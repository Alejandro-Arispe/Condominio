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

// Servicios para Condominios
export const condominioService = {
  list: (params) => axiosInstance.get('/condominios/', { params }),
  get: (id) => axiosInstance.get(`/condominios/${id}/`),
  create: (data) => axiosInstance.post('/condominios/', data),
  update: (id, data) => axiosInstance.patch(`/condominios/${id}/`, data),
  delete: (id) => axiosInstance.delete(`/condominios/${id}/`),
};

export const unidadService = {
  list: (params) => axiosInstance.get('/unidades/', { params }),
  get: (id) => axiosInstance.get(`/unidades/${id}/`),
  create: (data) => axiosInstance.post('/unidades/', data),
  update: (id, data) => axiosInstance.patch(`/unidades/${id}/`, data),
  delete: (id) => axiosInstance.delete(`/unidades/${id}/`),
};

export const residencyService = {
  list: (params) => axiosInstance.get('/ocupantes/', { params }),
  get: (id) => axiosInstance.get(`/ocupantes/${id}/`),
  create: (data) => axiosInstance.post('/ocupantes/', data),
  update: (id, data) => axiosInstance.patch(`/ocupantes/${id}/`, data),
  delete: (id) => axiosInstance.delete(`/ocupantes/${id}/`),
};

export const vehiculoService = {
  list: (params) => axiosInstance.get('/vehiculos/', { params }),
  get: (id) => axiosInstance.get(`/vehiculos/${id}/`),
  create: (data) => axiosInstance.post('/vehiculos/', data),
  update: (id, data) => axiosInstance.patch(`/vehiculos/${id}/`, data),
  delete: (id) => axiosInstance.delete(`/vehiculos/${id}/`),
};

export const mascotaService = {
  list: (params) => axiosInstance.get('/mascotas/', { params }),
  get: (id) => axiosInstance.get(`/mascotas/${id}/`),
  create: (data) => axiosInstance.post('/mascotas/', data),
  update: (id, data) => axiosInstance.patch(`/mascotas/${id}/`, data),
  delete: (id) => axiosInstance.delete(`/mascotas/${id}/`),
};

export const contratoService = {
  list: (params) => axiosInstance.get('/contratos/', { params }),
  get: (id) => axiosInstance.get(`/contratos/${id}/`),
  create: (data) => axiosInstance.post('/contratos/', data),
  update: (id, data) => axiosInstance.patch(`/contratos/${id}/`, data),
  delete: (id) => axiosInstance.delete(`/contratos/${id}/`),
  generarCargo: (id, periodo) =>
    axiosInstance.post(`/contratos/${id}/generar_cargo/`, { periodo }),
};

export default axiosInstance;
