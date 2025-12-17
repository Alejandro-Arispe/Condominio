import React, { useState } from 'react';
import { FiArrowLeft, FiPlus, FiDollarSign, FiTrash2, FiEdit2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const GestionarDepositosPage = () => {
  const navigate = useNavigate();
  const [depositos, setDepositos] = useState([
    { id: 1, usuario: 'Juan Pérez', monto: 500, fechaDeposito: '2024-01-15', concepto: 'Caución de Reserva', estado: 'Activo' },
    { id: 2, usuario: 'María García', monto: 300, fechaDeposito: '2024-01-20', concepto: 'Multa por Daño', estado: 'Retenido' },
    { id: 3, usuario: 'Carlos López', monto: 250, fechaDeposito: '2024-01-10', concepto: 'Caución de Reserva', estado: 'Devuelto' },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ usuario: '', monto: '', concepto: '', estado: 'Activo' });

  const conceptos = ['Caución de Reserva', 'Multa por Daño', 'Depósito de Seguridad', 'Adelanto de Expensas'];
  const estados = ['Activo', 'Retenido', 'Devuelto'];

  const handleAdd = () => {
    if (form.usuario && form.monto && form.concepto) {
      setDepositos([...depositos, {
        id: depositos.length + 1,
        ...form,
        fechaDeposito: new Date().toISOString().split('T')[0],
        monto: parseFloat(form.monto)
      }]);
      setForm({ usuario: '', monto: '', concepto: '', estado: 'Activo' });
      setShowModal(false);
    }
  };

  const handleDelete = (id) => {
    setDepositos(depositos.filter(d => d.id !== id));
  };

  const totalDepositado = depositos.reduce((sum, d) => sum + (d.estado === 'Activo' ? d.monto : 0), 0);
  const totalRetenido = depositos.reduce((sum, d) => sum + (d.estado === 'Retenido' ? d.monto : 0), 0);
  const totalDevuelto = depositos.reduce((sum, d) => sum + (d.estado === 'Devuelto' ? d.monto : 0), 0);

  const getStatusColor = (estado) => {
    const colors = {
      'Activo': 'bg-green-100 text-green-800',
      'Retenido': 'bg-yellow-100 text-yellow-800',
      'Devuelto': 'bg-blue-100 text-blue-800',
    };
    return colors[estado] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-200 rounded-lg">
            <FiArrowLeft size={20} />
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Gestionar Depósitos</h1>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <FiPlus /> Nuevo Depósito
        </button>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-600">
          <p className="text-sm text-gray-600">Depósitos Activos</p>
          <p className="text-3xl font-bold text-green-700">${totalDepositado.toFixed(2)}</p>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4 border-l-4 border-yellow-600">
          <p className="text-sm text-gray-600">Depósitos Retenidos</p>
          <p className="text-3xl font-bold text-yellow-700">${totalRetenido.toFixed(2)}</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-600">
          <p className="text-sm text-gray-600">Total Devuelto</p>
          <p className="text-3xl font-bold text-blue-700">${totalDevuelto.toFixed(2)}</p>
        </div>
      </div>

      {/* Tabla de Depósitos */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Usuario</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Monto</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Concepto</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Fecha</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Estado</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {depositos.map(deposito => (
              <tr key={deposito.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-3 text-sm font-medium text-gray-800">{deposito.usuario}</td>
                <td className="px-6 py-3 text-sm font-semibold text-gray-800">${deposito.monto}</td>
                <td className="px-6 py-3 text-sm text-gray-800">{deposito.concepto}</td>
                <td className="px-6 py-3 text-sm text-gray-600">{deposito.fechaDeposito}</td>
                <td className="px-6 py-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(deposito.estado)}`}>
                    {deposito.estado}
                  </span>
                </td>
                <td className="px-6 py-3 text-center">
                  <div className="flex justify-center gap-2">
                    <button className="p-2 hover:bg-blue-100 rounded-lg text-blue-600">
                      <FiEdit2 size={18} />
                    </button>
                    <button onClick={() => handleDelete(deposito.id)} className="p-2 hover:bg-red-100 rounded-lg text-red-600">
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
            <h2 className="text-2xl font-bold mb-4">Nuevo Depósito</h2>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Nombre del usuario"
                value={form.usuario}
                onChange={(e) => setForm({ ...form, usuario: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <input
                type="number"
                placeholder="Monto"
                value={form.monto}
                onChange={(e) => setForm({ ...form, monto: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <select
                value={form.concepto}
                onChange={(e) => setForm({ ...form, concepto: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="">Seleccionar concepto</option>
                {conceptos.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select
                value={form.estado}
                onChange={(e) => setForm({ ...form, estado: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                {estados.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
              <div className="flex gap-3 pt-4">
                <button onClick={handleAdd} className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
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

export default GestionarDepositosPage;
