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
import { cargoService } from '../../services/financeService';

const GastosPage = () => {
  const [gastos, setGastos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    unidad: '',
    concepto: 'cuota',
    descripcion: '',
    monto: '',
    periodo: new Date().toISOString().slice(0, 10),
  });

  const conceptoOptions = [
    { value: 'cuota', label: 'Cuota Ordinaria' },
    { value: 'multa', label: 'Multa' },
    { value: 'extraordinaria', label: 'Cuota Extraordinaria' },
    { value: 'servicio', label: 'Servicio Adicional' },
  ];

  useEffect(() => {
    loadGastos();
  }, []);

  const loadGastos = async () => {
    try {
      setLoading(true);
      const response = await cargoService.list();
      setGastos(response.data.results || response.data);
    } catch (err) {
      setError('Error al cargar cargos');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (gasto = null) => {
    if (gasto) {
      setEditingId(gasto.id);
      setFormData({
        unidad: gasto.unidad,
        concepto: gasto.concepto,
        descripcion: gasto.descripcion,
        monto: gasto.monto,
        periodo: gasto.periodo,
      });
    } else {
      setEditingId(null);
      setFormData({
        unidad: '',
        concepto: 'cuota',
        descripcion: '',
        monto: '',
        periodo: new Date().toISOString().slice(0, 10),
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
        await cargoService.update(editingId, formData);
        setSuccess('Cargo actualizado correctamente');
      } else {
        await cargoService.create(formData);
        setSuccess('Cargo creado correctamente');
      }
      handleCloseModal();
      loadGastos();
    } catch (err) {
      setError('Error al guardar cargo');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro?')) return;
    try {
      await cargoService.delete(id);
      setSuccess('Cargo eliminado correctamente');
      loadGastos();
    } catch (err) {
      setError('Error al eliminar cargo');
    }
  };

  const columns = [
    {
      key: 'unidad',
      label: 'Unidad',
      render: (value) => value?.code || value,
    },
    {
      key: 'concepto',
      label: 'Concepto',
      render: (value) => <span className="font-semibold">{value}</span>,
    },
    {
      key: 'descripcion',
      label: 'Descripción',
      render: (value) => <span className="text-sm text-gray-600">{value}</span>,
    },
    {
      key: 'monto',
      label: 'Monto',
      render: (value) => `$${parseFloat(value).toFixed(2)}`,
    },
    {
      key: 'periodo',
      label: 'Período',
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${value === 'pagado' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
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
        title="Gestión de Cargos"
        subtitle="Administra los cargos y expensas"
        action={
          <Button
            variant="primary"
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2"
          >
            <FiPlus size={20} />
            Nuevo Cargo
          </Button>
        }
      />

      {error && <Alert type="error" title="Error" message={error} />}
      {success && <Alert type="success" title="Éxito" message={success} />}

      <div className="bg-white rounded-lg shadow-sm">
        <Table
          columns={columns}
          data={gastos}
          loading={loading}
          emptyMessage="No hay cargos registrados"
        />
      </div>

      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingId ? 'Editar Cargo' : 'Nuevo Cargo'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormGroup label="ID de Unidad" required>
            <Input
              name="unidad"
              type="number"
              value={formData.unidad}
              onChange={handleInputChange}
              placeholder="ID de la unidad"
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

          <FormGroup label="Descripción" required>
            <Input
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              placeholder="Descripción del cargo"
            />
          </FormGroup>

          <FormGroup label="Monto" required>
            <Input
              name="monto"
              type="number"
              step="0.01"
              value={formData.monto}
              onChange={handleInputChange}
              placeholder="0.00"
            />
          </FormGroup>

          <FormGroup label="Período" required>
            <Input
              name="periodo"
              type="date"
              value={formData.periodo}
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

export default GastosPage;
