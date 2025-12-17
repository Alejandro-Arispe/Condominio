import React, { useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiCalendar } from 'react-icons/fi';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import FormGroup from '../../components/common/FormGroup';
import Alert from '../../components/common/Alert';
import Select from '../../components/common/Select';

const ReservasPage = () => {
  const [reservas, setReservas] = useState([
    {
      id: 1,
      area: 'Salón de Eventos',
      usuario: 'Carlos López',
      unidad: '301',
      fecha_inicio: '2025-12-20',
      fecha_fin: '2025-12-20',
      hora_inicio: '18:00',
      hora_fin: '23:00',
      motivo: 'Cumpleaños',
      estado: 'confirmada',
      deposito: 500,
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    area: '',
    usuario: '',
    unidad: '',
    fecha_inicio: '',
    hora_inicio: '',
    hora_fin: '',
    motivo: '',
  });

  const areaOptions = [
    { value: 'salon', label: 'Salón de Eventos' },
    { value: 'cancha', label: 'Cancha Deportiva' },
    { value: 'piscina', label: 'Piscina' },
    { value: 'parque', label: 'Parque Infantil' },
    { value: 'gym', label: 'Gimnasio' },
  ];

  const handleOpenModal = (reserva = null) => {
    if (reserva) {
      setEditingId(reserva.id);
      setFormData({
        area: reserva.area,
        usuario: reserva.usuario,
        unidad: reserva.unidad,
        fecha_inicio: reserva.fecha_inicio,
        hora_inicio: reserva.hora_inicio,
        hora_fin: reserva.hora_fin,
        motivo: reserva.motivo,
      });
    } else {
      setEditingId(null);
      setFormData({
        area: '',
        usuario: '',
        unidad: '',
        fecha_inicio: '',
        hora_inicio: '',
        hora_fin: '',
        motivo: '',
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
        setReservas(
          reservas.map((r) =>
            r.id === editingId
              ? { ...r, ...formData, estado: 'confirmada' }
              : r
          )
        );
        setSuccess('Reserva actualizada correctamente');
      } else {
        const newReserva = {
          id: Math.max(...reservas.map((r) => r.id), 0) + 1,
          ...formData,
          estado: 'confirmada',
          deposito: 0,
        };
        setReservas([...reservas, newReserva]);
        setSuccess('Reserva creada correctamente');
      }
      handleCloseModal();
    } catch (err) {
      setError('Error al guardar reserva: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro?')) {
      setReservas(reservas.filter((r) => r.id !== id));
      setSuccess('Reserva eliminada correctamente');
    }
  };

  const handleCancelar = (id) => {
    if (window.confirm('¿Cancelar esta reserva?')) {
      setReservas(
        reservas.map((r) => (r.id === id ? { ...r, estado: 'cancelada' } : r))
      );
      setSuccess('Reserva cancelada correctamente');
    }
  };

  return (
    <div className="p-8 space-y-6">
      <PageHeader
        title="Realizar Reservas"
        subtitle="Gestiona las reservas de áreas comunes"
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-gray-600 text-sm mb-2">Reservas Confirmadas</p>
          <p className="text-3xl font-bold text-green-600">
            {reservas.filter((r) => r.estado === 'confirmada').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-gray-600 text-sm mb-2">Próximas 7 Días</p>
          <p className="text-3xl font-bold text-blue-600">
            {reservas.filter((r) => {
              const fecha = new Date(r.fecha_inicio);
              const hoy = new Date();
              const proximos = new Date(hoy.getTime() + 7 * 24 * 60 * 60 * 1000);
              return fecha >= hoy && fecha <= proximos;
            }).length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-gray-600 text-sm mb-2">Depósitos Recaudados</p>
          <p className="text-3xl font-bold text-purple-600">
            ${reservas.reduce((sum, r) => sum + r.deposito, 0).toFixed(2)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-gray-600 text-sm mb-2">Áreas Disponibles</p>
          <p className="text-3xl font-bold text-gray-600">{areaOptions.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Próximas Reservas</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                  Área
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                  Horario
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                  Motivo
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
              {reservas.map((reserva) => (
                <tr key={reserva.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-semibold">
                    {reserva.area}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {reserva.usuario} (U{reserva.unidad})
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {new Date(reserva.fecha_inicio).toLocaleDateString('es-ES')}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {reserva.hora_inicio} - {reserva.hora_fin}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {reserva.motivo}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                        reserva.estado === 'confirmada'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {reserva.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-2 justify-center">
                    <button
                      onClick={() => handleOpenModal(reserva)}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <FiEdit2 size={18} />
                    </button>
                    {reserva.estado === 'confirmada' && (
                      <button
                        onClick={() => handleCancelar(reserva.id)}
                        className="p-1 text-yellow-600 hover:bg-yellow-50 rounded"
                      >
                        ✕
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(reserva.id)}
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
        title={editingId ? 'Editar Reserva' : 'Nueva Reserva'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormGroup label="Área Común" required>
            <Select
              name="area"
              value={formData.area}
              onChange={handleInputChange}
              options={areaOptions}
            />
          </FormGroup>

          <FormGroup label="Usuario" required>
            <Input
              name="usuario"
              value={formData.usuario}
              onChange={handleInputChange}
              placeholder="Nombre del usuario"
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

          <FormGroup label="Fecha" required>
            <Input
              name="fecha_inicio"
              type="date"
              value={formData.fecha_inicio}
              onChange={handleInputChange}
            />
          </FormGroup>

          <div className="grid grid-cols-2 gap-4">
            <FormGroup label="Hora Inicio" required>
              <Input
                name="hora_inicio"
                type="time"
                value={formData.hora_inicio}
                onChange={handleInputChange}
              />
            </FormGroup>
            <FormGroup label="Hora Fin" required>
              <Input
                name="hora_fin"
                type="time"
                value={formData.hora_fin}
                onChange={handleInputChange}
              />
            </FormGroup>
          </div>

          <FormGroup label="Motivo" required>
            <Input
              name="motivo"
              value={formData.motivo}
              onChange={handleInputChange}
              placeholder="Evento, reunión, etc."
            />
          </FormGroup>

          <div className="flex gap-3 pt-4">
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit" loading={loading}>
              {editingId ? 'Actualizar' : 'Reservar'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ReservasPage;
