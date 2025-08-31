import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole, UserStatus } from '../services/api';
import PasswordChangeModal from './PasswordChangeModal';

interface HeaderProps {
  onShowAdminDashboard?: () => void;
  onShowAssets?: () => void;
  onShowLedger?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onShowAdminDashboard, onShowAssets, onShowLedger }) => {
  const { user, logout, isAdmin } = useAuth();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const getUserStatusBadge = () => {
    if (!user) return null;
    
    const statusColors = {
      [UserStatus.PENDING]: '#f59e0b',
      [UserStatus.APPROVED]: '#10b981',
      [UserStatus.REJECTED]: '#ef4444'
    };
    
    const color = statusColors[user.status];
    
    return (
      <span style={{
        backgroundColor: `${color}20`,
        color: color,
        padding: '2px 6px',
        borderRadius: '8px',
        fontSize: '10px',
        fontWeight: '600',
        textTransform: 'uppercase'
      }}>
        {user.status}
      </span>
    );
  };

  const getRoleBadge = () => {
    if (!user) return null;
    
    const isAdminUser = user.role === UserRole.ADMIN;
    
    return (
      <span style={{
        backgroundColor: isAdminUser ? '#7c3aed20' : '#6b728020',
        color: isAdminUser ? '#7c3aed' : '#6b7280',
        padding: '2px 6px',
        borderRadius: '8px',
        fontSize: '10px',
        fontWeight: '600'
      }}>
        {isAdminUser ? '👑 ADMIN' : '👤 USER'}
      </span>
    );
  };

  return (
    <>
      <header style={{
        backgroundColor: '#1f2937',
        color: 'white',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        position: 'relative'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700' }}>
            💰 Asset Manager
          </h1>
          {isAdmin && (
            <span style={{
              backgroundColor: '#fbbf24',
              color: '#92400e',
              padding: '4px 8px',
              borderRadius: '12px',
              fontSize: '11px',
              fontWeight: '600'
            }}>
              ADMIN PANEL
            </span>
          )}
        </div>
        
        {user && (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                  <span style={{ fontWeight: '600' }}>{user.username}</span>
                  {getRoleBadge()}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {getUserStatusBadge()}
                  <span style={{ fontSize: '10px', opacity: 0.8 }}>
                    {user.permission?.toUpperCase()} ACCESS
                  </span>
                </div>
              </div>
              <span style={{ fontSize: '12px', transform: showMenu ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                ▼
              </span>
            </button>

            {showMenu && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '8px',
                backgroundColor: 'white',
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
                border: '1px solid #e5e7eb',
                minWidth: '200px',
                zIndex: 1000,
                overflow: 'hidden'
              }}>
                {isAdmin && (
                  <>
                    <button
                      onClick={() => {
                        onShowAdminDashboard?.();
                        setShowMenu(false);
                      }}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        textAlign: 'left',
                        border: 'none',
                        backgroundColor: 'transparent',
                        color: '#1f2937',
                        cursor: 'pointer',
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      👑 Admin Dashboard
                    </button>
                    <button
                      onClick={() => {
                        onShowAssets?.();
                        setShowMenu(false);
                      }}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        textAlign: 'left',
                        border: 'none',
                        backgroundColor: 'transparent',
                        color: '#1f2937',
                        cursor: 'pointer',
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      💼 Asset Management
                    </button>
                    <button
                      onClick={() => {
                        onShowLedger?.();
                        setShowMenu(false);
                      }}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        textAlign: 'left',
                        border: 'none',
                        backgroundColor: 'transparent',
                        color: '#1f2937',
                        cursor: 'pointer',
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      📊 가계부
                    </button>
                    <hr style={{ margin: 0, border: 'none', borderTop: '1px solid #e5e7eb' }} />
                  </>
                )}
                
                <button
                  onClick={() => {
                    setShowPasswordModal(true);
                    setShowMenu(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    textAlign: 'left',
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: '#1f2937',
                    cursor: 'pointer',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  🔑 Change Password
                </button>
                
                <hr style={{ margin: 0, border: 'none', borderTop: '1px solid #e5e7eb' }} />
                
                <button
                  onClick={() => {
                    logout();
                    setShowMenu(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    textAlign: 'left',
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: '#dc2626',
                    cursor: 'pointer',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      <PasswordChangeModal 
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </>
  );
};

export default Header;