import React, { useState } from 'react';
import PageHeader from '../components/common/PageHeader';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import FormGroup from '../components/common/FormGroup';
import Input from '../components/common/Input';

const GenerarExpensasPage = () => {
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    periodo: new Date().toISOString().slice(0, 7),
    monto_base: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess('Expensas generadas correctamente para todas las unidades (Demo)');
  };

  return (
    <div className="p-8 space-y-6">
      <PageHeader
        title="Generar Expensas"
        subtitle="Genera las expensas mensuales para todas las unidades"
      />

      {success && <Alert type="success" title="Éxito" message={success} />}

      <div className="bg-white rounded-lg shadow-sm p-8 max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormGroup label="Período" required>
            <Input
              name="periodo"
              type="month"
              value={formData.periodo}
              onChange={handleInputChange}
            />
          </FormGroup>

          <FormGroup label="Monto Base" required>
            <Input
              name="monto_base"
              type="number"
              step="0.01"
              value={formData.monto_base}
              onChange={handleInputChange}
              placeholder="0.00"
            />
          </FormGroup>

          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Nota:</strong> Esto generará un cargo automático para todas las unidades
              activas del condominio.
            </p>
          </div>

          <Button variant="primary" type="submit" className="w-full">
            Generar Expensas
          </Button>
        </form>
      </div>
    </div>
  );
};

export default GenerarExpensasPage;
