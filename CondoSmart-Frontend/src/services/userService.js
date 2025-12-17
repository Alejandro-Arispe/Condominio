import apiClient from './apiClient';

export const userService = {
    list: (params) => apiClient.get('/usuarios/', { params }),
    get: (id) => apiClient.get(`/usuarios/${id}/`),
    create: (data) => apiClient.post('/usuarios/', data),
    update: (id, data) => apiClient.patch(`/usuarios/${id}/`, data),
    delete: (id) => apiClient.delete(`/usuarios/${id}/`),
    me: () => apiClient.get('/usuarios/me/'),
    uploadPhoto: (id, formData) => apiClient.post(`/usuarios/${id}/upload_photo/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }),
};
