import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiFilter } from 'react-icons/fi';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Table from '../../components/common/Table';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import FormGroup from '../../components/common/FormGroup';
import Alert from '../../components/common/Alert';
import Select from '../../components/common/Select';

const AccesosPage = () => {
  const [accesos, setAccesos] = useState([
    {
      id: 1,
      visitante: 'Juan Pérez',
      unidad: '101',
      fecha_ingreso: '2025-12-15T08:30:00',
      fecha_salida: '2025-12-15T17:45:00',
      tipo: 'visitante',
      motivo: 'Visita personal',
      responsable: 'Carlos López',
      estado: 'completado',
    },
    {
      id: 2,
      visitante: 'Empresa de Limpieza XYZ',
      unidad: 'Áreas comunes',
      fecha_ingreso: '2025-12-14T06:00:00',
      fecha_salida: '2025-12-14T12:00:00',
      tipo: 'servicio',
      motivo: 'Limpieza general',
      responsable: 'Admin',
      estado: 'completado',
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    visitante: '',
    unidad: '',
    tipo: 'visitante',
    motivo: '',
    responsable: '',
  });

  const tipoOptions = [
    { value: 'visitante', label: 'Visitante' },
    { value: 'servicio', label: 'Servicio' },
    { value: 'contratista', label: 'Contratista' },
    { value: 'entrega', label: 'Entrega' },
  ];

  const handleOpenModal = (acceso = null) => {
    if (acceso) {
      setEditingId(acceso.id);
      setFormData(acceso);
    } else {
      setEditingId(null);
      setFormData({
        visitante: '',
        unidad: '',
        tipo: 'visitante',
        motivo: '',
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
        setAccesos(
          accesos.map((a) => (a.id === editingId ? { ...a, ...formData } : a))
        );
        setSuccess('Acceso actualizado correctamente');
      } else {
        const newAcceso = {
          id: Math.max(...accesos.map((a) => a.id), 0) + 1,
          ...formData,
          fecha_ingreso: new Date().toISOString(),
          estado: 'activo',
        };
        setAccesos([...accesos, newAcceso]);
        setSuccess('Acceso registrado correctamente');
      }
      handleCloseModal();
    } catch (err) {
      setError('Error al guardar acceso: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este registro?')) {
      setAccesos(accesos.filter((a) => a.id !== id));
      setSuccess('Acceso eliminado correctamente');
    }
  };

  const columns = [
    {
      key: 'visitante',
      label: 'Visitante/Empresa',
      render: (value) => <span className="font-semibold">{value}</span>,
    },
    {
      key: 'tipo',
      label: 'Tipo',
      render: (value) => (
        <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
          {value}
        </span>
      ),
    },
    {
      key: 'unidad',
      label: 'Unidad/Área',
      render: (value) => <span className="text-sm text-gray-600">{value}</span>,
    },
    {
      key: 'motivo',
      label: 'Motivo',
      render: (value) => (
        <span className="text-sm text-gray-600 truncate max-w-xs">{value}</span>
      ),
    },
    {
      key: 'fecha_ingreso',
      label: 'Ingreso',
      render: (value) =>
        new Date(value).toLocaleDateString('es-ES', {
          hour: '2-digit',
          minute: '2-digit',
        }),
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (value) => (
        <span
          className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
            value === 'completado'
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
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
            className="p-1 text-blue-600 hover:bg-blue-50 rounded transition"
          >
            <FiEdit2 size={18} />
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="p-1 text-red-600 hover:bg-red-50 rounded transition"
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
        title="Gestionar Accesos y Visitas"
        subtitle="Control de ingreso y egreso de visitantes"
        action={
          <Button
            variant="primary"
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2"
          >
            <FiPlus size={20} />
            Nuevo Acceso
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
            placeholder="Buscar por visitante o unidad..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <Table
          columns={columns}
          data={accesos}
          loading={loading}
          emptyMessage="No hay accesos registrados"
        />
      </div>

      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingId ? 'Editar Acceso' : 'Registrar Nuevo Acceso'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormGroup label="Visitante/Empresa" required>
            <Input
              name="visitante"
              value={formData.visitante}
              onChange={handleInputChange}
              placeholder="Nombre del visitante o empresa"
            />
          </FormGroup>

          <FormGroup label="Tipo de Acceso" required>
            <Select
              name="tipo"
              value={formData.tipo}
              onChange={handleInputChange}
              options={tipoOptions}
            />
          </FormGroup>

          <FormGroup label="Unidad/Área" required>
            <Input
              name="unidad"
              value={formData.unidad}
              onChange={handleInputChange}
              placeholder="Unidad o área común"
            />
          </FormGroup>

          <FormGroup label="Motivo de la Visita" required>
            <Input
              name="motivo"
              value={formData.motivo}
              onChange={handleInputChange}
              placeholder="Motivo"
            />
          </FormGroup>

          <FormGroup label="Responsable" required>
            <Input
              name="responsable"
              value={formData.responsable}
              onChange={handleInputChange}
              placeholder="Propietario o responsable"
            />
          </FormGroup>

          <div className="flex gap-3 pt-4">
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit" loading={loading}>
              {editingId ? 'Actualizar' : 'Registrar'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AccesosPage;
