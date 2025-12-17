import React, { useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiSend, FiEye } from 'react-icons/fi';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import FormGroup from '../../components/common/FormGroup';
import Alert from '../../components/common/Alert';
import Select from '../../components/common/Select';

const ComunicadosPage = () => {
  const [comunicados, setComunicados] = useState([
    {
      id: 1,
      titulo: 'Mantenimiento de Agua',
      contenido: 'Se realizará mantenimiento el 20/12 de 08:00 a 12:00',
      destinatarios: 'Todos',
      fecha_creacion: '2025-12-14',
      fecha_envio: '2025-12-14',
      estado: 'enviado',
      leidos: 28,
      total: 45,
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewingComunicado, setViewingComunicado] = useState(null);
  const [formData, setFormData] = useState({
    titulo: '',
    contenido: '',
    destinatarios: 'todos',
    tipo: 'informativo',
  });

  const destinatariosOptions = [
    { value: 'todos', label: 'Todos los Residentes' },
    { value: 'propietarios', label: 'Solo Propietarios' },
    { value: 'residentes', label: 'Solo Residentes' },
    { value: 'administrador', label: 'Solo Administradores' },
  ];

  const tipoOptions = [
    { value: 'informativo', label: 'Informativo' },
    { value: 'urgente', label: 'Urgente' },
    { value: 'mantenimiento', label: 'Mantenimiento' },
    { value: 'aviso', label: 'Aviso' },
  ];

  const handleOpenModal = (comunicado = null) => {
    if (comunicado) {
      setEditingId(comunicado.id);
      setFormData({
        titulo: comunicado.titulo,
        contenido: comunicado.contenido,
        destinatarios: comunicado.destinatarios.toLowerCase(),
        tipo: 'informativo',
      });
    } else {
      setEditingId(null);
      setFormData({
        titulo: '',
        contenido: '',
        destinatarios: 'todos',
        tipo: 'informativo',
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
        setComunicados(
          comunicados.map((c) =>
            c.id === editingId
              ? { ...c, ...formData, estado: 'editado' }
              : c
          )
        );
        setSuccess('Comunicado actualizado correctamente');
      } else {
        const newComunicado = {
          id: Math.max(...comunicados.map((c) => c.id), 0) + 1,
          ...formData,
          fecha_creacion: new Date().toISOString().split('T')[0],
          fecha_envio: new Date().toISOString().split('T')[0],
          estado: 'enviado',
          leidos: 0,
          total: 45,
        };
        setComunicados([...comunicados, newComunicado]);
        setSuccess('Comunicado enviado correctamente');
      }
      handleCloseModal();
    } catch (err) {
      setError('Error al guardar comunicado: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro?')) {
      setComunicados(comunicados.filter((c) => c.id !== id));
      setSuccess('Comunicado eliminado correctamente');
    }
  };

  const handleView = (comunicado) => {
    setViewingComunicado(comunicado);
    setShowViewModal(true);
  };

  const getTipoColor = (tipo) => {
    const colors = {
      informativo: 'bg-blue-100 text-blue-800',
      urgente: 'bg-red-100 text-red-800',
      mantenimiento: 'bg-yellow-100 text-yellow-800',
      aviso: 'bg-orange-100 text-orange-800',
    };
    return colors[tipo] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-8 space-y-6">
      <PageHeader
        title="Enviar Comunicados"
        subtitle="Gestiona comunicaciones con residentes"
        action={
          <Button
            variant="primary"
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2"
          >
            <FiSend size={20} />
            Nuevo Comunicado
          </Button>
        }
      />

      {error && <Alert type="error" title="Error" message={error} />}
      {success && <Alert type="success" title="Éxito" message={success} />}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-gray-600 text-sm mb-2">Total Enviados</p>
          <p className="text-3xl font-bold text-blue-600">
            {comunicados.length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-gray-600 text-sm mb-2">Promedio Lectura</p>
          <p className="text-3xl font-bold text-green-600">
            {comunicados.length > 0
              ? Math.round(
                  (comunicados.reduce((s, c) => s + c.leidos, 0) /
                    (comunicados.length * 45)) *
                    100
                )
              : 0}
            %
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-gray-600 text-sm mb-2">Total Lecturas</p>
          <p className="text-3xl font-bold text-purple-600">
            {comunicados.reduce((s, c) => s + c.leidos, 0)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-gray-600 text-sm mb-2">Pendientes</p>
          <p className="text-3xl font-bold text-yellow-600">
            {comunicados.reduce((s, c) => s + (c.total - c.leidos), 0)}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Histórico de Comunicados</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                  Título
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                  Destinatarios
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700">
                  Lectura
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                  Fecha
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {comunicados.map((comunicado) => (
                <tr key={comunicado.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-semibold">
                    {comunicado.titulo}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${getTipoColor(
                        comunicado.tipo || 'informativo'
                      )}`}
                    >
                      {comunicado.tipo || 'Informativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {comunicado.destinatarios}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="text-sm font-semibold text-gray-900">
                      {comunicado.leidos}/{comunicado.total}
                    </div>
                    <div className="text-xs text-gray-500">
                      {Math.round((comunicado.leidos / comunicado.total) * 100)}%
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {new Date(comunicado.fecha_creacion).toLocaleDateString(
                      'es-ES'
                    )}
                  </td>
                  <td className="px-6 py-4 flex gap-2 justify-center">
                    <button
                      onClick={() => handleView(comunicado)}
                      className="p-1 text-green-600 hover:bg-green-50 rounded"
                    >
                      <FiEye size={18} />
                    </button>
                    <button
                      onClick={() => handleOpenModal(comunicado)}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <FiEdit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(comunicado.id)}
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
              placeholder="Escribe el comunicado"
              rows="6"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </FormGroup>

          <FormGroup label="Destinatarios" required>
            <Select
              name="destinatarios"
              value={formData.destinatarios}
              onChange={handleInputChange}
              options={destinatariosOptions}
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
              {editingId ? 'Actualizar' : 'Enviar'}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title={viewingComunicado?.titulo}
        size="lg"
      >
        {viewingComunicado && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Contenido
              </label>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-900 whitespace-pre-wrap">
                  {viewingComunicado.contenido}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700">
                  Destinatarios
                </label>
                <p className="text-gray-600">{viewingComunicado.destinatarios}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700">
                  Fecha
                </label>
                <p className="text-gray-600">
                  {new Date(viewingComunicado.fecha_creacion).toLocaleDateString(
                    'es-ES'
                  )}
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700">
                  Lecturas
                </label>
                <p className="text-gray-600">
                  {viewingComunicado.leidos}/{viewingComunicado.total}
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700">
                  Porcentaje
                </label>
                <p className="text-gray-600">
                  {Math.round(
                    (viewingComunicado.leidos / viewingComunicado.total) * 100
                  )}
                  %
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ComunicadosPage;
