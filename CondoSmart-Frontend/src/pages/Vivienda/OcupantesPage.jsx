import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi';
import { residencyService } from '../../services/housingService';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Table from '../../components/common/Table';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import FormGroup from '../../components/common/FormGroup';
import Alert from '../../components/common/Alert';
import Select from '../../components/common/Select';

const OcupantesPage = () => {
  const [ocupantes, setOcupantes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    user: '',
    unidad: '',
    tipo_ocupacion: 'propietario',
    status: 'activa',
    is_owner: false,
    start: '',
    end: '',
  });

  const tipoOcupacionOptions = [
    { value: 'propietario', label: 'Propietario' },
    { value: 'residente', label: 'Residente' },
  ];

  const statusOptions = [
    { value: 'activa', label: 'Activa' },
    { value: 'inactiva', label: 'Inactiva' },
  ];

  useEffect(() => {
    loadOcupantes();
  }, []);

  const loadOcupantes = async () => {
    try {
      setLoading(true);
      const response = await residencyService.list({ search: searchTerm });
      setOcupantes(response.data.results || response.data);
      setError('');
    } catch (err) {
      setError('Error al cargar ocupantes: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  const handleOpenModal = (ocupante = null) => {
    if (ocupante) {
      setEditingId(ocupante.id);
      setFormData(ocupante);
    } else {
      setEditingId(null);
      setFormData({
        user: '',
        unidad: '',
        tipo_ocupacion: 'propietario',
        status: 'activa',
        is_owner: false,
        start: '',
        end: '',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingId) {
        await residencyService.update(editingId, formData);
        setSuccess('Ocupante actualizado correctamente');
      } else {
        await residencyService.create(formData);
        setSuccess('Ocupante creado correctamente');
      }
      handleCloseModal();
      loadOcupantes();
    } catch (err) {
      setError('Error al guardar ocupante: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este ocupante?')) {
      try {
        setLoading(true);
        await residencyService.delete(id);
        setSuccess('Ocupante eliminado correctamente');
        loadOcupantes();
      } catch (err) {
        setError('Error al eliminar ocupante: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const columns = [
    {
      key: 'user',
      label: 'Ocupante',
      render: (value) => (
        <span className="font-semibold">
          {typeof value === 'object' ? `${value.first_name} ${value.last_name}` : value}
        </span>
      ),
    },
    {
      key: 'unidad',
      label: 'Unidad',
      render: (value) => (
        <span className="text-sm">
          {typeof value === 'object' ? value.code : value}
        </span>
      ),
    },
    {
      key: 'tipo_ocupacion',
      label: 'Tipo de Ocupación',
      render: (value) => (
        <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
          {value === 'propietario' ? 'Propietario' : 'Residente'}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Estado',
      render: (value) => (
        <span
          className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
            value === 'activa'
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {value === 'activa' ? 'Activa' : 'Inactiva'}
        </span>
      ),
    },
    {
      key: 'is_owner',
      label: 'Propietario',
      render: (value) => (
        <span className={value ? 'text-green-600 font-semibold' : 'text-gray-400'}>
          {value ? '✓' : '-'}
        </span>
      ),
    },
    {
      key: 'start',
      label: 'Inicio',
      render: (value) => new Date(value).toLocaleDateString('es-ES'),
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (_, row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleOpenModal(row)}
            className="p-1 text-blue-600 hover:bg-blue-50 rounded transition"
            title="Editar"
          >
            <FiEdit2 size={18} />
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="p-1 text-red-600 hover:bg-red-50 rounded transition"
            title="Eliminar"
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
        title="Administrar Ocupantes"
        subtitle="Gestiona los residentes y propietarios de unidades"
        action={
          <Button
            variant="primary"
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2"
          >
            <FiPlus size={20} />
            Nuevo Ocupante
          </Button>
        }
      />

      {error && <Alert type="error" title="Error" message={error} />}
      {success && <Alert type="success" title="Éxito" message={success} />}

      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="relative">
          <FiSearch className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por nombre o unidad..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <Table
          columns={columns}
          data={ocupantes}
          loading={loading}
          emptyMessage="No hay ocupantes registrados"
        />
      </div>

      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingId ? 'Editar Ocupante' : 'Nuevo Ocupante'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormGroup label="Usuario" required>
            <Input
              name="user"
              value={formData.user}
              onChange={handleInputChange}
              placeholder="ID del usuario"
            />
          </FormGroup>

          <FormGroup label="Unidad" required>
            <Input
              name="unidad"
              value={formData.unidad}
              onChange={handleInputChange}
              placeholder="ID de la unidad"
            />
          </FormGroup>

          <FormGroup label="Tipo de Ocupación" required>
            <Select
              name="tipo_ocupacion"
              value={formData.tipo_ocupacion}
              onChange={handleInputChange}
              options={tipoOcupacionOptions}
            />
          </FormGroup>

          <FormGroup label="Estado" required>
            <Select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              options={statusOptions}
            />
          </FormGroup>

          <FormGroup label="Fecha de Inicio" required>
            <Input
              name="start"
              type="date"
              value={formData.start}
              onChange={handleInputChange}
            />
          </FormGroup>

          <FormGroup label="Fecha de Fin" required={false}>
            <Input
              name="end"
              type="date"
              value={formData.end}
              onChange={handleInputChange}
            />
          </FormGroup>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="is_owner"
              id="is_owner"
              checked={formData.is_owner}
              onChange={handleInputChange}
              className="rounded"
            />
            <label htmlFor="is_owner" className="text-sm font-medium text-gray-700">
              Marcar como propietario
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit" loading={loading}>
              {editingId ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default OcupantesPage;
