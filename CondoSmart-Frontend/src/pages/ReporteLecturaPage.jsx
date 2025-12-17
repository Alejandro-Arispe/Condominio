import React, { useState } from 'react';
import PageHeader from '../components/common/PageHeader';
import Button from '../components/common/Button';
import { FiCamera, FiCheckCircle } from 'react-icons/fi';

const ReporteLecturaPage = () => {
    const [scanning, setScanning] = useState(false);
    const [result, setResult] = useState(null);

    const handleScan = () => {
        setScanning(true);
        setTimeout(() => {
            setScanning(false);
            setResult({
                type: 'facial',
                user: 'Alejandro López',
                unit: '101',
                timestamp: new Date().toLocaleString(),
                status: 'Acceso autorizado'
            });
        }, 2000);
    };

    return (
        <div className="p-8 space-y-6">
            <PageHeader
                title="Reporte de Lectura"
                subtitle="Verificación de acceso por reconocimiento"
            />

            <div className="bg-white rounded-lg shadow-sm p-8">
                <div className="max-w-2xl mx-auto text-center space-y-6">
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
                        </>
                    ) : (
                        <div className="space-y-4">
                            <FiCheckCircle size={64} className="text-green-600 mx-auto" />
                            <h3 className="text-2xl font-bold text-gray-900">{result.status}</h3>
                            <div className="bg-gray-50 rounded-lg p-6 space-y-2">
                                <p><strong>Usuario:</strong> {result.user}</p>
                                <p><strong>Unidad:</strong> {result.unit}</p>
                                <p><strong>Hora:</strong> {result.timestamp}</p>
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
        </div>
    );
};

export default ReporteLecturaPage;
