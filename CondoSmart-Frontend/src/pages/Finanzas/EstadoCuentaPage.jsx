import React, { useState, useEffect } from 'react';
import { FiDownload, FiSearch, FiFilter, FiCheck, FiX } from 'react-icons/fi';
import { cargoService, pagoService } from '../../services/financeService';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Alert from '../../components/common/Alert';
import Select from '../../components/common/Select';

const EstadoCuentaPage = () => {
  const [cargos, setCargos] = useState([]);
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedUsuario, setSelectedUsuario] = useState('');
  const [filterMes, setFilterMes] = useState(
    new Date().toISOString().slice(0, 7)
  );

  const meses = [];
  for (let i = 11; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const value = date.toISOString().slice(0, 7);
    meses.push({
      value,
      label: date.toLocaleDateString('es-ES', {
        month: 'long',
        year: 'numeric',
      }),
    });
  }

  useEffect(() => {
    loadEstadoCuenta();
  }, [filterMes]);

  const loadEstadoCuenta = async () => {
    try {
      setLoading(true);
      const params = { mes: filterMes };
      if (selectedUsuario) {
        params.usuario = selectedUsuario;
      }
      const [cargosRes, pagosRes] = await Promise.all([
        cargoService.list(params),
        pagoService.list(params),
      ]);
      setCargos(cargosRes.data.results || cargosRes.data);
      setPagos(pagosRes.data.results || pagosRes.data);
      setError('');
    } catch (err) {
      setError('Error al cargar estado de cuenta: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const totalCargos = cargos.reduce(
    (sum, cargo) => sum + (parseFloat(cargo.monto) || 0),
    0
  );
  const totalPagos = pagos.reduce(
    (sum, pago) => sum + (parseFloat(pago.monto) || 0),
    0
  );
  const saldo = totalCargos - totalPagos;

  const handleExportarPDF = () => {
    // Aquí se implementaría la exportación a PDF
    alert('Exportar a PDF - Por implementar');
  };

  const handleExportarExcel = () => {
    // Aquí se implementaría la exportación a Excel
    alert('Exportar a Excel - Por implementar');
  };

  return (
    <div className="p-8 space-y-6">
      <PageHeader
        title="Estado de Cuenta"
        subtitle="Resumen de cargos y pagos del condominio"
        action={
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={handleExportarPDF}
              className="flex items-center gap-2"
            >
              <FiDownload size={20} />
              PDF
            </Button>
            <Button
              variant="secondary"
              onClick={handleExportarExcel}
              className="flex items-center gap-2"
            >
              <FiDownload size={20} />
              Excel
            </Button>
          </div>
        }
      />

      {error && <Alert type="error" title="Error" message={error} />}

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Período
            </label>
            <Select
              value={filterMes}
              onChange={(e) => setFilterMes(e.target.value)}
              options={meses}
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Usuario/Unidad
            </label>
            <div className="relative">
              <FiSearch className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Filtrar por usuario..."
                value={selectedUsuario}
                onChange={(e) => setSelectedUsuario(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>
          <Button variant="secondary" onClick={loadEstadoCuenta}>
            <FiFilter size={20} />
          </Button>
        </div>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-gray-600 text-sm font-medium mb-2">Total Cargado</p>
          <p className="text-3xl font-bold text-red-600">
            ${totalCargos.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500 mt-2">{cargos.length} registros</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-gray-600 text-sm font-medium mb-2">Total Pagado</p>
          <p className="text-3xl font-bold text-green-600">
            ${totalPagos.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500 mt-2">{pagos.length} registros</p>
        </div>
        <div
          className={`bg-white rounded-lg shadow-sm p-6 ${
            saldo > 0 ? 'border-l-4 border-red-500' : 'border-l-4 border-green-500'
          }`}
        >
          <p className="text-gray-600 text-sm font-medium mb-2">Saldo</p>
          <p className={`text-3xl font-bold ${saldo > 0 ? 'text-red-600' : 'text-green-600'}`}>
            ${Math.abs(saldo).toFixed(2)}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            {saldo > 0 ? 'A cobrar' : 'A favor'}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-gray-600 text-sm font-medium mb-2">Porcentaje Pago</p>
          <p className="text-3xl font-bold text-blue-600">
            {totalCargos > 0 ? ((totalPagos / totalCargos) * 100).toFixed(1) : '0'}%
          </p>
        </div>
      </div>

      {/* Cargos */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">Cargos</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                  Concepto
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                  Período
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700">
                  Monto
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody>
              {cargos.length > 0 ? (
                cargos.map((cargo) => (
                  <tr
                    key={cargo.id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {cargo.concepto || 'Expensa'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {typeof cargo.usuario === 'object'
                        ? cargo.usuario.username
                        : cargo.usuario}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {cargo.periodo || filterMes}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-red-600 text-right">
                      ${parseFloat(cargo.monto).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                        Por Cobrar
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    No hay cargos registrados para este período
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagos */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">Pagos Recibidos</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                  Método
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                  Fecha
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700">
                  Monto
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody>
              {pagos.length > 0 ? (
                pagos.map((pago) => (
                  <tr
                    key={pago.id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {typeof pago.usuario === 'object'
                        ? pago.usuario.username
                        : pago.usuario}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {pago.metodo}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(pago.fecha).toLocaleDateString('es-ES')}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-green-600 text-right">
                      ${parseFloat(pago.monto).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                          pago.status === 'confirmado'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {pago.status === 'confirmado' ? (
                          <span className="flex items-center gap-1">
                            <FiCheck size={14} />
                            Confirmado
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <FiX size={14} />
                            Pendiente
                          </span>
                        )}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    No hay pagos registrados para este período
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EstadoCuentaPage;
