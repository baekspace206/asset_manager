import React, { useState, useEffect, useRef } from 'react';
import { Asset, assetAPI } from '../services/api';
import AssetSummary from './AssetSummary';
import AuditLogTable from './AuditLogTable';
import Modal from './Modal';

interface GroupedAsset extends Asset {
  isFirstInCategory?: boolean;
  categoryRowSpan?: number;
}

const AssetList: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    amount: 0,
    note: '',
  });
  
  const assetTableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      const data = await assetAPI.getAll();
      setAssets(data);
    } catch (error) {
      console.error('Error fetching assets:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter assets by selected category
  const filteredAssets = React.useMemo(() => {
    if (!selectedCategory) return assets;
    return assets.filter(asset => {
      const category = asset.category || 'Uncategorized';
      return category === selectedCategory;
    });
  }, [assets, selectedCategory]);

  // Group and sort assets by category
  const groupedAssets = React.useMemo(() => {
    const sorted = [...filteredAssets].sort((a, b) => {
      const catA = a.category || 'Uncategorized';
      const catB = b.category || 'Uncategorized';
      if (catA === catB) {
        return a.name.localeCompare(b.name);
      }
      return catA.localeCompare(catB);
    });

    // Add grouping metadata
    const grouped: GroupedAsset[] = [];
    let currentCategory = '';
    let categoryCount = 0;
    let categoryStartIndex = 0;

    sorted.forEach((asset, index) => {
      const category = asset.category || 'Uncategorized';
      
      if (category !== currentCategory) {
        // Mark previous category items with rowspan
        if (categoryCount > 0) {
          for (let i = categoryStartIndex; i < categoryStartIndex + categoryCount; i++) {
            if (i === categoryStartIndex) {
              grouped[i].categoryRowSpan = categoryCount;
            }
          }
        }
        
        currentCategory = category;
        categoryCount = 1;
        categoryStartIndex = grouped.length;
        grouped.push({ ...asset, isFirstInCategory: true });
      } else {
        categoryCount++;
        grouped.push({ ...asset, isFirstInCategory: false });
      }
    });

    // Handle the last category
    if (categoryCount > 0) {
      for (let i = categoryStartIndex; i < categoryStartIndex + categoryCount; i++) {
        if (i === categoryStartIndex) {
          grouped[i].categoryRowSpan = categoryCount;
        }
      }
    }

    return grouped;
  }, [filteredAssets]);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    
    // Scroll to asset table
    if (assetTableRef.current) {
      assetTableRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  };

  const clearCategoryFilter = () => {
    setSelectedCategory(null);
  };

  const getCategoryIcon = (category: string | undefined) => {
    const cat = category?.toLowerCase() || 'uncategorized';
    const iconMap: { [key: string]: string } = {
      'house': '🏡',
      'deposit': '🏦',
      'savings': '💳',
      'stock': '📈',
      'coin': '₿',
      'parking account': '🅿️',
      'pension': '👴',
      'uncategorized': '💼'
    };
    
    return iconMap[cat] || '💼';
  };

  const getCategoryColor = (category: string | undefined) => {
    const cat = category?.toLowerCase() || 'uncategorized';
    const colorMap: { [key: string]: string } = {
      'house': '#059669',      // Green for real estate
      'deposit': '#0ea5e9',    // Blue for bank deposits
      'savings': '#06b6d4',    // Cyan for savings
      'stock': '#dc2626',      // Red for stocks (market volatility)
      'coin': '#f59e0b',       // Orange/Gold for cryptocurrency
      'parking account': '#8b5cf6', // Purple for parking investments
      'pension': '#4338ca',    // Indigo for pension/retirement
      'uncategorized': '#6b7280' // Gray for uncategorized
    };
    
    return colorMap[cat] || '#6b7280';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAsset) {
        await assetAPI.update(editingAsset.id, formData);
      } else {
        await assetAPI.create(formData);
      }
      fetchAssets();
      resetForm();
    } catch (error) {
      console.error('Error saving asset:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this asset?')) {
      try {
        await assetAPI.delete(id);
        fetchAssets();
      } catch (error) {
        console.error('Error deleting asset:', error);
      }
    }
  };

  const handleEdit = (asset: Asset) => {
    setEditingAsset(asset);
    setFormData({
      name: asset.name,
      category: asset.category || '',
      amount: asset.amount,
      note: asset.note || '',
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({ name: '', category: '', amount: 0, note: '' });
    setEditingAsset(null);
    setShowForm(false);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: window.innerWidth <= 768 ? '10px' : '20px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Mobile-specific styles */}
      <style>{`
        @media (max-width: 768px) {
          .asset-table th, .asset-table td {
            font-size: 12px !important;
            padding: 8px !important;
          }
          .asset-table .category-cell {
            min-width: 120px !important;
          }
          .asset-table .name-cell {
            min-width: 140px !important;
          }
          .asset-table .amount-cell {
            min-width: 100px !important;
          }
          .asset-table .note-cell {
            min-width: 120px !important;
          }
          .asset-table .actions-cell {
            min-width: 100px !important;
          }
          .modal-form-grid {
            grid-template-columns: 1fr !important;
          }
          .action-buttons {
            flex-direction: column !important;
          }
          .action-buttons button {
            width: 100% !important;
          }
        }
      `}</style>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: window.innerWidth <= 768 ? 'flex-start' : 'center', 
        marginBottom: '30px',
        backgroundColor: 'white',
        padding: window.innerWidth <= 768 ? '16px' : '20px',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        flexDirection: window.innerWidth <= 768 ? 'column' : 'row',
        gap: window.innerWidth <= 768 ? '16px' : '0'
      }}>
        <div>
          <h2 style={{ margin: 0, color: '#1f2937', fontSize: '28px', fontWeight: '700' }}>
            💰 Financial Asset Portfolio
          </h2>
          <p style={{ margin: '5px 0 0 0', color: '#6b7280', fontSize: '14px' }}>
            Track and manage your financial assets and investments
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          style={{
            padding: '12px 24px',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 2px 4px rgba(16, 185, 129, 0.2)',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#059669';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#10b981';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          ➕ Add Financial Asset
        </button>
      </div>

      <AssetSummary assets={assets} onCategoryClick={handleCategoryClick} />
      
      {/* Category Filter Status */}
      {selectedCategory && (
        <div style={{
          backgroundColor: 'white',
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#6b7280', fontSize: '14px' }}>
              Showing assets in category:
            </span>
            <span style={{ 
              color: getCategoryColor(selectedCategory),
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              {getCategoryIcon(selectedCategory)} {selectedCategory}
            </span>
          </div>
          <button
            onClick={clearCategoryFilter}
            style={{
              padding: '6px 12px',
              backgroundColor: '#f3f4f6',
              color: '#374151',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#e5e7eb';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
            }}
          >
            ✕ Clear Filter
          </button>
        </div>
      )}

      <Modal
        isOpen={showForm}
        onClose={resetForm}
        title={editingAsset ? '✏️ Edit Financial Asset' : '➕ Add New Financial Asset'}
      >
        <form onSubmit={handleSubmit}>
          <div className="modal-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <div>
              <label style={{ color: '#374151', fontWeight: '500', fontSize: '14px' }}>
                Name:
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="e.g., Samsung Stock, Bitcoin, Main House"
                  style={{
                    width: '100%',
                    padding: '12px',
                    marginTop: '8px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </label>
            </div>
            <div>
              <label style={{ color: '#374151', fontWeight: '500', fontSize: '14px' }}>
                Category:
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    marginTop: '8px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="">Select a financial asset category</option>
                  <option value="House">🏡 House</option>
                  <option value="Deposit">🏦 Deposit</option>
                  <option value="Savings">💳 Savings</option>
                  <option value="Stock">📈 Stock</option>
                  <option value="Coin">₿ Cryptocurrency</option>
                  <option value="Parking Account">🅿️ Parking Account</option>
                  <option value="Pension">👴 Pension</option>
                </select>
              </label>
            </div>
            <div>
              <label style={{ color: '#374151', fontWeight: '500', fontSize: '14px' }}>
                Amount (₩):
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                  required
                  placeholder="0.00"
                  style={{
                    width: '100%',
                    padding: '12px',
                    marginTop: '8px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#059669'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </label>
            </div>
            <div>
              <label style={{ color: '#374151', fontWeight: '500', fontSize: '14px' }}>
                Note:
                <input
                  type="text"
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  placeholder="e.g., 100 shares, Monthly dividend"
                  style={{
                    width: '100%',
                    padding: '12px',
                    marginTop: '8px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#6b7280'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </label>
            </div>
          </div>
          <div className="action-buttons" style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={resetForm}
              style={{
                padding: '12px 24px',
                backgroundColor: '#f3f4f6',
                color: '#374151',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#e5e7eb';
                e.currentTarget.style.borderColor = '#d1d5db';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
                e.currentTarget.style.borderColor = '#e5e7eb';
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: '12px 24px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 2px 4px rgba(59, 130, 246, 0.2)',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#2563eb';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#3b82f6';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {editingAsset ? '✏️ Update Asset' : '💾 Create Asset'}
            </button>
          </div>
        </form>
      </Modal>

      <div ref={assetTableRef} style={{ 
        backgroundColor: 'white', 
        borderRadius: '12px', 
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{ 
          overflowX: 'auto', 
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'thin',
          scrollbarColor: '#d1d5db #f3f4f6',
          maxWidth: '100%'
        }}>
          <table className="asset-table" style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc' }}>
              <th className="category-cell" style={{ 
                padding: '16px', 
                textAlign: 'center', 
                fontWeight: '600', 
                color: '#374151',
                fontSize: '14px',
                borderBottom: '2px solid #e5e7eb'
              }}>
                Category
              </th>
              <th className="name-cell" style={{ 
                padding: '16px', 
                textAlign: 'center', 
                fontWeight: '600', 
                color: '#374151',
                fontSize: '14px',
                borderBottom: '2px solid #e5e7eb'
              }}>
                Name
              </th>
              <th className="amount-cell" style={{ 
                padding: '16px', 
                textAlign: 'center', 
                fontWeight: '600', 
                color: '#374151',
                fontSize: '14px',
                borderBottom: '2px solid #e5e7eb'
              }}>
                Amount
              </th>
              <th className="note-cell" style={{ 
                padding: '16px', 
                textAlign: 'center', 
                fontWeight: '600', 
                color: '#374151',
                fontSize: '14px',
                borderBottom: '2px solid #e5e7eb'
              }}>
                Note
              </th>
              <th className="actions-cell" style={{ 
                padding: '16px', 
                textAlign: 'center', 
                fontWeight: '600', 
                color: '#374151',
                fontSize: '14px',
                borderBottom: '2px solid #e5e7eb'
              }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {groupedAssets.map((asset, index) => (
              <tr key={asset.id} style={{ 
                borderBottom: '1px solid #f3f4f6',
                transition: 'background-color 0.2s'
              }}>
                {asset.isFirstInCategory ? (
                  <td className="category-cell" style={{ 
                    padding: '16px',
                    verticalAlign: 'middle',
                    borderRight: '1px solid #f3f4f6',
                    backgroundColor: `${getCategoryColor(asset.category)}15`,
                    borderLeft: `4px solid ${getCategoryColor(asset.category)}`,
                    fontWeight: '600',
                    fontSize: '14px'
                  }} rowSpan={asset.categoryRowSpan}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px',
                      color: getCategoryColor(asset.category)
                    }}>
                      <span style={{ fontSize: '18px' }}>
                        {getCategoryIcon(asset.category)}
                      </span>
                      <span>
                        {asset.category || 'Uncategorized'}
                      </span>
                    </div>
                  </td>
                ) : null}
                <td className="name-cell" style={{ 
                  padding: '16px',
                  textAlign: 'center',
                  color: '#1f2937',
                  fontWeight: '500',
                  fontSize: '14px'
                }}>
                  {asset.name}
                </td>
                <td className="amount-cell" style={{ 
                  padding: '16px', 
                  textAlign: 'center',
                  color: '#059669',
                  fontWeight: '600',
                  fontSize: '16px'
                }}>
                  ₩{asset.amount.toLocaleString()}
                </td>
                <td className="note-cell" style={{ 
                  padding: '16px',
                  textAlign: 'center',
                  color: '#6b7280',
                  fontSize: '14px',
                  maxWidth: '200px',
                  wordBreak: 'break-word'
                }}>
                  {asset.note || '-'}
                </td>
                <td className="actions-cell" style={{ 
                  padding: '16px',
                  textAlign: 'center'
                }}>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                    <button
                      onClick={() => handleEdit(asset)}
                      style={{
                        padding: '8px 12px',
                        backgroundColor: '#f59e0b',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = '#d97706';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = '#f59e0b';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(asset.id)}
                      style={{
                        padding: '8px 12px',
                        backgroundColor: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = '#dc2626';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = '#ef4444';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          </table>
        </div>
        {assets.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 20px', 
            color: '#6b7280',
            backgroundColor: '#f9fafb'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>💼</div>
            <h3 style={{ margin: '0 0 8px 0', color: '#374151' }}>No financial assets found</h3>
            <p style={{ margin: 0, fontSize: '14px' }}>
              Click "Add Financial Asset" to start building your investment portfolio.
            </p>
          </div>
        )}
      </div>

      {/* Audit Log Table */}
      <div style={{ marginTop: '24px' }}>
        <AuditLogTable />
      </div>
    </div>
  );
};

export default AssetList;