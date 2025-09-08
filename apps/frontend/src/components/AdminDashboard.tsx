import React, { useState, useEffect } from 'react';
import { User, UserPermission, AdminStats, userAPI } from '../services/api';
import Modal from './Modal';

const AdminDashboard: React.FC = () => {
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [activeTab, setActiveTab] = useState<'pending' | 'all' | 'stats'>('pending');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [pendingData, allData, statsData] = await Promise.all([
        userAPI.getPendingUsers(),
        userAPI.getAllUsers(),
        userAPI.getAdminStats()
      ]);
      setPendingUsers(pendingData);
      setAllUsers(allData);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId: number, permission: UserPermission) => {
    try {
      await userAPI.approveUser(userId, permission);
      await fetchData();
    } catch (error) {
      console.error('Failed to approve user:', error);
    }
  };

  const handleReject = async () => {
    if (!selectedUser || !rejectionReason.trim()) return;

    try {
      await userAPI.rejectUser(selectedUser.id, rejectionReason.trim());
      await fetchData();
      setShowRejectModal(false);
      setSelectedUser(null);
      setRejectionReason('');
    } catch (error) {
      console.error('Failed to reject user:', error);
    }
  };

  const handlePermissionChange = async (userId: number, permission: UserPermission) => {
    try {
      await userAPI.updateUserPermission(userId, permission);
      await fetchData();
    } catch (error) {
      console.error('Failed to update user permission:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: '#f59e0b',
      approved: '#10b981',
      rejected: '#ef4444'
    };
    const color = colors[status as keyof typeof colors] || '#6b7280';

    return (
      <span style={{
        backgroundColor: `${color}20`,
        color: color,
        padding: '4px 8px',
        borderRadius: '12px',
        fontSize: '11px',
        fontWeight: '600',
        textTransform: 'uppercase'
      }}>
        {status}
      </span>
    );
  };

  const getRoleBadge = (role: string) => {
    const isAdmin = role === 'admin';
    return (
      <span style={{
        backgroundColor: isAdmin ? '#7c3aed20' : '#6b728020',
        color: isAdmin ? '#7c3aed' : '#6b7280',
        padding: '4px 8px',
        borderRadius: '12px',
        fontSize: '11px',
        fontWeight: '600',
        textTransform: 'uppercase'
      }}>
        {isAdmin ? '👑 Admin' : '👤 User'}
      </span>
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
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>⚙️</div>
          Loading admin dashboard...
        </div>
      </div>
    );
  }

  return (
    <>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #e5e7eb',
          backgroundColor: '#f8fafc'
        }}>
          <h2 style={{
            margin: 0,
            color: '#1f2937',
            fontSize: '20px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            👑 Admin Dashboard
          </h2>
          <p style={{ margin: '4px 0 0 0', color: '#6b7280', fontSize: '14px' }}>
            Manage user registrations, permissions, and view system statistics
          </p>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #e5e7eb',
          backgroundColor: '#f9fafb'
        }}>
          {[
            { key: 'pending' as const, label: '🕒 Pending Requests', count: stats?.pendingUsers || 0 },
            { key: 'all' as const, label: '👥 All Users', count: stats?.totalUsers || 0 },
            { key: 'stats' as const, label: '📊 Statistics', count: null }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                flex: 1,
                padding: '16px 20px',
                border: 'none',
                backgroundColor: activeTab === tab.key ? 'white' : 'transparent',
                color: activeTab === tab.key ? '#1f2937' : '#6b7280',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                borderBottom: activeTab === tab.key ? '2px solid #3b82f6' : '2px solid transparent',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                {tab.label}
                {tab.count !== null && (
                  <span style={{
                    backgroundColor: activeTab === tab.key ? '#3b82f6' : '#d1d5db',
                    color: activeTab === tab.key ? 'white' : '#6b7280',
                    padding: '2px 6px',
                    borderRadius: '10px',
                    fontSize: '11px',
                    fontWeight: '600'
                  }}>
                    {tab.count}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ padding: '24px' }}>
          {activeTab === 'pending' && (
            <div>
              {pendingUsers.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#6b7280', padding: '40px 0' }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
                  <h4 style={{ margin: '0 0 8px 0', color: '#374151' }}>No pending requests</h4>
                  <p style={{ margin: 0, fontSize: '14px' }}>
                    All user registration requests have been processed.
                  </p>
                </div>
              ) : (
                <div style={{
                  overflowX: 'auto',
                  WebkitOverflowScrolling: 'touch',
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#d1d5db #f3f4f6'
                }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f8fafc' }}>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151', borderBottom: '2px solid #e5e7eb' }}>User</th>
                        <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#374151', borderBottom: '2px solid #e5e7eb' }}>Registration Date</th>
                        <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#374151', borderBottom: '2px solid #e5e7eb' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingUsers.map((user) => (
                        <tr key={user.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                          <td style={{ padding: '16px' }}>
                            <div>
                              <div style={{ fontWeight: '600', color: '#1f2937', fontSize: '14px' }}>
                                {user.username}
                              </div>
                              <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                                ID: {user.id}
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: '16px', textAlign: 'center', fontSize: '12px', color: '#6b7280' }}>
                            {new Date(user.createdAt).toLocaleDateString('ko-KR', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </td>
                          <td style={{ padding: '16px', textAlign: 'center' }}>
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                              <button
                                onClick={() => handleApprove(user.id, UserPermission.VIEW)}
                                style={{
                                  padding: '6px 12px',
                                  backgroundColor: '#10b981',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '6px',
                                  fontSize: '11px',
                                  fontWeight: '500',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  transition: 'all 0.2s'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#059669'}
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
                              >
                                ✅ View Only
                              </button>
                              <button
                                onClick={() => handleApprove(user.id, UserPermission.EDIT)}
                                style={{
                                  padding: '6px 12px',
                                  backgroundColor: '#3b82f6',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '6px',
                                  fontSize: '11px',
                                  fontWeight: '500',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  transition: 'all 0.2s'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
                              >
                                ✏️ Full Access
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedUser(user);
                                  setShowRejectModal(true);
                                }}
                                style={{
                                  padding: '6px 12px',
                                  backgroundColor: '#ef4444',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '6px',
                                  fontSize: '11px',
                                  fontWeight: '500',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  transition: 'all 0.2s'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
                              >
                                ❌ Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'all' && (
            <div style={{
              overflowX: 'auto',
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'thin',
              scrollbarColor: '#d1d5db #f3f4f6'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc' }}>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151', borderBottom: '2px solid #e5e7eb' }}>User</th>
                    <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#374151', borderBottom: '2px solid #e5e7eb' }}>Role</th>
                    <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#374151', borderBottom: '2px solid #e5e7eb' }}>Status</th>
                    <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#374151', borderBottom: '2px solid #e5e7eb' }}>Permission</th>
                    <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#374151', borderBottom: '2px solid #e5e7eb' }}>Joined</th>
                    <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#374151', borderBottom: '2px solid #e5e7eb' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allUsers.map((user) => (
                    <tr key={user.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '16px' }}>
                        <div>
                          <div style={{ fontWeight: '600', color: '#1f2937', fontSize: '14px' }}>
                            {user.username}
                          </div>
                          <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                            ID: {user.id}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '16px', textAlign: 'center' }}>
                        {getRoleBadge(user.role)}
                      </td>
                      <td style={{ padding: '16px', textAlign: 'center' }}>
                        {getStatusBadge(user.status)}
                      </td>
                      <td style={{ padding: '16px', textAlign: 'center' }}>
                        {user.role === 'admin' ? (
                          <span style={{ color: '#6b7280', fontSize: '12px' }}>All Permissions</span>
                        ) : user.status === 'approved' ? (
                          <select
                            value={user.permission}
                            onChange={(e) => handlePermissionChange(user.id, e.target.value as UserPermission)}
                            style={{
                              padding: '4px 8px',
                              border: '1px solid #d1d5db',
                              borderRadius: '6px',
                              fontSize: '11px',
                              backgroundColor: 'white'
                            }}
                          >
                            <option value={UserPermission.VIEW}>👁️ View</option>
                            <option value={UserPermission.EDIT}>✏️ Edit</option>
                          </select>
                        ) : (
                          <span style={{ color: '#6b7280', fontSize: '12px' }}>-</span>
                        )}
                      </td>
                      <td style={{ padding: '16px', textAlign: 'center', fontSize: '12px', color: '#6b7280' }}>
                        {new Date(user.createdAt).toLocaleDateString('ko-KR', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td style={{ padding: '16px', textAlign: 'center' }}>
                        {user.rejectionReason && (
                          <span 
                            style={{ 
                              fontSize: '12px', 
                              color: '#ef4444',
                              cursor: 'help'
                            }}
                            title={`Rejection reason: ${user.rejectionReason}`}
                          >
                            ℹ️ Reason
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'stats' && stats && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              {[
                { label: 'Total Users', value: stats.totalUsers, icon: '👥', color: '#3b82f6' },
                { label: 'Pending Requests', value: stats.pendingUsers, icon: '⏳', color: '#f59e0b' },
                { label: 'Approved Users', value: stats.approvedUsers, icon: '✅', color: '#10b981' },
                { label: 'Rejected Users', value: stats.rejectedUsers, icon: '❌', color: '#ef4444' },
                { label: 'Admin Users', value: stats.adminUsers, icon: '👑', color: '#7c3aed' },
                { label: 'Edit Permission', value: stats.editPermissionUsers, icon: '✏️', color: '#059669' },
                { label: 'View Permission', value: stats.viewPermissionUsers, icon: '👁️', color: '#6b7280' }
              ].map((stat) => (
                <div
                  key={stat.label}
                  style={{
                    padding: '20px',
                    borderRadius: '12px',
                    backgroundColor: `${stat.color}10`,
                    border: `2px solid ${stat.color}20`,
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>{stat.icon}</div>
                  <div style={{ fontSize: '28px', fontWeight: '700', color: stat.color, marginBottom: '4px' }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Reject Modal */}
      <Modal
        isOpen={showRejectModal}
        onClose={() => {
          setShowRejectModal(false);
          setSelectedUser(null);
          setRejectionReason('');
        }}
        title="❌ Reject User Registration"
      >
        <div>
          <p style={{ margin: '0 0 16px 0', color: '#6b7280' }}>
            You are about to reject the registration request for <strong>{selectedUser?.username}</strong>.
            Please provide a reason for rejection:
          </p>
          <textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Enter rejection reason..."
            style={{
              width: '100%',
              minHeight: '100px',
              padding: '12px',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px',
              resize: 'vertical'
            }}
          />
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
            <button
              onClick={() => {
                setShowRejectModal(false);
                setSelectedUser(null);
                setRejectionReason('');
              }}
              style={{
                padding: '12px 24px',
                backgroundColor: '#f3f4f6',
                color: '#374151',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleReject}
              disabled={!rejectionReason.trim()}
              style={{
                padding: '12px 24px',
                backgroundColor: !rejectionReason.trim() ? '#d1d5db' : '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: !rejectionReason.trim() ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              Reject User
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AdminDashboard;