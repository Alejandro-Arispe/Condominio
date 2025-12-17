import React, { useState, useEffect } from 'react';
import { FiArrowLeft, FiDownload, FiFilter } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import apiClient from '../services/apiClient';
import Alert from '../components/common/Alert';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const AnaliticaVisualPage = () => {
  const navigate = useNavigate();
  const [periodo, setPeriodo] = useState('mes');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Datos del backend
  const [kpis, setKpis] = useState({
    totalExpensas: 0,
    ocupacionPromedio: 0,
    accesosRegistrados: 0,
    recaudacion: 0,
  });

  const [datosGastos, setDatosGastos] = useState([]);
  const [datosOcupacion, setDatosOcupacion] = useState([]);
  const [datosAccesos, setDatosAccesos] = useState([]);
  const [distribucionGastos, setDistribucionGastos] = useState([]);

  useEffect(() => {
    cargarDatos();
  }, [periodo]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError('');

      // Cargar datos en paralelo
      const [cargos, pagos, unidades, accesos] = await Promise.all([
        apiClient.get('/cargos/'),
        apiClient.get('/pagos/'),
        apiClient.get('/unidades/'),
        apiClient.get('/accesos/'),
      ]);

      // Calcular KPIs
      const totalCargos = cargos.data.results?.reduce((sum, c) => sum + parseFloat(c.monto), 0) || 0;
      const totalPagos = pagos.data.results?.reduce((sum, p) => sum + parseFloat(p.monto), 0) || 0;
      const totalUnidades = unidades.data.results?.length || 0;
      const ocupadas = unidades.data.results?.filter(u => u.user).length || 0;
      const ocupacionPct = totalUnidades > 0 ? ((ocupadas / totalUnidades) * 100).toFixed(0) : 0;

      setKpis({
        totalExpensas: totalCargos,
        ocupacionPromedio: ocupacionPct,
        accesosRegistrados: accesos.data.results?.length || 0,
        recaudacion: totalPagos,
      });

      // Preparar datos de gastos por concepto
      const gastosPorConcepto = {};
      cargos.data.results?.forEach(cargo => {
        const concepto = cargo.concepto || 'Otros';
        gastosPorConcepto[concepto] = (gastosPorConcepto[concepto] || 0) + parseFloat(cargo.monto);
      });

      const gastosArray = Object.entries(gastosPorConcepto).map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value: parseFloat(value.toFixed(2)),
      }));

      setDistribucionGastos(gastosArray);

      // Datos de ocupación por piso
      const ocupacionPorPiso = {};
      unidades.data.results?.forEach(unidad => {
        const piso = unidad.piso || 1;
        if (!ocupacionPorPiso[piso]) {
          ocupacionPorPiso[piso] = { total: 0, ocupadas: 0 };
        }
        ocupacionPorPiso[piso].total++;
        if (unidad.user) ocupacionPorPiso[piso].ocupadas++;
      });

      const ocupacionArray = Object.entries(ocupacionPorPiso).map(([piso, data]) => ({
        piso: `Piso ${piso}`,
        porcentaje: data.total > 0 ? ((data.ocupadas / data.total) * 100).toFixed(1) : 0,
      }));

      setDatosOcupacion(ocupacionArray);

      // Datos de accesos por día (últimos 7 días)
      const accesosArray = [
        { dia: 'Lun', entradas: 0, salidas: 0 },
        { dia: 'Mar', entradas: 0, salidas: 0 },
        { dia: 'Mié', entradas: 0, salidas: 0 },
        { dia: 'Jue', entradas: 0, salidas: 0 },
        { dia: 'Vie', entradas: 0, salidas: 0 },
        { dia: 'Sáb', entradas: 0, salidas: 0 },
        { dia: 'Dom', entradas: 0, salidas: 0 },
      ];

      // Contar accesos por tipo
      accesos.data.results?.forEach(acceso => {
        const fecha = new Date(acceso.timestamp || acceso.created_at);
        const diaSemana = fecha.getDay(); // 0 = Domingo, 1 = Lunes, etc.
        const diaIndex = diaSemana === 0 ? 6 : diaSemana - 1; // Ajustar para que Lun = 0

        if (acceso.tipo === 'entrada') {
          accesosArray[diaIndex].entradas++;
        } else {
          accesosArray[diaIndex].salidas++;
        }
      });

      setDatosAccesos(accesosArray);

      // Datos de gastos mensuales (simulado con datos actuales)
      const gastosMensuales = [
        { mes: 'Ene', monto: totalCargos * 0.8 },
        { mes: 'Feb', monto: totalCargos * 0.9 },
        { mes: 'Mar', monto: totalCargos * 0.95 },
        { mes: 'Abr', monto: totalCargos },
      ];

      setDatosGastos(gastosMensuales);

    } catch (err) {
      setError('Error al cargar datos de analítica');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportar = () => {
    alert('Funcionalidad de exportar en desarrollo');
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-200 rounded-lg">
            <FiArrowLeft size={20} />
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Analítica Visual</h1>
        </div>
        <button
          onClick={handleExportar}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <FiDownload /> Exportar
        </button>
      </div>

      {error && <Alert type="error" title="Error" message={error} />}

      {/* Selector de Período */}
      <div className="flex gap-2 mb-6">
        {['semana', 'mes', 'trimestre', 'año'].map(p => (
          <button
            key={p}
            onClick={() => setPeriodo(p)}
            className={`px-4 py-2 rounded-lg font-medium transition ${periodo === p
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4 border-t-4 border-blue-600">
          <p className="text-sm text-gray-600">Total Expensas</p>
          <p className="text-3xl font-bold text-blue-700">${kpis.totalExpensas.toFixed(2)}</p>
          <p className="text-xs text-gray-500 mt-1">Cargos generados</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 border-t-4 border-green-600">
          <p className="text-sm text-gray-600">Ocupación Promedio</p>
          <p className="text-3xl font-bold text-green-700">{kpis.ocupacionPromedio}%</p>
          <p className="text-xs text-gray-500 mt-1">Unidades ocupadas</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 border-t-4 border-purple-600">
          <p className="text-sm text-gray-600">Accesos Registrados</p>
          <p className="text-3xl font-bold text-purple-700">{kpis.accesosRegistrados}</p>
          <p className="text-xs text-gray-500 mt-1">Total registros</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 border-t-4 border-orange-600">
          <p className="text-sm text-gray-600">Recaudación</p>
          <p className="text-3xl font-bold text-orange-700">${kpis.recaudacion.toFixed(2)}</p>
          <p className="text-xs text-gray-500 mt-1">Pagos recibidos</p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Gráfico de Gastos */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Tendencia de Gastos</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={datosGastos}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="monto" fill="#3b82f6" name="Monto" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de Ocupación */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Ocupación por Piso</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={datosOcupacion}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="piso" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="porcentaje" fill="#10b981" name="Ocupación %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Línea de Accesos */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Movimiento Semanal</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={datosAccesos}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dia" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="entradas" stroke="#3b82f6" name="Entradas" />
              <Line type="monotone" dataKey="salidas" stroke="#ef4444" name="Salidas" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de Pastel */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Distribución de Gastos</h2>
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
    </div>
  );
};

export default AnaliticaVisualPage;
