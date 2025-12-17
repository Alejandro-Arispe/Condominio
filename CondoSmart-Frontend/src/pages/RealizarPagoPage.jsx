import React, { useState } from 'react';
import PageHeader from '../components/common/PageHeader';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import FormGroup from '../components/common/FormGroup';
import Input from '../components/common/Input';
import { pagoService } from '../services/financeService';

const RealizarPagoPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    unidad: '',
    monto: '',
    metodo: 'transferencia',
    comprobante: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      await pagoService.create(formData);
      setSuccess('Pago registrado correctamente');
      setFormData({
        unidad: '',
        monto: '',
        metodo: 'transferencia',
        comprobante: '',
      });
    } catch (err) {
      setError('Error al procesar el pago');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-6">
      <PageHeader
        title="Realizar Pago"
        subtitle="Registra un nuevo pago"
      />

      {error && <Alert type="error" title="Error" message={error} />}
      {success && <Alert type="success" title="Éxito" message={success} />}

      <div className="bg-white rounded-lg shadow-sm p-8 max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormGroup label="ID de Unidad" required>
            <Input
              name="unidad"
              type="number"
              value={formData.unidad}
              onChange={handleInputChange}
              placeholder="Ingrese el ID de su unidad"
            />
          </FormGroup>

          <FormGroup label="Monto a Pagar" required>
            <Input
              name="monto"
              type="number"
              step="0.01"
              value={formData.monto}
              onChange={handleInputChange}
              placeholder="0.00"
            />
          </FormGroup>

          <FormGroup label="Método de Pago" required>
            <select
              name="metodo"
              value={formData.metodo}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="efectivo">Efectivo</option>
              <option value="transferencia">Transferencia Bancaria</option>
              <option value="tarjeta">Tarjeta de Crédito/Débito</option>
              <option value="cheque">Cheque</option>
            </select>
          </FormGroup>

          <FormGroup label="Número de Comprobante">
            <Input
              name="comprobante"
              value={formData.comprobante}
              onChange={handleInputChange}
              placeholder="Número de referencia o comprobante"
            />
          </FormGroup>

          <div className="pt-4">
            <Button
              variant="primary"
              type="submit"
              loading={loading}
              className="w-full"
            >
              Registrar Pago
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RealizarPagoPage;
