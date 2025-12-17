import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import PageHeader from '../components/common/PageHeader';
import Button from '../components/common/Button';
import Table from '../components/common/Table';
import Modal from '../components/common/Modal';
import FormGroup from '../components/common/FormGroup';
import Alert from '../components/common/Alert';
import Input from '../components/common/Input';
import { areaService } from '../services/reservationService';

const ConfigurarAreasComunesPage = () => {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    descripcion: '',
    capacidad: '',
    precio_por_hora: '',
    horario_apertura: '',
    horario_cierre: '',
    deposit_amount: '',
  });

  useEffect(() => {
    loadAreas();
  }, []);

  const loadAreas = async () => {
    try {
      setLoading(true);
      const response = await areaService.list();
      setAreas(response.data.results || response.data);
    } catch (err) {
      setError('Error al cargar áreas comunes');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (area = null) => {
    if (area) {
      setEditingId(area.id);
      setFormData({
        name: area.name,
        descripcion: area.descripcion,
        capacidad: area.capacidad,
        precio_por_hora: area.precio_por_hora,
        horario_apertura: area.horario_apertura,
        horario_cierre: area.horario_cierre,
        deposit_amount: area.deposit_amount,
      });
    } else {
      setEditingId(null);
      setFormData({
        name: '',
        descripcion: '',
        capacidad: '',
        precio_por_hora: '',
        horario_apertura: '',
        horario_cierre: '',
        deposit_amount: '',
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
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingId) {
        await areaService.update(editingId, formData);
        setSuccess('Área actualizada correctamente');
      } else {
        await areaService.create(formData);
        setSuccess('Área creada correctamente');
      }
      handleCloseModal();
      loadAreas();
    } catch (err) {
      setError('Error al guardar área');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro?')) return;
    try {
      await areaService.delete(id);
      setSuccess('Área eliminada correctamente');
      loadAreas();
    } catch (err) {
      setError('Error al eliminar área');
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Nombre',
      render: (value) => <span className="font-semibold">{value}</span>,
    },
    {
      key: 'capacidad',
      label: 'Capacidad',
      render: (value) => `${value} personas`,
    },
    {
      key: 'precio_por_hora',
      label: 'Precio/Hora',
      render: (value) => `$${parseFloat(value).toFixed(2)}`,
    },
    {
      key: 'horario_apertura',
      label: 'Horario',
      render: (value, row) => `${value} - ${row.horario_cierre}`,
    },
    {
      key: 'deposit_amount',
      label: 'Depósito',
      render: (value) => `$${parseFloat(value).toFixed(2)}`,
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
        title="Configurar Áreas Comunes"
        subtitle="Gestiona las áreas comunes del condominio"
        action={
          <Button
            variant="primary"
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2"
          >
            <FiPlus size={20} />
            Nueva Área
          </Button>
        }
      />

      {error && <Alert type="error" title="Error" message={error} />}
      {success && <Alert type="success" title="Éxito" message={success} />}

      <div className="bg-white rounded-lg shadow-sm">
        <Table
          columns={columns}
          data={areas}
          loading={loading}
          emptyMessage="No hay áreas comunes configuradas"
        />
      </div>

      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingId ? 'Editar Área' : 'Nueva Área Común'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormGroup label="Nombre" required>
            <Input
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Salón de Eventos"
            />
          </FormGroup>

          <FormGroup label="Descripción">
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              placeholder="Descripción del área"
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </FormGroup>

          <div className="grid grid-cols-2 gap-4">
            <FormGroup label="Capacidad" required>
              <Input
                name="capacidad"
                type="number"
                value={formData.capacidad}
                onChange={handleInputChange}
                placeholder="50"
              />
            </FormGroup>

            <FormGroup label="Precio por Hora" required>
              <Input
                name="precio_por_hora"
                type="number"
                step="0.01"
                value={formData.precio_por_hora}
                onChange={handleInputChange}
                placeholder="100.00"
              />
            </FormGroup>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormGroup label="Horario Apertura" required>
              <Input
                name="horario_apertura"
                type="time"
                value={formData.horario_apertura}
                onChange={handleInputChange}
              />
            </FormGroup>

            <FormGroup label="Horario Cierre" required>
              <Input
                name="horario_cierre"
                type="time"
                value={formData.horario_cierre}
                onChange={handleInputChange}
              />
            </FormGroup>
          </div>

          <FormGroup label="Monto de Depósito" required>
            <Input
              name="deposit_amount"
              type="number"
              step="0.01"
              value={formData.deposit_amount}
              onChange={handleInputChange}
              placeholder="500.00"
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

export default ConfigurarAreasComunesPage;
