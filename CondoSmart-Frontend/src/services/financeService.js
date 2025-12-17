import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/v1';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Servicios para Configuración de Expensas
export const configExpensaService = {
  list: (params) => axiosInstance.get('/config-expensas/', { params }),
  get: (id) => axiosInstance.get(`/config-expensas/${id}/`),
  create: (data) => axiosInstance.post('/config-expensas/', data),
  update: (id, data) => axiosInstance.patch(`/config-expensas/${id}/`, data),
  delete: (id) => axiosInstance.delete(`/config-expensas/${id}/`),
};

export const gastoService = {
  list: (params) => axiosInstance.get('/gastos/', { params }),
  get: (id) => axiosInstance.get(`/gastos/${id}/`),
  create: (data) => axiosInstance.post('/gastos/', data),
  update: (id, data) => axiosInstance.patch(`/gastos/${id}/`, data),
  delete: (id) => axiosInstance.delete(`/gastos/${id}/`),
};

export const cargoService = {
  list: (params) => axiosInstance.get('/cargos/', { params }),
  get: (id) => axiosInstance.get(`/cargos/${id}/`),
  create: (data) => axiosInstance.post('/cargos/', data),
  update: (id, data) => axiosInstance.patch(`/cargos/${id}/`, data),
  delete: (id) => axiosInstance.delete(`/cargos/${id}/`),
};

export const pagoService = {
  list: (params) => axiosInstance.get('/pagos/', { params }),
  get: (id) => axiosInstance.get(`/pagos/${id}/`),
  create: (data) => axiosInstance.post('/pagos/', data),
  update: (id, data) => axiosInstance.patch(`/pagos/${id}/`, data),
  delete: (id) => axiosInstance.delete(`/pagos/${id}/`),
};

export const estadoCuentaService = {
  get: (userId) => axiosInstance.get(`/estado-cuenta/${userId}/`),
  generarReporte: (userId, params) =>
    axiosInstance.get(`/estado-cuenta/${userId}/`, { params }),
};

export default axiosInstance;
