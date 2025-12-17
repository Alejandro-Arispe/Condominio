import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Table from '../../components/common/Table';
import Modal from '../../components/common/Modal';
import FormGroup from '../../components/common/FormGroup';
import Alert from '../../components/common/Alert';
import Input from '../../components/common/Input';
import { accesoService } from '../../services/securityService';

const AccesosPage = () => {
  const [accesos, setAccesos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    tipo: 'entrada',
    metodo: 'manual',
  });

  useEffect(() => {
    loadAccesos();
  }, []);

  const loadAccesos = async () => {
    try {
      setLoading(true);
      const response = await accesoService.list();
      setAccesos(response.data.results || response.data);
    } catch (err) {
      setError('Error al cargar accesos');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (acceso = null) => {
    if (acceso) {
      setEditingId(acceso.id);
      setFormData({
        tipo: acceso.tipo,
        metodo: acceso.metodo,
      });
    } else {
      setEditingId(null);
      setFormData({
        tipo: 'entrada',
        metodo: 'manual',
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
        await accesoService.update(editingId, formData);
        setSuccess('Acceso actualizado correctamente');
      } else {
        await accesoService.create(formData);
        setSuccess('Acceso registrado correctamente');
      }
      handleCloseModal();
      loadAccesos();
    } catch (err) {
      setError('Error al guardar acceso');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro?')) return;
    try {
      await accesoService.delete(id);
      setSuccess('Acceso eliminado correctamente');
      loadAccesos();
    } catch (err) {
      setError('Error al eliminar acceso');
    }
  };

  const columns = [
    {
      key: 'tipo',
      label: 'Tipo',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${value === 'entrada' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
          {value}
        </span>
      ),
    },
    {
      key: 'metodo',
      label: 'Método',
    },
    {
      key: 'timestamp',
      label: 'Fecha y Hora',
      render: (value) => value ? new Date(value).toLocaleString() : '-',
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
        title="Control de Accesos"
        subtitle="Registro de entradas y salidas"
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
        title={editingId ? 'Editar Acceso' : 'Registrar Acceso'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormGroup label="Tipo" required>
            <select
              name="tipo"
              value={formData.tipo}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="entrada">Entrada</option>
              <option value="salida">Salida</option>
            </select>
          </FormGroup>

          <FormGroup label="Método" required>
            <select
              name="metodo"
              value={formData.metodo}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="manual">Manual</option>
              <option value="facial">Reconocimiento Facial</option>
              <option value="placa">Lectura de Placa</option>
              <option value="tarjeta">Tarjeta</option>
            </select>
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
