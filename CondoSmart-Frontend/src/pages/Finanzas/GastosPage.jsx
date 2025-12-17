import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiDownload } from 'react-icons/fi';
import { gastoService } from '../../services/financeService';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Table from '../../components/common/Table';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import FormGroup from '../../components/common/FormGroup';
import Alert from '../../components/common/Alert';
import Select from '../../components/common/Select';

const GastosPage = () => {
  const [gastos, setGastos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    concepto: '',
    descripcion: '',
    monto: '',
    fecha: '',
    categoria: 'general',
    comprobante: '',
  });

  const categoriaOptions = [
    { value: 'general', label: 'General' },
    { value: 'mantenimiento', label: 'Mantenimiento' },
    { value: 'servicios', label: 'Servicios' },
    { value: 'limpieza', label: 'Limpieza' },
    { value: 'seguridad', label: 'Seguridad' },
    { value: 'administracion', label: 'Administración' },
    { value: 'otros', label: 'Otros' },
  ];

  useEffect(() => {
    loadGastos();
  }, []);

  const loadGastos = async () => {
    try {
      setLoading(true);
      const response = await gastoService.list({ search: searchTerm });
      setGastos(response.data.results || response.data);
      setError('');
    } catch (err) {
      setError('Error al cargar gastos: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  const handleOpenModal = (gasto = null) => {
    if (gasto) {
      setEditingId(gasto.id);
      setFormData(gasto);
    } else {
      setEditingId(null);
      setFormData({
        concepto: '',
        descripcion: '',
        monto: '',
        fecha: '',
        categoria: 'general',
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
        await gastoService.update(editingId, formData);
        setSuccess('Gasto actualizado correctamente');
      } else {
        await gastoService.create(formData);
        setSuccess('Gasto creado correctamente');
      }
      handleCloseModal();
      loadGastos();
    } catch (err) {
      setError('Error al guardar gasto: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este gasto?')) {
      try {
        setLoading(true);
        await gastoService.delete(id);
        setSuccess('Gasto eliminado correctamente');
        loadGastos();
      } catch (err) {
        setError('Error al eliminar gasto: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const totalGastos = gastos.reduce((sum, gasto) => sum + (parseFloat(gasto.monto) || 0), 0);

  const columns = [
    {
      key: 'fecha',
      label: 'Fecha',
      render: (value) => new Date(value).toLocaleDateString('es-ES'),
    },
    {
      key: 'concepto',
      label: 'Concepto',
      render: (value) => <span className="font-semibold">{value}</span>,
    },
    {
      key: 'categoria',
      label: 'Categoría',
      render: (value) => (
        <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
          {value}
        </span>
      ),
    },
    {
      key: 'monto',
      label: 'Monto',
      render: (value) => (
        <span className="font-semibold text-red-600">
          ${parseFloat(value).toFixed(2)}
        </span>
      ),
    },
    {
      key: 'descripcion',
      label: 'Descripción',
      render: (value) => (
        <span className="text-sm text-gray-600 truncate max-w-xs">{value || '-'}</span>
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
        title="Gestionar Gastos"
        subtitle="Registro y seguimiento de gastos del condominio"
        action={
          <Button
            variant="primary"
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2"
          >
            <FiPlus size={20} />
            Nuevo Gasto
          </Button>
        }
      />

      {error && <Alert type="error" title="Error" message={error} />}
      {success && <Alert type="success" title="Éxito" message={success} />}

      {/* Resumen de Gastos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-gray-600 text-sm font-medium mb-2">Total de Gastos</p>
          <p className="text-3xl font-bold text-red-600">
            ${totalGastos.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500 mt-2">{gastos.length} registros</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-gray-600 text-sm font-medium mb-2">Promedio Mensual</p>
          <p className="text-3xl font-bold text-blue-600">
            ${(totalGastos / (new Date().getMonth() + 1)).toFixed(2)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-gray-600 text-sm font-medium mb-2">Últimos 30 días</p>
          <p className="text-3xl font-bold text-green-600">
            ${gastos
              .filter(
                (g) =>
                  new Date(g.fecha) >
                  new Date(new Date().setDate(new Date().getDate() - 30))
              )
              .reduce((sum, g) => sum + parseFloat(g.monto), 0)
              .toFixed(2)}
          </p>
        </div>
      </div>

      {/* Búsqueda */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="relative">
          <FiSearch className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por concepto o descripción..."
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
          data={gastos}
          loading={loading}
          emptyMessage="No hay gastos registrados"
        />
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingId ? 'Editar Gasto' : 'Nuevo Gasto'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormGroup label="Concepto" required>
            <Input
              name="concepto"
              value={formData.concepto}
              onChange={handleInputChange}
              placeholder="Descripción breve del gasto"
            />
          </FormGroup>

          <FormGroup label="Categoría" required>
            <Select
              name="categoria"
              value={formData.categoria}
              onChange={handleInputChange}
              options={categoriaOptions}
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

          <FormGroup label="Fecha" required>
            <Input
              name="fecha"
              type="date"
              value={formData.fecha}
              onChange={handleInputChange}
            />
          </FormGroup>

          <FormGroup label="Descripción" required={false}>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              placeholder="Detalles adicionales"
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </FormGroup>

          <FormGroup label="Comprobante" required={false}>
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
              {editingId ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default GastosPage;
