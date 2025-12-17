import React, { useState, useEffect } from 'react';
import { FiDollarSign } from 'react-icons/fi';
import PageHeader from '../../components/common/PageHeader';
import Alert from '../../components/common/Alert';
import { cargoService, pagoService } from '../../services/financeService';

const EstadoCuentaPage = () => {
  const [cargos, setCargos] = useState([]);
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

  useEffect(() => {
    loadData();
  }, [selectedMonth]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [cargosRes, pagosRes] = await Promise.all([
        cargoService.list({ mes: selectedMonth }),
        pagoService.list({ mes: selectedMonth }),
      ]);
      setCargos(cargosRes.data.results || cargosRes.data);
      setPagos(pagosRes.data.results || pagosRes.data);
    } catch (err) {
      setError('Error al cargar estado de cuenta');
    } finally {
      setLoading(false);
    }
  };

  const totalCargos = cargos.reduce((sum, c) => sum + parseFloat(c.monto || 0), 0);
  const totalPagos = pagos.reduce((sum, p) => sum + parseFloat(p.monto || 0), 0);
  const saldo = totalCargos - totalPagos;

  return (
    <div className="p-8 space-y-6">
      <PageHeader
        title="Estado de Cuenta"
        subtitle="Consulta tu estado de cuenta y pagos"
      />

      {error && <Alert type="error" title="Error" message={error} />}

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Seleccionar Mes
          </label>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-6">
            <div className="flex items-center gap-3">
              <FiDollarSign className="text-blue-600" size={32} />
              <div>
                <p className="text-sm text-gray-600">Total Cargos</p>
                <p className="text-2xl font-bold text-blue-600">
                  ${totalCargos.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-6">
            <div className="flex items-center gap-3">
              <FiDollarSign className="text-green-600" size={32} />
              <div>
                <p className="text-sm text-gray-600">Total Pagos</p>
                <p className="text-2xl font-bold text-green-600">
                  ${totalPagos.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className={`${saldo > 0 ? 'bg-red-50' : 'bg-gray-50'} rounded-lg p-6`}>
            <div className="flex items-center gap-3">
              <FiDollarSign className={saldo > 0 ? 'text-red-600' : 'text-gray-600'} size={32} />
              <div>
                <p className="text-sm text-gray-600">Saldo</p>
                <p className={`text-2xl font-bold ${saldo > 0 ? 'text-red-600' : 'text-gray-600'}`}>
                  ${Math.abs(saldo).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Cargos</h3>
            <div className="space-y-2">
              {cargos.length === 0 ? (
                <p className="text-gray-500 text-sm">No hay cargos en este período</p>
              ) : (
                cargos.map((cargo) => (
                  <div key={cargo.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium">{cargo.concepto}</p>
                      <p className="text-sm text-gray-600">{cargo.descripcion}</p>
                    </div>
                    <p className="font-bold text-red-600">${parseFloat(cargo.monto).toFixed(2)}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Pagos</h3>
            <div className="space-y-2">
              {pagos.length === 0 ? (
                <p className="text-gray-500 text-sm">No hay pagos en este período</p>
              ) : (
                pagos.map((pago) => (
                  <div key={pago.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium">{pago.metodo}</p>
                      <p className="text-sm text-gray-600">
                        {pago.fecha ? new Date(pago.fecha).toLocaleDateString() : '-'}
                      </p>
                    </div>
                    <p className="font-bold text-green-600">${parseFloat(pago.monto).toFixed(2)}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstadoCuentaPage;
