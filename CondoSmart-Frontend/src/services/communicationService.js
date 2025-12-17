import apiClient from './apiClient';

export const comunicadoService = {
    list: (params) => apiClient.get('/comunicados/', { params }),
    get: (id) => apiClient.get(`/comunicados/${id}/`),
    create: (data) => apiClient.post('/comunicados/', data),
    update: (id, data) => apiClient.patch(`/comunicados/${id}/`, data),
    delete: (id) => apiClient.delete(`/comunicados/${id}/`),
};
