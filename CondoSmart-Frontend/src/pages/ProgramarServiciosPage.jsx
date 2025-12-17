import React, { useState } from 'react';
import PageHeader from '../components/common/PageHeader';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import FormGroup from '../components/common/FormGroup';
import Input from '../components/common/Input';

const ProgramarServiciosPage = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    tipo: 'limpieza',
    descripcion: '',
    fecha: '',
    hora: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess('Servicio programado correctamente (Demo)');
    setFormData({
      tipo: 'limpieza',
      descripcion: '',
      fecha: '',
      hora: '',
    });
  };

  return (
    <div className="p-8 space-y-6">
      <PageHeader
        title="Programar Servicios"
        subtitle="Programa servicios de mantenimiento y limpieza"
      />

      {success && <Alert type="success" title="Éxito" message={success} />}

      <div className="bg-white rounded-lg shadow-sm p-8 max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormGroup label="Tipo de Servicio" required>
            <select
              name="tipo"
              value={formData.tipo}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="limpieza">Limpieza</option>
              <option value="mantenimiento">Mantenimiento</option>
              <option value="jardineria">Jardinería</option>
              <option value="fumigacion">Fumigación</option>
            </select>
          </FormGroup>

          <FormGroup label="Descripción" required>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Detalles del servicio"
            />
          </FormGroup>

          <div className="grid grid-cols-2 gap-4">
            <FormGroup label="Fecha" required>
              <Input
                name="fecha"
                type="date"
                value={formData.fecha}
                onChange={handleInputChange}
              />
            </FormGroup>

            <FormGroup label="Hora" required>
              <Input
                name="hora"
                type="time"
                value={formData.hora}
                onChange={handleInputChange}
              />
            </FormGroup>
          </div>

          <Button variant="primary" type="submit" loading={loading} className="w-full">
            Programar Servicio
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ProgramarServiciosPage;
