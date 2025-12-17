import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Table from '../../components/common/Table';
import Modal from '../../components/common/Modal';
import FormGroup from '../../components/common/FormGroup';
import Alert from '../../components/common/Alert';
import Input from '../../components/common/Input';
import { pagoService } from '../../services/financeService';

const PagosPage = () => {
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    unidad: '',
    monto: '',
    metodo: 'efectivo',
    comprobante: '',
  });

  useEffect(() => {
    loadPagos();
  }, []);

  const loadPagos = async () => {
    try {
      setLoading(true);
      const response = await pagoService.list();
      setPagos(response.data.results || response.data);
    } catch (err) {
      setError('Error al cargar pagos');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (pago = null) => {
    if (pago) {
      setEditingId(pago.id);
      setFormData({
        unidad: pago.unidad,
        monto: pago.monto,
        metodo: pago.metodo,
        comprobante: pago.comprobante || '',
      });
    } else {
      setEditingId(null);
      setFormData({
        unidad: '',
        monto: '',
        metodo: 'efectivo',
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
    setFormData({ ...formData, [name]: value });
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
      setError('Error al guardar pago');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro?')) return;
    try {
      await pagoService.delete(id);
      setSuccess('Pago eliminado correctamente');
      loadPagos();
    } catch (err) {
      setError('Error al eliminar pago');
    }
  };

  const columns = [
    {
      key: 'unidad',
      label: 'Unidad',
      render: (value) => value?.code || value,
    },
    {
      key: 'monto',
      label: 'Monto',
      render: (value) => `$${parseFloat(value).toFixed(2)}`,
    },
    {
      key: 'metodo',
      label: 'Método',
    },
    {
      key: 'comprobante',
      label: 'Comprobante',
      render: (value) => value || '-',
    },
    {
      key: 'fecha',
      label: 'Fecha',
      render: (value) => value ? new Date(value).toLocaleDateString() : '-',
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
        title="Historial de Pagos"
        subtitle="Registro de todos los pagos realizados"
        action={
          <Button
            variant="primary"
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2"
          >
            <FiPlus size={20} />
            Registrar Pago
          </Button>
        }
      />

      {error && <Alert type="error" title="Error" message={error} />}
      {success && <Alert type="success" title="Éxito" message={success} />}

      <div className="bg-white rounded-lg shadow-sm">
        <Table
          columns={columns}
          data={pagos}
          loading={loading}
          emptyMessage="No hay pagos registrados"
        />
      </div>

      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingId ? 'Editar Pago' : 'Registrar Pago'}
        size="md"
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
            <select
              name="metodo"
              value={formData.metodo}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="efectivo">Efectivo</option>
              <option value="transferencia">Transferencia</option>
              <option value="tarjeta">Tarjeta</option>
              <option value="cheque">Cheque</option>
            </select>
          </FormGroup>

          <FormGroup label="Comprobante">
            <Input
              name="comprobante"
              value={formData.comprobante}
              onChange={handleInputChange}
              placeholder="Número de comprobante"
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

export default PagosPage;
