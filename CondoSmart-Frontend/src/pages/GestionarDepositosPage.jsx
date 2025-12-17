import React, { useState } from 'react';
import PageHeader from '../components/common/PageHeader';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import FormGroup from '../components/common/FormGroup';
import Input from '../components/common/Input';

const GestionarDepositosPage = () => {
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    unidad: '',
    monto: '',
    concepto: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess('Depósito registrado correctamente (Demo)');
    setFormData({
      unidad: '',
      monto: '',
      concepto: '',
    });
  };

  return (
    <div className="p-8 space-y-6">
      <PageHeader
        title="Gestionar Depósitos"
        subtitle="Administra los depósitos de garantía"
      />

      {success && <Alert type="success" title="Éxito" message={success} />}

      <div className="bg-white rounded-lg shadow-sm p-8 max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormGroup label="ID de Unidad" required>
            <Input
              name="unidad"
              type="number"
              value={formData.unidad}
              onChange={handleInputChange}
              placeholder="ID de la unidad"
            />
          </FormGroup>

          <FormGroup label="Monto del Depósito" required>
            <Input
              name="monto"
              type="number"
              step="0.01"
              value={formData.monto}
              onChange={handleInputChange}
              placeholder="0.00"
            />
          </FormGroup>

          <FormGroup label="Concepto" required>
            <Input
              name="concepto"
              value={formData.concepto}
              onChange={handleInputChange}
              placeholder="Motivo del depósito"
            />
          </FormGroup>

          <Button variant="primary" type="submit" className="w-full">
            Registrar Depósito
          </Button>
        </form>
      </div>
    </div>
  );
};

export default GestionarDepositosPage;
