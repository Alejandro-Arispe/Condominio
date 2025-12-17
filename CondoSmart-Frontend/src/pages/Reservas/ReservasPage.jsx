import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Table from '../../components/common/Table';
import Modal from '../../components/common/Modal';
import FormGroup from '../../components/common/FormGroup';
import Alert from '../../components/common/Alert';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import { reservaService } from '../../services/reservationService';

const ReservasPage = () => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    area: '',
    unidad: '',
    start: '',
    end: '',
    status: 'pendiente',
  });

  const statusOptions = [
    { value: 'pendiente', label: 'Pendiente' },
    { value: 'confirmada', label: 'Confirmada' },
    { value: 'en_curso', label: 'En Curso' },
    { value: 'completada', label: 'Completada' },
    { value: 'cancelada', label: 'Cancelada' },
  ];

  useEffect(() => {
    loadReservas();
  }, []);

  const loadReservas = async () => {
    try {
      setLoading(true);
      const response = await reservaService.list();
      setReservas(response.data.results || response.data);
    } catch (err) {
      setError('Error al cargar reservas');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (reserva = null) => {
    if (reserva) {
      setEditingId(reserva.id);
      setFormData({
        area: reserva.area,
        unidad: reserva.unidad,
        start: reserva.start,
        end: reserva.end,
        status: reserva.status,
      });
    } else {
      setEditingId(null);
      setFormData({
        area: '',
        unidad: '',
        start: '',
        end: '',
        status: 'pendiente',
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
        await reservaService.update(editingId, formData);
        setSuccess('Reserva actualizada correctamente');
      } else {
        await reservaService.create(formData);
        setSuccess('Reserva creada correctamente');
      }
      handleCloseModal();
      loadReservas();
    } catch (err) {
      setError('Error al guardar reserva');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro?')) return;
    try {
      await reservaService.delete(id);
      setSuccess('Reserva eliminada correctamente');
      loadReservas();
    } catch (err) {
      setError('Error al eliminar reserva');
    }
  };

  const columns = [
    {
      key: 'area',
      label: 'Área',
      render: (value) => <span className="font-semibold">{value?.name || value}</span>,
    },
    {
      key: 'unidad',
      label: 'Unidad',
      render: (value) => value?.code || value,
    },
    {
      key: 'start',
      label: 'Inicio',
      render: (value) => new Date(value).toLocaleString(),
    },
    {
      key: 'end',
      label: 'Fin',
      render: (value) => new Date(value).toLocaleString(),
    },
    {
      key: 'status',
      label: 'Estado',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${value === 'confirmada' ? 'bg-green-100 text-green-800' :
            value === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
              value === 'cancelada' ? 'bg-red-100 text-red-800' :
                'bg-blue-100 text-blue-800'
          }`}>
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
        title="Reservas de Áreas Comunes"
        subtitle="Gestiona las reservas de espacios comunes"
        action={
          <Button
            variant="primary"
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2"
          >
            <FiPlus size={20} />
            Nueva Reserva
          </Button>
        }
      />

      {error && <Alert type="error" title="Error" message={error} />}
      {success && <Alert type="success" title="Éxito" message={success} />}

      <div className="bg-white rounded-lg shadow-sm">
        <Table
          columns={columns}
          data={reservas}
          loading={loading}
          emptyMessage="No hay reservas registradas"
        />
      </div>

      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingId ? 'Editar Reserva' : 'Nueva Reserva'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormGroup label="ID de Área" required>
            <Input
              name="area"
              type="number"
              value={formData.area}
              onChange={handleInputChange}
              placeholder="ID del área común"
            />
          </FormGroup>

          <FormGroup label="ID de Unidad" required>
            <Input
              name="unidad"
              type="number"
              value={formData.unidad}
              onChange={handleInputChange}
              placeholder="ID de la unidad"
            />
          </FormGroup>

          <FormGroup label="Fecha y Hora de Inicio" required>
            <Input
              name="start"
              type="datetime-local"
              value={formData.start}
              onChange={handleInputChange}
            />
          </FormGroup>

          <FormGroup label="Fecha y Hora de Fin" required>
            <Input
              name="end"
              type="datetime-local"
              value={formData.end}
              onChange={handleInputChange}
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

export default ReservasPage;
