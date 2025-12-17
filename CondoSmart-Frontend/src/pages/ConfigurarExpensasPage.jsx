import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import PageHeader from '../components/common/PageHeader';
import Button from '../components/common/Button';
import Table from '../components/common/Table';
import Modal from '../components/common/Modal';
import FormGroup from '../components/common/FormGroup';
import Alert from '../components/common/Alert';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import axios from 'axios';

const ConfigurarExpensasPage = () => {
  const [configuraciones, setConfiguraciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    concepto: 'cuota',
    tipo: 'fijo',
    monto_base: '',
    descripcion: '',
    activo: true,
    dia_generacion: 1,
    dias_vencimiento: 15,
  });

  const conceptoOptions = [
    { value: 'cuota', label: 'Cuota Ordinaria' },
    { value: 'multa', label: 'Multa' },
    { value: 'extraordinaria', label: 'Cuota Extraordinaria' },
    { value: 'servicio', label: 'Servicio Adicional' },
  ];

  const tipoOptions = [
    { value: 'fijo', label: 'Monto Fijo' },
    { value: 'variable', label: 'Variable por Unidad' },
    { value: 'porcentaje', label: 'Porcentaje' },
  ];

  useEffect(() => {
    loadConfiguraciones();
  }, []);

  const loadConfiguraciones = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/configuraciones-expensas/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setConfiguraciones(response.data.results || response.data);
    } catch (err) {
      setError('Error al cargar configuraciones');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (config = null) => {
    if (config) {
      setEditingId(config.id);
      setFormData(config);
    } else {
      setEditingId(null);
      setFormData({
        nombre: '',
        concepto: 'cuota',
        tipo: 'fijo',
        monto_base: '',
        descripcion: '',
        activo: true,
        dia_generacion: 1,
        dias_vencimiento: 15,
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
      const token = localStorage.getItem('token');

      if (editingId) {
        await axios.put(
          `${import.meta.env.VITE_API_BASE_URL}/configuraciones-expensas/${editingId}/`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSuccess('Configuración actualizada correctamente');
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/configuraciones-expensas/`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSuccess('Configuración creada correctamente');
      }
      handleCloseModal();
      loadConfiguraciones();
    } catch (err) {
      setError('Error al guardar configuración');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/configuraciones-expensas/${id}/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Configuración eliminada correctamente');
      loadConfiguraciones();
    } catch (err) {
      setError('Error al eliminar configuración');
    }
  };

  const columns = [
    {
      key: 'nombre',
      label: 'Nombre',
      render: (value) => <span className="font-semibold">{value}</span>,
    },
    {
      key: 'concepto',
      label: 'Concepto',
    },
    {
      key: 'tipo',
      label: 'Tipo',
    },
    {
      key: 'monto_base',
      label: 'Monto Base',
      render: (value) => `$${parseFloat(value).toFixed(2)}`,
    },
    {
      key: 'dia_generacion',
      label: 'Día Generación',
    },
    {
      key: 'dias_vencimiento',
      label: 'Días Vencimiento',
    },
    {
      key: 'activo',
      label: 'Estado',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
          {value ? 'Activo' : 'Inactivo'}
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
        title="Configurar Expensas"
        subtitle="Define los conceptos y montos de las expensas automáticas"
        action={
          <Button
            variant="primary"
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2"
          >
            <FiPlus size={20} />
            Nueva Configuración
          </Button>
        }
      />

      {error && <Alert type="error" title="Error" message={error} />}
      {success && <Alert type="success" title="Éxito" message={success} />}

      <div className="bg-white rounded-lg shadow-sm">
        <Table
          columns={columns}
          data={configuraciones}
          loading={loading}
          emptyMessage="No hay configuraciones registradas"
        />
      </div>

      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingId ? 'Editar Configuración' : 'Nueva Configuración'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormGroup label="Nombre" required>
            <Input
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              placeholder="Ej: Expensa Mensual"
            />
          </FormGroup>

          <FormGroup label="Concepto" required>
            <Select
              name="concepto"
              value={formData.concepto}
              onChange={handleInputChange}
              options={conceptoOptions}
            />
          </FormGroup>

          <FormGroup label="Tipo" required>
            <Select
              name="tipo"
              value={formData.tipo}
              onChange={handleInputChange}
              options={tipoOptions}
            />
          </FormGroup>

          <FormGroup label="Monto Base" required>
            <Input
              name="monto_base"
              type="number"
              step="0.01"
              value={formData.monto_base}
              onChange={handleInputChange}
              placeholder="0.00"
            />
          </FormGroup>

          <FormGroup label="Descripción">
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Descripción de la expensa"
            />
          </FormGroup>

          <div className="grid grid-cols-2 gap-4">
            <FormGroup label="Día de Generación (1-28)" required>
              <Input
                name="dia_generacion"
                type="number"
                min="1"
                max="28"
                value={formData.dia_generacion}
                onChange={handleInputChange}
              />
            </FormGroup>

            <FormGroup label="Días para Vencimiento" required>
              <Input
                name="dias_vencimiento"
                type="number"
                min="1"
                max="90"
                value={formData.dias_vencimiento}
                onChange={handleInputChange}
              />
            </FormGroup>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="activo"
              id="activo"
              checked={formData.activo}
              onChange={handleInputChange}
              className="rounded"
            />
            <label htmlFor="activo" className="text-sm font-medium text-gray-700">
              Configuración activa
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

export default ConfigurarExpensasPage;
