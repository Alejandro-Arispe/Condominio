import React, { useState, useEffect } from 'react';
import { FiDownload, FiBarChart2, FiPieChart, FiTrendingUp } from 'react-icons/fi';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Select from '../../components/common/Select';
import Alert from '../../components/common/Alert';
import apiClient from '../../services/apiClient';
import { exportarReportePDF, exportarReporteExcel } from '../../utils/exportReportes';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

const ReportesPage = () => {
  const [tipoReporte, setTipoReporte] = useState('financiero');
  const [periodo, setPeriodo] = useState('mensual');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Datos reales del backend
  const [datosFinancieros, setDatosFinancieros] = useState(null);
  const [datosOcupacion, setDatosOcupacion] = useState(null);
  const [datosMantenimiento, setDatosMantenimiento] = useState(null);
  const [datosSeguridad, setDatosSeguridad] = useState(null);

  const tipoOptions = [
    { value: 'financiero', label: 'Financiero' },
    { value: 'ocupacion', label: 'Ocupación' },
    { value: 'mantenimiento', label: 'Mantenimiento' },
    { value: 'seguridad', label: 'Seguridad' },
  ];

  const periodoOptions = [
    { value: 'mensual', label: 'Mensual' },
    { value: 'trimestral', label: 'Trimestral' },
    { value: 'anual', label: 'Anual' },
  ];

  useEffect(() => {
    cargarDatos();
  }, [tipoReporte]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError('');

      if (tipoReporte === 'financiero') {
        const [cargos, pagos] = await Promise.all([
          apiClient.get('/cargos/'),
          apiClient.get('/pagos/'),
        ]);

        const totalCargos = cargos.data.results?.reduce((sum, c) => sum + parseFloat(c.monto), 0) || 0;
        const totalPagos = pagos.data.results?.reduce((sum, p) => sum + parseFloat(p.monto), 0) || 0;
        const pendientes = cargos.data.results?.filter(c => c.estado === 'pendiente').reduce((sum, c) => sum + parseFloat(c.monto), 0) || 0;

        setDatosFinancieros({
          ingresos: totalPagos,
          gastos: totalCargos,
          saldo: totalPagos - totalCargos,
          pendientes,
          cargos: cargos.data.results || [],
          pagos: pagos.data.results || [],
        });
      } else if (tipoReporte === 'ocupacion') {
        const [unidades, ocupantes] = await Promise.all([
          apiClient.get('/unidades/'),
          apiClient.get('/ocupantes/'),
        ]);

        const totalUnidades = unidades.data.results?.length || 0;
        const ocupadas = unidades.data.results?.filter(u => u.user).length || 0;
        const totalOcupantes = ocupantes.data.results?.length || 0;

        setDatosOcupacion({
          total: totalUnidades,
          ocupadas,
          disponibles: totalUnidades - ocupadas,
          residentes: totalOcupantes,
          porcentaje: totalUnidades > 0 ? ((ocupadas / totalUnidades) * 100).toFixed(1) : 0,
        });
      } else if (tipoReporte === 'mantenimiento') {
        const tickets = await apiClient.get('/tickets/');

        const total = tickets.data.results?.length || 0;
        const completados = tickets.data.results?.filter(t => t.status === 'completada').length || 0;
        const pendientes = tickets.data.results?.filter(t => t.status === 'pendiente').length || 0;

        setDatosMantenimiento({
          total,
          completados,
          pendientes,
          porcentaje: total > 0 ? ((completados / total) * 100).toFixed(0) : 0,
          tickets: tickets.data.results || [],
        });
      } else if (tipoReporte === 'seguridad') {
        const [accesos, incidentes] = await Promise.all([
          apiClient.get('/accesos/'),
          apiClient.get('/incidentes/'),
        ]);

        setDatosSeguridad({
          totalAccesos: accesos.data.results?.length || 0,
          totalIncidentes: incidentes.data.results?.length || 0,
          resueltos: incidentes.data.results?.filter(i => i.status === 'resuelto').length || 0,
          accesos: accesos.data.results || [],
          incidentes: incidentes.data.results || [],
        });
      }
    } catch (err) {
      setError('Error al cargar datos del reporte');
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = () => {
    let datos = null;

    if (tipoReporte === 'financiero' && datosFinancieros) {
      datos = datosFinancieros;
    } else if (tipoReporte === 'ocupacion' && datosOcupacion) {
      datos = datosOcupacion;
    } else if (tipoReporte === 'mantenimiento' && datosMantenimiento) {
      datos = datosMantenimiento;
    } else if (tipoReporte === 'seguridad' && datosSeguridad) {
      datos = datosSeguridad;
    }

    if (datos) {
      exportarReportePDF(tipoReporte, datos, periodo);
    } else {
      alert('No hay datos disponibles para exportar');
    }
  };

  const handleExportExcel = () => {
    let datos = null;

    if (tipoReporte === 'financiero' && datosFinancieros) {
      datos = datosFinancieros;
    } else if (tipoReporte === 'ocupacion' && datosOcupacion) {
      datos = datosOcupacion;
    } else if (tipoReporte === 'mantenimiento' && datosMantenimiento) {
      datos = datosMantenimiento;
    } else if (tipoReporte === 'seguridad' && datosSeguridad) {
      datos = datosSeguridad;
    }

    if (datos) {
      exportarReporteExcel(tipoReporte, datos);
    } else {
      alert('No hay datos disponibles para exportar');
    }
  };

  const getReporteContent = () => {
    if (loading) {
      return <div className="bg-white rounded-lg shadow-sm p-8 text-center">Cargando datos...</div>;
    }

    if (tipoReporte === 'financiero' && datosFinancieros) {
      const chartData = [
        { name: 'Ingresos', value: datosFinancieros.ingresos },
        { name: 'Gastos', value: datosFinancieros.gastos },
        { name: 'Pendientes', value: datosFinancieros.pendientes },
      ];

      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <p className="text-gray-600 text-sm mb-2">Ingresos (Pagos)</p>
              <p className="text-3xl font-bold text-green-600">${datosFinancieros.ingresos.toFixed(2)}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <p className="text-gray-600 text-sm mb-2">Gastos (Cargos)</p>
              <p className="text-3xl font-bold text-red-600">${datosFinancieros.gastos.toFixed(2)}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <p className="text-gray-600 text-sm mb-2">Saldo</p>
              <p className={`text-3xl font-bold ${datosFinancieros.saldo >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                ${datosFinancieros.saldo.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Distribución Financiera</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      );
    } else if (tipoReporte === 'ocupacion' && datosOcupacion) {
      const chartData = [
        { name: 'Ocupadas', value: datosOcupacion.ocupadas },
        { name: 'Disponibles', value: datosOcupacion.disponibles },
      ];

      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <p className="text-gray-600 text-sm mb-2">Total Unidades</p>
              <p className="text-3xl font-bold text-gray-600">{datosOcupacion.total}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <p className="text-gray-600 text-sm mb-2">Ocupadas</p>
              <p className="text-3xl font-bold text-green-600">{datosOcupacion.ocupadas}</p>
              <p className="text-xs text-gray-500 mt-2">{datosOcupacion.porcentaje}%</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <p className="text-gray-600 text-sm mb-2">Disponibles</p>
              <p className="text-3xl font-bold text-yellow-600">{datosOcupacion.disponibles}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <p className="text-gray-600 text-sm mb-2">Residentes</p>
              <p className="text-3xl font-bold text-blue-600">{datosOcupacion.residentes}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Distribución de Ocupación</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      );
    } else if (tipoReporte === 'mantenimiento' && datosMantenimiento) {
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <p className="text-gray-600 text-sm mb-2">Total Solicitudes</p>
              <p className="text-3xl font-bold text-gray-600">{datosMantenimiento.total}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <p className="text-gray-600 text-sm mb-2">Completadas</p>
              <p className="text-3xl font-bold text-green-600">{datosMantenimiento.completados}</p>
              <p className="text-xs text-gray-500 mt-2">{datosMantenimiento.porcentaje}%</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <p className="text-gray-600 text-sm mb-2">Pendientes</p>
              <p className="text-3xl font-bold text-red-600">{datosMantenimiento.pendientes}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <p className="text-gray-600 text-sm mb-2">Tasa de Éxito</p>
              <p className="text-3xl font-bold text-blue-600">{datosMantenimiento.porcentaje}%</p>
            </div>
          </div>
        </div>
      );
    } else if (tipoReporte === 'seguridad' && datosSeguridad) {
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <p className="text-gray-600 text-sm mb-2">Accesos Registrados</p>
              <p className="text-3xl font-bold text-gray-600">{datosSeguridad.totalAccesos}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <p className="text-gray-600 text-sm mb-2">Incidentes</p>
              <p className="text-3xl font-bold text-red-600">{datosSeguridad.totalIncidentes}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <p className="text-gray-600 text-sm mb-2">Resueltos</p>
              <p className="text-3xl font-bold text-green-600">{datosSeguridad.resueltos}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <p className="text-gray-600 text-sm mb-2">Tasa Resolución</p>
              <p className="text-3xl font-bold text-blue-600">
                {datosSeguridad.totalIncidentes > 0
                  ? ((datosSeguridad.resueltos / datosSeguridad.totalIncidentes) * 100).toFixed(0)
                  : 0}%
              </p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <p className="text-gray-600">Selecciona un tipo de reporte</p>
      </div>
    );
  };

  return (
    <div className="p-8 space-y-6">
      <PageHeader
        title="Generar Reportes"
        subtitle="Análisis y reportes del condominio con datos reales"
      />

      {error && <Alert type="error" title="Error" message={error} />}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Reporte
          </label>
          <Select
            value={tipoReporte}
            onChange={(e) => setTipoReporte(e.target.value)}
            options={tipoOptions}
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Período
          </label>
          <Select
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
            options={periodoOptions}
          />
        </div>
        <div className="flex items-end gap-2">
          <Button
            variant="secondary"
            onClick={handleExportPDF}
            className="flex items-center gap-2 flex-1"
          >
            <FiDownload size={18} />
            PDF
          </Button>
        </div>
        <div className="flex items-end gap-2">
          <Button
            variant="secondary"
            onClick={handleExportExcel}
            className="flex items-center gap-2 flex-1"
          >
            <FiDownload size={18} />
            Excel
          </Button>
        </div>
      </div>

      {getReporteContent()}
    </div>
  );
};

export default ReportesPage;
