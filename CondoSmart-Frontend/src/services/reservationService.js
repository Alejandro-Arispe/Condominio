import apiClient from './apiClient';

export const reservaService = {
    list: (params) => apiClient.get('/reservas/', { params }),
    get: (id) => apiClient.get(`/reservas/${id}/`),
    create: (data) => apiClient.post('/reservas/', data),
    update: (id, data) => apiClient.patch(`/reservas/${id}/`, data),
    delete: (id) => apiClient.delete(`/reservas/${id}/`),
};

export const areaService = {
    list: (params) => apiClient.get('/areas/', { params }),
    get: (id) => apiClient.get(`/areas/${id}/`),
    create: (data) => apiClient.post('/areas/', data),
    update: (id, data) => apiClient.patch(`/areas/${id}/`, data),
    delete: (id) => apiClient.delete(`/areas/${id}/`),
};

export const suministroService = {
    list: (params) => apiClient.get('/suministros/', { params }),
    get: (id) => apiClient.get(`/suministros/${id}/`),
    create: (data) => apiClient.post('/suministros/', data),
    update: (id, data) => apiClient.patch(`/suministros/${id}/`, data),
    delete: (id) => apiClient.delete(`/suministros/${id}/`),
};
