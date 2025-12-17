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
  list: (params) => axiosInstance.get('/housing/condominios/', { params }),
  get: (id) => axiosInstance.get(`/housing/condominios/${id}/`),
  create: (data) => axiosInstance.post('/housing/condominios/', data),
  update: (id, data) => axiosInstance.patch(`/housing/condominios/${id}/`, data),
  delete: (id) => axiosInstance.delete(`/housing/condominios/${id}/`),
};

// Servicios para Unidades
export const unidadService = {
  list: (params) => axiosInstance.get('/housing/unidades/', { params }),
  get: (id) => axiosInstance.get(`/housing/unidades/${id}/`),
  create: (data) => axiosInstance.post('/housing/unidades/', data),
  update: (id, data) => axiosInstance.patch(`/housing/unidades/${id}/`, data),
  delete: (id) => axiosInstance.delete(`/housing/unidades/${id}/`),
};

// Servicios para Ocupantes (Residencias)
export const residencyService = {
  list: (params) => axiosInstance.get('/housing/residencias/', { params }),
  get: (id) => axiosInstance.get(`/housing/residencias/${id}/`),
  create: (data) => axiosInstance.post('/housing/residencias/', data),
  update: (id, data) => axiosInstance.patch(`/housing/residencias/${id}/`, data),
  delete: (id) => axiosInstance.delete(`/housing/residencias/${id}/`),
};

// Servicios para Vehículos
export const vehiculoService = {
  list: (params) => axiosInstance.get('/housing/vehiculos/', { params }),
  get: (id) => axiosInstance.get(`/housing/vehiculos/${id}/`),
  create: (data) => axiosInstance.post('/housing/vehiculos/', data),
  update: (id, data) => axiosInstance.patch(`/housing/vehiculos/${id}/`, data),
  delete: (id) => axiosInstance.delete(`/housing/vehiculos/${id}/`),
};

// Servicios para Mascotas
export const mascotaService = {
  list: (params) => axiosInstance.get('/housing/mascotas/', { params }),
  get: (id) => axiosInstance.get(`/housing/mascotas/${id}/`),
  create: (data) => axiosInstance.post('/housing/mascotas/', data),
  update: (id, data) => axiosInstance.patch(`/housing/mascotas/${id}/`, data),
  delete: (id) => axiosInstance.delete(`/housing/mascotas/${id}/`),
};

// Servicios para Contratos
export const contratoService = {
  list: (params) => axiosInstance.get('/housing/contratos/', { params }),
  get: (id) => axiosInstance.get(`/housing/contratos/${id}/`),
  create: (data) => axiosInstance.post('/housing/contratos/', data),
  update: (id, data) => axiosInstance.patch(`/housing/contratos/${id}/`, data),
  delete: (id) => axiosInstance.delete(`/housing/contratos/${id}/`),
  generarCargo: (id, periodo) =>
    axiosInstance.post(`/housing/contratos/${id}/generar_cargo/`, { periodo }),
};

export default axiosInstance;
