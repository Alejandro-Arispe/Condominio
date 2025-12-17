# 📷 INTEGRACIÓN DE CÁMARA - React Webcam

---

## 1️⃣ INSTALACIÓN

```bash
cd d:\Documents\SI2\0-MESA\condominio\CondoSmart-Frontend

npm install react-webcam
npm install html5-qrcode  # Para leer códigos QR (opcional pero útil)
```

---

## 2️⃣ HOOK PERSONALIZADO: useCamera.js

Crear archivo: `src/hooks/useCamera.js`

```jsx
import { useRef, useCallback } from 'react';

export const useCamera = () => {
  const webcamRef = useRef(null);

  const capturePhoto = useCallback(() => {
    if (!webcamRef.current) {
      throw new Error('Webcam no inicializada');
    }
    
    try {
      const imageSrc = webcamRef.current.getScreenshot();
      return imageSrc; // Retorna base64
    } catch (error) {
      console.error('Error capturando foto:', error);
      throw error;
    }
  }, []);

  const captureVideoStream = useCallback((durationMs = 5000) => {
    // Para futuras implementaciones de video
    if (!webcamRef.current) {
      throw new Error('Webcam no inicializada');
    }
    return webcamRef.current;
  }, []);

  return {
    webcamRef,
    capturePhoto,
    captureVideoStream,
  };
};
```

---

## 3️⃣ COMPONENTE: CameraCapture.jsx

Crear archivo: `src/components/camera/CameraCapture.jsx`

```jsx
import React, { useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import { useCamera } from '../../hooks/useCamera';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Alert from '../common/Alert';
import { FiCamera, FiRefreshCw, FiLoader } from 'react-icons/fi';

const CameraCapture = ({
  isOpen,
  onClose,
  onCapture,
  title = "Capturar Foto",
  facingMode = "user", // user, environment
  loading = false,
  error = null,
}) => {
  const { webcamRef, capturePhoto } = useCamera();
  const [captureError, setCaptureError] = useState(null);
  const [countdown, setCountdown] = useState(0);

  const handleCapture = async () => {
    try {
      setCaptureError(null);
      setCountdown(3);
      
      // Contador de 3 segundos
      for (let i = 3; i > 0; i--) {
        setCountdown(i);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      const photo = capturePhoto();
      if (photo) {
        onCapture(photo);
      }
    } catch (err) {
      setCaptureError('Error al capturar foto: ' + err.message);
    }
  };

  const handleRetry = () => {
    setCaptureError(null);
  };

  const videoConstraints = {
    width: { ideal: 1280 },
    height: { ideal: 720 },
    facingMode: facingMode,
    aspectRatio: { ideal: 16 / 9 },
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="lg">
      <div className="space-y-4">
        {error && <Alert type="error" title="Error" message={error} />}
        {captureError && (
          <Alert 
            type="error" 
            title="Error de Captura" 
            message={captureError}
          />
        )}

        {/* Video de cámara */}
        <div className="bg-black rounded-lg overflow-hidden border-4 border-gray-300 relative">
          {countdown > 0 && (
            <div className="absolute inset-0 flex items-center justify-center z-10 bg-black bg-opacity-70">
              <div className="text-6xl font-bold text-white">{countdown}</div>
            </div>
          )}
          
          <Webcam
            ref={webcamRef}
            videoConstraints={videoConstraints}
            screenshotFormat="image/jpeg"
            screenshotQuality={0.95}
            mirrored={facingMode === "user"}
            className="w-full"
          />
        </div>

        {/* Información */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-900">
            ✓ Asegúrese de que su cara sea visible
            <br />
            ✓ Buena iluminación
            <br />
            ✓ Sin accesorios que cubran la cara
          </p>
        </div>

        {/* Botones */}
        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={handleRetry}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <FiRefreshCw size={18} />
            Reintentar
          </Button>
          
          <Button
            variant="primary"
            onClick={handleCapture}
            loading={loading}
            disabled={loading || countdown > 0}
            className="flex-1 flex items-center justify-center gap-2"
          >
            {loading && <FiLoader className="animate-spin" size={18} />}
            {countdown > 0 ? `Capturando en ${countdown}...` : 'Capturar Foto'}
            {!loading && countdown === 0 && <FiCamera size={18} />}
          </Button>
          
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cerrar
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CameraCapture;
```

---

## 4️⃣ COMPONENTE: PlateCapture.jsx (para placas)

Crear archivo: `src/components/camera/PlateCapture.jsx`

```jsx
import React, { useState } from 'react';
import CameraCapture from './CameraCapture';
import Input from '../common/Input';
import Button from '../common/Button';
import Modal from '../common/Modal';
import { FiCamera, FiEdit2 } from 'react-icons/fi';

const PlateCapture = ({
  isOpen,
  onClose,
  onCapture,
  title = "Verificar Placa Vehicular",
}) => {
  const [method, setMethod] = useState("manual"); // manual o foto
  const [plateManual, setPlateManual] = useState("");
  const [showCamera, setShowCamera] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleManualSubmit = () => {
    if (plateManual.trim()) {
      onCapture({
        placa: plateManual.toUpperCase(),
        tipo: "manual",
      });
    }
  };

  const handlePhotoCapture = async (photo) => {
    setLoading(true);
    try {
      // TODO: Aquí iría OCR para leer la placa de la foto
      // Por ahora, solo guardamos la foto
      onCapture({
        foto_base64: photo,
        tipo: "ocr",
      });
      setShowCamera(false);
    } catch (error) {
      console.error('Error procesando placa:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title={title} size="md">
        <div className="space-y-4">
          {/* Selector de método */}
          <div className="flex gap-2">
            <button
              onClick={() => setMethod("manual")}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
                method === "manual"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <FiEdit2 className="inline mr-2" size={18} />
              Ingreso Manual
            </button>
            
            <button
              onClick={() => setMethod("foto")}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
                method === "foto"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <FiCamera className="inline mr-2" size={18} />
              Desde Cámara
            </button>
          </div>

          {/* Formulario Manual */}
          {method === "manual" && (
            <div className="space-y-3">
              <Input
                label="Placa Vehicular"
                placeholder="Ej: ABC-123 o ABC123"
                value={plateManual}
                onChange={(e) => setPlateManual(e.target.value.toUpperCase())}
              />
              
              <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-600">
                Formato: ABC-123 (con guión) o ABC123 (sin guión)
              </div>

              <Button
                variant="primary"
                onClick={handleManualSubmit}
                disabled={!plateManual.trim()}
                className="w-full"
              >
                Verificar Placa
              </Button>
            </div>
          )}

          {/* Botón para Cámara */}
          {method === "foto" && (
            <div className="text-center space-y-3">
              <p className="text-gray-600">
                Capture una foto clara de la placa del vehículo
              </p>
              <Button
                variant="primary"
                onClick={() => setShowCamera(true)}
                className="w-full flex items-center justify-center gap-2"
              >
                <FiCamera size={18} />
                Abrir Cámara
              </Button>
            </div>
          )}
        </div>
      </Modal>

      {/* Modal de Cámara */}
      <CameraCapture
        isOpen={showCamera}
        onClose={() => setShowCamera(false)}
        onCapture={handlePhotoCapture}
        title="Capturar Placa"
        facingMode="environment"
        loading={loading}
      />
    </>
  );
};

export default PlateCapture;
```

---

## 5️⃣ USO EN PÁGINAS

### Ejemplo: ReconocimientoFacialPage.jsx

```jsx
import CameraCapture from '../components/camera/CameraCapture';

const ReconocimientoFacialPage = () => {
  const [showCamera, setShowCamera] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handlePhotoCapture = async (photoBase64) => {
    setLoading(true);
    try {
      // Enviar a API
      const response = await apiService.post('/accesos/verificar-facial/', {
        foto_base64: photoBase64,
        unidad_id: currentUnidad,
      });
      
      setResult(response);
      
      if (response.permitido) {
        // Mostrar éxito y registrar acceso
        await apiService.post('/accesos/registrar-acceso/', {
          foto_base64: photoBase64,
          tipo: 'facial',
          unidad_id: currentUnidad,
        });
      }
    } catch (error) {
      setResult({ error: error.message });
    } finally {
      setLoading(false);
      setShowCamera(false);
    }
  };

  return (
    <div className="p-8 space-y-6">
      <PageHeader title="Reconocimiento Facial" />
      
      <Button
        variant="primary"
        onClick={() => setShowCamera(true)}
        className="flex items-center gap-2"
      >
        <FiCamera size={20} />
        Iniciar Verificación
      </Button>

      <CameraCapture
        isOpen={showCamera}
        onClose={() => setShowCamera(false)}
        onCapture={handlePhotoCapture}
        title="Verificación Facial"
        facingMode="user"
        loading={loading}
      />

      {result && (
        <ResultCard
          permitido={result.permitido}
          usuario={result.usuario}
          confianza={result.confianza}
          mensaje={result.mensaje}
        />
      )}
    </div>
  );
};
```

---

## 🛠️ PASOS A SEGUIR

```bash
# 1. Instalar dependencia
npm install react-webcam

# 2. Crear archivos
# - src/hooks/useCamera.js
# - src/components/camera/CameraCapture.jsx
# - src/components/camera/PlateCapture.jsx

# 3. Actualizar páginas para usar CameraCapture
# - ReconocimientoFacialPage.jsx
# - HistorialAccesosPage.jsx (para verification)
# - ConfigurarAreasComunesPage.jsx

# 4. Probar en navegador
npm start
```

---

## ⚠️ NOTAS IMPORTANTES

1. **HTTPS Requerido**: Webcam solo funciona en `https://` o `localhost`
2. **Permisos**: El navegador pedirá permiso para acceder a la cámara
3. **Velocidad**: Las fotos en base64 son pesadas (500KB+), comprimirlas si es necesario
4. **Formato**: `getScreenshot()` retorna JPEG con calidad 0.95

---

## 📝 PRUEBAS LOCALES

```jsx
// En DevTools, verificar que funciona:
const webcam = useRef(null);
const photo = webcam.current.getScreenshot();
console.log(photo.length); // Debería ser > 50000
```

