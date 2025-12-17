import React, { useState, useEffect } from 'react';
import PageHeader from '../components/common/PageHeader';
import Alert from '../components/common/Alert';
import { accesoService } from '../services/securityService';

const HistorialAccesosPage = () => {
  const [accesos, setAccesos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filtro, setFiltro] = useState('todos');

  useEffect(() => {
    loadAccesos();
  }, [filtro]);

  const loadAccesos = async () => {
    try {
      setLoading(true);
      const params = filtro !== 'todos' ? { tipo: filtro } : {};
      const response = await accesoService.list(params);
      setAccesos(response.data.results || response.data);
    } catch (err) {
      setError('Error al cargar historial de accesos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-6">
      <PageHeader
        title="Historial de Accesos"
        subtitle="Registro completo de entradas y salidas"
      />

      {error && <Alert type="error" title="Error" message={error} />}

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setFiltro('todos')}
            className={`px-4 py-2 rounded-lg ${filtro === 'todos' ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFiltro('entrada')}
            className={`px-4 py-2 rounded-lg ${filtro === 'entrada' ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}
          >
            Entradas
          </button>
          <button
            onClick={() => setFiltro('salida')}
            className={`px-4 py-2 rounded-lg ${filtro === 'salida' ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}
          >
            Salidas
          </button>
        </div>

        <div className="space-y-2">
          {loading ? (
            <p className="text-gray-500">Cargando...</p>
          ) : accesos.length === 0 ? (
            <p className="text-gray-500">No hay accesos registrados</p>
          ) : (
            accesos.map((acceso) => (
              <div key={acceso.id} className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
                <div>
                  <p className="font-semibold">{acceso.metodo}</p>
                  <p className="text-sm text-gray-600">
                    {acceso.timestamp ? new Date(acceso.timestamp).toLocaleString() : '-'}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${acceso.tipo === 'entrada' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                  {acceso.tipo}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default HistorialAccesosPage;
