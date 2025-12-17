import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiCheck } from 'react-icons/fi';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import FormGroup from '../../components/common/FormGroup';
import Alert from '../../components/common/Alert';
import Select from '../../components/common/Select';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

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

const MantenimientoPage = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    tipo: 'reparacion',
    descripcion: '',
    unidad_id: '',
    prioridad: 'media',
  });

  const tipoOptions = [
    { value: 'mantenimiento', label: 'Mantenimiento' },
    { value: 'limpieza', label: 'Limpieza' },
    { value: 'reparacion', label: 'Reparación' },
    { value: 'plagas', label: 'Control de Plagas' },
    { value: 'jardineria', label: 'Jardinería' },
  ];

  const prioridadOptions = [
    { value: 'baja', label: 'Baja' },
    { value: 'media', label: 'Media' },
    { value: 'alta', label: 'Alta' },
    { value: 'urgente', label: 'Urgente' },
  ];

  useEffect(() => {
    loadSolicitudes();
  }, []);

  const loadSolicitudes = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/tickets/');
      setSolicitudes(response.data.results || response.data);
    } catch (err) {
      setError('Error al cargar solicitudes');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (solicitud = null) => {
    if (solicitud) {
      setEditingId(solicitud.id);
      setFormData({
        tipo: solicitud.tipo,
        descripcion: solicitud.descripcion,
        unidad_id: solicitud.unidad,
        prioridad: solicitud.prioridad,
      });
    } else {
      setEditingId(null);
      setFormData({
        tipo: 'reparacion',
        descripcion: '',
        unidad_id: '',
        prioridad: 'media',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingId) {
        await axiosInstance.patch(`/tickets/${editingId}/`, formData);
        setSuccess('Solicitud actualizada correctamente');
      } else {
        await axiosInstance.post('/tickets/', formData);
        setSuccess('Solicitud creada correctamente');
      }
      handleCloseModal();
      loadSolicitudes();
    } catch (err) {
      setError('Error al guardar solicitud');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro?')) return;
    try {
      await axiosInstance.delete(`/tickets/${id}/`);
      setSuccess('Solicitud eliminada correctamente');
      loadSolicitudes();
    } catch (err) {
      setError('Error al eliminar solicitud');
    }
  };

  const handleComplete = async (id) => {
    try {
      await axiosInstance.patch(`/tickets/${id}/`, { estado: 'completado' });
      setSuccess('Solicitud marcada como completada');
      loadSolicitudes();
    } catch (err) {
      setError('Error al actualizar estado');
    }
  };

  const getPrioridadColor = (prioridad) => {
    const colors = {
      baja: 'bg-green-100 text-green-800',
      media: 'bg-yellow-100 text-yellow-800',
      alta: 'bg-orange-100 text-orange-800',
      urgente: 'bg-red-100 text-red-800',
    };
    return colors[prioridad] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-8 space-y-6">
      <PageHeader
        title="Solicitar Mantenimiento"
        subtitle="Gestiona solicitudes de servicios y reparaciones"
        action={
          <Button
            variant="primary"
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2"
          >
            <FiPlus size={20} />
            Nueva Solicitud
          </Button>
        }
      />

      {error && <Alert type="error" title="Error" message={error} />}
      {success && <Alert type="success" title="Éxito" message={success} />}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-gray-600 text-sm mb-2">Total Solicitudes</p>
          <p className="text-3xl font-bold text-gray-600">
            {solicitudes.length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-gray-600 text-sm mb-2">Pendientes</p>
          <p className="text-3xl font-bold text-red-600">
            {solicitudes.filter((s) => s.estado === 'pendiente').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-gray-600 text-sm mb-2">En Progreso</p>
          <p className="text-3xl font-bold text-yellow-600">
            {solicitudes.filter((s) => s.estado === 'en_progreso').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-gray-600 text-sm mb-2">Completadas</p>
          <p className="text-3xl font-bold text-green-600">
            {solicitudes.filter((s) => s.estado === 'completado').length}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Solicitudes de Mantenimiento</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                  Descripción
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                  Unidad
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                  Prioridad
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                  Estado
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {solicitudes.map((solicitud) => (
                <tr key={solicitud.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-semibold">
                    {solicitud.tipo}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {solicitud.descripcion?.substring(0, 50)}...
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {solicitud.unidad?.code || solicitud.unidad}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${getPrioridadColor(
                        solicitud.prioridad
                      )}`}
                    >
                      {solicitud.prioridad}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${solicitud.estado === 'completado'
                          ? 'bg-green-100 text-green-800'
                          : solicitud.estado === 'en_progreso'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                    >
                      {solicitud.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-2 justify-center">
                    {solicitud.estado !== 'completado' && (
                      <button
                        onClick={() => handleComplete(solicitud.id)}
                        className="p-1 text-green-600 hover:bg-green-50 rounded"
                      >
                        <FiCheck size={18} />
                      </button>
                    )}
                    <button
                      onClick={() => handleOpenModal(solicitud)}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <FiEdit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(solicitud.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingId ? 'Editar Solicitud' : 'Nueva Solicitud de Mantenimiento'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormGroup label="Tipo" required>
            <Select
              name="tipo"
              value={formData.tipo}
              onChange={handleInputChange}
              options={tipoOptions}
            />
          </FormGroup>

          <FormGroup label="Descripción Detallada" required>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              placeholder="Detalles del problema"
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </FormGroup>

          <FormGroup label="ID de Unidad" required>
            <Input
              name="unidad_id"
              type="number"
              value={formData.unidad_id}
              onChange={handleInputChange}
              placeholder="ID de la unidad"
            />
          </FormGroup>

          <FormGroup label="Prioridad" required>
            <Select
              name="prioridad"
              value={formData.prioridad}
              onChange={handleInputChange}
              options={prioridadOptions}
            />
          </FormGroup>

          <div className="flex gap-3 pt-4">
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit" loading={loading}>
              {editingId ? 'Actualizar' : 'Crear Solicitud'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MantenimientoPage;
