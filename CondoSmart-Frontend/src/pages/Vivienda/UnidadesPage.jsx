import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiSearch } from 'react-icons/fi';
import { unidadService } from '../../services/housingService';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Table from '../../components/common/Table';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import FormGroup from '../../components/common/FormGroup';
import Alert from '../../components/common/Alert';
import Select from '../../components/common/Select';

const UnidadesPage = () => {
  const [unidades, setUnidades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    condominio: '',
    direccion: '',
    code: '',
    user: '',
    piso: '',
    manzano: '',
  });

  // Cargar unidades
  useEffect(() => {
    loadUnidades();
  }, []);

  const loadUnidades = async () => {
    try {
      setLoading(true);
      const response = await unidadService.list({ search: searchTerm });
      setUnidades(response.data.results || response.data);
      setError('');
    } catch (err) {
      setError('Error al cargar unidades: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  const handleOpenModal = (unidad = null) => {
    if (unidad) {
      setEditingId(unidad.id);
      setFormData(unidad);
    } else {
      setEditingId(null);
      setFormData({
        condominio: '',
        direccion: '',
        code: '',
        user: '',
        piso: '',
        manzano: '',
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
        await unidadService.update(editingId, formData);
        setSuccess('Unidad actualizada correctamente');
      } else {
        await unidadService.create(formData);
        setSuccess('Unidad creada correctamente');
      }
      handleCloseModal();
      loadUnidades();
    } catch (err) {
      setError('Error al guardar unidad: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta unidad?')) {
      try {
        setLoading(true);
        await unidadService.delete(id);
        setSuccess('Unidad eliminada correctamente');
        loadUnidades();
      } catch (err) {
        setError('Error al eliminar unidad: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const columns = [
    {
      key: 'code',
      label: 'Código',
      render: (value) => <span className="font-semibold">{value}</span>,
    },
    {
      key: 'direccion',
      label: 'Dirección',
    },
    {
      key: 'condominio',
      label: 'Condominio',
      render: (value) => (
        <span className="text-sm text-gray-600">
          {typeof value === 'object' ? value.name : value}
        </span>
      ),
    },
    {
      key: 'piso',
      label: 'Piso',
      render: (value) => value || '-',
    },
    {
      key: 'manzano',
      label: 'Manzano',
      render: (value) => value || '-',
    },
    {
      key: 'user',
      label: 'Propietario',
      render: (value) => (
        <span className="text-sm">
          {value && typeof value === 'object' ? `${value.first_name} ${value.last_name}` : value || 'Sin asignar'}
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
      {/* Header */}
      <PageHeader
        title="Administrar Unidades"
        subtitle="Gestiona todas las unidades del condominio"
        action={
          <Button
            variant="primary"
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2"
          >
            <FiPlus size={20} />
            Nueva Unidad
          </Button>
        }
      />

      {/* Alertas */}
      {error && <Alert type="error" title="Error" message={error} />}
      {success && <Alert type="success" title="Éxito" message={success} />}

      {/* Búsqueda */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="relative">
          <FiSearch className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por código o dirección..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-lg shadow-sm">
        <Table
          columns={columns}
          data={unidades}
          loading={loading}
          emptyMessage="No hay unidades registradas"
        />
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingId ? 'Editar Unidad' : 'Nueva Unidad'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormGroup label="Código" required>
            <Input
              name="code"
              value={formData.code}
              onChange={handleInputChange}
              placeholder="Ej: 101"
            />
          </FormGroup>

          <FormGroup label="Dirección" required>
            <Input
              name="direccion"
              value={formData.direccion}
              onChange={handleInputChange}
              placeholder="Dirección completa"
            />
          </FormGroup>

          <FormGroup label="Condominio" required>
            <Input
              name="condominio"
              value={formData.condominio}
              onChange={handleInputChange}
              placeholder="ID del condominio"
            />
          </FormGroup>

          <FormGroup label="Piso" required={false}>
            <Input
              name="piso"
              type="number"
              value={formData.piso}
              onChange={handleInputChange}
              placeholder="Número de piso"
            />
          </FormGroup>

          <FormGroup label="Manzano" required={false}>
            <Input
              name="manzano"
              value={formData.manzano}
              onChange={handleInputChange}
              placeholder="Manzano"
            />
          </FormGroup>

          <FormGroup label="Propietario" required={false}>
            <Input
              name="user"
              value={formData.user}
              onChange={handleInputChange}
              placeholder="ID del propietario"
            />
          </FormGroup>

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

export default UnidadesPage;
