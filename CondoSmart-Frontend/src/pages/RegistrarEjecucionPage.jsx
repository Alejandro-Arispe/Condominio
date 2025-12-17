import React, { useState } from 'react';
import PageHeader from '../components/common/PageHeader';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import FormGroup from '../components/common/FormGroup';
import Input from '../components/common/Input';

const RegistrarEjecucionPage = () => {
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    servicio: '',
    fecha: '',
    observaciones: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess('Ejecución registrada correctamente (Demo)');
    setFormData({
      servicio: '',
      fecha: '',
      observaciones: '',
    });
  };

  return (
    <div className="p-8 space-y-6">
      <PageHeader
        title="Registrar Ejecución"
        subtitle="Registra la ejecución de servicios programados"
      />

      {success && <Alert type="success" title="Éxito" message={success} />}

      <div className="bg-white rounded-lg shadow-sm p-8 max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormGroup label="Servicio" required>
            <Input
              name="servicio"
              value={formData.servicio}
              onChange={handleInputChange}
              placeholder="Nombre del servicio ejecutado"
            />
          </FormGroup>

          <FormGroup label="Fecha de Ejecución" required>
            <Input
              name="fecha"
              type="date"
              value={formData.fecha}
              onChange={handleInputChange}
            />
          </FormGroup>

          <FormGroup label="Observaciones">
            <textarea
              name="observaciones"
              value={formData.observaciones}
              onChange={handleInputChange}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Observaciones sobre la ejecución"
            />
          </FormGroup>

          <Button variant="primary" type="submit" className="w-full">
            Registrar Ejecución
          </Button>
        </form>
      </div>
    </div>
  );
};

export default RegistrarEjecucionPage;
