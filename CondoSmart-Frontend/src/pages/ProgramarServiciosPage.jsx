import React, { useState } from 'react';
import { FiArrowLeft, FiPlus, FiCalendar, FiTrash2, FiEdit2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const ProgramarServiciosPage = () => {
  const navigate = useNavigate();
  const [servicios, setServicios] = useState([
    { id: 1, tipo: 'Mantenimiento de Piscina', fecha: '2024-02-15', hora: '10:00', responsable: 'Carlos López', estado: 'Programado' },
    { id: 2, tipo: 'Limpieza de Áreas Comunes', fecha: '2024-02-16', hora: '08:00', responsable: 'María García', estado: 'En Proceso' },
    { id: 3, tipo: 'Reparación de Iluminación', fecha: '2024-02-10', hora: '14:00', responsable: 'Juan Pérez', estado: 'Completado' },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ tipo: '', fecha: '', hora: '', responsable: '' });

  const tipos = ['Mantenimiento de Piscina', 'Limpieza de Áreas Comunes', 'Reparación de Iluminación', 'Control de Plagas', 'Jardinería'];

  const handleAdd = () => {
    if (form.tipo && form.fecha && form.hora && form.responsable) {
      setServicios([...servicios, {
        id: servicios.length + 1,
        ...form,
        estado: 'Programado'
      }]);
      setForm({ tipo: '', fecha: '', hora: '', responsable: '' });
      setShowModal(false);
    }
  };

  const handleDelete = (id) => {
    setServicios(servicios.filter(s => s.id !== id));
  };

  const handleEstado = (id, nuevoEstado) => {
    setServicios(servicios.map(s => s.id === id ? { ...s, estado: nuevoEstado } : s));
  };

  const getStatusColor = (estado) => {
    const colors = {
      'Programado': 'bg-blue-100 text-blue-800',
      'En Proceso': 'bg-yellow-100 text-yellow-800',
      'Completado': 'bg-green-100 text-green-800',
      'Cancelado': 'bg-red-100 text-red-800',
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
          <h1 className="text-3xl font-bold text-gray-800">Programar Servicios</h1>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <FiPlus /> Nuevo Servicio
        </button>
      </div>

      {/* Calendário */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
          <FiCalendar /> Calendario de Servicios
        </h2>
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
            <div key={day} className="text-center font-semibold text-gray-700">{day}</div>
          ))}
          {Array.from({ length: 29 }).map((_, i) => (
            <div key={i} className={`p-2 border rounded-lg text-center cursor-pointer hover:bg-blue-50 ${
              Math.random() > 0.7 ? 'bg-blue-100' : ''
            }`}>
              {i + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Lista de Servicios */}
      <div className="space-y-4">
        {servicios.map(servicio => (
          <div key={servicio.id} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-600">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
              <div>
                <p className="text-xs text-gray-500 uppercase">Servicio</p>
                <p className="font-semibold text-gray-800">{servicio.tipo}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Fecha y Hora</p>
                <p className="font-semibold text-gray-800">{servicio.fecha} - {servicio.hora}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Responsable</p>
                <p className="font-semibold text-gray-800">{servicio.responsable}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Estado</p>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(servicio.estado)}`}>
                  {servicio.estado}
                </span>
              </div>
            </div>

            <div className="flex gap-2 pt-3 border-t">
              <button
                onClick={() => handleEstado(servicio.id, 'En Proceso')}
                className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 text-sm font-medium"
              >
                Iniciar
              </button>
              <button
                onClick={() => handleEstado(servicio.id, 'Completado')}
                className="px-3 py-1 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 text-sm font-medium"
              >
                Completar
              </button>
              <button
                onClick={() => handleDelete(servicio.id)}
                className="ml-auto p-2 hover:bg-red-100 rounded-lg text-red-600"
              >
                <FiTrash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Nuevo Servicio</h2>
            <div className="space-y-3">
              <select
                value={form.tipo}
                onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="">Seleccionar tipo</option>
                {tipos.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <input
                type="date"
                value={form.fecha}
                onChange={(e) => setForm({ ...form, fecha: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <input
                type="time"
                value={form.hora}
                onChange={(e) => setForm({ ...form, hora: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <input
                type="text"
                placeholder="Responsable"
                value={form.responsable}
                onChange={(e) => setForm({ ...form, responsable: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
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

export default ProgramarServiciosPage;
