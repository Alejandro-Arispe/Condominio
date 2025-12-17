import React, { useState } from 'react';
import { FiDownload, FiBarChart2, FiPieChart, FiTrendingUp } from 'react-icons/fi';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Select from '../../components/common/Select';
import Alert from '../../components/common/Alert';

const ReportesPage = () => {
  const [tipoReporte, setTipoReporte] = useState('financiero');
  const [periodo, setPeriodo] = useState('mensual');

  const tipoOptions = [
    { value: 'financiero', label: 'Financiero' },
    { value: 'ocupacion', label: 'Ocupación' },
    { value: 'mantenimiento', label: 'Mantenimiento' },
    { value: 'seguridad', label: 'Seguridad' },
    { value: 'reservas', label: 'Reservas' },
  ];

  const periodoOptions = [
    { value: 'diario', label: 'Diario' },
    { value: 'semanal', label: 'Semanal' },
    { value: 'mensual', label: 'Mensual' },
    { value: 'trimestral', label: 'Trimestral' },
    { value: 'anual', label: 'Anual' },
  ];

  const handleExportPDF = () => {
    alert('Exportando a PDF...');
  };

  const handleExportExcel = () => {
    alert('Exportando a Excel...');
  };

  const getReporteContent = () => {
    if (tipoReporte === 'financiero') {
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <p className="text-gray-600 text-sm mb-2">Ingresos</p>
              <p className="text-3xl font-bold text-green-600">$45,230.50</p>
              <p className="text-xs text-gray-500 mt-2">+12% vs mes anterior</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <p className="text-gray-600 text-sm mb-2">Gastos</p>
              <p className="text-3xl font-bold text-red-600">$32,150.00</p>
              <p className="text-xs text-gray-500 mt-2">-5% vs mes anterior</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <p className="text-gray-600 text-sm mb-2">Saldo</p>
              <p className="text-3xl font-bold text-blue-600">$13,080.50</p>
              <p className="text-xs text-gray-500 mt-2">Disponible</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Gastos por Categoría</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Mantenimiento</span>
                    <span className="text-sm font-semibold">35%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '35%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Servicios</span>
                    <span className="text-sm font-semibold">28%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '28%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Seguridad</span>
                    <span className="text-sm font-semibold">22%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-600 h-2 rounded-full" style={{ width: '22%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Otros</span>
                    <span className="text-sm font-semibold">15%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '15%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Evolución de Ingresos</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Enero</span>
                  <span className="font-semibold">$42,500</span>
                </div>
                <div className="flex justify-between">
                  <span>Febrero</span>
                  <span className="font-semibold">$40,300</span>
                </div>
                <div className="flex justify-between">
                  <span>Marzo</span>
                  <span className="font-semibold">$43,100</span>
                </div>
                <div className="flex justify-between">
                  <span>Abril</span>
                  <span className="font-semibold">$45,230</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (tipoReporte === 'ocupacion') {
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <p className="text-gray-600 text-sm mb-2">Total Unidades</p>
              <p className="text-3xl font-bold text-gray-600">45</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <p className="text-gray-600 text-sm mb-2">Ocupadas</p>
              <p className="text-3xl font-bold text-green-600">40</p>
              <p className="text-xs text-gray-500 mt-2">88.9%</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <p className="text-gray-600 text-sm mb-2">Disponibles</p>
              <p className="text-3xl font-bold text-yellow-600">5</p>
              <p className="text-xs text-gray-500 mt-2">11.1%</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <p className="text-gray-600 text-sm mb-2">Residentes</p>
              <p className="text-3xl font-bold text-blue-600">125</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Distribución por Piso</h3>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((piso) => (
                <div key={piso}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Piso {piso}</span>
                    <span className="text-sm font-semibold">{8 + piso}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${8 + piso}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    } else if (tipoReporte === 'mantenimiento') {
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <p className="text-gray-600 text-sm mb-2">Total Solicitudes</p>
              <p className="text-3xl font-bold text-gray-600">156</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <p className="text-gray-600 text-sm mb-2">Completadas</p>
              <p className="text-3xl font-bold text-green-600">142</p>
              <p className="text-xs text-gray-500 mt-2">91%</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <p className="text-gray-600 text-sm mb-2">Pendientes</p>
              <p className="text-3xl font-bold text-red-600">14</p>
              <p className="text-xs text-gray-500 mt-2">9%</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <p className="text-gray-600 text-sm mb-2">Tiempo Promedio</p>
              <p className="text-3xl font-bold text-blue-600">3.2</p>
              <p className="text-xs text-gray-500 mt-2">días</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Por Categoría</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Plomería</span>
                  <span className="font-semibold">45</span>
                </div>
                <div className="flex justify-between">
                  <span>Electricidad</span>
                  <span className="font-semibold">38</span>
                </div>
                <div className="flex justify-between">
                  <span>Carpintería</span>
                  <span className="font-semibold">32</span>
                </div>
                <div className="flex justify-between">
                  <span>Pintura</span>
                  <span className="font-semibold">28</span>
                </div>
                <div className="flex justify-between">
                  <span>Otros</span>
                  <span className="font-semibold">13</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Por Prioridad</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Baja</span>
                  <span className="font-semibold">28</span>
                </div>
                <div className="flex justify-between">
                  <span>Media</span>
                  <span className="font-semibold">85</span>
                </div>
                <div className="flex justify-between">
                  <span>Alta</span>
                  <span className="font-semibold">35</span>
                </div>
                <div className="flex justify-between">
                  <span>Urgente</span>
                  <span className="font-semibold">8</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (tipoReporte === 'seguridad') {
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <p className="text-gray-600 text-sm mb-2">Accesos Registrados</p>
              <p className="text-3xl font-bold text-gray-600">1,245</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <p className="text-gray-600 text-sm mb-2">Incidentes</p>
              <p className="text-3xl font-bold text-red-600">12</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <p className="text-gray-600 text-sm mb-2">Resueltos</p>
              <p className="text-3xl font-bold text-green-600">11</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <p className="text-gray-600 text-sm mb-2">Tiempo Respuesta</p>
              <p className="text-3xl font-bold text-blue-600">45</p>
              <p className="text-xs text-gray-500 mt-2">minutos</p>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <p className="text-gray-600">Reporte en desarrollo</p>
        </div>
      );
    }
  };

  return (
    <div className="p-8 space-y-6">
      <PageHeader
        title="Generar Reportes"
        subtitle="Análisis y reportes del condominio"
      />

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
