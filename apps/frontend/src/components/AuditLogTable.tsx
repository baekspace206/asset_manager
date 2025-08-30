import React, { useState, useEffect } from 'react';
import { AuditLog, auditAPI } from '../services/api';

const AuditLogTable: React.FC = () => {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const fetchAuditLogs = async () => {
    try {
      setError(null);
      const data = await auditAPI.getLogs();
      setAuditLogs(data);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      setError('Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action: string) => {
    switch (action.toUpperCase()) {
      case 'CREATE':
        return '➕';
      case 'UPDATE':
        return '✏️';
      case 'DELETE':
        return '🗑️';
      default:
        return '📝';
    }
  };

  const getActionColor = (action: string) => {
    switch (action.toUpperCase()) {
      case 'CREATE':
        return '#059669';
      case 'UPDATE':
        return '#f59e0b';
      case 'DELETE':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const formatTimestamp = (timestamp: Date | string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const parseJsonValue = (jsonString: string | null) => {
    if (!jsonString) return null;
    try {
      return JSON.parse(jsonString);
    } catch {
      return jsonString;
    }
  };

  const formatValue = (value: any) => {
    if (!value) return '-';
    if (typeof value === 'object') {
      return (
        <div style={{ fontSize: '12px', color: '#6b7280' }}>
          {Object.entries(value).map(([key, val]) => (
            <div key={key}>
              <strong>{key}:</strong> {val?.toString() || 'null'}
            </div>
          ))}
        </div>
      );
    }
    return value.toString();
  };

  const formatTotalChange = (previous: number | null, current: number | null) => {
    if (previous === null || current === null) return null;
    
    const change = current - previous;
    const isPositive = change > 0;
    
    return (
      <div style={{ 
        fontSize: '11px',
        color: isPositive ? '#10b981' : change < 0 ? '#ef4444' : '#6b7280',
        fontWeight: '600'
      }}>
        {isPositive ? '+' : ''}₩{change.toLocaleString()}
      </div>
    );
  };

  if (loading) {
    return (
      <div style={{
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{ textAlign: 'center', color: '#6b7280' }}>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>📋</div>
          Loading audit logs...
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
        border: '1px solid #e5e7eb'
      }}>
        <div style={{ textAlign: 'center', color: '#ef4444' }}>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>⚠️</div>
          {error}
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
      border: '1px solid #e5e7eb'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h3 style={{
          margin: '0',
          color: '#1f2937',
          fontSize: '18px',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          📋 Activity Log
        </h3>
        <button
          onClick={fetchAuditLogs}
          style={{
            padding: '8px 16px',
            backgroundColor: '#f3f4f6',
            color: '#374151',
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
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

      {auditLogs.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#6b7280', padding: '40px 0' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
          <h4 style={{ margin: '0 0 8px 0', color: '#374151' }}>No activity logs available</h4>
          <p style={{ margin: 0, fontSize: '14px' }}>
            Asset changes will be tracked and displayed here.
          </p>
        </div>
      ) : (
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '8px', 
          overflow: 'hidden',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'thin',
            scrollbarColor: '#d1d5db #f3f4f6'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc' }}>
                <th style={{ 
                  padding: '12px 16px', 
                  textAlign: 'center', 
                  fontWeight: '600', 
                  color: '#374151',
                  fontSize: '12px',
                  borderBottom: '2px solid #e5e7eb',
                  width: '80px'
                }}>
                  Action
                </th>
                <th style={{ 
                  padding: '12px 16px', 
                  textAlign: 'center', 
                  fontWeight: '600', 
                  color: '#374151',
                  fontSize: '12px',
                  borderBottom: '2px solid #e5e7eb'
                }}>
                  Asset Name
                </th>
                <th style={{ 
                  padding: '12px 16px', 
                  textAlign: 'center', 
                  fontWeight: '600', 
                  color: '#374151',
                  fontSize: '12px',
                  borderBottom: '2px solid #e5e7eb',
                  width: '120px'
                }}>
                  Previous Total
                </th>
                <th style={{ 
                  padding: '12px 16px', 
                  textAlign: 'center', 
                  fontWeight: '600', 
                  color: '#374151',
                  fontSize: '12px',
                  borderBottom: '2px solid #e5e7eb',
                  width: '120px'
                }}>
                  Current Total
                </th>
                <th style={{ 
                  padding: '12px 16px', 
                  textAlign: 'center', 
                  fontWeight: '600', 
                  color: '#374151',
                  fontSize: '12px',
                  borderBottom: '2px solid #e5e7eb',
                  width: '100px'
                }}>
                  Change
                </th>
                <th style={{ 
                  padding: '12px 16px', 
                  textAlign: 'center', 
                  fontWeight: '600', 
                  color: '#374151',
                  fontSize: '12px',
                  borderBottom: '2px solid #e5e7eb',
                  width: '140px'
                }}>
                  Timestamp
                </th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((log) => (
                <tr key={log.id} style={{ 
                  borderBottom: '1px solid #f3f4f6',
                  transition: 'background-color 0.2s'
                }}>
                  <td style={{ 
                    padding: '12px 16px',
                    textAlign: 'center',
                    verticalAlign: 'middle'
                  }}>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: `${getActionColor(log.action)}20`,
                      color: getActionColor(log.action),
                      fontSize: '16px'
                    }}>
                      {getActionIcon(log.action)}
                    </div>
                  </td>
                  <td style={{ 
                    padding: '12px 16px',
                    textAlign: 'center',
                    color: '#1f2937',
                    fontWeight: '500',
                    fontSize: '14px'
                  }}>
                    {log.entityName}
                  </td>
                  <td style={{ 
                    padding: '12px 16px',
                    textAlign: 'center',
                    color: '#6b7280',
                    fontSize: '11px'
                  }}>
                    {log.previousTotalValue !== null && log.previousTotalValue !== undefined
                      ? `₩${log.previousTotalValue.toLocaleString()}`
                      : '-'
                    }
                  </td>
                  <td style={{ 
                    padding: '12px 16px',
                    textAlign: 'center',
                    color: '#059669',
                    fontWeight: '600',
                    fontSize: '11px'
                  }}>
                    {log.currentTotalValue !== null && log.currentTotalValue !== undefined
                      ? `₩${log.currentTotalValue.toLocaleString()}`
                      : '-'
                    }
                  </td>
                  <td style={{ 
                    padding: '12px 16px',
                    textAlign: 'center'
                  }}>
                    {formatTotalChange(log.previousTotalValue, log.currentTotalValue) || '-'}
                  </td>
                  <td style={{ 
                    padding: '12px 16px',
                    textAlign: 'center',
                    color: '#6b7280',
                    fontSize: '10px'
                  }}>
                    {formatTimestamp(log.timestamp)}
                  </td>
                </tr>
              ))}
            </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditLogTable;