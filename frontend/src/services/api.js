import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || 'An error occurred';
    return Promise.reject({ message, ...error.response?.data });
  }
);

export const employeeAPI = {
  getAll: () => api.get('/api/employees/'),
  getById: (id) => api.get(`/api/employees/${id}/`),
  create: (data) => api.post('/api/employees/', data),
  delete: (id) => api.delete(`/api/employees/${id}/`),
};

export const attendanceAPI = {
  getAll: (date = null) => {
    const params = date ? { date } : {};
    return api.get('/api/attendance/', { params });
  },
  markAttendance: (data) => api.post('/api/attendance/', data),
  getByEmployee: (employeeId) => api.get(`/api/attendance/employee/${employeeId}/`),
};

export const dashboardAPI = {
  getSummary: () => api.get('/api/attendance/dashboard/'),
};

export default api;
