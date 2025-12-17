import React, { useState } from 'react';
import { FiArrowLeft, FiPlus, FiDownload, FiTrash2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const GenerarExpensasPage = () => {
  const navigate = useNavigate();
  const [expensas, setExpensas] = useState([
    { id: 1, mes: 'Enero 2024', estado: 'Generada', total: 2500, unidades: 10, confirmada: true },
    { id: 2, mes: 'Febrero 2024', estado: 'En Proceso', total: 0, unidades: 10, confirmada: false },
  ]);
  const [mesSeleccionado, setMesSeleccionado] = useState('Febrero 2024');

  const handleGenerar = () => {
    const nuevaExpensa = {
      id: expensas.length + 1,
      mes: mesSeleccionado,
      estado: 'Generada',
      total: Math.random() * 3000 + 1500,
      unidades: 10,
      confirmada: false
    };
    setExpensas([...expensas, nuevaExpensa]);
  };

  const handleConfirmar = (id) => {
    setExpensas(expensas.map(e => e.id === id ? { ...e, confirmada: true, estado: 'Confirmada' } : e));
  };

  const handleDelete = (id) => {
    setExpensas(expensas.filter(e => e.id !== id));
  };

  const getStatusColor = (estado) => {
    const colors = {
      'Generada': 'bg-blue-100 text-blue-800',
      'En Proceso': 'bg-yellow-100 text-yellow-800',
      'Confirmada': 'bg-green-100 text-green-800',
    };
    return colors[estado] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-200 rounded-lg">
          <FiArrowLeft size={20} />
        </button>
        <h1 className="text-3xl font-bold text-gray-800">Generar Expensas</h1>
      </div>

      {/* Generador */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Generar Nueva Expensa</h2>
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Mes</label>
            <select
              value={mesSeleccionado}
              onChange={(e) => setMesSeleccionado(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option>Enero 2024</option>
              <option>Febrero 2024</option>
              <option>Marzo 2024</option>
              <option>Abril 2024</option>
              <option>Mayo 2024</option>
              <option>Junio 2024</option>
            </select>
          </div>
          <button
            onClick={handleGenerar}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            <FiPlus /> Generar
          </button>
        </div>
      </div>

      {/* Tabla de Expensas */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Mes</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Estado</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Total</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Unidades</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Por Unidad</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {expensas.map(expensa => (
              <tr key={expensa.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-3 text-sm font-medium text-gray-800">{expensa.mes}</td>
                <td className="px-6 py-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(expensa.estado)}`}>
                    {expensa.estado}
                  </span>
                </td>
                <td className="px-6 py-3 text-sm font-bold text-gray-800">${expensa.total.toFixed(2)}</td>
                <td className="px-6 py-3 text-sm text-gray-800">{expensa.unidades}</td>
                <td className="px-6 py-3 text-sm font-semibold text-green-600">${(expensa.total / expensa.unidades).toFixed(2)}</td>
                <td className="px-6 py-3 text-center">
                  <div className="flex justify-center gap-2">
                    <button className="p-2 hover:bg-green-100 rounded-lg text-green-600" title="Descargar PDF">
                      <FiDownload size={18} />
                    </button>
                    {!expensa.confirmada && (
                      <button
                        onClick={() => handleConfirmar(expensa.id)}
                        className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
                      >
                        Confirmar
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(expensa.id)}
                      className="p-2 hover:bg-red-100 rounded-lg text-red-600"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detalles de Expensa */}
      <div className="mt-6 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Detalles por Concepto</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="border-l-4 border-blue-600 pl-4">
            <p className="text-sm text-gray-600">Administración</p>
            <p className="text-2xl font-bold text-blue-600">$1,000</p>
          </div>
          <div className="border-l-4 border-green-600 pl-4">
            <p className="text-sm text-gray-600">Servicios</p>
            <p className="text-2xl font-bold text-green-600">$800</p>
          </div>
          <div className="border-l-4 border-purple-600 pl-4">
            <p className="text-sm text-gray-600">Seguros</p>
            <p className="text-2xl font-bold text-purple-600">$500</p>
          </div>
          <div className="border-l-4 border-red-600 pl-4">
            <p className="text-sm text-gray-600">Otros</p>
            <p className="text-2xl font-bold text-red-600">$200</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerarExpensasPage;
