import React, { useState } from 'react';
import { FiArrowLeft, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const ConfigurarExpensasPage = () => {
  const navigate = useNavigate();
  const [reglas, setReglas] = useState([
    { id: 1, concepto: 'Administración', porcentaje: 100, base: 'Área', aplicado: true },
    { id: 2, concepto: 'Servicios Generales', porcentaje: 80, base: 'Ocupantes', aplicado: true },
    { id: 3, concepto: 'Seguros', porcentaje: 100, base: 'Unidades', aplicado: true },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ concepto: '', porcentaje: '', base: 'Área', aplicado: true });

  const bases = ['Área', 'Ocupantes', 'Unidades'];

  const handleAdd = () => {
    if (form.concepto && form.porcentaje) {
      setReglas([...reglas, {
        id: reglas.length + 1,
        ...form,
        porcentaje: parseFloat(form.porcentaje)
      }]);
      setForm({ concepto: '', porcentaje: '', base: 'Área', aplicado: true });
      setShowModal(false);
    }
  };

  const handleDelete = (id) => {
    setReglas(reglas.filter(r => r.id !== id));
  };

  const toggleAplicado = (id) => {
    setReglas(reglas.map(r => r.id === id ? { ...r, aplicado: !r.aplicado } : r));
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-200 rounded-lg">
            <FiArrowLeft size={20} />
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Configurar Expensas</h1>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <FiPlus /> Nueva Regla
        </button>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-600 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-800">
          <strong>Nota:</strong> Las expensas se distribuyen según la base configurada. 
          Total de reglas activas: <strong>{reglas.filter(r => r.aplicado).length}</strong>
        </p>
      </div>

      {/* Tabla de Reglas */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Concepto</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Porcentaje</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Base de Cálculo</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Estado</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reglas.map(regla => (
              <tr key={regla.id} className={`border-b hover:bg-gray-50 ${!regla.aplicado ? 'opacity-50' : ''}`}>
                <td className="px-6 py-3 text-sm font-medium text-gray-800">{regla.concepto}</td>
                <td className="px-6 py-3 text-sm font-semibold text-gray-800">{regla.porcentaje}%</td>
                <td className="px-6 py-3 text-sm text-gray-800">{regla.base}</td>
                <td className="px-6 py-3">
                  <button
                    onClick={() => toggleAplicado(regla.id)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                      regla.aplicado
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {regla.aplicado ? 'Activa' : 'Inactiva'}
                  </button>
                </td>
                <td className="px-6 py-3 text-center">
                  <div className="flex justify-center gap-2">
                    <button className="p-2 hover:bg-blue-100 rounded-lg text-blue-600">
                      <FiEdit2 size={18} />
                    </button>
                    <button onClick={() => handleDelete(regla.id)} className="p-2 hover:bg-red-100 rounded-lg text-red-600">
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
            <h2 className="text-2xl font-bold mb-4">Nueva Regla de Expensas</h2>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Concepto"
                value={form.concepto}
                onChange={(e) => setForm({ ...form, concepto: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <input
                type="number"
                placeholder="Porcentaje"
                value={form.porcentaje}
                onChange={(e) => setForm({ ...form, porcentaje: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <select
                value={form.base}
                onChange={(e) => setForm({ ...form, base: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                {bases.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.aplicado}
                  onChange={(e) => setForm({ ...form, aplicado: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">Aplicar inmediatamente</span>
              </label>
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

export default ConfigurarExpensasPage;
