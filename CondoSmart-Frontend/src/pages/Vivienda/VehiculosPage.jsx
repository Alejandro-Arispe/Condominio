import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi';
import { vehiculoService } from '../../services/housingService';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Table from '../../components/common/Table';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import FormGroup from '../../components/common/FormGroup';
import Alert from '../../components/common/Alert';

const VehiculosPage = () => {
  const [vehiculos, setVehiculos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    unidad: '',
    responsable: '',
    placa: '',
    marca: '',
    color: '',
    observacion: '',
  });

  useEffect(() => {
    loadVehiculos();
  }, []);

  const loadVehiculos = async () => {
    try {
      setLoading(true);
      const response = await vehiculoService.list({ search: searchTerm });
      setVehiculos(response.data.results || response.data);
      setError('');
    } catch (err) {
      setError('Error al cargar vehículos: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  const handleOpenModal = (vehiculo = null) => {
    if (vehiculo) {
      setEditingId(vehiculo.id);
      setFormData(vehiculo);
    } else {
      setEditingId(null);
      setFormData({
        unidad: '',
        responsable: '',
        placa: '',
        marca: '',
        color: '',
        observacion: '',
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
        await vehiculoService.update(editingId, formData);
        setSuccess('Vehículo actualizado correctamente');
      } else {
        await vehiculoService.create(formData);
        setSuccess('Vehículo creado correctamente');
      }
      handleCloseModal();
      loadVehiculos();
    } catch (err) {
      setError('Error al guardar vehículo: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este vehículo?')) {
      try {
        setLoading(true);
        await vehiculoService.delete(id);
        setSuccess('Vehículo eliminado correctamente');
        loadVehiculos();
      } catch (err) {
        setError('Error al eliminar vehículo: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const columns = [
    {
      key: 'placa',
      label: 'Placa',
      render: (value) => <span className="font-semibold text-lg">{value}</span>,
    },
    {
      key: 'marca',
      label: 'Marca',
    },
    {
      key: 'color',
      label: 'Color',
      render: (value) => (
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded border border-gray-300"
            style={{ backgroundColor: value?.toLowerCase() || '#ccc' }}
          />
          <span>{value || 'N/A'}</span>
        </div>
      ),
    },
    {
      key: 'unidad',
      label: 'Unidad',
      render: (value) => (
        <span className="text-sm text-gray-600">
          {typeof value === 'object' ? value.code : value}
        </span>
      ),
    },
    {
      key: 'responsable',
      label: 'Responsable',
      render: (value) => (
        <span className="text-sm">
          {typeof value === 'object'
            ? `${value.first_name} ${value.last_name}`
            : value || 'Externo'}
        </span>
      ),
    },
    {
      key: 'observacion',
      label: 'Observación',
      render: (value) => (
        <span className="text-sm text-gray-600 truncate max-w-xs">
          {value || '-'}
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
      <PageHeader
        title="Gestionar Vehículos"
        subtitle="Registro de vehículos por unidad"
        action={
          <Button
            variant="primary"
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2"
          >
            <FiPlus size={20} />
            Nuevo Vehículo
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
            placeholder="Buscar por placa, marca..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <Table
          columns={columns}
          data={vehiculos}
          loading={loading}
          emptyMessage="No hay vehículos registrados"
        />
      </div>

      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingId ? 'Editar Vehículo' : 'Nuevo Vehículo'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormGroup label="Placa" required>
            <Input
              name="placa"
              value={formData.placa}
              onChange={handleInputChange}
              placeholder="Ej: AAA-123"
            />
          </FormGroup>

          <FormGroup label="Marca" required={false}>
            <Input
              name="marca"
              value={formData.marca}
              onChange={handleInputChange}
              placeholder="Ej: Toyota"
            />
          </FormGroup>

          <FormGroup label="Color" required={false}>
            <Input
              name="color"
              value={formData.color}
              onChange={handleInputChange}
              placeholder="Ej: Blanco"
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

          <FormGroup label="Responsable" required={false}>
            <Input
              name="responsable"
              value={formData.responsable}
              onChange={handleInputChange}
              placeholder="ID del responsable"
            />
          </FormGroup>

          <FormGroup label="Observación" required={false}>
            <textarea
              name="observacion"
              value={formData.observacion}
              onChange={handleInputChange}
              placeholder="Observaciones adicionales"
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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

export default VehiculosPage;
