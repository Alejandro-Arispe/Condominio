import React, { useState, useEffect } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const CicloVidaReservasPage = () => {
  const navigate = useNavigate();
  const [reservas, setReservas] = useState([]);
  const [filtro, setFiltro] = useState('Todas');
  const [loading, setLoading] = useState(false);

  const estados = ['Todas', 'pendiente', 'confirmada', 'en_curso', 'completada', 'cancelada'];

  useEffect(() => {
    loadReservas();
  }, []);

  const loadReservas = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/reservas/');
      setReservas(response.data.results || response.data);
    } catch (error) {
      console.error('Error al cargar reservas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEstadoChange = async (id, nuevoEstado) => {
    try {
      await axiosInstance.patch(`/reservas/${id}/`, { status: nuevoEstado });
      setReservas(reservas.map(r => r.id === id ? { ...r, status: nuevoEstado } : r));
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      alert('Error al actualizar el estado de la reserva');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta reserva?')) return;

    try {
      await axiosInstance.delete(`/reservas/${id}/`);
      setReservas(reservas.filter(r => r.id !== id));
    } catch (error) {
      console.error('Error al eliminar reserva:', error);
      alert('Error al eliminar la reserva');
    }
  };

  const filtradas = filtro === 'Todas'
    ? reservas
    : reservas.filter(r => r.status === filtro);

  const getStatusColor = (estado) => {
    const colors = {
      'pendiente': 'bg-yellow-100 text-yellow-800',
      'confirmada': 'bg-blue-100 text-blue-800',
      'en_curso': 'bg-purple-100 text-purple-800',
      'completada': 'bg-green-100 text-green-800',
      'cancelada': 'bg-red-100 text-red-800',
    };
    return colors[estado] || 'bg-gray-100 text-gray-800';
  };

  const formatEstado = (estado) => {
    const nombres = {
      'pendiente': 'Pendiente',
      'confirmada': 'Confirmada',
      'en_curso': 'En Curso',
      'completada': 'Completada',
      'cancelada': 'Cancelada',
    };
    return nombres[estado] || estado;
  };

  if (loading) {
    return <div className="p-6">Cargando...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-200 rounded-lg">
          <FiArrowLeft size={20} />
        </button>
        <h1 className="text-3xl font-bold text-gray-800">Ciclo de Vida de Reservas</h1>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {estados.map(estado => (
          <button
            key={estado}
            onClick={() => setFiltro(estado)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium transition ${filtro === estado
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
          >
            {estado === 'Todas' ? 'Todas' : formatEstado(estado)}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtradas.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
            No hay reservas {filtro !== 'Todas' ? `en estado "${formatEstado(filtro)}"` : ''}
          </div>
        ) : (
          filtradas.map(reserva => (
            <div key={reserva.id} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-600">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase">Área</p>
                  <p className="font-semibold text-gray-800">
                    {reserva.area?.name || `Área ${reserva.area}`}
                  </p>
                  <p className="text-sm text-gray-600">
                    Unidad {reserva.unidad?.code || reserva.unidad}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">Fecha y Hora</p>
                  <p className="font-semibold text-gray-800">
                    {new Date(reserva.start).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    {new Date(reserva.start).toLocaleTimeString()} - {new Date(reserva.end).toLocaleTimeString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">Estado</p>
                  <div className="flex gap-2 items-center">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(reserva.status)}`}>
                      {formatEstado(reserva.status)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex gap-2 flex-wrap">
                {['pendiente', 'confirmada', 'en_curso', 'completada', 'cancelada'].map(estado => (
                  <button
                    key={estado}
                    onClick={() => handleEstadoChange(reserva.id, estado)}
                    disabled={reserva.status === estado}
                    className={`px-3 py-1 text-sm rounded-lg transition ${reserva.status === estado
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-300'
                      }`}
                  >
                    {formatEstado(estado)}
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
          ))
        )}
      </div>
    </div>
  );
};

export default CicloVidaReservasPage;
