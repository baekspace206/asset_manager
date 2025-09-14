import React, { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PortfolioGrowthData, portfolioAPI } from '../services/api';

const PortfolioChart: React.FC = () => {
  const [growthData, setGrowthData] = useState<PortfolioGrowthData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [dateRange, setDateRange] = useState<'7d' | '1m' | '3m' | '6m' | '1y' | 'all' | 'custom'>('1m');

  const applyDateRange = useCallback(() => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    switch (dateRange) {
      case '7d':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        setStartDate(weekAgo.toISOString().split('T')[0]);
        setEndDate(today);
        break;
      case '1m':
        const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        setStartDate(monthAgo.toISOString().split('T')[0]);
        setEndDate(today);
        break;
      case '3m':
        const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
        setStartDate(threeMonthsAgo.toISOString().split('T')[0]);
        setEndDate(today);
        break;
      case '6m':
        const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
        setStartDate(sixMonthsAgo.toISOString().split('T')[0]);
        setEndDate(today);
        break;
      case '1y':
        const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        setStartDate(yearAgo.toISOString().split('T')[0]);
        setEndDate(today);
        break;
      case 'all':
        setStartDate('');
        setEndDate('');
        break;
    }
  }, [dateRange]);

  const fetchGrowthData = useCallback(async () => {
    try {
      setError(null);
      const data = await portfolioAPI.getGrowthData(
        startDate || undefined, 
        endDate || undefined
      );
      setGrowthData(data);
    } catch (error) {
      console.error('Error fetching portfolio growth data:', error);
      setError('Failed to load portfolio growth data');
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  // Effects after function declarations
  useEffect(() => {
    fetchGrowthData();
  }, [fetchGrowthData]);

  useEffect(() => {
    if (dateRange !== 'custom') {
      applyDateRange();
    }
  }, [dateRange, applyDateRange]);

  const formatTooltipValue = (value: number) => {
    return [`₩${value.toLocaleString()}`, 'Portfolio Value'];
  };

  const formatXAxisLabel = (tickItem: string) => {
    const date = new Date(tickItem);
    return date.toLocaleDateString('ko-KR', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div style={{
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb',
        marginBottom: '20px'
      }}>
        <div style={{ textAlign: 'center', color: '#6b7280' }}>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>📊</div>
          Loading portfolio growth data...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb',
        marginBottom: '20px'
      }}>
        <div style={{ textAlign: 'center', color: '#ef4444' }}>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>⚠️</div>
          {error}
        </div>
      </div>
    );
  }

  if (growthData.length === 0) {
    return (
      <div style={{
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb',
        marginBottom: '20px'
      }}>
        <h3 style={{
          margin: '0 0 16px 0',
          color: '#1f2937',
          fontSize: '18px',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          📈 Portfolio Growth
        </h3>
        <div style={{ textAlign: 'center', color: '#6b7280', padding: '40px 0' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
          <h4 style={{ margin: '0 0 8px 0', color: '#374151' }}>No growth data available</h4>
          <p style={{ margin: 0, fontSize: '14px' }}>
            Add some assets to start tracking your portfolio growth over time.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: 'white',
      padding: '24px',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      border: '1px solid #e5e7eb',
      marginBottom: '20px'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        {/* Mobile breakpoint detection */}
        <style>{`
          @media (max-width: 768px) {
            .portfolio-header {
              flex-direction: column;
              align-items: stretch !important;
            }
            .portfolio-controls {
              justify-content: center !important;
            }
            .date-range-buttons {
              justify-content: center !important;
            }
            .custom-date-inputs {
              flex-direction: column !important;
              width: 100% !important;
            }
            .custom-date-inputs input {
              width: 100% !important;
            }
          }
        `}</style>
        <h3 style={{
          margin: '0',
          color: '#1f2937',
          fontSize: '18px',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          📈 Portfolio Growth
        </h3>
        
        <div className="portfolio-controls" style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Date Range Buttons */}
          <div className="date-range-buttons" style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {['7d', '1m', '3m', '6m', '1y', 'all', 'custom'].map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range as typeof dateRange)}
                style={{
                  padding: '6px 12px',
                  backgroundColor: dateRange === range ? '#059669' : '#f3f4f6',
                  color: dateRange === range ? 'white' : '#374151',
                  border: '1px solid #e5e7eb',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '11px',
                  fontWeight: '500',
                  transition: 'all 0.2s'
                }}
              >
                {range === 'all' ? 'All' : range.toUpperCase()}
              </button>
            ))}
          </div>
          
          {/* Custom Date Inputs */}
          {dateRange === 'custom' && (
            <div className="custom-date-inputs" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={{
                  padding: '4px 8px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '4px',
                  fontSize: '12px'
                }}
              />
              <span style={{ fontSize: '12px', color: '#6b7280' }}>~</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={{
                  padding: '4px 8px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '4px',
                  fontSize: '12px'
                }}
              />
            </div>
          )}
          
          <button
            onClick={fetchGrowthData}
            style={{
              padding: '6px 12px',
              backgroundColor: '#f3f4f6',
              color: '#374151',
              border: '1px solid #e5e7eb',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '11px',
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
            🔄 Refresh
          </button>
        </div>
      </div>
      
      <div style={{ width: '100%', height: window.innerWidth <= 768 ? '250px' : '300px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={growthData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatXAxisLabel}
              stroke="#6b7280"
              fontSize={12}
            />
            <YAxis 
              tickFormatter={(value) => `₩${(value / 1000).toFixed(0)}K`}
              stroke="#6b7280"
              fontSize={12}
            />
            <Tooltip
              formatter={formatTooltipValue}
              labelStyle={{ color: '#374151' }}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#059669"
              strokeWidth={3}
              dot={{ fill: '#059669', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: '#059669' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={{ 
        marginTop: '16px',
        padding: '12px',
        backgroundColor: '#f8fafc',
        borderRadius: '8px',
        fontSize: '12px',
        color: '#6b7280',
        textAlign: 'center'
      }}>
        📅 Portfolio snapshots are automatically created when you add, edit, or delete assets
      </div>
    </div>
  );
};

export default PortfolioChart;