import React, { useState } from 'react';
import { userAPI } from '../services/api';
import Modal from './Modal';

interface PasswordChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PasswordChangeModal: React.FC<PasswordChangeModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (formData.oldPassword === formData.newPassword) {
      setError('New password must be different from current password');
      return;
    }

    try {
      setLoading(true);
      await userAPI.changePassword(formData.oldPassword, formData.newPassword);
      setSuccess(true);
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    setError('');
    setSuccess(false);
    onClose();
  };

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { level: 0, text: '', color: '#d1d5db' };
    if (password.length < 6) return { level: 1, text: 'Too short', color: '#ef4444' };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (strength <= 2) return { level: 2, text: 'Weak', color: '#f59e0b' };
    if (strength <= 3) return { level: 3, text: 'Good', color: '#3b82f6' };
    return { level: 4, text: 'Strong', color: '#10b981' };
  };

  const passwordStrength = getPasswordStrength(formData.newPassword);

  if (success) {
    return (
      <Modal isOpen={isOpen} onClose={handleClose} title="✅ Password Changed">
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
          <h3 style={{ margin: '0 0 8px 0', color: '#10b981' }}>Password Changed Successfully!</h3>
          <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>
            Your password has been updated. This window will close automatically.
          </p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="🔑 Change Password">
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            color: '#374151', 
            fontWeight: '500', 
            fontSize: '14px' 
          }}>
            Current Password
          </label>
          <input
            type="password"
            value={formData.oldPassword}
            onChange={(e) => setFormData({ ...formData, oldPassword: e.target.value })}
            required
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            placeholder="Enter your current password"
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            color: '#374151', 
            fontWeight: '500', 
            fontSize: '14px' 
          }}>
            New Password
          </label>
          <input
            type="password"
            value={formData.newPassword}
            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
            required
            style={{
              width: '100%',
              padding: '12px',
              border: `2px solid ${formData.newPassword ? passwordStrength.color : '#e5e7eb'}`,
              borderRadius: '8px',
              fontSize: '14px',
              transition: 'border-color 0.2s'
            }}
            placeholder="Enter your new password"
          />
          {formData.newPassword && (
            <div style={{ marginTop: '8px' }}>
              <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                {[1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    style={{
                      flex: 1,
                      height: '4px',
                      backgroundColor: level <= passwordStrength.level ? passwordStrength.color : '#e5e7eb',
                      borderRadius: '2px',
                      transition: 'background-color 0.3s'
                    }}
                  />
                ))}
              </div>
              <div style={{ fontSize: '12px', color: passwordStrength.color, fontWeight: '500' }}>
                Password strength: {passwordStrength.text}
              </div>
            </div>
          )}
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            color: '#374151', 
            fontWeight: '500', 
            fontSize: '14px' 
          }}>
            Confirm New Password
          </label>
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            required
            style={{
              width: '100%',
              padding: '12px',
              border: `2px solid ${
                formData.confirmPassword && formData.newPassword !== formData.confirmPassword 
                  ? '#ef4444' 
                  : formData.confirmPassword && formData.newPassword === formData.confirmPassword
                    ? '#10b981'
                    : '#e5e7eb'
              }`,
              borderRadius: '8px',
              fontSize: '14px',
              transition: 'border-color 0.2s'
            }}
            placeholder="Confirm your new password"
          />
          {formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
            <div style={{ marginTop: '4px', fontSize: '12px', color: '#ef4444' }}>
              Passwords do not match
            </div>
          )}
        </div>

        {error && (
          <div style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '16px'
          }}>
            <div style={{ color: '#dc2626', fontSize: '14px' }}>
              ❌ {error}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            style={{
              padding: '12px 24px',
              backgroundColor: '#f3f4f6',
              color: '#374151',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              opacity: loading ? 0.5 : 1
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={
              loading || 
              !formData.oldPassword || 
              !formData.newPassword || 
              !formData.confirmPassword ||
              formData.newPassword !== formData.confirmPassword ||
              formData.newPassword.length < 6
            }
            style={{
              padding: '12px 24px',
              backgroundColor: loading ? '#d1d5db' : '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {loading ? '🔄 Changing...' : '🔑 Change Password'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default PasswordChangeModal;