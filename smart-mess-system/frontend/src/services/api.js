import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, (err) => Promise.reject(err));

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  signup: (d)  => API.post('/auth/signup', d),
  login:  (d)  => API.post('/auth/login', d),
  getMe:  ()   => API.get('/auth/me'),
};

export const mealAPI = {
  getAll:  (mealType) => API.get('/meals', { params: mealType ? { mealType } : {} }),
  getById: (id)       => API.get(`/meals/${id}`),
  create:  (d)        => API.post('/meals', d),
  update:  (id, d)    => API.put(`/meals/${id}`, d),
  delete:  (id)       => API.delete(`/meals/${id}`),
  toggle:  (id)       => API.patch(`/meals/${id}/toggle`),
};

export const bookingAPI = {
  create:     (d)      => API.post('/bookings', d),
  getMy:      ()       => API.get('/bookings/my'),
  getToday:   ()       => API.get('/bookings/my/today'),
  cancel:     (id)     => API.put(`/bookings/${id}/cancel`),
  adminAll:   (params) => API.get('/bookings/admin/all', { params }),
  adminStats: ()       => API.get('/bookings/admin/stats'),
  markUsed:   (id)     => API.put(`/bookings/${id}/use`),
};

export const feedbackAPI = {
  create:   (d) => API.post('/feedback', d),
  getMy:    ()  => API.get('/feedback/my'),
  adminAll: ()  => API.get('/feedback/admin/all'),
};

export const wasteAPI = {
  log:     (d) => API.post('/waste', d),
  getAll:  ()  => API.get('/waste'),
  summary: ()  => API.get('/waste/summary'),
};

export default API;