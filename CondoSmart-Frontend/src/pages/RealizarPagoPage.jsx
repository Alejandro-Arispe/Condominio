import React, { useState } from 'react';
import { FiArrowLeft, FiDollarSign, FiCreditCard, FiCheck } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const RealizarPagoPage = () => {
  const navigate = useNavigate();
  const [deuda, setDeuda] = useState({
    total: 1250.50,
    expensas: 850.00,
    servicios: 200.00,
    multas: 200.50,
  });
  const [pagando, setPagando] = useState(false);
  const [monto, setMonto] = useState(deuda.total.toString());
  const [metodo, setMetodo] = useState('tarjeta');
  const [completado, setCompletado] = useState(false);

  const montoNumerico = parseFloat(monto) || 0;
  const cambio = montoNumerico - deuda.total;

  const handlePago = () => {
    setPagando(true);
    setTimeout(() => {
      setPagando(false);
      setCompletado(true);
      setTimeout(() => {
        setCompletado(false);
        navigate(-1);
      }, 3000);
    }, 2000);
  };

  if (completado) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-green-100">
        <div className="text-center">
          <div className="bg-green-600 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <FiCheck size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-green-700 mb-2">¡Pago Completado!</h1>
          <p className="text-gray-700 mb-2">Tu pago ha sido procesado exitosamente</p>
          <p className="text-2xl font-bold text-green-600">${montoNumerico.toFixed(2)}</p>
          <p className="text-sm text-gray-600 mt-4">Redirigiendo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-200 rounded-lg">
          <FiArrowLeft size={20} />
        </button>
        <h1 className="text-3xl font-bold text-gray-800">Realizar Pago de Deudas</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulario de Pago */}
        <div className="lg:col-span-2 space-y-6">
          {/* Resumen de Deuda */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Resumen de Deuda</h2>
            <div className="space-y-3 mb-6 pb-6 border-b">
              <div className="flex justify-between text-gray-700">
                <span>Expensas Generales:</span>
                <span className="font-semibold">${deuda.expensas.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Servicios:</span>
                <span className="font-semibold">${deuda.servicios.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-red-700">
                <span>Multas:</span>
                <span className="font-semibold">${deuda.multas.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex justify-between text-lg font-bold text-blue-700">
              <span>Total a Pagar:</span>
              <span>${deuda.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Método de Pago */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Método de Pago</h2>
            <div className="space-y-3">
              <label className="flex items-center p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50" style={{ borderColor: metodo === 'tarjeta' ? '#2563eb' : '#e5e7eb' }}>
                <input
                  type="radio"
                  name="metodo"
                  value="tarjeta"
                  checked={metodo === 'tarjeta'}
                  onChange={(e) => setMetodo(e.target.value)}
                  className="w-4 h-4"
                />
                <FiCreditCard size={20} className="ml-3 text-blue-600" />
                <span className="ml-3 font-medium">Tarjeta de Crédito/Débito</span>
              </label>
              <label className="flex items-center p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50" style={{ borderColor: metodo === 'transferencia' ? '#2563eb' : '#e5e7eb' }}>
                <input
                  type="radio"
                  name="metodo"
                  value="transferencia"
                  checked={metodo === 'transferencia'}
                  onChange={(e) => setMetodo(e.target.value)}
                  className="w-4 h-4"
                />
                <FiDollarSign size={20} className="ml-3 text-green-600" />
                <span className="ml-3 font-medium">Transferencia Bancaria</span>
              </label>
            </div>
          </div>

          {/* Monto a Pagar */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Monto a Pagar</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cantidad</label>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-gray-800">$</span>
                  <input
                    type="number"
                    value={monto}
                    onChange={(e) => setMonto(e.target.value)}
                    className="flex-1 px-4 py-3 text-2xl font-bold border-2 border-blue-600 rounded-lg focus:outline-none"
                  />
                </div>
              </div>
              {cambio !== 0 && (
                <div className={`p-3 rounded-lg text-center font-semibold ${cambio > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {cambio > 0 ? `+ Cambio: $${cambio.toFixed(2)}` : `Falta: $${Math.abs(cambio).toFixed(2)}`}
                </div>
              )}
            </div>
          </div>

          {/* Botón de Pago */}
          <button
            onClick={handlePago}
            disabled={pagando || montoNumerico < deuda.total}
            className={`w-full py-4 text-lg font-bold rounded-lg text-white transition ${
              montoNumerico < deuda.total
                ? 'bg-gray-400 cursor-not-allowed'
                : pagando
                ? 'bg-blue-400'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {pagando ? 'Procesando Pago...' : `Pagar $${montoNumerico.toFixed(2)}`}
          </button>
        </div>

        {/* Detalles del Lado */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-md p-6 sticky top-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Información de Cuenta</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Propietario</p>
                <p className="font-semibold text-gray-800">Juan Pérez García</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Unidad</p>
                <p className="font-semibold text-gray-800">Apto 305</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Manzana</p>
                <p className="font-semibold text-gray-800">B</p>
              </div>
              <div className="pt-4 border-t">
                <p className="text-sm text-gray-600 mb-2">Estado de Pago</p>
                <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-semibold rounded-full">
                  Con Deuda
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealizarPagoPage;
