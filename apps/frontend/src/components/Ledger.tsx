import React, { useState, useEffect, useCallback } from 'react';
import { ledgerAPI, LedgerEntry, MonthlyStats, LedgerLog, LedgerLogAction } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import LedgerModal from './LedgerModal';

const Ledger: React.FC = () => {
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [logs, setLogs] = useState<LedgerLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<LedgerEntry | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [expandedMonths, setExpandedMonths] = useState<Set<string>>(new Set());
  const [showLogs, setShowLogs] = useState(false);

  const { hasEditPermission } = useAuth();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [statsData, categoriesData] = await Promise.all([
        ledgerAPI.getStats(selectedYear),
        ledgerAPI.getCategories()
      ]);
      setMonthlyStats(statsData);
      setCategories(categoriesData);
      
      // Try to fetch logs separately with error handling
      try {
        const logsData = await ledgerAPI.getLogs(20);
        setLogs(logsData);
      } catch (logError) {
        console.warn('Failed to load logs:', logError);
        setLogs([]);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load data.');
    } finally {
      setLoading(false);
    }
  }, [selectedYear]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddEntry = async (entryData: Omit<LedgerEntry, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    try {
      await ledgerAPI.create(entryData);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create entry.');
    }
  };

  const handleUpdateEntry = async (entryData: Omit<LedgerEntry, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!editingEntry) return;
    
    try {
      await ledgerAPI.update(editingEntry.id, entryData);
      fetchData();
      setEditingEntry(null);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update entry.');
    }
  };

  const handleDeleteEntry = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this entry?')) return;
    
    try {
      await ledgerAPI.delete(id);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete entry.');
    }
  };

  const toggleMonth = (monthKey: string) => {
    setExpandedMonths(prev => {
      const newSet = new Set(prev);
      if (newSet.has(monthKey)) {
        newSet.delete(monthKey);
      } else {
        newSet.add(monthKey);
      }
      return newSet;
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  const getYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear; i >= currentYear - 5; i--) {
      years.push(i);
    }
    return years;
  };

  const getActionIcon = (action: LedgerLogAction) => {
    switch (action) {
      case LedgerLogAction.CREATE: return '✅';
      case LedgerLogAction.UPDATE: return '✏️';
      case LedgerLogAction.DELETE: return '🗑️';
      default: return '📝';
    }
  };

  const getActionColor = (action: LedgerLogAction) => {
    switch (action) {
      case LedgerLogAction.CREATE: return '#28a745';
      case LedgerLogAction.UPDATE: return '#ffc107';
      case LedgerLogAction.DELETE: return '#dc3545';
      default: return '#6c757d';
    }
  };

  const renderLogsTable = () => (
    <div style={{ 
      marginTop: '40px', 
      border: '1px solid #ddd', 
      borderRadius: '8px',
      overflow: 'hidden'
    }}>
      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '20px',
        borderBottom: '1px solid #dee2e6',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h3 style={{ margin: 0, color: '#495057' }}>
          📋 Activity Logs (Recent 20)
        </h3>
        <button
          onClick={() => setShowLogs(!showLogs)}
          style={{
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          {showLogs ? 'Hide Logs' : 'Show Logs'}
        </button>
      </div>
      
      {showLogs && (
        <div style={{ padding: '0' }}>
          {logs.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
              No activity logs found.
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#e9ecef' }}>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6', width: '80px' }}>Action</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Description</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6', width: '100px' }}>Amount</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6', width: '120px' }}>Category</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6', width: '100px' }}>User</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6', width: '140px' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, index) => (
                  <tr key={log.id} style={{ 
                    backgroundColor: index % 2 === 0 ? '#fff' : '#f8f9fa',
                    borderBottom: index === logs.length - 1 ? 'none' : '1px solid #eee'
                  }}>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <span style={{ 
                        fontSize: '16px',
                        color: getActionColor(log.action)
                      }}>
                        {getActionIcon(log.action)}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>
                        {log.description}
                      </div>
                      {log.note && (
                        <div style={{ fontSize: '12px', color: '#666' }}>
                          📝 {log.note}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '12px', fontWeight: 'bold' }}>
                      ${formatCurrency(log.amount)}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        backgroundColor: '#e9ecef',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '12px'
                      }}>
                        {log.category}
                      </span>
                    </td>
                    <td style={{ padding: '12px', fontSize: '14px' }}>
                      {log.username}
                    </td>
                    <td style={{ padding: '12px', fontSize: '12px', color: '#666' }}>
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Household Ledger</h1>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            style={{
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px'
            }}
          >
            {getYearOptions().map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          {hasEditPermission && (
            <button
              onClick={() => setIsModalOpen(true)}
              style={{
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Add Entry
            </button>
          )}
        </div>
      </div>

      {monthlyStats.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#666', fontSize: '18px', marginTop: '50px' }}>
          No ledger entries found.
        </div>
      ) : (
        <div>
          {monthlyStats.map(monthData => (
            <div key={monthData.month} style={{
              marginBottom: '30px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              overflow: 'hidden'
            }}>
              <div
                style={{
                  backgroundColor: '#f8f9fa',
                  padding: '20px',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: expandedMonths.has(monthData.month) ? 'none' : '1px solid #dee2e6'
                }}
                onClick={() => toggleMonth(monthData.month)}
              >
                <div>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', color: '#212529' }}>
                    📅 {monthData.month.replace('-', '/')}
                  </h3>
                  <div style={{ display: 'flex', gap: '15px', fontSize: '14px', color: '#6c757d' }}>
                    <span>📊 {Object.keys(monthData.categories).length} categories</span>
                    <span>📝 {Object.values(monthData.categories).reduce((sum, cat) => sum + cat.count, 0)} entries</span>
                    <span>💰 Avg {formatCurrency(Math.round(monthData.totalAmount / Object.values(monthData.categories).reduce((sum, cat) => sum + cat.count, 0)))}/entry</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff', marginBottom: '5px' }}>
                    ${formatCurrency(monthData.totalAmount)}
                  </div>
                  <div style={{ fontSize: '14px', color: '#6c757d' }}>
                    {expandedMonths.has(monthData.month) ? 'Collapse ▲' : 'Expand ▼'}
                  </div>
                </div>
              </div>

              {expandedMonths.has(monthData.month) && (
                <div style={{ padding: '20px' }}>
                  {/* 카테고리별 월 사용량 요약 */}
                  <div style={{ 
                    backgroundColor: '#f8f9fa', 
                    padding: '15px', 
                    borderRadius: '6px', 
                    marginBottom: '20px',
                    border: '1px solid #dee2e6'
                  }}>
                    <h4 style={{ margin: '0 0 15px 0', color: '#495057' }}>
                      📊 {monthData.month.replace('-', '/')} Category Breakdown
                    </h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                      {Object.entries(monthData.categories)
                        .sort(([,a], [,b]) => b.total - a.total) // 금액 순으로 정렬
                        .map(([category, categoryData], index) => {
                          const percentage = ((categoryData.total / monthData.totalAmount) * 100).toFixed(1);
                          // 카테고리별 색상 배열
                          const colors = ['#007bff', '#28a745', '#ffc107', '#dc3545', '#6f42c1', '#fd7e14', '#20c997', '#6c757d'];
                          const color = colors[index % colors.length];
                          
                          return (
                            <div key={`summary-${category}`} style={{
                              backgroundColor: 'white',
                              padding: '12px',
                              borderRadius: '6px',
                              border: `2px solid ${color}20`,
                              minWidth: '200px',
                              flex: '1',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}>
                              <div style={{ fontWeight: 'bold', color: '#495057', marginBottom: '5px' }}>
                                {category}
                              </div>
                              <div style={{ fontSize: '18px', fontWeight: 'bold', color: color }}>
                                ${formatCurrency(categoryData.total)}
                              </div>
                              <div style={{ fontSize: '12px', color: '#6c757d' }}>
                                {categoryData.count} entries · {percentage}%
                              </div>
                              {/* 진행률 바 */}
                              <div style={{
                                backgroundColor: '#e9ecef',
                                height: '4px',
                                borderRadius: '2px',
                                marginTop: '8px',
                                overflow: 'hidden'
                              }}>
                                <div style={{
                                  backgroundColor: color,
                                  height: '100%',
                                  width: `${percentage}%`,
                                  borderRadius: '2px'
                                }}></div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>

                  {/* 카테고리별 상세 내역 */}
                  <h4 style={{ marginBottom: '20px', color: '#495057' }}>📋 Detailed Entries</h4>
                  {Object.entries(monthData.categories).map(([category, categoryData]) => (
                    <div key={category} style={{ marginBottom: '30px' }}>
                      <h5 style={{
                        backgroundColor: '#e9ecef',
                        padding: '10px',
                        margin: '0 0 15px 0',
                        borderRadius: '4px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <span>{category}</span>
                        <span style={{ fontSize: '14px', color: '#666' }}>
                          ${formatCurrency(categoryData.total)} ({categoryData.count} entries)
                        </span>
                      </h5>
                      <div style={{ paddingLeft: '15px' }}>
                        {categoryData.entries.map((entry, index) => (
                          <div key={entry.id} style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '10px',
                            borderBottom: index === categoryData.entries.length - 1 ? 'none' : '1px solid #eee'
                          }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                                {entry.description}
                              </div>
                              <div style={{ fontSize: '12px', color: '#666' }}>
                                {formatDate(entry.date)}
                                {entry.note && (
                                  <span style={{ marginLeft: '10px' }}>
                                    📝 {entry.note}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <strong>${formatCurrency(entry.amount)}</strong>
                              {hasEditPermission && (
                                <div style={{ display: 'flex', gap: '5px' }}>
                                  <button
                                    onClick={() => {
                                      setEditingEntry(entry);
                                      setIsModalOpen(true);
                                    }}
                                    style={{
                                      padding: '5px 10px',
                                      backgroundColor: '#ffc107',
                                      color: 'white',
                                      border: 'none',
                                      borderRadius: '3px',
                                      cursor: 'pointer',
                                      fontSize: '12px'
                                    }}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDeleteEntry(entry.id)}
                                    style={{
                                      padding: '5px 10px',
                                      backgroundColor: '#dc3545',
                                      color: 'white',
                                      border: 'none',
                                      borderRadius: '3px',
                                      cursor: 'pointer',
                                      fontSize: '12px'
                                    }}
                                  >
                                    Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {renderLogsTable()}

      <LedgerModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingEntry(null);
        }}
        onSave={editingEntry ? handleUpdateEntry : handleAddEntry}
        editingEntry={editingEntry}
        categories={categories}
      />
    </div>
  );
};

export default Ledger;