import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi';
import { mascotaService } from '../../services/housingService';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Table from '../../components/common/Table';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import FormGroup from '../../components/common/FormGroup';
import Alert from '../../components/common/Alert';
import Select from '../../components/common/Select';

const MascotasPage = () => {
  const [mascotas, setMascotas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    raza: '',
    tipo: 'perro',
    desde: '',
    hasta: '',
    responsable: '',
  });

  const tipoMascotaOptions = [
    { value: 'perro', label: 'Perro' },
    { value: 'gato', label: 'Gato' },
    { value: 'pez', label: 'Pez' },
    { value: 'hamster', label: 'Hamster' },
    { value: 'otro', label: 'Otro' },
  ];

  useEffect(() => {
    loadMascotas();
  }, []);

  const loadMascotas = async () => {
    try {
      setLoading(true);
      const response = await mascotaService.list({ search: searchTerm });
      setMascotas(response.data.results || response.data);
      setError('');
    } catch (err) {
      setError('Error al cargar mascotas: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  const handleOpenModal = (mascota = null) => {
    if (mascota) {
      setEditingId(mascota.id);
      setFormData(mascota);
    } else {
      setEditingId(null);
      setFormData({
        name: '',
        raza: '',
        tipo: 'perro',
        desde: '',
        hasta: '',
        responsable: '',
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
        await mascotaService.update(editingId, formData);
        setSuccess('Mascota actualizada correctamente');
      } else {
        await mascotaService.create(formData);
        setSuccess('Mascota creada correctamente');
      }
      handleCloseModal();
      loadMascotas();
    } catch (err) {
      setError('Error al guardar mascota: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta mascota?')) {
      try {
        setLoading(true);
        await mascotaService.delete(id);
        setSuccess('Mascota eliminada correctamente');
        loadMascotas();
      } catch (err) {
        setError('Error al eliminar mascota: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const getAnimalEmoji = (tipo) => {
    const emojis = {
      perro: '🐕',
      gato: '🐈',
      pez: '🐠',
      hamster: '🐹',
      otro: '🐾',
    };
    return emojis[tipo] || '🐾';
  };

  const columns = [
    {
      key: 'name',
      label: 'Nombre',
      render: (value, row) => (
        <span className="font-semibold">
          {getAnimalEmoji(row.tipo)} {value}
        </span>
      ),
    },
    {
      key: 'tipo',
      label: 'Tipo',
      render: (value) => (
        <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
          {value?.charAt(0).toUpperCase() + value?.slice(1)}
        </span>
      ),
    },
    {
      key: 'raza',
      label: 'Raza',
      render: (value) => <span className="text-sm text-gray-600">{value || '-'}</span>,
    },
    {
      key: 'responsable',
      label: 'Responsable',
      render: (value) => (
        <span className="text-sm">
          {typeof value === 'object'
            ? `${value.first_name} ${value.last_name}`
            : value || 'Sin asignar'}
        </span>
      ),
    },
    {
      key: 'desde',
      label: 'Desde',
      render: (value) =>
        value ? new Date(value).toLocaleDateString('es-ES') : '-',
    },
    {
      key: 'hasta',
      label: 'Hasta',
      render: (value) =>
        value ? new Date(value).toLocaleDateString('es-ES') : '-',
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
        title="Gestionar Mascotas"
        subtitle="Registro de mascotas por unidad"
        action={
          <Button
            variant="primary"
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2"
          >
            <FiPlus size={20} />
            Nueva Mascota
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
            placeholder="Buscar por nombre o raza..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <Table
          columns={columns}
          data={mascotas}
          loading={loading}
          emptyMessage="No hay mascotas registradas"
        />
      </div>

      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingId ? 'Editar Mascota' : 'Nueva Mascota'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormGroup label="Nombre" required>
            <Input
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Nombre de la mascota"
            />
          </FormGroup>

          <FormGroup label="Tipo" required>
            <Select
              name="tipo"
              value={formData.tipo}
              onChange={handleInputChange}
              options={tipoMascotaOptions}
            />
          </FormGroup>

          <FormGroup label="Raza" required={false}>
            <Input
              name="raza"
              value={formData.raza}
              onChange={handleInputChange}
              placeholder="Raza de la mascota"
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

          <FormGroup label="Fecha de Inicio" required={false}>
            <Input
              name="desde"
              type="date"
              value={formData.desde}
              onChange={handleInputChange}
            />
          </FormGroup>

          <FormGroup label="Fecha de Fin" required={false}>
            <Input
              name="hasta"
              type="date"
              value={formData.hasta}
              onChange={handleInputChange}
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

export default MascotasPage;
