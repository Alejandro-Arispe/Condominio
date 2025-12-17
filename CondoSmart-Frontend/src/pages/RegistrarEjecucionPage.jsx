import React, { useState } from 'react';
import { FiArrowLeft, FiPlus, FiTrash2, FiUpload } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const RegistrarEjecucionPage = () => {
  const navigate = useNavigate();
  const [ejecuciones, setEjecuciones] = useState([
    { id: 1, servicio: 'Mantenimiento de Piscina', fecha: '2024-02-10', responsable: 'Carlos López', evidencias: 3, estado: 'Completado' },
    { id: 2, servicio: 'Limpieza de Áreas Comunes', fecha: '2024-02-16', responsable: 'María García', evidencias: 2, estado: 'En Revisión' },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ servicio: '', responsable: '', notas: '', archivos: [] });

  const servicios = ['Mantenimiento de Piscina', 'Limpieza de Áreas Comunes', 'Reparación de Iluminación', 'Control de Plagas'];

  const handleAdd = () => {
    if (form.servicio && form.responsable) {
      setEjecuciones([...ejecuciones, {
        id: ejecuciones.length + 1,
        ...form,
        fecha: new Date().toISOString().split('T')[0],
        evidencias: form.archivos.length,
        estado: 'En Revisión'
      }]);
      setForm({ servicio: '', responsable: '', notas: '', archivos: [] });
      setShowModal(false);
    }
  };

  const handleDelete = (id) => {
    setEjecuciones(ejecuciones.filter(e => e.id !== id));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setForm({ ...form, archivos: [...form.archivos, ...files] });
  };

  const getStatusColor = (estado) => {
    const colors = {
      'Completado': 'bg-green-100 text-green-800',
      'En Revisión': 'bg-yellow-100 text-yellow-800',
      'Rechazado': 'bg-red-100 text-red-800',
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
          <h1 className="text-3xl font-bold text-gray-800">Registrar Ejecución de Servicios</h1>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <FiPlus /> Nueva Ejecución
        </button>
      </div>

      {/* Tabla de Ejecuciones */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Servicio</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Fecha</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Responsable</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Evidencias</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Estado</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ejecuciones.map(ejecucion => (
              <tr key={ejecucion.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-3 text-sm font-medium text-gray-800">{ejecucion.servicio}</td>
                <td className="px-6 py-3 text-sm text-gray-800">{ejecucion.fecha}</td>
                <td className="px-6 py-3 text-sm text-gray-800">{ejecucion.responsable}</td>
                <td className="px-6 py-3">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {ejecucion.evidencias} archivos
                  </span>
                </td>
                <td className="px-6 py-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(ejecucion.estado)}`}>
                    {ejecucion.estado}
                  </span>
                </td>
                <td className="px-6 py-3 text-center">
                  <div className="flex justify-center gap-2">
                    <button className="px-3 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 text-sm">
                      Ver Evidencias
                    </button>
                    <button
                      onClick={() => handleDelete(ejecucion.id)}
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Nueva Ejecución</h2>
            <div className="space-y-3">
              <select
                value={form.servicio}
                onChange={(e) => setForm({ ...form, servicio: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="">Seleccionar servicio</option>
                {servicios.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <input
                type="text"
                placeholder="Responsable"
                value={form.responsable}
                onChange={(e) => setForm({ ...form, responsable: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <textarea
                placeholder="Notas de ejecución"
                value={form.notas}
                onChange={(e) => setForm({ ...form, notas: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                rows="3"
              />
              
              {/* Carga de archivos */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Evidencias</label>
                <div className="flex items-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500">
                  <FiUpload className="text-gray-500" />
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="flex-1 cursor-pointer">
                    <span className="text-sm text-gray-700">
                      {form.archivos.length > 0 ? `${form.archivos.length} archivos` : 'Click para subir archivos'}
                    </span>
                  </label>
                </div>
                {form.archivos.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {form.archivos.map((file, idx) => (
                      <div key={idx} className="text-sm text-gray-600">✓ {file.name}</div>
                    ))}
                  </div>
                )}
              </div>

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

export default RegistrarEjecucionPage;
