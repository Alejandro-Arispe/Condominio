import React, { useState } from 'react';
import { FiDollarSign, FiCalendar, FiAlertCircle } from 'react-icons/fi';
import PageHeader from '../components/common/PageHeader';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import FormGroup from '../components/common/FormGroup';
import Input from '../components/common/Input';
import axios from 'axios';

const GenerarExpensasPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resultado, setResultado] = useState(null);
  const [periodo, setPeriodo] = useState(new Date().toISOString().slice(0, 10));

  const handleGenerar = async () => {
    if (!window.confirm('¿Estás seguro de generar las expensas para todas las unidades?')) return;

    try {
      setLoading(true);
      setError('');
      setResultado(null);

      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/cargos/generar_expensas/`,
        { periodo },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setResultado(response.data);
      setSuccess(response.data.mensaje);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al generar expensas');
    } finally {
      setLoading(false);
    }
  };

  const handleEnviarRecordatorios = async () => {
    if (!window.confirm('¿Enviar recordatorios de pago a todas las unidades con cargos pendientes?')) return;

    try {
      setLoading(true);
      setError('');

      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/cargos/enviar_recordatorios/`,
        { dias_anticipacion: 5 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess(response.data.mensaje);
      setResultado(response.data);
    } catch (err) {
      setError('Error al enviar recordatorios');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-6">
      <PageHeader
        title="Generar Expensas"
        subtitle="Genera las expensas mensuales para todas las unidades automáticamente"
      />

      {error && <Alert type="error" title="Error" message={error} />}
      {success && <Alert type="success" title="Éxito" message={success} />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Generar Expensas */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FiDollarSign size={24} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Generar Expensas</h3>
              <p className="text-sm text-gray-600">Crea cargos automáticos para todas las unidades</p>
            </div>
          </div>

          <FormGroup label="Período" required>
            <div className="relative">
              <FiCalendar className="absolute left-3 top-3 text-gray-400" size={20} />
              <Input
                type="date"
                value={periodo}
                onChange={(e) => setPeriodo(e.target.value)}
                className="pl-10"
              />
            </div>
          </FormGroup>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex gap-2">
              <FiAlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">Importante:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Se generarán cargos según las configuraciones activas</li>
                  <li>Solo se crearán cargos para unidades activas</li>
                  <li>No se duplicarán cargos existentes</li>
                </ul>
              </div>
            </div>
          </div>

          <Button
            variant="primary"
            onClick={handleGenerar}
            loading={loading}
            className="w-full mt-6"
          >
            Generar Expensas
          </Button>
        </div>

        {/* Enviar Recordatorios */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-orange-100 rounded-lg">
              <FiAlertCircle size={24} className="text-orange-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Enviar Recordatorios</h3>
              <p className="text-sm text-gray-600">Notifica a residentes sobre pagos pendientes</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>Recordatorios automáticos:</strong>
              </p>
              <ul className="mt-2 text-sm text-gray-600 space-y-1">
                <li>• Cargos próximos a vencer (5 días antes)</li>
                <li>• Cargos vencidos</li>
                <li>• Actualización de estados</li>
              </ul>
            </div>

            <Button
              variant="warning"
              onClick={handleEnviarRecordatorios}
              loading={loading}
              className="w-full"
            >
              Enviar Recordatorios
            </Button>
          </div>
        </div>
      </div>

      {/* Resultados */}
      {resultado && (
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h3 className="text-lg font-semibold mb-4">Resultados</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {resultado.cargos_creados !== undefined && (
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">Cargos Creados</p>
                <p className="text-3xl font-bold text-green-600">{resultado.cargos_creados}</p>
              </div>
            )}

            {resultado.total_unidades !== undefined && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Total Unidades</p>
                <p className="text-3xl font-bold text-blue-600">{resultado.total_unidades}</p>
              </div>
            )}

            {resultado.recordatorios_creados !== undefined && (
              <div className="p-4 bg-orange-50 rounded-lg">
                <p className="text-sm text-gray-600">Recordatorios Enviados</p>
                <p className="text-3xl font-bold text-orange-600">{resultado.recordatorios_creados}</p>
              </div>
            )}

            {resultado.cargos_proximos_vencer !== undefined && (
              <div className="p-4 bg-yellow-50 rounded-lg">
                <p className="text-sm text-gray-600">Próximos a Vencer</p>
                <p className="text-3xl font-bold text-yellow-600">{resultado.cargos_proximos_vencer}</p>
              </div>
            )}

            {resultado.cargos_vencidos !== undefined && (
              <div className="p-4 bg-red-50 rounded-lg">
                <p className="text-sm text-gray-600">Vencidos</p>
                <p className="text-3xl font-bold text-red-600">{resultado.cargos_vencidos}</p>
              </div>
            )}
          </div>

          {resultado.errores && resultado.errores.length > 0 && (
            <div className="mt-4 p-4 bg-red-50 rounded-lg">
              <p className="font-semibold text-red-800 mb-2">Errores:</p>
              <ul className="text-sm text-red-700 space-y-1">
                {resultado.errores.map((err, idx) => (
                  <li key={idx}>• {err}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GenerarExpensasPage;
