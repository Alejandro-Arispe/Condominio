import React, { useState, useEffect } from 'react';
import { FiAlertTriangle, FiEye, FiActivity, FiBell } from 'react-icons/fi';
import PageHeader from '../components/common/PageHeader';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import apiClient from '../services/apiClient';

const DeteccionAnomaliasPage = () => {
    const [monitoring, setMonitoring] = useState(false);
    const [anomalias, setAnomalias] = useState([]);
    const [incidentes, setIncidentes] = useState([]);
    const [estadisticas, setEstadisticas] = useState({
        total: 0,
        resueltas: 0,
        pendientes: 0,
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const incidentesRes = await apiClient.get('/incidentes/');
            const incidentesData = incidentesRes.data.results || incidentesRes.data;

            setIncidentes(incidentesData);
            setEstadisticas({
                total: incidentesData.length,
                resueltas: incidentesData.filter(i => i.status === 'resuelto').length,
                pendientes: incidentesData.filter(i => i.status === 'pendiente').length,
            });
        } catch (err) {
            console.error('Error al cargar datos:', err);
        }
    };

    const handleStartMonitoring = () => {
        setMonitoring(true);

        // Simular detección de anomalías
        const interval = setInterval(() => {
            const tiposAnomalias = [
                { tipo: 'Movimiento Sospechoso', severidad: 'media', zona: 'Estacionamiento' },
                { tipo: 'Perro Suelto', severidad: 'baja', zona: 'Área Verde' },
                { tipo: 'Vehículo Mal Estacionado', severidad: 'baja', zona: 'Zona B' },
                { tipo: 'Ruido Excesivo', severidad: 'media', zona: 'Piso 3' },
                { tipo: 'Persona No Autorizada', severidad: 'alta', zona: 'Entrada Principal' },
            ];

            const anomaliaAleatoria = tiposAnomalias[Math.floor(Math.random() * tiposAnomalias.length)];

            setAnomalias(prev => [{
                id: Date.now(),
                ...anomaliaAleatoria,
                timestamp: new Date().toLocaleString(),
                confidence: Math.floor(Math.random() * 20 + 80), // 80-100%
            }, ...prev].slice(0, 10));
        }, 5000); // Nueva anomalía cada 5 segundos

        // Detener después de 30 segundos
        setTimeout(() => {
            clearInterval(interval);
            setMonitoring(false);
        }, 30000);
    };

    const handleStopMonitoring = () => {
        setMonitoring(false);
    };

    const getSeveridadColor = (severidad) => {
        switch (severidad) {
            case 'alta':
            case 'critica':
                return 'bg-red-100 text-red-800 border-red-300';
            case 'media':
                return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'baja':
                return 'bg-blue-100 text-blue-800 border-blue-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    return (
        <div className="p-8 space-y-6">
            <PageHeader
                title="Detección de Anomalías (IA)"
                subtitle="Sistema inteligente de detección de comportamientos anómalos"
            />

            {/* Panel de Control */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg shadow-lg p-8 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold mb-2">Sistema de Monitoreo IA</h2>
                        <p className="text-purple-100">
                            Detección automática de: Movimientos sospechosos • Perros sueltos • Vehículos mal estacionados
                        </p>
                    </div>
                    <div>
                        {!monitoring ? (
                            <Button
                                onClick={handleStartMonitoring}
                                className="bg-white text-purple-600 hover:bg-purple-50 px-8 py-3 text-lg font-semibold"
                            >
                                <FiEye className="inline mr-2" />
                                Iniciar Monitoreo
                            </Button>
                        ) : (
                            <Button
                                onClick={handleStopMonitoring}
                                className="bg-red-600 text-white hover:bg-red-700 px-8 py-3 text-lg font-semibold"
                            >
                                <FiActivity className="inline mr-2 animate-pulse" />
                                Detener
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-600">
                    <p className="text-gray-600 text-sm mb-1">Total Incidentes</p>
                    <p className="text-3xl font-bold text-blue-600">{estadisticas.total}</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-600">
                    <p className="text-gray-600 text-sm mb-1">Resueltos</p>
                    <p className="text-3xl font-bold text-green-600">{estadisticas.resueltas}</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-red-600">
                    <p className="text-gray-600 text-sm mb-1">Pendientes</p>
                    <p className="text-3xl font-bold text-red-600">{estadisticas.pendientes}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Anomalías Detectadas en Tiempo Real */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <FiBell className="text-orange-600" />
                            Anomalías Detectadas (Tiempo Real)
                        </h3>
                        {monitoring && (
                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold animate-pulse">
                                ● ACTIVO
                            </span>
                        )}
                    </div>

                    <div className="space-y-3 max-h-96 overflow-y-auto">
                        {anomalias.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <FiEye size={48} className="mx-auto mb-3 opacity-30" />
                                <p>Inicie el monitoreo para detectar anomalías</p>
                            </div>
                        ) : (
                            anomalias.map((anomalia) => (
                                <div
                                    key={anomalia.id}
                                    className={`border rounded-lg p-4 ${getSeveridadColor(anomalia.severidad)}`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <FiAlertTriangle className="flex-shrink-0" />
                                                <p className="font-semibold">{anomalia.tipo}</p>
                                            </div>
                                            <p className="text-sm opacity-80">Zona: {anomalia.zona}</p>
                                            <p className="text-xs opacity-60 mt-1">{anomalia.timestamp}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xs font-semibold uppercase">{anomalia.severidad}</span>
                                            <p className="text-xs opacity-60">Conf: {anomalia.confidence}%</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Incidentes Registrados */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <FiActivity className="text-blue-600" />
                        Incidentes Registrados
                    </h3>

                    <div className="space-y-3 max-h-96 overflow-y-auto">
                        {incidentes.length === 0 ? (
                            <p className="text-gray-500 text-sm text-center py-8">No hay incidentes registrados</p>
                        ) : (
                            incidentes.slice(0, 10).map((incidente) => (
                                <div key={incidente.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-900">{incidente.tipo}</p>
                                            <p className="text-sm text-gray-600 mt-1">{incidente.descripcion}</p>
                                            <p className="text-xs text-gray-500 mt-2">
                                                {incidente.fecha_reporte ? new Date(incidente.fecha_reporte).toLocaleString() : '-'}
                                            </p>
                                        </div>
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${incidente.status === 'resuelto'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {incidente.status}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Información del Sistema */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-semibold text-blue-900 mb-3">Sobre el Sistema de IA</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-800">
                    <div>
                        <p className="font-semibold mb-1">Visión por Computadora</p>
                        <p className="text-blue-700">Análisis de video en tiempo real para detectar comportamientos anómalos</p>
                    </div>
                    <div>
                        <p className="font-semibold mb-1">Machine Learning</p>
                        <p className="text-blue-700">Modelos entrenados para identificar patrones sospechosos</p>
                    </div>
                    <div>
                        <p className="font-semibold mb-1">Alertas Automáticas</p>
                        <p className="text-blue-700">Notificaciones instantáneas al personal de seguridad</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeteccionAnomaliasPage;
