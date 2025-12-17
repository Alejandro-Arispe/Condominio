import React, { useState, useRef, useEffect } from 'react';
import { FiCamera, FiCheckCircle, FiXCircle, FiUser } from 'react-icons/fi';
import PageHeader from '../components/common/PageHeader';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import apiClient from '../services/apiClient';

const LectorQRPage = () => {
    const [scanning, setScanning] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [manualCode, setManualCode] = useState('');
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const scanIntervalRef = useRef(null);

    useEffect(() => {
        return () => {
            stopScanning();
        };
    }, []);

    const startScanning = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
                setScanning(true);
                setError('');

                // Iniciar escaneo continuo
                scanIntervalRef.current = setInterval(scanQRCode, 500);
            }
        } catch (err) {
            setError('Error al acceder a la cámara: ' + err.message);
        }
    };

    const stopScanning = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
        if (scanIntervalRef.current) {
            clearInterval(scanIntervalRef.current);
        }
        setScanning(false);
    };

    const scanQRCode = async () => {
        if (!videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

        // Aquí usaríamos una librería de QR como jsQR
        // Por ahora, simulamos la detección
        // En producción: const code = jsQR(imageData.data, imageData.width, imageData.height);
    };

    const validateQR = async (qrData) => {
        setError('');
        setResult(null);

        // Limpiar el código QR
        const cleanQR = qrData.trim();

        try {
            const response = await apiClient.post('/validate-qr/', {
                qr_data: cleanQR
            });

            if (response.data.success) {
                setResult({
                    success: true,
                    user: response.data.user,
                    timestamp: response.data.timestamp,
                    accessId: response.data.access_id
                });
                stopScanning();
            }
        } catch (err) {
            console.error('Error validando QR:', err.response?.data);
            const errorData = err.response?.data;
            let errorMessage = 'Error al validar QR';

            if (errorData?.error) {
                errorMessage = errorData.error;

                // Agregar detalles adicionales si existen
                if (errorData.expired_seconds_ago) {
                    errorMessage += ` (expiró hace ${errorData.expired_seconds_ago} segundos)`;
                }
                if (errorData.received) {
                    console.log('QR recibido:', errorData.received);
                    console.log('Formato esperado:', errorData.expected_format);
                }
            }

            setError(errorMessage);
            setResult({
                success: false,
                error: errorMessage
            });
        }
    };

    const handleManualValidation = () => {
        if (!manualCode.trim()) {
            setError('Ingrese un código QR');
            return;
        }
        validateQR(manualCode);
    };

    return (
        <div className="p-8 space-y-6">
            <PageHeader
                title="Lector de QR - Control de Acceso"
                subtitle="Escanea el código QR del residente para registrar su acceso"
            />

            {error && <Alert type="error" title="Error" message={error} />}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Panel de Escaneo */}
                <div className="bg-white rounded-lg shadow-sm p-8">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <FiCamera className="text-blue-600" />
                        Escaneo de QR
                    </h3>

                    {!result ? (
                        <>
                            <div className="w-full h-96 bg-gray-900 rounded-lg flex items-center justify-center relative overflow-hidden mb-4">
                                <video
                                    ref={videoRef}
                                    className="w-full h-full object-cover"
                                    style={{ display: scanning ? 'block' : 'none' }}
                                />
                                <canvas
                                    ref={canvasRef}
                                    className="hidden"
                                />
                                {!scanning && (
                                    <div className="text-white text-center">
                                        <FiCamera size={80} className="mx-auto mb-4 opacity-50" />
                                        <p className="text-lg">Presiona "Iniciar Escaneo" para comenzar</p>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-3 mb-6">
                                {!scanning ? (
                                    <Button
                                        variant="primary"
                                        onClick={startScanning}
                                        className="flex-1"
                                    >
                                        <FiCamera className="inline mr-2" />
                                        Iniciar Escaneo
                                    </Button>
                                ) : (
                                    <Button
                                        variant="secondary"
                                        onClick={stopScanning}
                                        className="flex-1"
                                    >
                                        Detener Escaneo
                                    </Button>
                                )}
                            </div>

                            {/* Validación Manual */}
                            <div className="border-t pt-6">
                                <h4 className="font-semibold mb-3">Validación Manual</h4>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={manualCode}
                                        onChange={(e) => setManualCode(e.target.value)}
                                        placeholder="Ingrese código QR manualmente"
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    <Button
                                        variant="primary"
                                        onClick={handleManualValidation}
                                    >
                                        Validar
                                    </Button>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    Formato: CONDOSMART:user_id:timestamp:token
                                </p>
                            </div>
                        </>
                    ) : (
                        <div className="text-center space-y-4">
                            {result.success ? (
                                <>
                                    <FiCheckCircle size={80} className="text-green-600 mx-auto" />
                                    <h3 className="text-2xl font-bold text-green-600">
                                        ✓ Acceso Autorizado
                                    </h3>
                                    <div className="bg-green-50 rounded-lg p-6 space-y-3 text-left">
                                        <div className="flex items-center gap-3">
                                            <FiUser className="text-green-600" size={24} />
                                            <div>
                                                <p className="text-sm text-gray-600">Residente</p>
                                                <p className="text-lg font-bold">{result.user.name}</p>
                                            </div>
                                        </div>
                                        <div className="border-t pt-3">
                                            <p className="text-sm text-gray-600">Email</p>
                                            <p className="font-medium">{result.user.email}</p>
                                        </div>
                                        <div className="border-t pt-3">
                                            <p className="text-sm text-gray-600">Hora de acceso</p>
                                            <p className="font-medium">{new Date(result.timestamp).toLocaleString()}</p>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <FiXCircle size={80} className="text-red-600 mx-auto" />
                                    <h3 className="text-2xl font-bold text-red-600">
                                        ⚠ Acceso Denegado
                                    </h3>
                                    <div className="bg-red-50 rounded-lg p-6">
                                        <p className="text-red-700">{result.error}</p>
                                    </div>
                                </>
                            )}

                            <Button
                                variant="secondary"
                                onClick={() => {
                                    setResult(null);
                                    setManualCode('');
                                }}
                                className="w-full"
                            >
                                Nuevo Escaneo
                            </Button>
                        </div>
                    )}
                </div>

                {/* Panel de Información */}
                <div className="space-y-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <h3 className="font-semibold text-blue-900 mb-3">Instrucciones</h3>
                        <ul className="space-y-2 text-sm text-blue-800">
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 font-bold">1.</span>
                                <span>Solicita al residente que abra su app móvil</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 font-bold">2.</span>
                                <span>El residente debe mostrar su código QR</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 font-bold">3.</span>
                                <span>Escanea el código con la cámara</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 font-bold">4.</span>
                                <span>El sistema validará automáticamente el acceso</span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                        <h3 className="font-semibold text-green-900 mb-3">Seguridad</h3>
                        <ul className="space-y-2 text-sm text-green-800">
                            <li>• Los códigos QR expiran en 30 segundos</li>
                            <li>• Cada código es único y no reutilizable</li>
                            <li>• Todos los accesos quedan registrados</li>
                            <li>• Validación en tiempo real con el backend</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LectorQRPage;
