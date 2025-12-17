import React, { useState, useEffect } from 'react';
import { FiCamera, FiCheckCircle } from 'react-icons/fi';
import PageHeader from '../components/common/PageHeader';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import { accesoService } from '../services/securityService';

const ReconocimientoFacialPage = () => {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [accesos, setAccesos] = useState([]);

  useEffect(() => {
    loadAccesos();
  }, []);

  const loadAccesos = async () => {
    try {
      const response = await accesoService.list({ metodo: 'facial' });
      setAccesos(response.data.results || response.data);
    } catch (err) {
      console.error('Error al cargar accesos:', err);
    }
  };

  const handleScan = async () => {
    setScanning(true);
    setError('');

    setTimeout(async () => {
      try {
        const mockResult = {
          type: 'facial',
          user: 'Usuario Demo',
          unit: '101',
          timestamp: new Date().toLocaleString(),
          status: 'Acceso autorizado',
          confidence: 95
        };

        await accesoService.create({
          tipo: 'entrada',
          metodo: 'facial',
        });

        setResult(mockResult);
        loadAccesos();
      } catch (err) {
        setError('Error al registrar acceso');
      } finally {
        setScanning(false);
      }
    }, 2000);
  };

  return (
    <div className="p-8 space-y-6">
      <PageHeader
        title="Reconocimiento Facial"
        subtitle="Sistema de acceso por reconocimiento facial"
      />

      {error && <Alert type="error" title="Error" message={error} />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h3 className="text-lg font-semibold mb-4">Escaneo Facial</h3>
          <div className="text-center space-y-6">
            {!result ? (
              <>
                <div className="w-64 h-64 mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
                  {scanning ? (
                    <div className="animate-pulse">
                      <FiCamera size={64} className="text-blue-600" />
                    </div>
                  ) : (
                    <FiCamera size={64} className="text-gray-400" />
                  )}
                </div>

                <Button
                  variant="primary"
                  onClick={handleScan}
                  disabled={scanning}
                  className="px-8 py-3"
                >
                  {scanning ? 'Escaneando...' : 'Iniciar Escaneo'}
                </Button>

                <p className="text-sm text-gray-500">
                  Nota: Esta es una demostración. La integración real requiere un servicio de IA.
                </p>
              </>
            ) : (
              <div className="space-y-4">
                <FiCheckCircle size={64} className="text-green-600 mx-auto" />
                <h3 className="text-2xl font-bold text-gray-900">{result.status}</h3>
                <div className="bg-gray-50 rounded-lg p-6 space-y-2 text-left">
                  <p><strong>Usuario:</strong> {result.user}</p>
                  <p><strong>Unidad:</strong> {result.unit}</p>
                  <p><strong>Hora:</strong> {result.timestamp}</p>
                  <p><strong>Confianza:</strong> {result.confidence}%</p>
                </div>
                <Button
                  variant="secondary"
                  onClick={() => setResult(null)}
                >
                  Nuevo Escaneo
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <h3 className="text-lg font-semibold mb-4">Accesos Recientes (Facial)</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {accesos.length === 0 ? (
              <p className="text-gray-500 text-sm">No hay accesos registrados</p>
            ) : (
              accesos.map((acceso) => (
                <div key={acceso.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{acceso.tipo}</p>
                      <p className="text-sm text-gray-600">
                        {acceso.timestamp ? new Date(acceso.timestamp).toLocaleString() : '-'}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${acceso.tipo === 'entrada' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                      {acceso.metodo}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReconocimientoFacialPage;
