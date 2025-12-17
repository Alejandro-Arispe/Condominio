import React, { useState } from 'react';
import { FiArrowLeft, FiPlus, FiEdit2, FiTrash2, FiCheck, FiClock } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const CicloVidaReservasPage = () => {
  const navigate = useNavigate();
  const [reservas, setReservas] = useState([
    { id: 1, area: 'Salón de Eventos', usuario: 'Juan Pérez', fecha: '2024-02-15', hora: '19:00-22:00', estado: 'Confirmada', pago: 100 },
    { id: 2, area: 'Cancha de Tenis', usuario: 'María García', fecha: '2024-02-16', hora: '18:00-20:00', estado: 'Pendiente', pago: 30 },
    { id: 3, area: 'Piscina', usuario: 'Carlos López', fecha: '2024-02-10', hora: '15:00-17:00', estado: 'Cancelada', pago: 50 },
  ]);
  const [filtro, setFiltro] = useState('Todas');

  const estados = ['Todas', 'Pendiente', 'Confirmada', 'En Curso', 'Completada', 'Cancelada'];
  
  const handleEstadoChange = (id, nuevoEstado) => {
    setReservas(reservas.map(r => r.id === id ? { ...r, estado: nuevoEstado } : r));
  };

  const handleDelete = (id) => {
    setReservas(reservas.filter(r => r.id !== id));
  };

  const filtradas = filtro === 'Todas' ? reservas : reservas.filter(r => r.estado === filtro);

  const getStatusColor = (estado) => {
    const colors = {
      'Pendiente': 'bg-yellow-100 text-yellow-800',
      'Confirmada': 'bg-blue-100 text-blue-800',
      'En Curso': 'bg-purple-100 text-purple-800',
      'Completada': 'bg-green-100 text-green-800',
      'Cancelada': 'bg-red-100 text-red-800',
    };
    return colors[estado] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-200 rounded-lg">
          <FiArrowLeft size={20} />
        </button>
        <h1 className="text-3xl font-bold text-gray-800">Ciclo de Vida de Reservas</h1>
      </div>

      {/* Filtros por Estado */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {estados.map(estado => (
          <button
            key={estado}
            onClick={() => setFiltro(estado)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium transition ${
              filtro === estado
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {estado}
          </button>
        ))}
      </div>

      {/* Tabla de Reservas */}
      <div className="space-y-3">
        {filtradas.map(reserva => (
          <div key={reserva.id} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-600">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-500 uppercase">Área</p>
                <p className="font-semibold text-gray-800">{reserva.area}</p>
                <p className="text-sm text-gray-600">{reserva.usuario}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Fecha y Hora</p>
                <p className="font-semibold text-gray-800">{reserva.fecha}</p>
                <p className="text-sm text-gray-600">{reserva.hora}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Estado</p>
                <div className="flex gap-2 items-center">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(reserva.estado)}`}>
                    {reserva.estado}
                  </span>
                  <span className="text-lg font-bold text-green-600">${reserva.pago}</span>
                </div>
              </div>
            </div>

            {/* Botones de Estado */}
            <div className="mt-4 flex gap-2">
              {['Pendiente', 'Confirmada', 'En Curso', 'Completada', 'Cancelada'].map(estado => (
                <button
                  key={estado}
                  onClick={() => handleEstadoChange(reserva.id, estado)}
                  disabled={reserva.estado === estado}
                  className={`px-3 py-1 text-sm rounded-lg transition ${
                    reserva.estado === estado
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {estado}
                </button>
              ))}
              <button
                onClick={() => handleDelete(reserva.id)}
                className="ml-auto px-3 py-1 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 text-sm"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CicloVidaReservasPage;
