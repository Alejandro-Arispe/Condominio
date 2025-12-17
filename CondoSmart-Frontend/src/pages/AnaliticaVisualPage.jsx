import React, { useState } from 'react';
import { FiArrowLeft, FiDownload, FiFilter } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const AnaliticaVisualPage = () => {
  const navigate = useNavigate();
  const [periodo, setPeriodo] = useState('mes');

  // Datos de ejemplo
  const datosGastos = [
    { mes: 'Ene', expensas: 1200, servicios: 450, seguros: 300 },
    { mes: 'Feb', expensas: 1300, servicios: 500, seguros: 300 },
    { mes: 'Mar', expensas: 1250, servicios: 480, seguros: 300 },
    { mes: 'Abr', expensas: 1400, servicios: 520, seguros: 300 },
  ];

  const datosOcupacion = [
    { zona: 'Zona A', porcentaje: 95 },
    { zona: 'Zona B', porcentaje: 88 },
    { zona: 'Zona C', porcentaje: 92 },
    { zona: 'Zona D', porcentaje: 85 },
  ];

  const datosAccesos = [
    { dia: 'Lun', entradas: 245, salidas: 230 },
    { dia: 'Mar', entradas: 289, salidas: 275 },
    { dia: 'Mié', entradas: 256, salidas: 248 },
    { dia: 'Jue', entradas: 312, salidas: 305 },
    { dia: 'Vie', entradas: 350, salidas: 340 },
    { dia: 'Sáb', entradas: 120, salidas: 115 },
    { dia: 'Dom', entradas: 90, salidas: 88 },
  ];

  // Componente de gráfico de barras simple
  const BarChart = ({ datos, dataKey, label, maxValue }) => {
    const max = Math.max(...datos.map(d => d[dataKey]));
    return (
      <div className="space-y-3">
        {datos.map(item => (
          <div key={item.mes || item.zona || item.dia}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-700 font-medium">{item.mes || item.zona || item.dia}</span>
              <span className="text-gray-600">{item[dataKey]}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${(item[dataKey] / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Gráfico de línea simple
  const LineChart = ({ datos }) => {
    const maxEntradas = Math.max(...datos.map(d => d.entradas));
    const scale = 300 / maxEntradas;
    
    return (
      <div className="relative h-64 bg-gradient-to-b from-gray-50 to-white rounded-lg p-4">
        <svg className="w-full h-full" viewBox="0 0 700 250" preserveAspectRatio="xMidYMid meet">
          {/* Grilla */}
          {[0, 1, 2, 3, 4].map(i => (
            <line key={`h-${i}`} x1="30" y1={50 + i * 40} x2="680" y2={50 + i * 40} stroke="#e5e7eb" strokeDasharray="5" />
          ))}
          
          {/* Línea de Entradas */}
          <polyline
            points={datos.map((d, i) => `${50 + i * 90},${200 - d.entradas * scale}`).join(' ')}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3"
          />
          
          {/* Línea de Salidas */}
          <polyline
            points={datos.map((d, i) => `${50 + i * 90},${200 - d.salidas * scale}`).join(' ')}
            fill="none"
            stroke="#ef4444"
            strokeWidth="3"
          />
          
          {/* Etiquetas X */}
          {datos.map((d, i) => (
            <text key={`x-${i}`} x={50 + i * 90} y="230" textAnchor="middle" fontSize="12" fill="#666">
              {d.dia}
            </text>
          ))}
          
          {/* Etiquetas Y */}
          {[0, 1, 2, 3, 4].map(i => (
            <text key={`y-${i}`} x="20" y={55 + i * 40} textAnchor="end" fontSize="12" fill="#666">
              {Math.round(maxEntradas * (4 - i) / 4)}
            </text>
          ))}
        </svg>
        <div className="flex justify-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
            <span>Entradas</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-600 rounded-full"></div>
            <span>Salidas</span>
          </div>
        </div>
      </div>
    );
  };

  // Gráfico de pastel simple
  const PieChart = ({ datos }) => {
    const total = Object.values(datos).reduce((a, b) => a + b, 0);
    const colores = ['#3b82f6', '#10b981', '#f59e0b'];
    const labels = Object.keys(datos);
    
    let startAngle = 0;
    const slices = labels.map((label, idx) => {
      const valor = datos[label];
      const sliceAngle = (valor / total) * 360;
      const [x1, y1] = [
        100 + 80 * Math.cos((startAngle * Math.PI) / 180),
        100 + 80 * Math.sin((startAngle * Math.PI) / 180)
      ];
      const [x2, y2] = [
        100 + 80 * Math.cos(((startAngle + sliceAngle) * Math.PI) / 180),
        100 + 80 * Math.sin(((startAngle + sliceAngle) * Math.PI) / 180)
      ];
      
      const largeArc = sliceAngle > 180 ? 1 : 0;
      const path = `M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`;
      
      startAngle += sliceAngle;
      
      return (
        <path key={label} d={path} fill={colores[idx]} opacity="0.8" />
      );
    });
    
    return (
      <div className="flex flex-col items-center">
        <svg width="200" height="200" viewBox="0 0 200 200">
          {slices}
        </svg>
        <div className="space-y-2 mt-4">
          {labels.map((label, idx) => (
            <div key={label} className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colores[idx] }}></div>
              <span className="text-gray-700">{label}: ${datos[label]}</span>
            </div>
          ))}
        </div>
      </div>
    );
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
        <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
          <FiDownload /> Exportar
        </button>
      </div>

      {/* Selector de Período */}
      <div className="flex gap-2 mb-6">
        {['semana', 'mes', 'trimestre', 'año'].map(p => (
          <button
            key={p}
            onClick={() => setPeriodo(p)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              periodo === p
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
          <p className="text-3xl font-bold text-blue-700">$5,150</p>
          <p className="text-xs text-gray-500 mt-1">+2.5% vs mes anterior</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 border-t-4 border-green-600">
          <p className="text-sm text-gray-600">Ocupación Promedio</p>
          <p className="text-3xl font-bold text-green-700">90%</p>
          <p className="text-xs text-gray-500 mt-1">4 zonas monitoreadas</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 border-t-4 border-purple-600">
          <p className="text-sm text-gray-600">Accesos Registrados</p>
          <p className="text-3xl font-bold text-purple-700">1,852</p>
          <p className="text-xs text-gray-500 mt-1">Esta semana</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 border-t-4 border-orange-600">
          <p className="text-sm text-gray-600">Recaudación</p>
          <p className="text-3xl font-bold text-orange-700">$51,500</p>
          <p className="text-xs text-gray-500 mt-1">98% de cobranza</p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Gráfico de Gastos */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Tendencia de Gastos</h2>
          <BarChart datos={datosGastos} dataKey="expensas" label="Expensas" />
        </div>

        {/* Gráfico de Ocupación */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Ocupación por Zona</h2>
          <BarChart datos={datosOcupacion} dataKey="porcentaje" label="Porcentaje" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Línea de Accesos */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Movimiento Semanal</h2>
          <LineChart datos={datosAccesos} />
        </div>

        {/* Gráfico de Pastel */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Distribución de Gastos</h2>
          <PieChart datos={{ 'Expensas': 5200, 'Servicios': 1950, 'Seguros': 900 }} />
        </div>
      </div>
    </div>
  );
};

export default AnaliticaVisualPage;
