import React, { useEffect, useState } from 'react';
import { useAuth } from '../utils/hooks';
import { FiHome, FiUsers, FiDollarSign, FiCalendar, FiShield } from 'react-icons/fi';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUnits: 0,
    totalResidents: 0,
    pendingPayments: 0,
    upcomingReservations: 0,
    recentAccess: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const API_URL = 'http://localhost:8000/api/v1';

      // Simular datos hasta que los endpoints estén listos
      const mockStats = {
        totalUnits: 45,
        totalResidents: 125,
        pendingPayments: 8,
        upcomingReservations: 12,
        totalVehicles: 62,
        recentAccess: [
          { id: 1, type: 'entrada', person: 'Juan Pérez', time: '14:30', unit: 'A-101' },
          { id: 2, type: 'salida', person: 'María García', time: '14:15', unit: 'B-205' },
          { id: 3, type: 'entrada', person: 'Carlos López', time: '14:00', unit: 'A-305' },
        ],
      };

      setStats(mockStats);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Cargando datos...</div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Unidades',
      value: stats.totalUnits,
      icon: FiHome,
      color: 'blue',
    },
    {
      title: 'Residentes',
      value: stats.totalResidents,
      icon: FiUsers,
      color: 'green',
    },
    {
      title: 'Pagos Pendientes',
      value: stats.pendingPayments,
      icon: FiDollarSign,
      color: 'red',
    },
    {
      title: 'Reservas Próximas',
      value: stats.upcomingReservations,
      icon: FiCalendar,
      color: 'purple',
    },
    {
      title: 'Vehículos Registrados',
      value: stats.totalVehicles,
      icon: FiShield,
      color: 'yellow',
    },
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600 border-blue-200',
      green: 'bg-green-50 text-green-600 border-green-200',
      red: 'bg-red-50 text-red-600 border-red-200',
      purple: 'bg-purple-50 text-purple-600 border-purple-200',
      yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200',
    };
    return colors[color];
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Bienvenido, {user?.username || user?.email.split('@')[0]}
        </h1>
        <p className="text-gray-600 mt-2">
          Panel de control de CondoSmart - {new Date().toLocaleDateString('es-ES')}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className={`${getColorClasses(stat.color)} rounded-lg border p-6 shadow-sm hover:shadow-md transition`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium opacity-75">{stat.title}</p>
                  <p className="text-3xl font-bold mt-2">{stat.value}</p>
                </div>
                <Icon className="text-4xl opacity-20" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Access */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Accesos Recientes</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Persona</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Tipo</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Unidad</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Hora</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {stats.recentAccess.map((access) => (
                  <tr key={access.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-900">{access.person}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          access.type === 'entrada'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {access.type === 'entrada' ? '🟢 Entrada' : '🔵 Salida'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{access.unit}</td>
                    <td className="px-4 py-3 text-gray-600">{access.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Estado Rápido</h2>

          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm font-medium text-blue-900">Financiero</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">
                ${(stats.pendingPayments * 1500).toLocaleString()}
              </p>
              <p className="text-xs text-blue-700 mt-1">en deudas</p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm font-medium text-green-900">Ocupación</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {((stats.totalResidents / (stats.totalUnits * 2.5)) * 100).toFixed(0)}%
              </p>
              <p className="text-xs text-green-700 mt-1">tasa de ocupación</p>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <p className="text-sm font-medium text-purple-900">Seguridad</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">100%</p>
              <p className="text-xs text-purple-700 mt-1">cámaras funcionales</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
