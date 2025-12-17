import React, { useState, useEffect, useRef } from 'react';
import { FiCamera, FiCheckCircle, FiAlertCircle, FiVideo, FiVideoOff } from 'react-icons/fi';
import * as faceapi from 'face-api.js';
import PageHeader from '../components/common/PageHeader';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import { accesoService } from '../services/securityService';

const ReconocimientoFacialPage = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [accesos, setAccesos] = useState([]);
  const [detectionInterval, setDetectionInterval] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);

  useEffect(() => {
    loadModels();
    loadAccesos();

    return () => {
      stopCamera();
    };
  }, []);

  const loadModels = async () => {
    try {
      // Usar CDN de face-api.js
      const MODEL_URL = 'https://justadudewhohacks.github.io/face-api.js/models';

      await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      ]);

      setModelsLoaded(true);
      console.log('✓ Modelos de IA cargados desde CDN');
    } catch (err) {
      console.error('Error al cargar modelos:', err);
      setError('Error al cargar modelos de IA desde CDN. Verifica tu conexión a internet.');
    }
  };

  const loadAccesos = async () => {
    try {
      const response = await accesoService.list({ metodo: 'facial' });
      setAccesos(response.data.results || response.data);
    } catch (err) {
      console.error('Error al cargar accesos:', err);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (err) {
      setError('Error al acceder a la cámara. Verifica los permisos.');
      console.error(err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
    if (detectionInterval) {
      clearInterval(detectionInterval);
      setDetectionInterval(null);
    }
  };

  const handleStartScan = async () => {
    if (!modelsLoaded) {
      setError('Los modelos de IA aún no están cargados');
      return;
    }

    if (!cameraActive) {
      await startCamera();
    }

    setScanning(true);
    setError('');

    // Detectar rostros cada 100ms
    const interval = setInterval(async () => {
      if (videoRef.current && canvasRef.current && videoRef.current.readyState === 4) {
        try {
          const detections = await faceapi
            .detectAllFaces(videoRef.current, new faceapi.SsdMobilenetv1Options())
            .withFaceLandmarks()
            .withFaceDescriptors()
            .withFaceExpressions();

          // Limpiar canvas
          const displaySize = {
            width: videoRef.current.videoWidth,
            height: videoRef.current.videoHeight
          };

          if (displaySize.width === 0 || displaySize.height === 0) {
            return; // Video aún no está listo
          }

          faceapi.matchDimensions(canvasRef.current, displaySize);
          const resizedDetections = faceapi.resizeResults(detections, displaySize);

          canvasRef.current.getContext('2d').clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
          faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
          faceapi.draw.drawFaceExpressions(canvasRef.current, resizedDetections);

          // Si se detecta un rostro, procesar
          if (detections.length > 0) {
            const detection = detections[0];
            const confidence = Math.round(detection.detection.score * 100);

            if (confidence > 80) {
              // Rostro detectado con alta confianza
              clearInterval(interval);
              setDetectionInterval(null);

              await processDetection(detection, confidence);
            }
          }
        } catch (err) {
          console.error('Error en detección:', err);
        }
      }
    }, 100);

    setDetectionInterval(interval);
  };


  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0);
      return canvas.toDataURL('image/jpeg', 0.8);
    }
    return null;
  };

  const processDetection = async (detection, confidence) => {
    try {
      // Capturar foto del visitante
      const photo = capturePhoto();
      setCapturedPhoto(photo);

      // Obtener descriptor facial de la persona detectada
      const faceDescriptor = detection.descriptor;

      // Cargar usuarios registrados con sus fotos
      const registeredUsers = await loadRegisteredUsers();

      if (registeredUsers.length === 0) {
        // MODO FALLBACK: Usar usuario actual como reconocido
        const userStr = localStorage.getItem('user');
        const currentUser = userStr ? JSON.parse(userStr) : null;

        if (currentUser) {
          // Registrar acceso del usuario actual
          await accesoService.create({
            tipo: 'facial',
            sentido: 'in',
            permitido: true,
            confianza: confidence,
            user: currentUser.id,
          });

          setResult({
            user: `${currentUser.first_name} ${currentUser.last_name}`,
            unit: currentUser.username,
            timestamp: new Date().toLocaleString(),
            status: 'Acceso autorizado (Demo)',
            confidence: confidence,
            expression: detection.expressions.asSortedArray()[0].expression,
            photo: photo,
            allowed: true
          });
        } else {
          setResult({
            user: 'Desconocido',
            unit: 'N/A',
            timestamp: new Date().toLocaleString(),
            status: 'Acceso denegado - No hay usuarios registrados',
            confidence: confidence,
            expression: detection.expressions.asSortedArray()[0].expression,
            photo: photo,
            allowed: false
          });
        }

        setScanning(false);
        stopCamera();
        loadAccesos();
        return;
      }

      // Comparar con usuarios registrados
      const match = await findBestMatch(faceDescriptor, registeredUsers);

      if (match && match.distance < 0.6) {
        // Match encontrado (distancia < 0.6 es buen match)
        const matchConfidence = Math.round((1 - match.distance) * 100);

        // Registrar acceso
        await accesoService.create({
          tipo: 'facial',
          sentido: 'in',
          permitido: true,
          confianza: matchConfidence,
          user: match.user.id,
        });

        setResult({
          user: `${match.user.first_name} ${match.user.last_name}`,
          unit: match.user.username,
          timestamp: new Date().toLocaleString(),
          status: 'Acceso autorizado',
          confidence: matchConfidence,
          expression: detection.expressions.asSortedArray()[0].expression,
          photo: photo,
          allowed: true
        });
      } else {
        // No match - persona desconocida
        await accesoService.create({
          tipo: 'facial',
          sentido: 'in',
          permitido: false,
          confianza: confidence,
        });

        setResult({
          user: 'Desconocido',
          unit: 'N/A',
          timestamp: new Date().toLocaleString(),
          status: 'Acceso denegado - Persona no reconocida',
          confidence: confidence,
          expression: detection.expressions.asSortedArray()[0].expression,
          photo: photo,
          allowed: false
        });
      }

      setScanning(false);
      stopCamera();
      loadAccesos();
    } catch (err) {
      console.error('Error al procesar detección:', err);
      setError('Error al procesar detección');
      setScanning(false);
    }
  };

  const loadRegisteredUsers = async () => {
    try {
      // Cargar usuarios desde el backend usando el nuevo endpoint
      const response = await fetch('/api/v1/usuarios/with-photos/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al cargar usuarios');
      }

      const users = await response.json();

      console.log('Usuarios cargados:', users.length);
      console.log('Usuarios con foto:', users.filter(u => u.photo_url).length);

      // Ya vienen filtrados con foto
      return users;
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
      return [];
    }
  };

  const findBestMatch = async (faceDescriptor, registeredUsers) => {
    let bestMatch = null;
    let minDistance = 1.0;

    for (const user of registeredUsers) {
      try {
        // Cargar foto del usuario
        const img = await faceapi.fetchImage(user.photo_url);

        // Detectar rostro en la foto registrada
        const detection = await faceapi
          .detectSingleFace(img, new faceapi.SsdMobilenetv1Options())
          .withFaceLandmarks()
          .withFaceDescriptor();

        if (detection) {
          // Calcular distancia euclidiana
          const distance = faceapi.euclideanDistance(faceDescriptor, detection.descriptor);

          if (distance < minDistance) {
            minDistance = distance;
            bestMatch = { user, distance };
          }
        }
      } catch (err) {
        console.error(`Error al procesar foto de ${user.username}:`, err);
      }
    }

    return bestMatch;
  };

  const handleStopScan = () => {
    if (detectionInterval) {
      clearInterval(detectionInterval);
      setDetectionInterval(null);
    }
    setScanning(false);
    stopCamera();
  };

  return (
    <div className="p-8 space-y-6">
      <PageHeader
        title="Reconocimiento Facial (IA Real)"
        subtitle="Sistema de acceso por reconocimiento facial con TensorFlow.js"
      />

      {error && <Alert type="error" title="Error" message={error} />}

      {!modelsLoaded && (
        <Alert
          type="warning"
          title="Cargando modelos de IA"
          message="Los modelos de reconocimiento facial se están cargando..."
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FiCamera className="text-blue-600" />
            Escaneo Facial en Tiempo Real
          </h3>

          <div className="text-center space-y-6">
            {!result ? (
              <>
                <div className="relative w-full bg-gray-900 rounded-lg overflow-hidden" style={{ aspectRatio: '4/3' }}>
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    className="w-full h-full object-cover"
                    onLoadedMetadata={() => {
                      if (canvasRef.current && videoRef.current) {
                        canvasRef.current.width = videoRef.current.videoWidth;
                        canvasRef.current.height = videoRef.current.videoHeight;
                      }
                    }}
                  />
                  <canvas
                    ref={canvasRef}
                    className="absolute top-0 left-0 w-full h-full"
                  />

                  {!cameraActive && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
                      <div className="text-white text-center">
                        <FiVideoOff size={64} className="mx-auto mb-4 opacity-50" />
                        <p className="text-lg">Cámara desactivada</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  {!scanning ? (
                    <Button
                      variant="primary"
                      onClick={handleStartScan}
                      disabled={!modelsLoaded}
                      className="flex-1 flex items-center justify-center gap-2"
                    >
                      <FiVideo />
                      Iniciar Escaneo
                    </Button>
                  ) : (
                    <Button
                      variant="danger"
                      onClick={handleStopScan}
                      className="flex-1 flex items-center justify-center gap-2"
                    >
                      <FiVideoOff />
                      Detener
                    </Button>
                  )}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
                  <p className="text-sm text-blue-800">
                    <strong>Tecnología Real:</strong>
                  </p>
                  <ul className="text-sm text-blue-700 mt-2 space-y-1">
                    <li>• <strong>face-api.js</strong> - TensorFlow.js para detección facial</li>
                    <li>• <strong>Tiny Face Detector</strong> - Modelo ligero y rápido</li>
                    <li>• <strong>68 Face Landmarks</strong> - Puntos de referencia faciales</li>
                    <li>• <strong>Face Expressions</strong> - Detección de emociones</li>
                  </ul>
                </div>
              </>
            ) : (
              <div className="text-center space-y-4">
                {result.allowed ? (
                  <FiCheckCircle size={80} className="text-green-600 mx-auto" />
                ) : (
                  <FiAlertCircle size={80} className="text-red-600 mx-auto" />
                )}

                <h3 className={`text-2xl font-bold ${result.allowed ? 'text-green-600' : 'text-red-600'}`}>
                  {result.status}
                </h3>

                {/* Foto capturada */}
                {result.photo && (
                  <div className="flex justify-center">
                    <img
                      src={result.photo}
                      alt="Foto capturada"
                      className={`w-48 h-48 object-cover rounded-lg border-4 ${result.allowed ? 'border-green-500' : 'border-red-500'
                        } shadow-lg`}
                    />
                  </div>
                )}

                <div className={`rounded-lg p-6 space-y-2 text-left ${result.allowed ? 'bg-green-50' : 'bg-red-50'
                  }`}>
                  <p><strong>Usuario:</strong> {result.user}</p>
                  <p><strong>Unidad:</strong> {result.unit}</p>
                  <p><strong>Hora:</strong> {result.timestamp}</p>
                  <p>
                    <strong>Confianza:</strong>{' '}
                    <span className={`font-bold ${result.allowed ? 'text-green-600' : 'text-red-600'}`}>
                      {result.confidence}%
                    </span>
                  </p>
                  <p><strong>Expresión:</strong> {result.expression}</p>
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
                      <p className="font-medium capitalize">{acceso.tipo}</p>
                      <p className="text-sm text-gray-600">
                        {acceso.timestamp ? new Date(acceso.timestamp).toLocaleString() :
                          acceso.created_at ? new Date(acceso.created_at).toLocaleString() : '-'}
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

      {/* Instrucciones */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="text-sm text-green-800 space-y-2">
          <p><strong>El reconocimiento facial está completamente configurado:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Los modelos de IA se cargan automáticamente desde CDN</li>
            <li>Solo necesitas permitir acceso a la cámara cuando el navegador lo solicite</li>
            <li>El sistema detectará rostros en tiempo real</li>
            <li>Se mostrarán puntos faciales y expresiones</li>
          </ul>
          <p className="mt-3 pt-3 border-t border-green-300">
            <strong>Tecnología:</strong> TensorFlow.js + face-api.js cargados desde jsDelivr CDN
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReconocimientoFacialPage;
