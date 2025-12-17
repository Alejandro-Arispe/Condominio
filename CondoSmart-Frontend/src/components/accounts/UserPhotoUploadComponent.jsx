import React, { useState } from 'react';
import { FiUpload, FiCheck, FiX } from 'react-icons/fi';
import { useAuthContext } from '../../context/AuthContext';

export const UserPhotoUploadComponent = ({ userId, onSuccess, onError }) => {
  const { api } = useAuthContext();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    // Validar tipo
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(selectedFile.type)) {
      setError('Solo se permiten JPEG, PNG o WEBP');
      return;
    }

    // Validar tamaño (5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('La imagen no debe exceder 5MB');
      return;
    }

    setFile(selectedFile);
    setError(null);

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Seleccione un archivo');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append('foto', file);

      const response = await api.post(
        `/accounts/users/${userId}/upload_foto/`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );

      setResult(response.data);
      setFile(null);
      onSuccess?.(response.data);
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message;
      setError(errorMsg);
      onError?.(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-bold mb-4">Foto de Perfil</h3>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded flex items-center gap-2">
          <FiX /> {error}
        </div>
      )}

      {!result ? (
        <div className="space-y-4">
          {/* Input File */}
          <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileSelect}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center gap-2">
              <FiUpload className="text-4xl text-gray-400" />
              <p className="text-gray-600">Arrastra una foto o haz click aquí</p>
              <p className="text-sm text-gray-500">JPEG, PNG o WEBP (máx 5MB)</p>
            </div>
          </div>

          {/* Preview */}
          {preview && (
            <div className="flex flex-col items-center">
              <img src={preview} alt="Preview" className="max-w-xs h-auto rounded" />
              <p className="text-sm text-gray-600 mt-2">{file?.name}</p>
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-2">
            <button
              onClick={handleUpload}
              disabled={!file || loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 font-semibold"
            >
              {loading ? 'Subiendo...' : 'Subir Foto'}
            </button>
            <button
              onClick={handleReset}
              disabled={!file}
              className="flex-1 px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 disabled:opacity-50 font-semibold"
            >
              Limpiar
            </button>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-green-100 rounded">
          <div className="flex items-center gap-2 text-green-800 font-semibold mb-2">
            <FiCheck className="text-2xl" /> Foto subida exitosamente
          </div>
          {result.url && (
            <img src={result.url} alt="Uploaded" className="max-w-xs h-auto rounded mt-2" />
          )}
          <button
            onClick={handleReset}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Subir otra foto
          </button>
        </div>
      )}
    </div>
  );
};
