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
import { comunicadoService } from '../../services/communicationService';

const ComunicadosPage = () => {
  const [comunicados, setComunicados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    titulo: '',
    contenido: '',
    tipo: 'general',
  });

  const tipoOptions = [
    { value: 'general', label: 'General' },
    { value: 'urgente', label: 'Urgente' },
    { value: 'mantenimiento', label: 'Mantenimiento' },
    { value: 'evento', label: 'Evento' },
  ];

  useEffect(() => {
    loadComunicados();
  }, []);

  const loadComunicados = async () => {
    try {
      setLoading(true);
      const response = await comunicadoService.list();
      setComunicados(response.data.results || response.data);
    } catch (err) {
      setError('Error al cargar comunicados');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (comunicado = null) => {
    if (comunicado) {
      setEditingId(comunicado.id);
      setFormData({
        titulo: comunicado.titulo,
        contenido: comunicado.contenido,
        tipo: comunicado.tipo,
      });
    } else {
      setEditingId(null);
      setFormData({
        titulo: '',
        contenido: '',
        tipo: 'general',
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
        await comunicadoService.update(editingId, formData);
        setSuccess('Comunicado actualizado correctamente');
      } else {
        await comunicadoService.create(formData);
        setSuccess('Comunicado publicado correctamente');
      }
      handleCloseModal();
      loadComunicados();
    } catch (err) {
      setError('Error al guardar comunicado');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro?')) return;
    try {
      await comunicadoService.delete(id);
      setSuccess('Comunicado eliminado correctamente');
      loadComunicados();
    } catch (err) {
      setError('Error al eliminar comunicado');
    }
  };

  const columns = [
    {
      key: 'titulo',
      label: 'Título',
      render: (value) => <span className="font-semibold">{value}</span>,
    },
    {
      key: 'contenido',
      label: 'Contenido',
      render: (value) => <span className="text-sm text-gray-600">{value?.substring(0, 100)}...</span>,
    },
    {
      key: 'tipo',
      label: 'Tipo',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${value === 'urgente' ? 'bg-red-100 text-red-800' :
            value === 'evento' ? 'bg-blue-100 text-blue-800' :
              value === 'mantenimiento' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
          }`}>
          {value}
        </span>
      ),
    },
    {
      key: 'created_at',
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
        title="Comunicados"
        subtitle="Publica avisos y comunicados para los residentes"
        action={
          <Button
            variant="primary"
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2"
          >
            <FiPlus size={20} />
            Nuevo Comunicado
          </Button>
        }
      />

      {error && <Alert type="error" title="Error" message={error} />}
      {success && <Alert type="success" title="Éxito" message={success} />}

      <div className="bg-white rounded-lg shadow-sm">
        <Table
          columns={columns}
          data={comunicados}
          loading={loading}
          emptyMessage="No hay comunicados publicados"
        />
      </div>

      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingId ? 'Editar Comunicado' : 'Nuevo Comunicado'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormGroup label="Título" required>
            <Input
              name="titulo"
              value={formData.titulo}
              onChange={handleInputChange}
              placeholder="Título del comunicado"
            />
          </FormGroup>

          <FormGroup label="Contenido" required>
            <textarea
              name="contenido"
              value={formData.contenido}
              onChange={handleInputChange}
              placeholder="Contenido del comunicado"
              rows="6"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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

          <div className="flex gap-3 pt-4">
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit" loading={loading}>
              {editingId ? 'Actualizar' : 'Publicar'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ComunicadosPage;
