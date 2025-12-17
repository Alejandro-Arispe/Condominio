import React, { useState, useEffect } from 'react';
import { FiCreditCard, FiDollarSign, FiCheckCircle, FiLock } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Alert from '../components/common/Alert';
import apiClient from '../services/apiClient';
import { useNotifications } from '../context/NotificationContext';

const PagoEnLineaPage = () => {
    const navigate = useNavigate();
    const { addNotification } = useNotifications();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [cargosPendientes, setCargosPendientes] = useState([]);
    const [selectedCargo, setSelectedCargo] = useState(null);
    const [formData, setFormData] = useState({
        numeroTarjeta: '',
        nombreTitular: '',
        fechaExpiracion: '',
        cvv: '',
        monto: 0,
    });

    useEffect(() => {
        cargarCargosPendientes();
    }, []);

    const cargarCargosPendientes = async () => {
        try {
            const response = await apiClient.get('/cargos/?estado=pendiente');
            const cargos = response.data.results || response.data;
            setCargosPendientes(cargos);
        } catch (err) {
            console.error('Error al cargar cargos:', err);
        }
    };

    const handleSelectCargo = (cargo) => {
        setSelectedCargo(cargo);
        setFormData({ ...formData, monto: parseFloat(cargo.monto) });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Formatear número de tarjeta
        if (name === 'numeroTarjeta') {
            const formatted = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
            setFormData({ ...formData, [name]: formatted });
        } else if (name === 'fechaExpiracion') {
            const formatted = value.replace(/\D/g, '').replace(/(\d{2})(\d{0,2})/, '$1/$2');
            setFormData({ ...formData, [name]: formatted });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validaciones básicas
        if (formData.numeroTarjeta.replace(/\s/g, '').length !== 16) {
            setError('Número de tarjeta inválido');
            setLoading(false);
            return;
        }

        if (formData.cvv.length !== 3) {
            setError('CVV inválido');
            setLoading(false);
            return;
        }

        // Simular procesamiento de pago (3 segundos)
        setTimeout(async () => {
            try {
                // Registrar pago en el backend
                await apiClient.post('/pagos/', {
                    unidad: selectedCargo?.unidad,
                    monto: formData.monto,
                    metodo_pago: 'tarjeta_credito',
                    referencia: `TRX-${Date.now()}`,
                });

                setSuccess(true);

                // Notificación push
                addNotification({
                    type: 'success',
                    title: '¡Pago exitoso!',
                    message: `Se procesó tu pago de $${formData.monto.toFixed(2)}`,
                });

                // Redirigir después de 3 segundos
                setTimeout(() => {
                    navigate('/estado-cuenta');
                }, 3000);

            } catch (err) {
                setError('Error al procesar el pago. Intenta nuevamente.');
            } finally {
                setLoading(false);
            }
        }, 3000);
    };

    if (success) {
        return (
            <div className="p-8 flex items-center justify-center min-h-screen">
                <div className="bg-white rounded-lg shadow-lg p-12 text-center max-w-md">
                    <FiCheckCircle size={80} className="text-green-600 mx-auto mb-6" />
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">¡Pago Exitoso!</h2>
                    <p className="text-gray-600 mb-2">Tu pago ha sido procesado correctamente</p>
                    <p className="text-2xl font-bold text-green-600 mb-6">${formData.monto.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">Redirigiendo a estado de cuenta...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-6">
            <PageHeader
                title="Pago en Línea"
                subtitle="Paga tus cuotas de forma segura con tarjeta de crédito/débito"
            />

            {error && <Alert type="error" title="Error" message={error} />}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Cargos Pendientes */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <FiDollarSign className="text-blue-600" />
                            Cargos Pendientes
                        </h3>
                        <div className="space-y-3">
                            {cargosPendientes.length === 0 ? (
                                <p className="text-gray-500 text-sm">No tienes cargos pendientes</p>
                            ) : (
                                cargosPendientes.map((cargo) => (
                                    <div
                                        key={cargo.id}
                                        onClick={() => handleSelectCargo(cargo)}
                                        className={`p-4 border rounded-lg cursor-pointer transition ${selectedCargo?.id === cargo.id
                                            ? 'border-blue-600 bg-blue-50'
                                            : 'border-gray-200 hover:border-blue-300'
                                            }`}
                                    >
                                        <p className="font-semibold text-gray-900">{cargo.concepto}</p>
                                        <p className="text-2xl font-bold text-blue-600 mt-2">${parseFloat(cargo.monto).toFixed(2)}</p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Vence: {cargo.fecha_vencimiento ? new Date(cargo.fecha_vencimiento).toLocaleDateString() : 'N/A'}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Formulario de Pago */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <FiCreditCard className="text-blue-600" />
                                Información de Pago
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <FiLock size={16} />
                                Pago Seguro
                            </div>
                        </div>

                        {!selectedCargo ? (
                            <div className="text-center py-12 text-gray-500">
                                <FiDollarSign size={48} className="mx-auto mb-4 opacity-30" />
                                <p>Selecciona un cargo pendiente para continuar</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Monto a Pagar */}
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <p className="text-sm text-blue-800 mb-1">Monto a pagar</p>
                                    <p className="text-3xl font-bold text-blue-900">${formData.monto.toFixed(2)}</p>
                                </div>

                                {/* Número de Tarjeta */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Número de Tarjeta
                                    </label>
                                    <Input
                                        name="numeroTarjeta"
                                        value={formData.numeroTarjeta}
                                        onChange={handleInputChange}
                                        placeholder="1234 5678 9012 3456"
                                        maxLength="19"
                                        required
                                    />
                                    <div className="flex gap-2 mt-2">
                                        <img src="https://img.icons8.com/color/48/000000/visa.png" alt="Visa" className="h-8" />
                                        <img src="https://img.icons8.com/color/48/000000/mastercard.png" alt="Mastercard" className="h-8" />
                                        <img src="https://img.icons8.com/color/48/000000/amex.png" alt="Amex" className="h-8" />
                                    </div>
                                </div>

                                {/* Nombre del Titular */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nombre del Titular
                                    </label>
                                    <Input
                                        name="nombreTitular"
                                        value={formData.nombreTitular}
                                        onChange={handleInputChange}
                                        placeholder="JUAN PEREZ"
                                        required
                                    />
                                </div>

                                {/* Fecha y CVV */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Fecha de Expiración
                                        </label>
                                        <Input
                                            name="fechaExpiracion"
                                            value={formData.fechaExpiracion}
                                            onChange={handleInputChange}
                                            placeholder="MM/AA"
                                            maxLength="5"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            CVV
                                        </label>
                                        <Input
                                            name="cvv"
                                            type="password"
                                            value={formData.cvv}
                                            onChange={handleInputChange}
                                            placeholder="123"
                                            maxLength="3"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Botones */}
                                <div className="flex gap-3 pt-4">
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={() => navigate('/estado-cuenta')}
                                        className="flex-1"
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        loading={loading}
                                        className="flex-1"
                                    >
                                        {loading ? 'Procesando...' : `Pagar $${formData.monto.toFixed(2)}`}
                                    </Button>
                                </div>

                                {/* Información de Seguridad */}
                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-600">
                                    <p className="font-semibold mb-2">Tu información está segura</p>
                                    <ul className="space-y-1 text-xs">
                                        <li>• Conexión encriptada SSL/TLS</li>
                                        <li>• No almacenamos datos de tu tarjeta</li>
                                        <li>• Procesamiento seguro PCI-DSS</li>
                                    </ul>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PagoEnLineaPage;
