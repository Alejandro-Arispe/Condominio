import React, { useState } from 'react';
import { FiSearch, FiCheck, FiX } from 'react-icons/fi';
import { useAuthContext } from '../../context/AuthContext';

export const PlateVerificationComponent = ({ unidadId, onSuccess, onError }) => {
  const { api } = useAuthContext();
  const [placa, setPlaca] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!placa.trim()) {
      onError?.('Por favor ingrese una placa');
      return;
    }

    try {
      setLoading(true);
      const response = await api.post('/security/accesos/verificar_placa/', {
        placa: placa.toUpperCase().trim(),
        unidad_id: unidadId,
        sentido: 'in'
      });

      setResult(response.data);
      onSuccess?.(response.data);
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message;
      setResult({ error: errorMsg });
      onError?.(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setPlaca('');
    setResult(null);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-bold mb-4">Verificación de Placa</h3>

      <form onSubmit={handleVerify} className="space-y-4">
        <div className="relative">
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Ej: ABC-1234"
            value={placa}
            onChange={(e) => setPlaca(e.target.value.toUpperCase())}
            className="w-full pl-10 pr-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Verificando...' : 'Verificar'}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
          >
            Limpiar
          </button>
        </div>
      </form>

      {result && (
        <div className={`mt-4 p-4 rounded ${result.match ? 'bg-green-100' : 'bg-red-100'}`}>
          <div className={`flex items-center gap-2 font-semibold ${result.match ? 'text-green-800' : 'text-red-800'}`}>
            {result.match ? <FiCheck className="text-2xl" /> : <FiX className="text-2xl" />}
            {result.match ? 'Vehículo Registrado' : 'Vehículo No Registrado'}
          </div>
          {result.placa && <p className="text-sm mt-2">Placa: {result.placa}</p>}
          {result.error && <p className="text-sm text-red-600 mt-2">{result.error}</p>}
        </div>
      )}
    </div>
  );
};
