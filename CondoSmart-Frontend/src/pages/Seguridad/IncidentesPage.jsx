import React, { useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiAlertTriangle } from 'react-icons/fi';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Table from '../../components/common/Table';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import FormGroup from '../../components/common/FormGroup';
import Alert from '../../components/common/Alert';
import Select from '../../components/common/Select';

const IncidentesPage = () => {
  const [incidentes, setIncidentes] = useState([
    {
      id: 1,
      titulo: 'Comportamiento sospechoso',
      descripcion: 'Persona merodeando la entrada',
      severidad: 'media',
      ubicacion: 'Entrada principal',
      fecha: '2025-12-15',
      hora: '14:30',
      reportado_por: 'Vigilancia',
      estado: 'en_revision',
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
    severidad: 'media',
    ubicacion: '',
    reportado_por: '',
  });

  const severidadOptions = [
    { value: 'baja', label: 'Baja' },
    { value: 'media', label: 'Media' },
    { value: 'alta', label: 'Alta' },
    { value: 'critica', label: 'Crítica' },
  ];

  const estadoOptions = [
    { value: 'nuevo', label: 'Nuevo' },
    { value: 'en_revision', label: 'En Revisión' },
    { value: 'resuelto', label: 'Resuelto' },
  ];

  const handleOpenModal = (incidente = null) => {
    if (incidente) {
      setEditingId(incidente.id);
      setFormData(incidente);
    } else {
      setEditingId(null);
      setFormData({
        titulo: '',
        descripcion: '',
        severidad: 'media',
        ubicacion: '',
        reportado_por: '',
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
      const now = new Date();
      if (editingId) {
        setIncidentes(
          incidentes.map((i) => (i.id === editingId ? { ...i, ...formData } : i))
        );
        setSuccess('Incidente actualizado correctamente');
      } else {
        const newIncidente = {
          id: Math.max(...incidentes.map((i) => i.id), 0) + 1,
          ...formData,
          fecha: now.toISOString().split('T')[0],
          hora: `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`,
          estado: 'nuevo',
        };
        setIncidentes([...incidentes, newIncidente]);
        setSuccess('Incidente registrado correctamente');
      }
      handleCloseModal();
    } catch (err) {
      setError('Error al guardar incidente: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro?')) {
      setIncidentes(incidentes.filter((i) => i.id !== id));
      setSuccess('Incidente eliminado correctamente');
    }
  };

  const getSeveridadColor = (severidad) => {
    const colors = {
      baja: 'bg-yellow-100 text-yellow-800',
      media: 'bg-orange-100 text-orange-800',
      alta: 'bg-red-100 text-red-800',
      critica: 'bg-red-200 text-red-900',
    };
    return colors[severidad] || 'bg-gray-100 text-gray-800';
  };

  const columns = [
    {
      key: 'titulo',
      label: 'Título',
      render: (value) => <span className="font-semibold">{value}</span>,
    },
    {
      key: 'severidad',
      label: 'Severidad',
      render: (value) => (
        <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${getSeveridadColor(value)}`}>
          {value}
        </span>
      ),
    },
    {
      key: 'ubicacion',
      label: 'Ubicación',
      render: (value) => <span className="text-sm text-gray-600">{value}</span>,
    },
    {
      key: 'fecha',
      label: 'Fecha',
      render: (value, row) => (
        <span className="text-sm">
          {new Date(value).toLocaleDateString('es-ES')} {row.hora}
        </span>
      ),
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (value) => (
        <span
          className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
            value === 'resuelto'
              ? 'bg-green-100 text-green-800'
              : value === 'en_revision'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (_, row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleOpenModal(row)}
            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
          >
            <FiEdit2 size={18} />
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="p-1 text-red-600 hover:bg-red-50 rounded"
          >
            <FiTrash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-8 space-y-6">
      <PageHeader
        title="Alertas e Incidentes"
        subtitle="Registro y seguimiento de incidentes de seguridad"
        action={
          <Button
            variant="primary"
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2"
          >
            <FiPlus size={20} />
            Nuevo Incidente
          </Button>
        }
      />

      {error && <Alert type="error" title="Error" message={error} />}
      {success && <Alert type="success" title="Éxito" message={success} />}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-gray-600 text-sm mb-2">Nuevos</p>
          <p className="text-3xl font-bold text-red-600">
            {incidentes.filter((i) => i.estado === 'nuevo').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-gray-600 text-sm mb-2">En Revisión</p>
          <p className="text-3xl font-bold text-yellow-600">
            {incidentes.filter((i) => i.estado === 'en_revision').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-gray-600 text-sm mb-2">Resueltos</p>
          <p className="text-3xl font-bold text-green-600">
            {incidentes.filter((i) => i.estado === 'resuelto').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-gray-600 text-sm mb-2">Críticos</p>
          <p className="text-3xl font-bold text-red-700">
            {incidentes.filter((i) => i.severidad === 'critica').length}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <Table
          columns={columns}
          data={incidentes}
          loading={loading}
          emptyMessage="No hay incidentes registrados"
        />
      </div>

      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingId ? 'Editar Incidente' : 'Reportar Incidente'}
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
              placeholder="Detalles del incidente"
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </FormGroup>

          <FormGroup label="Severidad" required>
            <Select
              name="severidad"
              value={formData.severidad}
              onChange={handleInputChange}
              options={severidadOptions}
            />
          </FormGroup>

          <FormGroup label="Ubicación" required>
            <Input
              name="ubicacion"
              value={formData.ubicacion}
              onChange={handleInputChange}
              placeholder="Dónde ocurrió el incidente"
            />
          </FormGroup>

          <FormGroup label="Reportado por" required>
            <Input
              name="reportado_por"
              value={formData.reportado_por}
              onChange={handleInputChange}
              placeholder="Nombre de quien reporta"
            />
          </FormGroup>

          <div className="flex gap-3 pt-4">
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit" loading={loading}>
              {editingId ? 'Actualizar' : 'Reportar'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default IncidentesPage;
