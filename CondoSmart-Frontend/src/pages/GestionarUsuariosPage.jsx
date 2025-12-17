import React, { useState } from 'react';
import { FiArrowLeft, FiPlus, FiTrash2, FiEdit2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const GestionarUsuariosPage = () => {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([
    { id: 1, username: 'alejandro', email: 'ale@gmail.com', nombre: 'Alejandro', rol: 'admin', activo: true },
    { id: 2, username: 'albaro', email: 'albaro@example.com', nombre: 'Álvaro', rol: 'usuario', activo: true },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ username: '', email: '', nombre: '', rol: 'usuario' });

  const handleAddUser = () => {
    if (form.username && form.email && form.nombre) {
      setUsuarios([...usuarios, { id: usuarios.length + 1, ...form, activo: true }]);
      setForm({ username: '', email: '', nombre: '', rol: 'usuario' });
      setShowModal(false);
    }
  };

  const handleDeleteUser = (id) => {
    setUsuarios(usuarios.filter(u => u.id !== id));
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-200 rounded-lg">
            <FiArrowLeft size={20} />
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Gestionar Usuarios</h1>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <FiPlus /> Nuevo Usuario
        </button>
      </div>

      {/* Tabla de Usuarios */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Usuario</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Nombre</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Rol</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Estado</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map(usuario => (
              <tr key={usuario.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-3 text-sm text-gray-800">{usuario.username}</td>
                <td className="px-6 py-3 text-sm text-gray-800">{usuario.email}</td>
                <td className="px-6 py-3 text-sm text-gray-800">{usuario.nombre}</td>
                <td className="px-6 py-3 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${usuario.rol === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                    {usuario.rol}
                  </span>
                </td>
                <td className="px-6 py-3 text-sm">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {usuario.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-6 py-3 text-center">
                  <div className="flex justify-center gap-2">
                    <button className="p-2 hover:bg-blue-100 rounded-lg text-blue-600">
                      <FiEdit2 size={18} />
                    </button>
                    <button onClick={() => handleDeleteUser(usuario.id)} className="p-2 hover:bg-red-100 rounded-lg text-red-600">
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Nuevo Usuario</h2>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Usuario"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <input
                type="text"
                placeholder="Nombre"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <select
                value={form.rol}
                onChange={(e) => setForm({ ...form, rol: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="usuario">Usuario</option>
                <option value="admin">Administrador</option>
              </select>
              <div className="flex gap-3 pt-4">
                <button onClick={handleAddUser} className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                  Guardar
                </button>
                <button onClick={() => setShowModal(false)} className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400">
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionarUsuariosPage;
