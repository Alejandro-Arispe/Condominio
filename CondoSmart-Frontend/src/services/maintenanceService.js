import apiClient from './apiClient';

export const ticketService = {
    list: (params) => apiClient.get('/tickets/', { params }),
    get: (id) => apiClient.get(`/tickets/${id}/`),
    create: (data) => apiClient.post('/tickets/', data),
    update: (id, data) => apiClient.patch(`/tickets/${id}/`, data),
    delete: (id) => apiClient.delete(`/tickets/${id}/`),
};

export const fotoTicketService = {
    list: (params) => apiClient.get('/fotos-tickets/', { params }),
    create: (data) => apiClient.post('/fotos-tickets/', data),
    delete: (id) => apiClient.delete(`/fotos-tickets/${id}/`),
};
