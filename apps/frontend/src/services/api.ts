import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface User {
  id: number;
  username: string;
  role: string;
}

export interface Asset {
  id: number;
  name: string;
  category?: string;
  amount: number;
  note?: string;
}

export interface PortfolioGrowthData {
  date: string;
  value: number;
}

export interface AuditLog {
  id: number;
  action: string;
  entityType: string;
  entityId: number;
  entityName: string;
  oldValue: string | null;
  newValue: string | null;
  timestamp: Date;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export const authAPI = {
  register: (username: string, password: string): Promise<User> =>
    api.post('/auth/register', { username, password }).then(res => res.data),
  
  login: (username: string, password: string): Promise<LoginResponse> =>
    api.post('/auth/login', { username, password }).then(res => res.data),
  
  getProfile: (): Promise<User> =>
    api.get('/profile').then(res => res.data),
};

export const assetAPI = {
  getAll: (): Promise<Asset[]> =>
    api.get('/assets').then(res => res.data),
  
  create: (asset: Omit<Asset, 'id'>): Promise<Asset> =>
    api.post('/assets', asset).then(res => res.data),
  
  update: (id: number, asset: Partial<Asset>): Promise<Asset> =>
    api.patch(`/assets/${id}`, asset).then(res => res.data),
  
  delete: (id: number): Promise<{ success: boolean }> =>
    api.delete(`/assets/${id}`).then(res => res.data),
};

export const portfolioAPI = {
  getGrowthData: (): Promise<PortfolioGrowthData[]> =>
    api.get('/portfolio/growth').then(res => res.data),
  
  createSnapshot: (): Promise<any> =>
    api.post('/portfolio/snapshot').then(res => res.data),
};

export const auditAPI = {
  getLogs: (): Promise<AuditLog[]> =>
    api.get('/audit/logs').then(res => res.data),
};

export default api;