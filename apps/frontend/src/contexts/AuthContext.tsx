import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, authAPI, UserStatus, UserRole } from '../services/api';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  loading: boolean;
  isAdmin: boolean;
  isApproved: boolean;
  hasEditPermission: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const updatedUser = await authAPI.getProfile();
      setUser(updatedUser);
    } catch (error) {
      console.error('Failed to refresh user:', error);
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      authAPI.getProfile()
        .then(setUser)
        .catch(() => {
          localStorage.removeItem('token');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (username: string, password: string) => {
    const response = await authAPI.login(username, password);
    localStorage.setItem('token', response.access_token);
    setUser(response.user);
  };

  const register = async (username: string, password: string) => {
    try {
      const newUser = await authAPI.register(username, password);
      return {
        success: true,
        message: 'Registration successful! Your account is pending admin approval. You will be notified once approved.'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed. Please try again.'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const isAdmin = user?.role === UserRole.ADMIN || false;
  const isApproved = user?.status === UserStatus.APPROVED || false;
  const hasEditPermission = user?.hasEditPermission || false;

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAdmin,
    isApproved,
    hasEditPermission,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};