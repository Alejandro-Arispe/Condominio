import React, { useState } from 'react';
import { FiArrowLeft, FiSearch, FiCalendar } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const ReconocimientoFacialPage = () => {
  const navigate = useNavigate();
  const [filtro, setFiltro] = useState('');
  const [tipo, setTipo] = useState('todos');
  const [registros, setRegistros] = useState([
    { id: 1, tipo: 'facial', fecha: '2025-12-16 14:30', persona: 'Juan García', resultado: 'Autorizado', confianza: '98%' },
    { id: 2, tipo: 'placa', fecha: '2025-12-16 14:25', persona: 'ABC-123', resultado: 'Autorizado', confianza: '95%' },
    { id: 3, tipo: 'facial', fecha: '2025-12-16 14:20', persona: 'María López', resultado: 'Autorizado', confianza: '99%' },
    { id: 4, tipo: 'placa', fecha: '2025-12-16 14:15', persona: 'XYZ-789', resultado: 'Denegado', confianza: '45%' },
  ]);

  const registrosFiltrados = registros.filter(r => 
    (tipo === 'todos' || r.tipo === tipo) &&
    (r.persona.toLowerCase().includes(filtro.toLowerCase()) || r.fecha.includes(filtro))
  );

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-200 rounded-lg">
          <FiArrowLeft size={20} />
        </button>
        <h1 className="text-3xl font-bold text-gray-800">Reconocimiento Facial y Placas</h1>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6 grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Búsqueda</label>
          <div className="relative">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              placeholder="Persona o placa..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="todos">Todos</option>
            <option value="facial">Reconocimiento Facial</option>
            <option value="placa">Reconocimiento de Placas</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Resultado</label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600">
            <option value="">Todos</option>
            <option value="autorizado">Autorizado</option>
            <option value="denegado">Denegado</option>
          </select>
        </div>
      </div>

      {/* Tabla de Registros */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Tipo</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Persona/Placa</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Fecha/Hora</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Resultado</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Confianza</th>
            </tr>
          </thead>
          <tbody>
            {registrosFiltrados.map(reg => (
              <tr key={reg.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-3 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${reg.tipo === 'facial' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                    {reg.tipo === 'facial' ? 'Facial' : 'Placa'}
                  </span>
                </td>
                <td className="px-6 py-3 text-sm text-gray-800">{reg.persona}</td>
                <td className="px-6 py-3 text-sm text-gray-800 flex items-center gap-2">
                  <FiCalendar size={16} /> {reg.fecha}
                </td>
                <td className="px-6 py-3 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${reg.resultado === 'Autorizado' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {reg.resultado}
                  </span>
                </td>
                <td className="px-6 py-3 text-sm font-semibold text-gray-800">{reg.confianza}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mt-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-gray-600 text-sm">Autorizados Hoy</p>
          <p className="text-2xl font-bold text-green-600">23</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-gray-600 text-sm">Denegados Hoy</p>
          <p className="text-2xl font-bold text-red-600">1</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-gray-600 text-sm">Tasa de Éxito</p>
          <p className="text-2xl font-bold text-blue-600">95.8%</p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <p className="text-gray-600 text-sm">Confianza Promedio</p>
          <p className="text-2xl font-bold text-purple-600">96.2%</p>
        </div>
      </div>
    </div>
  );
};

export default ReconocimientoFacialPage;
