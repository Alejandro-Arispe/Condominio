import React, { useState } from 'react';
import PageHeader from '../components/common/PageHeader';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import FormGroup from '../components/common/FormGroup';
import Input from '../components/common/Input';

const ConfigurarExpensasPage = () => {
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    concepto: '',
    monto: '',
    tipo: 'fijo',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess('Configuración de expensa guardada correctamente (Demo)');
    setFormData({
      concepto: '',
      monto: '',
      tipo: 'fijo',
    });
  };

  return (
    <div className="p-8 space-y-6">
      <PageHeader
        title="Configurar Expensas"
        subtitle="Define los conceptos y montos de las expensas"
      />

      {success && <Alert type="success" title="Éxito" message={success} />}

      <div className="bg-white rounded-lg shadow-sm p-8 max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormGroup label="Concepto" required>
            <Input
              name="concepto"
              value={formData.concepto}
              onChange={handleInputChange}
              placeholder="Ej: Mantenimiento de áreas comunes"
            />
          </FormGroup>

          <FormGroup label="Monto" required>
            <Input
              name="monto"
              type="number"
              step="0.01"
              value={formData.monto}
              onChange={handleInputChange}
              placeholder="0.00"
            />
          </FormGroup>

          <FormGroup label="Tipo" required>
            <select
              name="tipo"
              value={formData.tipo}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="fijo">Monto Fijo</option>
              <option value="variable">Variable por Unidad</option>
              <option value="porcentaje">Porcentaje</option>
            </select>
          </FormGroup>

          <Button variant="primary" type="submit" className="w-full">
            Guardar Configuración
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ConfigurarExpensasPage;
