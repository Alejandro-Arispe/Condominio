import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiDownload, FiCheck } from 'react-icons/fi';
import { pagoService, cargoService } from '../../services/financeService';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Table from '../../components/common/Table';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import FormGroup from '../../components/common/FormGroup';
import Alert from '../../components/common/Alert';
import Select from '../../components/common/Select';

const PagosPage = () => {
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [formData, setFormData] = useState({
    usuario: '',
    monto: '',
    fecha: '',
    metodo: 'transferencia',
    referencia: '',
    comprobante: '',
  });

  const metodoOptions = [
    { value: 'transferencia', label: 'Transferencia Bancaria' },
    { value: 'tarjeta', label: 'Tarjeta de Crédito' },
    { value: 'efectivo', label: 'Efectivo' },
    { value: 'cheque', label: 'Cheque' },
  ];

  const statusOptions = [
    { value: 'all', label: 'Todos' },
    { value: 'pendiente', label: 'Pendiente' },
    { value: 'confirmado', label: 'Confirmado' },
    { value: 'rechazado', label: 'Rechazado' },
  ];

  useEffect(() => {
    loadPagos();
  }, [filterStatus]);

  const loadPagos = async () => {
    try {
      setLoading(true);
      const params = { search: searchTerm };
      if (filterStatus !== 'all') {
        params.status = filterStatus;
      }
      const response = await pagoService.list(params);
      setPagos(response.data.results || response.data);
      setError('');
    } catch (err) {
      setError('Error al cargar pagos: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  const handleOpenModal = (pago = null) => {
    if (pago) {
      setEditingId(pago.id);
      setFormData(pago);
    } else {
      setEditingId(null);
      setFormData({
        usuario: '',
        monto: '',
        fecha: '',
        metodo: 'transferencia',
        referencia: '',
        comprobante: '',
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
        await pagoService.update(editingId, formData);
        setSuccess('Pago actualizado correctamente');
      } else {
        await pagoService.create(formData);
        setSuccess('Pago registrado correctamente');
      }
      handleCloseModal();
      loadPagos();
    } catch (err) {
      setError('Error al guardar pago: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPago = async (id) => {
    if (window.confirm('¿Deseas confirmar este pago?')) {
      try {
        setLoading(true);
        await pagoService.update(id, { status: 'confirmado' });
        setSuccess('Pago confirmado correctamente');
        loadPagos();
      } catch (err) {
        setError('Error al confirmar pago: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este pago?')) {
      try {
        setLoading(true);
        await pagoService.delete(id);
        setSuccess('Pago eliminado correctamente');
        loadPagos();
      } catch (err) {
        setError('Error al eliminar pago: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const totalPagos = pagos.reduce((sum, pago) => sum + (parseFloat(pago.monto) || 0), 0);
  const pagosPendientes = pagos.filter((p) => p.status === 'pendiente').length;
  const pagosConfirmados = pagos.filter((p) => p.status === 'confirmado').length;

  const columns = [
    {
      key: 'usuario',
      label: 'Unidad/Usuario',
      render: (value) => (
        <span className="font-semibold">
          {typeof value === 'object' ? value.username : value}
        </span>
      ),
    },
    {
      key: 'monto',
      label: 'Monto',
      render: (value) => (
        <span className="font-semibold text-green-600">
          ${parseFloat(value).toFixed(2)}
        </span>
      ),
    },
    {
      key: 'metodo',
      label: 'Método',
      render: (value) => (
        <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
          {value}
        </span>
      ),
    },
    {
      key: 'fecha',
      label: 'Fecha',
      render: (value) => new Date(value).toLocaleDateString('es-ES'),
    },
    {
      key: 'status',
      label: 'Estado',
      render: (value) => (
        <span
          className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
            value === 'confirmado'
              ? 'bg-green-100 text-green-800'
              : value === 'pendiente'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {value?.charAt(0).toUpperCase() + value?.slice(1)}
        </span>
      ),
    },
    {
      key: 'referencia',
      label: 'Referencia',
      render: (value) => (
        <span className="text-sm text-gray-600 font-mono">{value || '-'}</span>
      ),
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (_, row) => (
        <div className="flex gap-2">
          {row.status === 'pendiente' && (
            <button
              onClick={() => handleConfirmPago(row.id)}
              className="p-1 text-green-600 hover:bg-green-50 rounded transition"
              title="Confirmar"
            >
              <FiCheck size={18} />
            </button>
          )}
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
        title="Historial de Pagos"
        subtitle="Registro y seguimiento de pagos realizados"
        action={
          <Button
            variant="primary"
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2"
          >
            <FiPlus size={20} />
            Nuevo Pago
          </Button>
        }
      />

      {error && <Alert type="error" title="Error" message={error} />}
      {success && <Alert type="success" title="Éxito" message={success} />}

      {/* Resumen de Pagos */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-gray-600 text-sm font-medium mb-2">Total Pagado</p>
          <p className="text-3xl font-bold text-green-600">
            ${totalPagos.toFixed(2)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-gray-600 text-sm font-medium mb-2">Pagos Confirmados</p>
          <p className="text-3xl font-bold text-blue-600">{pagosConfirmados}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-gray-600 text-sm font-medium mb-2">Pagos Pendientes</p>
          <p className="text-3xl font-bold text-yellow-600">{pagosPendientes}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-gray-600 text-sm font-medium mb-2">Total Registros</p>
          <p className="text-3xl font-bold text-gray-600">{pagos.length}</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm p-4 flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <FiSearch className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por usuario o referencia..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>
        <Select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          options={statusOptions}
          className="w-48"
        />
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-lg shadow-sm">
        <Table
          columns={columns}
          data={pagos}
          loading={loading}
          emptyMessage="No hay pagos registrados"
        />
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingId ? 'Editar Pago' : 'Nuevo Pago'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormGroup label="Usuario/Unidad" required>
            <Input
              name="usuario"
              value={formData.usuario}
              onChange={handleInputChange}
              placeholder="ID del usuario"
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

          <FormGroup label="Método de Pago" required>
            <Select
              name="metodo"
              value={formData.metodo}
              onChange={handleInputChange}
              options={metodoOptions}
            />
          </FormGroup>

          <FormGroup label="Fecha de Pago" required>
            <Input
              name="fecha"
              type="date"
              value={formData.fecha}
              onChange={handleInputChange}
            />
          </FormGroup>

          <FormGroup label="Referencia/Comprobante" required={false}>
            <Input
              name="referencia"
              value={formData.referencia}
              onChange={handleInputChange}
              placeholder="Número de referencia o comprobante"
            />
          </FormGroup>

          <FormGroup label="Archivo Comprobante" required={false}>
            <Input
              name="comprobante"
              type="file"
              onChange={handleInputChange}
            />
          </FormGroup>

          <div className="flex gap-3 pt-4">
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit" loading={loading}>
              {editingId ? 'Actualizar' : 'Registrar Pago'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PagosPage;
