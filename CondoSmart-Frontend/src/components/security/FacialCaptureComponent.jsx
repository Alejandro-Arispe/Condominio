import React, { useState } from 'react';
import { useCamera } from '../../hooks/useCamera';
import { FiCamera, FiX } from 'react-icons/fi';
import { useAuthContext } from '../../context/AuthContext';

export const FacialCaptureComponent = ({ unidadId, onSuccess, onError }) => {
  const { videoRef, canvasRef, isOpen, openCamera, closeCamera, captureAsBlob, error } = useCamera();
  const { api } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleCapture = async () => {
    try {
      setLoading(true);
      const blob = await captureAsBlob();
      
      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(blob);

      // Enviar a backend
      const formData = new FormData();
      formData.append('foto', blob, 'foto_facial.jpg');
      formData.append('unidad_id', unidadId);
      formData.append('sentido', 'in');

      const response = await api.post('/security/accesos/verificar_facial/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setResult(response.data);
      onSuccess?.(response.data);
      closeCamera();
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message;
      setResult({ error: errorMsg });
      onError?.(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-bold mb-4">Verificación Facial</h3>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {!isOpen ? (
        <button
          onClick={openCamera}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <FiCamera /> Abrir Cámara
        </button>
      ) : (
        <div className="space-y-4">
          <div className="relative w-full bg-black rounded overflow-hidden">
            <video
              ref={videoRef}
              className="w-full h-auto"
              style={{ aspectRatio: '4/3' }}
            />
            <canvas ref={canvasRef} className="hidden" />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleCapture}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              <FiCamera /> Capturar
            </button>
            <button
              onClick={closeCamera}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              <FiX /> Cerrar
            </button>
          </div>
        </div>
      )}

      {preview && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <p className="text-sm font-semibold mb-2">Vista previa:</p>
          <img src={preview} alt="Preview" className="w-full max-w-md rounded" />
        </div>
      )}

      {result && (
        <div className={`mt-4 p-4 rounded ${result.match ? 'bg-green-100' : 'bg-red-100'}`}>
          <p className={`font-semibold ${result.match ? 'text-green-800' : 'text-red-800'}`}>
            {result.match ? '✓ Acceso Permitido' : '✗ Acceso Denegado'}
          </p>
          {result.usuario && <p className="text-sm">Usuario: {result.usuario}</p>}
          {result.error && <p className="text-sm text-red-600">{result.error}</p>}
        </div>
      )}
    </div>
  );
};
