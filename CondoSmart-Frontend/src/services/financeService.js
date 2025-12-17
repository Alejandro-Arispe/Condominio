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
  list: (params) => axiosInstance.get('/finance/config-expensas/', { params }),
  get: (id) => axiosInstance.get(`/finance/config-expensas/${id}/`),
  create: (data) => axiosInstance.post('/finance/config-expensas/', data),
  update: (id, data) => axiosInstance.patch(`/finance/config-expensas/${id}/`, data),
  delete: (id) => axiosInstance.delete(`/finance/config-expensas/${id}/`),
};

// Servicios para Gastos
export const gastoService = {
  list: (params) => axiosInstance.get('/finance/gastos/', { params }),
  get: (id) => axiosInstance.get(`/finance/gastos/${id}/`),
  create: (data) => axiosInstance.post('/finance/gastos/', data),
  update: (id, data) => axiosInstance.patch(`/finance/gastos/${id}/`, data),
  delete: (id) => axiosInstance.delete(`/finance/gastos/${id}/`),
};

// Servicios para Cargos
export const cargoService = {
  list: (params) => axiosInstance.get('/finance/cargos/', { params }),
  get: (id) => axiosInstance.get(`/finance/cargos/${id}/`),
  create: (data) => axiosInstance.post('/finance/cargos/', data),
  update: (id, data) => axiosInstance.patch(`/finance/cargos/${id}/`, data),
  delete: (id) => axiosInstance.delete(`/finance/cargos/${id}/`),
};

// Servicios para Pagos
export const pagoService = {
  list: (params) => axiosInstance.get('/finance/pagos/', { params }),
  get: (id) => axiosInstance.get(`/finance/pagos/${id}/`),
  create: (data) => axiosInstance.post('/finance/pagos/', data),
  update: (id, data) => axiosInstance.patch(`/finance/pagos/${id}/`, data),
  delete: (id) => axiosInstance.delete(`/finance/pagos/${id}/`),
};

// Servicios para Estado de Cuenta (resumen)
export const estadoCuentaService = {
  get: (userId) => axiosInstance.get(`/finance/estado-cuenta/${userId}/`),
  generarReporte: (userId, params) =>
    axiosInstance.get(`/finance/estado-cuenta/${userId}/`, { params }),
};

export default axiosInstance;
