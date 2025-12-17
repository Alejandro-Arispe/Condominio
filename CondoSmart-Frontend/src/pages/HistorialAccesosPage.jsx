import React, { useState } from 'react';
import { FiArrowLeft, FiSearch, FiFilter } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const HistorialAccesosPage = () => {
  const navigate = useNavigate();
  const [accesos, setAccesos] = useState([
    { id: 1, tipo: 'Entrada', usuario: 'Juan Pérez', fecha: '2024-02-16', hora: '08:15', ubicacion: 'Puerta Principal', metodo: 'Tarjeta' },
    { id: 2, tipo: 'Salida', usuario: 'María García', fecha: '2024-02-16', hora: '12:30', ubicacion: 'Garaje', metodo: 'Código PIN' },
    { id: 3, tipo: 'Entrada', usuario: 'Carlos López', fecha: '2024-02-16', hora: '14:45', ubicacion: 'Puerta Trasera', metodo: 'Biométrico' },
    { id: 4, tipo: 'Salida', usuario: 'Juan Pérez', fecha: '2024-02-16', hora: '17:20', ubicacion: 'Puerta Principal', metodo: 'Tarjeta' },
    { id: 5, tipo: 'Entrada', usuario: 'Visitante', fecha: '2024-02-16', hora: '19:00', ubicacion: 'Puerta Principal', metodo: 'Registrado' },
  ]);
  const [filtroTipo, setFiltroTipo] = useState('Todas');
  const [busqueda, setBusqueda] = useState('');

  const filtradas = accesos.filter(a => {
    const coincideTipo = filtroTipo === 'Todas' || a.tipo === filtroTipo;
    const coincideBusqueda = a.usuario.toLowerCase().includes(busqueda.toLowerCase()) ||
                             a.ubicacion.toLowerCase().includes(busqueda.toLowerCase());
    return coincideTipo && coincideBusqueda;
  });

  const getTipoColor = (tipo) => {
    return tipo === 'Entrada' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  const getMetodoIcon = (metodo) => {
    const iconos = {
      'Tarjeta': '🎫',
      'Código PIN': '🔐',
      'Biométrico': '👆',
      'Registrado': '✓'
    };
    return iconos[metodo] || '📱';
  };

  // Estadísticas
  const hoy = accesos.filter(a => a.fecha === '2024-02-16');
  const entradas = hoy.filter(a => a.tipo === 'Entrada').length;
  const salidas = hoy.filter(a => a.tipo === 'Salida').length;

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-200 rounded-lg">
          <FiArrowLeft size={20} />
        </button>
        <h1 className="text-3xl font-bold text-gray-800">Historial de Accesos</h1>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-600">
          <p className="text-sm text-gray-600">Entradas Hoy</p>
          <p className="text-3xl font-bold text-green-700">{entradas}</p>
        </div>
        <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-600">
          <p className="text-sm text-gray-600">Salidas Hoy</p>
          <p className="text-3xl font-bold text-red-700">{salidas}</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-600">
          <p className="text-sm text-gray-600">Total de Movimientos</p>
          <p className="text-3xl font-bold text-blue-700">{hoy.length}</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <FiSearch className="text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por usuario o ubicación..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div className="flex items-center gap-2">
            <FiFilter className="text-gray-400" />
            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option>Todas</option>
              <option>Entrada</option>
              <option>Salida</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabla de Accesos */}
      <div className="space-y-3">
        {filtradas.map(acceso => (
          <div key={acceso.id} className="bg-white rounded-lg shadow-md p-4 border-l-4" style={{
            borderColor: acceso.tipo === 'Entrada' ? '#10b981' : '#ef4444'
          }}>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getTipoColor(acceso.tipo)}`}>
                  {acceso.tipo}
                </span>
                <span className="text-2xl">{getMetodoIcon(acceso.metodo)}</span>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Usuario</p>
                <p className="font-semibold text-gray-800">{acceso.usuario}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Hora</p>
                <p className="font-semibold text-gray-800">{acceso.hora}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Ubicación</p>
                <p className="font-semibold text-gray-800">{acceso.ubicacion}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Método</p>
                <p className="text-sm text-gray-700">{acceso.metodo}</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">📅 {acceso.fecha}</p>
          </div>
        ))}
        {filtradas.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No se encontraron registros</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistorialAccesosPage;
