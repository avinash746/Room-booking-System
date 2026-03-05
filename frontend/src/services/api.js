import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── Auth ────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
};

// ─── Rooms ───────────────────────────────────────────────────
export const roomsAPI = {
  getAll: () => api.get('/rooms'),
  getById: (id) => api.get(`/rooms/${id}`),
  checkAvailability: (id, startDate, endDate) =>
    api.get(`/rooms/${id}/availability`, { params: { startDate, endDate } }),
};

// ─── Bookings ────────────────────────────────────────────────
export const bookingsAPI = {
  create: (data) => api.post('/bookings', data),
  getMyBookings: () => api.get('/bookings/my'),
  cancel: (id) => api.patch(`/bookings/${id}/cancel`),
};

export default api;