import React, { useState, useEffect, useCallback } from 'react';
import { FiCalendar, FiMapPin } from 'react-icons/fi';
import { useAuthContext } from '../../context/AuthContext';

export const ReservationFormComponent = ({ unidadId, onSuccess, onError }) => {
  const { api } = useAuthContext();
  const [formData, setFormData] = useState({
    area: '',
    start: '',
    end: '',
    notas: ''
  });
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [areaDetails, setAreaDetails] = useState(null);
  const [errors, setErrors] = useState({});

  const fetchAreas = useCallback(async () => {
    try {
      const response = await api.get('/reservations/areascomunnes/');
      setAreas(response.data.results || response.data);
    } catch (err) {
      console.error('Error cargando áreas:', err);
    }
  }, [api]);

  useEffect(() => {
    fetchAreas();
  }, [fetchAreas]);

  const handleAreaChange = (areaId) => {
    setFormData(prev => ({ ...prev, area: areaId }));
    const selected = areas.find(a => a.id === parseInt(areaId));
    setAreaDetails(selected);
  };

  const handleDateChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.area) newErrors.area = 'Seleccione un área común';
    if (!formData.start) newErrors.start = 'Ingrese fecha y hora de inicio';
    if (!formData.end) newErrors.end = 'Ingrese fecha y hora de fin';

    if (formData.start && formData.end) {
      const start = new Date(formData.start);
      const end = new Date(formData.end);

      if (end <= start) {
        newErrors.end = 'La fecha de fin debe ser posterior a la de inicio';
      }

      if (areaDetails) {
        const startTime = start.toTimeString().slice(0, 5);
        const endTime = end.toTimeString().slice(0, 5);

        if (startTime < areaDetails.horario_apertura || endTime > areaDetails.horario_cierre) {
          newErrors.general = `Horario fuera de servicio. Disponible ${areaDetails.horario_apertura} a ${areaDetails.horario_cierre}`;
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const response = await api.post('/reservations/reservas/', {
        unidad: unidadId,
        area: formData.area,
        start: new Date(formData.start).toISOString(),
        end: new Date(formData.end).toISOString(),
        notas: formData.notas
      });

      setFormData({ area: '', start: '', end: '', notas: '' });
      setErrors({});
      onSuccess?.(response.data);
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message;
      setErrors({ general: errorMsg });
      onError?.(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-bold mb-4">Nueva Reserva</h3>

      {errors.general && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded">
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Área Común */}
        <div>
          <label className="flex items-center gap-2 font-semibold text-sm mb-2">
            <FiMapPin /> Área Común
          </label>
          <select
            value={formData.area}
            onChange={(e) => handleAreaChange(e.target.value)}
            className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.area ? 'border-red-500' : ''
            }`}
          >
            <option value="">-- Seleccionar --</option>
            {areas.map(area => (
              <option key={area.id} value={area.id}>
                {area.name} - ${area.precio_por_hora}/hora
              </option>
            ))}
          </select>
          {errors.area && <p className="text-red-500 text-sm mt-1">{errors.area}</p>}
        </div>

        {areaDetails && (
          <div className="p-3 bg-blue-50 rounded text-sm">
            <p><strong>Horario:</strong> {areaDetails.horario_apertura} - {areaDetails.horario_cierre}</p>
            <p><strong>Capacidad:</strong> {areaDetails.capacidad} personas</p>
            <p><strong>Precio:</strong> ${areaDetails.precio_por_hora}/hora</p>
          </div>
        )}

        {/* Fecha y Hora Inicio */}
        <div>
          <label className="flex items-center gap-2 font-semibold text-sm mb-2">
            <FiCalendar /> Inicio
          </label>
          <input
            type="datetime-local"
            value={formData.start}
            onChange={(e) => handleDateChange('start', e.target.value)}
            className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.start ? 'border-red-500' : ''
            }`}
          />
          {errors.start && <p className="text-red-500 text-sm mt-1">{errors.start}</p>}
        </div>

        {/* Fecha y Hora Fin */}
        <div>
          <label className="flex items-center gap-2 font-semibold text-sm mb-2">
            <FiCalendar /> Fin
          </label>
          <input
            type="datetime-local"
            value={formData.end}
            onChange={(e) => handleDateChange('end', e.target.value)}
            className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.end ? 'border-red-500' : ''
            }`}
          />
          {errors.end && <p className="text-red-500 text-sm mt-1">{errors.end}</p>}
        </div>

        {/* Notas */}
        <div>
          <label className="font-semibold text-sm mb-2 block">Notas</label>
          <textarea
            value={formData.notas}
            onChange={(e) => setFormData(prev => ({ ...prev, notas: e.target.value }))}
            placeholder="Detalles adicionales de la reserva..."
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
          />
        </div>

        {/* Botón Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 font-semibold"
        >
          {loading ? 'Creando reserva...' : 'Crear Reserva'}
        </button>
      </form>
    </div>
  );
};
