import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('moneymate_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Unauthorized / Token Expiry
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const isAuthRoute = window.location.pathname === '/login' || window.location.pathname === '/signup';
      if (!isAuthRoute && localStorage.getItem('moneymate_token')) {
        localStorage.removeItem('moneymate_token');
        localStorage.removeItem('moneymate_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ===================== AUTH SERVICES =====================
export const authService = {
  login: async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    return res.data;
  },
  register: async (userData) => {
    const res = await api.post('/auth/register', userData);
    return res.data;
  },
};

// ===================== USER SERVICES =====================
export const userService = {
  getProfile: async () => {
    const res = await api.get('/user/profile');
    return res.data;
  },
  updateProfile: async (data) => {
    const res = await api.put('/user/profile', data);
    return res.data;
  },
  changePassword: async (data) => {
    const res = await api.post('/user/change-password', data);
    return res.data;
  },
};

// ===================== TRANSACTION SERVICES =====================
export const transactionService = {
  getAll: async (params) => {
    const res = await api.get('/transactions', { params });
    return res.data;
  },
  getById: async (id) => {
    const res = await api.get(`/transactions/${id}`);
    return res.data;
  },
  create: async (data) => {
    const res = await api.post('/transactions', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await api.put(`/transactions/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/transactions/${id}`);
    return res.data;
  },
};

// ===================== BUDGET SERVICES =====================
export const budgetService = {
  getAll: async () => {
    const res = await api.get('/budgets');
    return res.data;
  },
  getById: async (id) => {
    const res = await api.get(`/budgets/${id}`);
    return res.data;
  },
  create: async (data) => {
    const res = await api.post('/budgets', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await api.put(`/budgets/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/budgets/${id}`);
    return res.data;
  },
};

// ===================== GOAL SERVICES =====================
export const goalService = {
  getAll: async () => {
    const res = await api.get('/goals');
    return res.data;
  },
  getById: async (id) => {
    const res = await api.get(`/goals/${id}`);
    return res.data;
  },
  create: async (data) => {
    const res = await api.post('/goals', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await api.put(`/goals/${id}`, data);
    return res.data;
  },
  addSavings: async (id, amount) => {
    const res = await api.post(`/goals/${id}/savings`, { amount });
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/goals/${id}`);
    return res.data;
  },
};

// ===================== DASHBOARD SERVICES =====================
export const dashboardService = {
  getSummary: async () => {
    const res = await api.get('/dashboard/summary');
    return res.data;
  },
};

// ===================== REPORT SERVICES =====================
export const reportService = {
  getReport: async (year, month) => {
    const res = await api.get('/reports', { params: { year, month } });
    return res.data;
  },
};

// ===================== NOTIFICATION SERVICES =====================
export const notificationService = {
  getAll: async () => {
    const res = await api.get('/notifications');
    return res.data;
  },
  getUnreadCount: async () => {
    const res = await api.get('/notifications/unread-count');
    return res.data;
  },
  markAsRead: async (id) => {
    const res = await api.put(`/notifications/${id}/read`);
    return res.data;
  },
  markAllAsRead: async () => {
    const res = await api.put('/notifications/read-all');
    return res.data;
  },
};

// ===================== ADMIN SERVICES =====================
export const adminService = {
  getDashboard: async () => {
    const res = await api.get('/admin/dashboard');
    return res.data;
  },
  toggleUserStatus: async (userId) => {
    const res = await api.put(`/admin/users/${userId}/toggle-status`);
    return res.data;
  },
  deleteUser: async (userId) => {
    const res = await api.delete(`/admin/users/${userId}`);
    return res.data;
  },
};

export default api;
