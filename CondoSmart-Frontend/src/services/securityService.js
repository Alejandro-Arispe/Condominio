import apiClient from './apiClient';

export const visitaService = {
    list: (params) => apiClient.get('/visitas/', { params }),
    get: (id) => apiClient.get(`/visitas/${id}/`),
    create: (data) => apiClient.post('/visitas/', data),
    update: (id, data) => apiClient.patch(`/visitas/${id}/`, data),
    delete: (id) => apiClient.delete(`/visitas/${id}/`),
};

export const incidenteService = {
    list: (params) => apiClient.get('/incidentes/', { params }),
    get: (id) => apiClient.get(`/incidentes/${id}/`),
    create: (data) => apiClient.post('/incidentes/', data),
    update: (id, data) => apiClient.patch(`/incidentes/${id}/`, data),
    delete: (id) => apiClient.delete(`/incidentes/${id}/`),
};

export const accesoService = {
    list: (params) => apiClient.get('/accesos/', { params }),
    get: (id) => apiClient.get(`/accesos/${id}/`),
    create: (data) => apiClient.post('/accesos/', data),
    update: (id, data) => apiClient.patch(`/accesos/${id}/`, data),
    delete: (id) => apiClient.delete(`/accesos/${id}/`),
};
