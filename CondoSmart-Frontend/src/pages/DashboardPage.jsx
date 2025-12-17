import React, { useState, useEffect } from 'react';
import {
    FiHome, FiUsers, FiDollarSign, FiAlertCircle,
    FiTrendingUp, FiTrendingDown, FiActivity, FiCheckCircle
} from 'react-icons/fi';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const DashboardPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [kpis, setKpis] = useState({
        totalUnidades: 0,
        ocupadas: 0,
        totalResidentes: 0,
        ingresos: 0,
        gastos: 0,
        saldo: 0,
        incidentes: 0,
        ticketsPendientes: 0,
        reservasHoy: 0,
    });
    const [tendenciaFinanciera, setTendenciaFinanciera] = useState([]);
    const [distribucionGastos, setDistribucionGastos] = useState([]);
    const [actividadReciente, setActividadReciente] = useState([]);

    useEffect(() => {
        cargarDashboard();
    }, []);

    const cargarDashboard = async () => {
        try {
            setLoading(true);

            const [unidades, ocupantes, cargos, pagos, incidentes, tickets, reservas, accesos] = await Promise.all([
                apiClient.get('/unidades/'),
                apiClient.get('/ocupantes/'),
                apiClient.get('/cargos/'),
                apiClient.get('/pagos/'),
                apiClient.get('/incidentes/'),
                apiClient.get('/tickets/'),
                apiClient.get('/reservas/'),
                apiClient.get('/accesos/'),
            ]);

            const unidadesData = unidades.data.results || unidades.data;
            const ocupantesData = ocupantes.data.results || ocupantes.data;
            const cargosData = cargos.data.results || cargos.data;
            const pagosData = pagos.data.results || pagos.data;
            const incidentesData = incidentes.data.results || incidentes.data;
            const ticketsData = tickets.data.results || tickets.data;
            const reservasData = reservas.data.results || reservas.data;
            const accesosData = accesos.data.results || accesos.data;

            const totalIngresos = pagosData.reduce((sum, p) => sum + parseFloat(p.monto), 0);
            const totalGastos = cargosData.reduce((sum, c) => sum + parseFloat(c.monto), 0);

            setKpis({
                totalUnidades: unidadesData.length,
                ocupadas: unidadesData.filter(u => u.user).length,
                totalResidentes: ocupantesData.length,
                ingresos: totalIngresos,
                gastos: totalGastos,
                saldo: totalIngresos - totalGastos,
                incidentes: incidentesData.filter(i => i.status === 'pendiente').length,
                ticketsPendientes: ticketsData.filter(t => t.status === 'pendiente').length,
                reservasHoy: reservasData.filter(r => {
                    const hoy = new Date().toISOString().split('T')[0];
                    return r.fecha?.startsWith(hoy);
                }).length,
            });

            // Tendencia financiera (últimos 6 meses simulados)
            const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];
            const tendencia = meses.map((mes, i) => ({
                mes,
                ingresos: totalIngresos * (0.7 + i * 0.05),
                gastos: totalGastos * (0.8 + i * 0.03),
            }));
            setTendenciaFinanciera(tendencia);

            // Distribución de gastos por concepto
            const gastosPorConcepto = {};
            cargosData.forEach(cargo => {
                const concepto = cargo.concepto || 'Otros';
                gastosPorConcepto[concepto] = (gastosPorConcepto[concepto] || 0) + parseFloat(cargo.monto);
            });
            const distribucion = Object.entries(gastosPorConcepto).map(([name, value]) => ({
                name: name.charAt(0).toUpperCase() + name.slice(1),
                value: parseFloat(value.toFixed(2)),
            }));
            setDistribucionGastos(distribucion);

            // Actividad reciente
            const actividades = [
                ...accesosData.slice(0, 3).map(a => ({
                    tipo: 'Acceso',
                    descripcion: `${a.tipo} registrado`,
                    fecha: a.timestamp || a.created_at,
                    icono: FiCheckCircle,
                    color: 'text-green-600',
                })),
                ...incidentesData.slice(0, 2).map(i => ({
                    tipo: 'Incidente',
                    descripcion: i.tipo,
                    fecha: i.fecha_reporte,
                    icono: FiAlertCircle,
                    color: 'text-red-600',
                })),
            ].sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).slice(0, 5);

            setActividadReciente(actividades);

        } catch (err) {
            console.error('Error al cargar dashboard:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Cargando dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard Principal</h1>
                    <p className="text-gray-600 mt-1">Resumen general del condominio</p>
                </div>
                <button
                    onClick={() => cargarDashboard()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                    <FiActivity />
                    Actualizar
                </button>
            </div>

            {/* KPIs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Unidades */}
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white cursor-pointer hover:shadow-xl transition"
                    onClick={() => navigate('/unidades')}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100 text-sm">Unidades Ocupadas</p>
                            <p className="text-3xl font-bold mt-2">{kpis.ocupadas}/{kpis.totalUnidades}</p>
                            <p className="text-blue-100 text-xs mt-1">
                                {kpis.totalUnidades > 0 ? ((kpis.ocupadas / kpis.totalUnidades) * 100).toFixed(0) : 0}% ocupación
                            </p>
                        </div>
                        <FiHome size={48} className="opacity-20" />
                    </div>
                </div>

                {/* Residentes */}
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white cursor-pointer hover:shadow-xl transition"
                    onClick={() => navigate('/ocupantes')}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-100 text-sm">Total Residentes</p>
                            <p className="text-3xl font-bold mt-2">{kpis.totalResidentes}</p>
                            <p className="text-green-100 text-xs mt-1">Registrados en el sistema</p>
                        </div>
                        <FiUsers size={48} className="opacity-20" />
                    </div>
                </div>

                {/* Finanzas */}
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white cursor-pointer hover:shadow-xl transition"
                    onClick={() => navigate('/estado-cuenta')}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-100 text-sm">Saldo</p>
                            <p className="text-3xl font-bold mt-2">${kpis.saldo.toFixed(2)}</p>
                            <p className="text-purple-100 text-xs mt-1 flex items-center gap-1">
                                {kpis.saldo >= 0 ? <FiTrendingUp size={12} /> : <FiTrendingDown size={12} />}
                                Ingresos - Gastos
                            </p>
                        </div>
                        <FiDollarSign size={48} className="opacity-20" />
                    </div>
                </div>

                {/* Alertas */}
                <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-lg p-6 text-white cursor-pointer hover:shadow-xl transition"
                    onClick={() => navigate('/incidentes')}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-red-100 text-sm">Incidentes Pendientes</p>
                            <p className="text-3xl font-bold mt-2">{kpis.incidentes}</p>
                            <p className="text-red-100 text-xs mt-1">Requieren atención</p>
                        </div>
                        <FiAlertCircle size={48} className="opacity-20" />
                    </div>
                </div>
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Tendencia Financiera */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold mb-4">Tendencia Financiera</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={tendenciaFinanciera}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="mes" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="ingresos" stroke="#10b981" strokeWidth={2} name="Ingresos" />
                            <Line type="monotone" dataKey="gastos" stroke="#ef4444" strokeWidth={2} name="Gastos" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Distribución de Gastos */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold mb-4">Distribución de Gastos</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={distribucionGastos}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {distribucionGastos.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Actividad Reciente */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">Actividad Reciente</h3>
                <div className="space-y-3">
                    {actividadReciente.map((actividad, index) => {
                        const Icon = actividad.icono;
                        return (
                            <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                                <Icon className={`${actividad.color} flex-shrink-0 mt-1`} size={20} />
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900">{actividad.tipo}</p>
                                    <p className="text-sm text-gray-600">{actividad.descripcion}</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {actividad.fecha ? new Date(actividad.fecha).toLocaleString() : 'Fecha no disponible'}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button
                    onClick={() => navigate('/generar-expensas')}
                    className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-center transition"
                >
                    <FiDollarSign className="mx-auto mb-2 text-blue-600" size={24} />
                    <p className="text-sm font-medium text-blue-900">Generar Expensas</p>
                </button>
                <button
                    onClick={() => navigate('/reservas')}
                    className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-center transition"
                >
                    <FiCheckCircle className="mx-auto mb-2 text-green-600" size={24} />
                    <p className="text-sm font-medium text-green-900">Nueva Reserva</p>
                </button>
                <button
                    onClick={() => navigate('/comunicados')}
                    className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-center transition"
                >
                    <FiActivity className="mx-auto mb-2 text-purple-600" size={24} />
                    <p className="text-sm font-medium text-purple-900">Publicar Aviso</p>
                </button>
                <button
                    onClick={() => navigate('/reportes')}
                    className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg text-center transition"
                >
                    <FiTrendingUp className="mx-auto mb-2 text-orange-600" size={24} />
                    <p className="text-sm font-medium text-orange-900">Ver Reportes</p>
                </button>
            </div>
        </div>
    );
};

export default DashboardPage;
