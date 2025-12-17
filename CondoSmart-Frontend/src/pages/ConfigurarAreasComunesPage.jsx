import React, { useState } from 'react';
import { FiArrowLeft, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const ConfigurarAreasComunesPage = () => {
  const navigate = useNavigate();
  const [areas, setAreas] = useState([
    { id: 1, nombre: 'Salón de Eventos', capacidad: 50, precio: 100, horarioApertura: '08:00', horarioCierre: '23:00' },
    { id: 2, nombre: 'Cancha de Tenis', capacidad: 4, precio: 30, horarioApertura: '06:00', horarioCierre: '22:00' },
    { id: 3, nombre: 'Piscina', capacidad: 30, precio: 50, horarioApertura: '07:00', horarioCierre: '20:00' },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ nombre: '', capacidad: '', precio: '', horarioApertura: '', horarioCierre: '' });

  const handleAdd = () => {
    if (form.nombre && form.capacidad && form.precio) {
      setAreas([...areas, { id: areas.length + 1, ...form }]);
      setForm({ nombre: '', capacidad: '', precio: '', horarioApertura: '', horarioCierre: '' });
      setShowModal(false);
    }
  };

  const handleDelete = (id) => {
    setAreas(areas.filter(a => a.id !== id));
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-200 rounded-lg">
            <FiArrowLeft size={20} />
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Configurar Áreas Comunes</h1>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <FiPlus /> Nueva Área
        </button>
      </div>

      {/* Tabla de Áreas */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Área</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Capacidad</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Precio/Hora</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Horario</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {areas.map(area => (
              <tr key={area.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-3 text-sm font-medium text-gray-800">{area.nombre}</td>
                <td className="px-6 py-3 text-sm text-gray-800">{area.capacidad} personas</td>
                <td className="px-6 py-3 text-sm text-gray-800">${area.precio}</td>
                <td className="px-6 py-3 text-sm text-gray-800">{area.horarioApertura} - {area.horarioCierre}</td>
                <td className="px-6 py-3 text-center">
                  <div className="flex justify-center gap-2">
                    <button className="p-2 hover:bg-blue-100 rounded-lg text-blue-600">
                      <FiEdit2 size={18} />
                    </button>
                    <button onClick={() => handleDelete(area.id)} className="p-2 hover:bg-red-100 rounded-lg text-red-600">
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
            <h2 className="text-2xl font-bold mb-4">Nueva Área</h2>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Nombre del área"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <input
                type="number"
                placeholder="Capacidad"
                value={form.capacidad}
                onChange={(e) => setForm({ ...form, capacidad: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <input
                type="number"
                placeholder="Precio por hora"
                value={form.precio}
                onChange={(e) => setForm({ ...form, precio: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <input
                type="time"
                value={form.horarioApertura}
                onChange={(e) => setForm({ ...form, horarioApertura: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <input
                type="time"
                value={form.horarioCierre}
                onChange={(e) => setForm({ ...form, horarioCierre: e.target.value })}
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

export default ConfigurarAreasComunesPage;
