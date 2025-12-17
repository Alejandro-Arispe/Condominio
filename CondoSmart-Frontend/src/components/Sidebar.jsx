import React, { useState } from 'react';
import {
  FiChevronDown, FiLogOut, FiMenu, FiX, FiLock, FiHome,
  FiCalendar, FiDollarSign, FiMessageSquare, FiTool,
  FiBarChart2, FiShield
} from 'react-icons/fi';
import { useAuth } from '../utils/hooks';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState({});
  const [mobileOpen, setMobileOpen] = useState(false);

  const packages = [
    {
      id: 'auth',
      name: 'Autenticación y Acceso',
      icon: FiLock,
      items: [
        { id: 'login', name: 'Iniciar Sesión', path: '/login' },
        { id: 'users', name: 'Gestionar Usuarios', path: '/usuarios' },
        { id: 'change-password', name: 'Cambiar Contraseña', path: '/cambiar-contraseña' },
      ],
    },
    {
      id: 'housing',
      name: 'Vivienda',
      icon: FiHome,
      items: [
        { id: 'units', name: 'Administrar Unidades', path: '/unidades' },
        { id: 'residents', name: 'Ocupantes', path: '/ocupantes' },
        { id: 'vehicles', name: 'Gestionar Vehículos', path: '/vehiculos' },
        { id: 'pets', name: 'Gestionar Mascotas', path: '/mascotas' },
        { id: 'unit-info', name: 'Información de Unidad', path: '/informacion-unidad' },
      ],
    },
    {
      id: 'security',
      name: 'Seguridad',
      icon: FiShield,
      items: [
        { id: 'accesses', name: 'Gestionar Accesos y Visitas', path: '/accesos' },
        { id: 'facial-recognition', name: 'Reconocimiento Facial', path: '/reconocimiento' },
        { id: 'plate-recognition', name: 'Reconocimiento de Placas (OCR)', path: '/reconocimiento-placas' },
        { id: 'anomaly-detection', name: 'Detección de Anomalías', path: '/deteccion-anomalias' },
        { id: 'alerts', name: 'Alertas e Incidentes', path: '/incidentes' },
        { id: 'access-history', name: 'Historial de Accesos', path: '/historial-accesos' },
      ],
    },
    {
      id: 'reservations',
      name: 'Reservas',
      icon: FiCalendar,
      items: [
        { id: 'areas', name: 'Configurar Áreas Comunes', path: '/areas-comunes' },
        { id: 'booking', name: 'Realizar Reservas', path: '/reservas' },
        { id: 'reservation-lifecycle', name: 'Ciclo de Vida de Reservas', path: '/ciclo-reservas' },
        { id: 'deposits', name: 'Gestionar Depósitos', path: '/depositos' },
      ],
    },
    {
      id: 'finance',
      name: 'Finanzas',
      icon: FiDollarSign,
      items: [
        { id: 'expenses-config', name: 'Configurar Expensas', path: '/configurar-expensas' },
        { id: 'generate-expenses', name: 'Generar Expensas', path: '/generar-expensas' },
        { id: 'account-status', name: 'Estado de Cuenta', path: '/estado-cuenta' },
        { id: 'payment-history', name: 'Historial de Pagos', path: '/historial-pagos' },
        { id: 'make-payment', name: 'Realizar Pago', path: '/realizar-pago' },
      ],
    },
    {
      id: 'communication',
      name: 'Comunicación',
      icon: FiMessageSquare,
      items: [
        { id: 'broadcast', name: 'Enviar Comunicados', path: '/comunicados' },
        { id: 'read-report', name: 'Reporte de Lectura', path: '/reporte-lectura' },
      ],
    },
    {
      id: 'services',
      name: 'Servicios y Mantenimiento',
      icon: FiTool,
      items: [
        { id: 'program-services', name: 'Programar Servicios', path: '/programar-servicios' },
        { id: 'register-execution', name: 'Registrar Ejecución', path: '/registrar-ejecucion' },
        { id: 'maintenance-request', name: 'Solicitar Mantenimiento', path: '/solicitar-mantenimiento' },
      ],
    },
    {
      id: 'reports',
      name: 'Reportes y Analítica',
      icon: FiBarChart2,
      items: [
        { id: 'generate-reports', name: 'Generar Reportes', path: '/reportes' },
        { id: 'analytics', name: 'Analítica Visual', path: '/analitica' },
        { id: 'predictive', name: 'Analítica Predictiva (IA)', path: '/analitica-predictiva' },
        { id: 'payment-online', name: 'Pago en Línea', path: '/pago-en-linea' },
      ],
    },
  ];

  const toggleExpand = (id) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleNavigate = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
        <h2 className="text-white text-2xl font-bold">CondoSmart</h2>
        <p className="text-blue-100 text-xs mt-1">Gestión de Condominios</p>
      </div>

      {/* User Info */}
      {user && (
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <p className="text-sm font-medium text-gray-800">{user.username || user.email}</p>
          <p className="text-xs text-gray-600 mt-1">{user.email}</p>
        </div>
      )}

      {/* Navigation Packages */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {packages.map((pkg) => (
          <div key={pkg.id} className="space-y-1">
            {/* Package Header */}
            <button
              onClick={() => toggleExpand(pkg.id)}
              className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-blue-50 transition text-left font-medium text-gray-800"
            >
              <span className="text-sm flex items-center gap-2">
                {pkg.icon && <pkg.icon size={18} className="text-blue-600" />}
                {pkg.name}
              </span>
              <FiChevronDown
                className={`transition-transform ${expanded[pkg.id] ? 'rotate-180' : ''
                  }`}
              />
            </button>

            {/* Package Items */}
            {expanded[pkg.id] && (
              <div className="space-y-1 pl-4">
                {pkg.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavigate(item.path)}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-100 rounded-lg transition"
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition"
        >
          <FiLogOut className="text-lg" />
          Cerrar Sesión
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-80 bg-white border-r border-gray-200 shadow-lg">
        {sidebarContent}
      </aside>

      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 bg-blue-600 text-white rounded-lg shadow-lg"
        >
          {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden">
          <aside className="w-72 bg-white h-full shadow-xl">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
};

export default Sidebar;
