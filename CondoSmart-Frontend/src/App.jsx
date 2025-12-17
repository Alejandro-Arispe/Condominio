import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/MainLayout';
// Módulo Vivienda
import UnidadesPage from './pages/Vivienda/UnidadesPage';
import OcupantesPage from './pages/Vivienda/OcupantesPage';
import VehiculosPage from './pages/Vivienda/VehiculosPage';
import MascotasPage from './pages/Vivienda/MascotasPage';
import UnidadInfoPage from './pages/UnidadInfoPage';
// Módulo Finanzas
import GastosPage from './pages/Finanzas/GastosPage';
import PagosPage from './pages/Finanzas/PagosPage';
import EstadoCuentaPage from './pages/Finanzas/EstadoCuentaPage';
// Módulo Seguridad
import AccesosPage from './pages/Seguridad/AccesosPage';
import IncidentesPage from './pages/Seguridad/IncidentesPage';
// Otros
import ChangePasswordPage from './pages/ChangePasswordPage';
import GestionarUsuariosPage from './pages/GestionarUsuariosPage';
// Módulo Reservas
import ReservasPage from './pages/Reservas/ReservasPage';
// Módulo Comunicación
import ComunicadosPage from './pages/Comunicacion/ComunicadosPage';
// Módulo Servicios
import MantenimientoPage from './pages/Servicios/MantenimientoPage';
// Módulo Reportes
import ReportesPage from './pages/Reportes/ReportesPage';
// Nuevas páginas
import ReconocimientoFacialPage from './pages/ReconocimientoFacialPage';
import ReconocimientoPlacasPage from './pages/ReconocimientoPlacasPage';
import DeteccionAnomaliasPage from './pages/DeteccionAnomaliasPage';
import AnaliticaPredictiva from './pages/AnaliticaPredictiva';
import DashboardPage from './pages/DashboardPage';
import PagoEnLineaPage from './pages/PagoEnLineaPage';
import ConfigurarAreasComunesPage from './pages/ConfigurarAreasComunesPage';
import CicloVidaReservasPage from './pages/CicloVidaReservasPage';
import GestionarDepositosPage from './pages/GestionarDepositosPage';
import ConfigurarExpensasPage from './pages/ConfigurarExpensasPage';
import GenerarExpensasPage from './pages/GenerarExpensasPage';
import RealizarPagoPage from './pages/RealizarPagoPage';
import ProgramarServiciosPage from './pages/ProgramarServiciosPage';
import RegistrarEjecucionPage from './pages/RegistrarEjecucionPage';
import HistorialAccesosPage from './pages/HistorialAccesosPage';
import AnaliticaVisualPage from './pages/AnaliticaVisualPage';
import ReporteLecturaPage from './pages/ReporteLecturaPage';
import './index.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route
                path="/dashboard"
                element={
                  <MainLayout>
                    <DashboardPage />
                  </MainLayout>
                }
              />

              {/* Vivienda Module */}
              <Route
                path="/unidades"
                element={
                  <MainLayout>
                    <UnidadesPage />
                  </MainLayout>
                }
              />
              <Route
                path="/ocupantes"
                element={
                  <MainLayout>
                    <OcupantesPage />
                  </MainLayout>
                }
              />
              <Route
                path="/vehiculos"
                element={
                  <MainLayout>
                    <VehiculosPage />
                  </MainLayout>
                }
              />
              <Route
                path="/mascotas"
                element={
                  <MainLayout>
                    <MascotasPage />
                  </MainLayout>
                }
              />
              <Route
                path="/informacion-unidad"
                element={
                  <MainLayout>
                    <UnidadInfoPage />
                  </MainLayout>
                }
              />

              {/* Seguridad Module */}
              <Route
                path="/accesos"
                element={
                  <MainLayout>
                    <AccesosPage />
                  </MainLayout>
                }
              />
              <Route
                path="/reconocimiento"
                element={
                  <MainLayout>
                    <ReconocimientoFacialPage />
                  </MainLayout>
                }
              />
              <Route
                path="/reconocimiento-placas"
                element={
                  <MainLayout>
                    <ReconocimientoPlacasPage />
                  </MainLayout>
                }
              />
              <Route
                path="/deteccion-anomalias"
                element={
                  <MainLayout>
                    <DeteccionAnomaliasPage />
                  </MainLayout>
                }
              />
              <Route
                path="/analitica-predictiva"
                element={
                  <MainLayout>
                    <AnaliticaPredictiva />
                  </MainLayout>
                }
              />
              <Route
                path="/incidentes"
                element={
                  <MainLayout>
                    <IncidentesPage />
                  </MainLayout>
                }
              />
              <Route
                path="/historial-accesos"
                element={
                  <MainLayout>
                    <HistorialAccesosPage />
                  </MainLayout>
                }
              />

              {/* Reservas Module */}
              <Route
                path="/areas-comunes"
                element={
                  <MainLayout>
                    <ConfigurarAreasComunesPage />
                  </MainLayout>
                }
              />
              <Route
                path="/reservas"
                element={
                  <MainLayout>
                    <ReservasPage />
                  </MainLayout>
                }
              />
              <Route
                path="/ciclo-reservas"
                element={
                  <MainLayout>
                    <CicloVidaReservasPage />
                  </MainLayout>
                }
              />
              <Route
                path="/depositos"
                element={
                  <MainLayout>
                    <GestionarDepositosPage />
                  </MainLayout>
                }
              />

              {/* Finanzas Module */}
              <Route
                path="/configurar-expensas"
                element={
                  <MainLayout>
                    <ConfigurarExpensasPage />
                  </MainLayout>
                }
              />
              <Route
                path="/generar-expensas"
                element={
                  <MainLayout>
                    <GenerarExpensasPage />
                  </MainLayout>
                }
              />
              <Route
                path="/estado-cuenta"
                element={
                  <MainLayout>
                    <EstadoCuentaPage />
                  </MainLayout>
                }
              />
              <Route
                path="/historial-pagos"
                element={
                  <MainLayout>
                    <PagosPage />
                  </MainLayout>
                }
              />
              <Route
                path="/realizar-pago"
                element={
                  <MainLayout>
                    <RealizarPagoPage />
                  </MainLayout>
                }
              />
              <Route
                path="/pago-en-linea"
                element={
                  <MainLayout>
                    <PagoEnLineaPage />
                  </MainLayout>
                }
              />
              <Route
                path="/cambiar-contraseña"
                element={
                  <MainLayout>
                    <ChangePasswordPage />
                  </MainLayout>
                }
              />

              {/* Comunicación Module */}
              <Route
                path="/comunicados"
                element={
                  <MainLayout>
                    <ComunicadosPage />
                  </MainLayout>
                }
              />

              {/* Servicios Module */}
              <Route
                path="/programar-servicios"
                element={
                  <MainLayout>
                    <ProgramarServiciosPage />
                  </MainLayout>
                }
              />
              <Route
                path="/registrar-ejecucion"
                element={
                  <MainLayout>
                    <RegistrarEjecucionPage />
                  </MainLayout>
                }
              />
              <Route
                path="/solicitar-mantenimiento"
                element={
                  <MainLayout>
                    <MantenimientoPage />
                  </MainLayout>
                }
              />

              {/* Reportes Module */}
              <Route
                path="/reportes"
                element={
                  <MainLayout>
                    <ReportesPage />
                  </MainLayout>
                }
              />
              <Route
                path="/analitica"
                element={
                  <MainLayout>
                    <AnaliticaVisualPage />
                  </MainLayout>
                }
              />

              {/* Usuarios Module */}
              <Route
                path="/usuarios"
                element={
                  <MainLayout>
                    <GestionarUsuariosPage />
                  </MainLayout>
                }
              />
              <Route
                path="/reporte-lectura"
                element={
                  <MainLayout>
                    <ReporteLecturaPage />
                  </MainLayout>
                }
              />
            </Route>
          </Routes>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
