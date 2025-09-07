import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

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

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user'
}

export enum UserStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export enum UserPermission {
  VIEW = 'view',
  EDIT = 'edit'
}

export interface User {
  id: number;
  username: string;
  role: UserRole;
  status: UserStatus;
  permission: UserPermission;
  approvedBy?: string | null;
  approvedAt?: Date | null;
  rejectionReason?: string | null;
  createdAt: Date;
  updatedAt: Date;
  isAdmin?: boolean;
  isApproved?: boolean;
  hasEditPermission?: boolean;
}

export interface AdminStats {
  totalUsers: number;
  pendingUsers: number;
  approvedUsers: number;
  rejectedUsers: number;
  adminUsers: number;
  editPermissionUsers: number;
  viewPermissionUsers: number;
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
  previousTotalValue: number | null;
  currentTotalValue: number | null;
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
    api.get('/auth/profile').then(res => res.data),
};

export const userAPI = {
  getProfile: (): Promise<User> =>
    api.get('/users/profile').then(res => res.data),

  changePassword: (oldPassword: string, newPassword: string): Promise<{ message: string }> =>
    api.put('/users/change-password', { oldPassword, newPassword }).then(res => res.data),

  // Admin functions
  getPendingUsers: (): Promise<User[]> =>
    api.get('/users/admin/pending').then(res => res.data),

  getAllUsers: (): Promise<User[]> =>
    api.get('/users/admin/all').then(res => res.data),

  approveUser: (userId: number, permission: UserPermission): Promise<User> =>
    api.post(`/users/admin/approve/${userId}`, { permission }).then(res => res.data),

  rejectUser: (userId: number, reason: string): Promise<User> =>
    api.post(`/users/admin/reject/${userId}`, { reason }).then(res => res.data),

  updateUserPermission: (userId: number, permission: UserPermission): Promise<User> =>
    api.put(`/users/admin/permission/${userId}`, { permission }).then(res => res.data),

  getAdminStats: (): Promise<AdminStats> =>
    api.get('/users/admin/stats').then(res => res.data),
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

export interface LedgerEntry {
  id: number;
  date: string;
  category: string;
  description: string;
  amount: number;
  note?: string;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface MonthlyStats {
  month: string;
  categories: {
    [category: string]: {
      total: number;
      count: number;
      entries: LedgerEntry[];
    };
  };
  totalAmount: number;
}

export enum LedgerLogAction {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete'
}

export interface LedgerLog {
  id: number;
  entryId: number;
  userId: number;
  username: string;
  action: LedgerLogAction;
  description: string;
  amount: number;
  category: string;
  date: string;
  note?: string;
  previousData?: string;
  createdAt: Date;
}

export const ledgerAPI = {
  getAll: (): Promise<LedgerEntry[]> =>
    api.get('/ledger').then(res => res.data),
  
  create: (entry: Omit<LedgerEntry, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<LedgerEntry> =>
    api.post('/ledger', entry).then(res => res.data),
  
  update: (id: number, entry: Partial<Omit<LedgerEntry, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>): Promise<LedgerEntry> =>
    api.patch(`/ledger/${id}`, entry).then(res => res.data),
  
  delete: (id: number): Promise<{ success: boolean }> =>
    api.delete(`/ledger/${id}`).then(res => res.data),

  getStats: (year?: number, month?: number): Promise<MonthlyStats[]> => {
    const params = new URLSearchParams();
    if (year) params.append('year', year.toString());
    if (month) params.append('month', month.toString());
    return api.get(`/ledger/stats?${params}`).then(res => res.data);
  },

  getCategories: (): Promise<string[]> =>
    api.get('/ledger/categories').then(res => res.data),

  getLogs: (limit?: number): Promise<LedgerLog[]> => {
    const params = limit ? `?limit=${limit}` : '';
    return api.get(`/ledger/logs${params}`).then(res => res.data);
  },
};

export interface Order {
  id: number;
  date: string;
  foodType: string;
  details: string;
  status: 'pending' | 'completed';
  completedImage?: string;
  completedComment?: string;
  completedAt?: string;
  createdAt: string;
}

export interface CreateOrderDto {
  date: string;
  foodType: string;
  details: string;
}

export interface CompleteOrderDto {
  restaurantName: string;
  foodImage: string;
  rating: number;
  rankComment?: string;
}

export const orderAPI = {
  getPending: (): Promise<Order[]> =>
    api.get('/orders/pending').then(res => res.data),
  
  getCompleted: (): Promise<Order[]> =>
    api.get('/orders/completed').then(res => res.data),
  
  create: (order: CreateOrderDto): Promise<Order> =>
    api.post('/orders', order).then(res => res.data),
  
  update: (id: number, order: Partial<Order>): Promise<Order> =>
    api.patch(`/orders/${id}`, order).then(res => res.data),
  
  complete: (id: number, data: CompleteOrderDto): Promise<Order> =>
    api.post(`/orders/${id}/complete`, data).then(res => res.data),
  
  delete: (id: number): Promise<{ success: boolean }> =>
    api.delete(`/orders/${id}`).then(res => res.data),
};

export interface FoodRank {
  id: number;
  orderId: number;
  foodType: string;
  restaurantName: string;
  foodImage: string;
  rating: number;
  date: string;
  comment?: string;
  createdAt: string;
}

export interface UpdateFoodRankDto {
  foodType?: string;
  restaurantName?: string;
  foodImage?: string;
  rating?: number;
  date?: string;
  comment?: string;
}

export interface CreateFoodRankDto {
  foodType: string;
  restaurantName: string;
  foodImage: string;
  rating: number;
  date: string;
  comment?: string;
}

export const foodRankAPI = {
  getAll: (): Promise<FoodRank[]> =>
    api.get('/food-ranks').then(res => res.data),
  
  create: (data: CreateFoodRankDto): Promise<FoodRank> =>
    api.post('/food-ranks', data).then(res => res.data),
  
  update: (id: number, data: UpdateFoodRankDto): Promise<FoodRank> =>
    api.patch(`/food-ranks/${id}`, data).then(res => res.data),
  
  delete: (id: number): Promise<{ success: boolean }> =>
    api.delete(`/food-ranks/${id}`).then(res => res.data),
};

export default api;