import React, { useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiTool, FiCheck } from 'react-icons/fi';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import FormGroup from '../../components/common/FormGroup';
import Alert from '../../components/common/Alert';
import Select from '../../components/common/Select';

const MantenimientoPage = () => {
  const [solicitudes, setSolicitudes] = useState([
    {
      id: 1,
      titulo: 'Reparación de llave',
      descripcion: 'La llave del baño pierde agua',
      unidad: '201',
      residente: 'Ana García',
      estado: 'pendiente',
      prioridad: 'media',
      fecha_creacion: '2025-12-14',
      categoria: 'plomeria',
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    unidad: '',
    residente: '',
    categoria: 'general',
    prioridad: 'media',
  });

  const categoriaOptions = [
    { value: 'plomeria', label: 'Plomería' },
    { value: 'electricidad', label: 'Electricidad' },
    { value: 'pintura', label: 'Pintura' },
    { value: 'carpinteria', label: 'Carpintería' },
    { value: 'general', label: 'General' },
  ];

  const prioridadOptions = [
    { value: 'baja', label: 'Baja' },
    { value: 'media', label: 'Media' },
    { value: 'alta', label: 'Alta' },
    { value: 'urgente', label: 'Urgente' },
  ];

  const estadoOptions = [
    { value: 'pendiente', label: 'Pendiente' },
    { value: 'en_progreso', label: 'En Progreso' },
    { value: 'completada', label: 'Completada' },
  ];

  const handleOpenModal = (solicitud = null) => {
    if (solicitud) {
      setEditingId(solicitud.id);
      setFormData({
        titulo: solicitud.titulo,
        descripcion: solicitud.descripcion,
        unidad: solicitud.unidad,
        residente: solicitud.residente,
        categoria: solicitud.categoria,
        prioridad: solicitud.prioridad,
      });
    } else {
      setEditingId(null);
      setFormData({
        titulo: '',
        descripcion: '',
        unidad: '',
        residente: '',
        categoria: 'general',
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
        setSolicitudes(
          solicitudes.map((s) =>
            s.id === editingId
              ? { ...s, ...formData, estado: 'en_progreso' }
              : s
          )
        );
        setSuccess('Solicitud actualizada correctamente');
      } else {
        const newSolicitud = {
          id: Math.max(...solicitudes.map((s) => s.id), 0) + 1,
          ...formData,
          estado: 'pendiente',
          fecha_creacion: new Date().toISOString().split('T')[0],
        };
        setSolicitudes([...solicitudes, newSolicitud]);
        setSuccess('Solicitud de mantenimiento creada correctamente');
      }
      handleCloseModal();
    } catch (err) {
      setError('Error al guardar solicitud: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro?')) {
      setSolicitudes(solicitudes.filter((s) => s.id !== id));
      setSuccess('Solicitud eliminada correctamente');
    }
  };

  const handleComplete = (id) => {
    setSolicitudes(
      solicitudes.map((s) =>
        s.id === id ? { ...s, estado: 'completada' } : s
      )
    );
    setSuccess('Solicitud marcada como completada');
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
            {solicitudes.filter((s) => s.estado === 'completada').length}
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
                  Título
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                  Unidad
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                  Categoría
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
                    {solicitud.titulo}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {solicitud.unidad}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {solicitud.categoria}
                    </span>
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
                      className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                        solicitud.estado === 'completada'
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
                    {solicitud.estado !== 'completada' && (
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
          <FormGroup label="Título" required>
            <Input
              name="titulo"
              value={formData.titulo}
              onChange={handleInputChange}
              placeholder="Descripción breve"
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

          <FormGroup label="Unidad" required>
            <Input
              name="unidad"
              value={formData.unidad}
              onChange={handleInputChange}
              placeholder="Número de unidad"
            />
          </FormGroup>

          <FormGroup label="Residente" required>
            <Input
              name="residente"
              value={formData.residente}
              onChange={handleInputChange}
              placeholder="Nombre del residente"
            />
          </FormGroup>

          <FormGroup label="Categoría" required>
            <Select
              name="categoria"
              value={formData.categoria}
              onChange={handleInputChange}
              options={categoriaOptions}
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
