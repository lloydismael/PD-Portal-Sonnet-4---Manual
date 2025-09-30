import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:8000');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Customer API
export const customerAPI = {
  getAll: () => api.get('/customers'),
  create: (customer) => api.post('/customers', customer),
};

// Cost Center API
export const costCenterAPI = {
  getAll: (customerId = null) => {
    const params = customerId ? { customer_id: customerId } : {};
    return api.get('/cost-centers', { params });
  },
  create: (costCenter) => api.post('/cost-centers', costCenter),
};

// User API
export const userAPI = {
  getAll: (role = null) => {
    const params = role ? { role } : {};
    return api.get('/users', { params });
  },
  create: (user) => api.post('/users', user),
};

// Form API
export const formAPI = {
  getAll: (filters = {}) => api.get('/forms', { params: filters }),
  getById: (id) => api.get(`/forms/${id}`),
  create: (formData) => {
    return api.post('/forms', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  updateStatus: (id, status) => {
    const formData = new FormData();
    formData.append('status', status);
    return api.put(`/forms/${id}/status`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  assign: (id, assignedToId) => {
    const formData = new FormData();
    formData.append('assigned_to_id', assignedToId);
    return api.put(`/forms/${id}/assign`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
};

export default api;