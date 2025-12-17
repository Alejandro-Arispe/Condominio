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
import { userService } from '../services/userService';

const GestionarUsuariosPage = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    role: 'residente',
    password: '',
  });

  const roleOptions = [
    { value: 'admin', label: 'Administrador' },
    { value: 'propietario', label: 'Propietario' },
    { value: 'residente', label: 'Residente' },
    { value: 'inquilino', label: 'Inquilino' },
    { value: 'vigilancia', label: 'Vigilancia' },
  ];

  useEffect(() => {
    loadUsuarios();
  }, []);

  const loadUsuarios = async () => {
    try {
      setLoading(true);
      const response = await userService.list();
      setUsuarios(response.data.results || response.data);
    } catch (err) {
      setError('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (usuario = null) => {
    if (usuario) {
      setEditingId(usuario.id);
      setFormData({
        username: usuario.username,
        email: usuario.email,
        first_name: usuario.first_name,
        last_name: usuario.last_name,
        role: usuario.role,
        password: '',
      });
    } else {
      setEditingId(null);
      setFormData({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        role: 'residente',
        password: '',
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
      const dataToSend = { ...formData };
      if (editingId && !dataToSend.password) {
        delete dataToSend.password;
      }

      if (editingId) {
        await userService.update(editingId, dataToSend);
        setSuccess('Usuario actualizado correctamente');
      } else {
        await userService.create(dataToSend);
        setSuccess('Usuario creado correctamente');
      }
      handleCloseModal();
      loadUsuarios();
    } catch (err) {
      setError('Error al guardar usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro?')) return;
    try {
      await userService.delete(id);
      setSuccess('Usuario eliminado correctamente');
      loadUsuarios();
    } catch (err) {
      setError('Error al eliminar usuario');
    }
  };

  const columns = [
    {
      key: 'username',
      label: 'Usuario',
      render: (value) => <span className="font-semibold">{value}</span>,
    },
    {
      key: 'first_name',
      label: 'Nombre',
      render: (value, row) => `${value} ${row.last_name}`,
    },
    {
      key: 'email',
      label: 'Email',
    },
    {
      key: 'role',
      label: 'Rol',
      render: (value) => (
        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
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
        title="Gestionar Usuarios"
        subtitle="Administra los usuarios del sistema"
        action={
          <Button
            variant="primary"
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2"
          >
            <FiPlus size={20} />
            Nuevo Usuario
          </Button>
        }
      />

      {error && <Alert type="error" title="Error" message={error} />}
      {success && <Alert type="success" title="Éxito" message={success} />}

      <div className="bg-white rounded-lg shadow-sm">
        <Table
          columns={columns}
          data={usuarios}
          loading={loading}
          emptyMessage="No hay usuarios registrados"
        />
      </div>

      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingId ? 'Editar Usuario' : 'Nuevo Usuario'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormGroup label="Nombre de Usuario" required>
            <Input
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="usuario123"
            />
          </FormGroup>

          <FormGroup label="Email" required>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="usuario@ejemplo.com"
            />
          </FormGroup>

          <div className="grid grid-cols-2 gap-4">
            <FormGroup label="Nombre" required>
              <Input
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                placeholder="Juan"
              />
            </FormGroup>

            <FormGroup label="Apellido" required>
              <Input
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                placeholder="Pérez"
              />
            </FormGroup>
          </div>

          <FormGroup label="Rol" required>
            <Select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              options={roleOptions}
            />
          </FormGroup>

          <FormGroup label={editingId ? "Contraseña (dejar vacío para no cambiar)" : "Contraseña"} required={!editingId}>
            <Input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="••••••••"
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

export default GestionarUsuariosPage;
