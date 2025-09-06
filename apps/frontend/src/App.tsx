import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import Login from './components/Login';
import AssetList from './components/AssetList';
import AdminDashboard from './components/AdminDashboard';
import Ledger from './components/Ledger';
import Orders from './components/Orders';
import { UserStatus } from './services/api';
import './App.css';

function AppContent() {
  const { user, loading, isAdmin, isApproved } = useAuth();
  const [currentView, setCurrentView] = useState<'assets' | 'ledger' | 'orders' | 'admin'>('assets');

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: '#f8fafc'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '40px',
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔄</div>
          <div style={{ fontSize: '18px', color: '#374151', fontWeight: '500' }}>Loading...</div>
        </div>
      </div>
    );
  }

  // Show login if no user
  if (!user) {
    return (
      <div className="App">
        <Login />
      </div>
    );
  }

  // Show pending/rejected status screen for non-approved users
  if (user.status !== UserStatus.APPROVED) {
    const statusMessages = {
      [UserStatus.PENDING]: {
        icon: '⏳',
        title: 'Account Pending Approval',
        message: 'Your account is currently pending admin approval. You will receive access once an administrator reviews and approves your registration.',
        bgColor: '#fef3c7',
        textColor: '#92400e',
        borderColor: '#fbbf24'
      },
      [UserStatus.REJECTED]: {
        icon: '❌',
        title: 'Account Access Denied',
        message: user.rejectionReason || 'Your account has been rejected by the administrator. Please contact support for more information.',
        bgColor: '#fef2f2',
        textColor: '#b91c1c',
        borderColor: '#f87171'
      }
    };

    const status = statusMessages[user.status as keyof typeof statusMessages];

    return (
      <div className="App">
        <Header />
        <div style={{ 
          padding: '40px 20px',
          backgroundColor: '#f8fafc',
          minHeight: 'calc(100vh - 80px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            maxWidth: '500px',
            width: '100%',
            backgroundColor: status.bgColor,
            padding: '40px',
            borderRadius: '16px',
            border: `2px solid ${status.borderColor}`,
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>
              {status.icon}
            </div>
            <h2 style={{ 
              margin: '0 0 16px 0',
              color: status.textColor,
              fontSize: '24px',
              fontWeight: '700'
            }}>
              {status.title}
            </h2>
            <p style={{
              margin: 0,
              color: status.textColor,
              fontSize: '16px',
              lineHeight: 1.6
            }}>
              {status.message}
            </p>
            {user.status === UserStatus.PENDING && (
              <div style={{
                marginTop: '20px',
                padding: '16px',
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                borderRadius: '8px',
                fontSize: '14px',
                color: '#6b7280'
              }}>
                <strong>Account Details:</strong><br />
                Username: {user.username}<br />
                Registration Date: {new Date(user.createdAt).toLocaleDateString()}<br />
                Status: {user.status.toUpperCase()}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <Header 
        onShowAdminDashboard={() => setCurrentView('admin')}
        onShowAssets={() => setCurrentView('assets')}
        onShowLedger={() => setCurrentView('ledger')}
        onShowOrders={() => setCurrentView('orders')}
      />
      
      {/* Quick Navigation Bar */}
      <div style={{ 
        backgroundColor: 'white', 
        borderBottom: '1px solid #e5e7eb',
        padding: '15px 20px',
        display: 'flex',
        gap: '10px',
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={() => setCurrentView('assets')}
          style={{
            padding: '8px 16px',
            backgroundColor: currentView === 'assets' ? '#007bff' : '#f8f9fa',
            color: currentView === 'assets' ? 'white' : '#495057',
            border: '1px solid #dee2e6',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          💼 Asset Management
        </button>
        <button
          onClick={() => setCurrentView('ledger')}
          style={{
            padding: '8px 16px',
            backgroundColor: currentView === 'ledger' ? '#28a745' : '#f8f9fa',
            color: currentView === 'ledger' ? 'white' : '#495057',
            border: '1px solid #dee2e6',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          📊 Financial Ledger
        </button>
        <button
          onClick={() => setCurrentView('orders')}
          style={{
            padding: '8px 16px',
            backgroundColor: currentView === 'orders' ? '#fd7e14' : '#f8f9fa',
            color: currentView === 'orders' ? 'white' : '#495057',
            border: '1px solid #dee2e6',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          🍽️ Food Orders
        </button>
        {isAdmin && (
          <button
            onClick={() => setCurrentView('admin')}
            style={{
              padding: '8px 16px',
              backgroundColor: currentView === 'admin' ? '#6f42c1' : '#f8f9fa',
              color: currentView === 'admin' ? 'white' : '#495057',
              border: '1px solid #dee2e6',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            👑 Admin Dashboard
          </button>
        )}
      </div>
      
      <div style={{ backgroundColor: '#f8fafc', minHeight: 'calc(100vh - 120px)' }}>
        {currentView === 'admin' && isAdmin ? (
          <div style={{ padding: '20px' }}>
            <AdminDashboard />
          </div>
        ) : currentView === 'ledger' ? (
          <Ledger />
        ) : currentView === 'orders' ? (
          <Orders />
        ) : (
          <AssetList />
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
