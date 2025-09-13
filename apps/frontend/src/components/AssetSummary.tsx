import React from 'react';
import { Asset } from '../services/api';
import PortfolioChart from './PortfolioChart';

interface AssetSummaryProps {
  assets: Asset[];
  onCategoryClick?: (category: string) => void;
}

const AssetSummary: React.FC<AssetSummaryProps> = ({ assets, onCategoryClick }) => {
  const totalValue = assets.reduce((sum, asset) => sum + asset.amount, 0);
  
  const categoryStats = React.useMemo(() => {
    const stats = assets.reduce((acc, asset) => {
      const category = asset.category || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = { count: 0, total: 0 };
      }
      acc[category].count++;
      acc[category].total += asset.amount;
      return acc;
    }, {} as Record<string, { count: number; total: number }>);

    return Object.entries(stats)
      .map(([category, data]) => ({ category, ...data }))
      .sort((a, b) => b.total - a.total);
  }, [assets]);

  const getCategoryIcon = (category: string) => {
    const cat = category.toLowerCase();
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

  const getCategoryColor = (category: string) => {
    const cat = category.toLowerCase();
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

  return (
    <div style={{ marginBottom: '24px' }}>
      {/* Total Value Card */}
      <div style={{
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb',
        marginBottom: '20px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', opacity: 0.9 }}>
            💰 Total Portfolio Value
          </h3>
          <div style={{ fontSize: '36px', fontWeight: '700', margin: '0' }}>
            ₩{totalValue.toLocaleString()}
          </div>
          <p style={{ margin: '8px 0 0 0', opacity: 0.8, fontSize: '14px' }}>
            Across {assets.length} financial assets in {categoryStats.length} categories
          </p>
        </div>
      </div>

      {/* Portfolio Growth Chart */}
      <PortfolioChart />

      {/* Category Breakdown */}
      {categoryStats.length > 0 && (
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <h3 style={{ 
            margin: '0 0 20px 0', 
            color: '#1f2937', 
            fontSize: '18px', 
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            📊 Category
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth <= 768 ? '1fr' : 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            {categoryStats.map((stat) => {
              const percentage = totalValue > 0 ? (stat.total / totalValue) * 100 : 0;
              return (
                <div
                  key={stat.category}
                  onClick={() => onCategoryClick?.(stat.category)}
                  style={{
                    padding: '16px',
                    borderRadius: '8px',
                    border: `2px solid ${getCategoryColor(stat.category)}20`,
                    backgroundColor: `${getCategoryColor(stat.category)}05`,
                    cursor: onCategoryClick ? 'pointer' : 'default',
                    transition: 'all 0.2s ease',
                    ...(onCategoryClick && {
                      ':hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }
                    })
                  }}
                  onMouseEnter={(e) => {
                    if (onCategoryClick) {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (onCategoryClick) {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }
                  }}
                >
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    marginBottom: '8px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '18px' }}>
                        {getCategoryIcon(stat.category)}
                      </span>
                      <span style={{ 
                        fontWeight: '600', 
                        color: '#1f2937',
                        fontSize: '14px'
                      }}>
                        {stat.category}
                      </span>
                    </div>
                    <span style={{ 
                      fontSize: '12px', 
                      color: '#6b7280',
                      backgroundColor: '#f3f4f6',
                      padding: '4px 8px',
                      borderRadius: '12px'
                    }}>
                      {stat.count} items
                    </span>
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    <div style={{ 
                      fontSize: '20px', 
                      fontWeight: '700', 
                      color: getCategoryColor(stat.category)
                    }}>
                      ₩{stat.total.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>
                      {percentage.toFixed(1)}% of total
                    </div>
                  </div>
                  <div style={{ 
                    height: '4px', 
                    backgroundColor: '#e5e7eb', 
                    borderRadius: '2px',
                    overflow: 'hidden'
                  }}>
                    <div style={{ 
                      height: '100%', 
                      width: `${percentage}%`,
                      backgroundColor: getCategoryColor(stat.category),
                      borderRadius: '2px',
                      transition: 'width 0.5s ease'
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetSummary;