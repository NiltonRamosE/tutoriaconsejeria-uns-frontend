import React from 'react';
import PrevStepButton from '@/shared/components/PrevStepButton';
import ScheduleSelector from '@/dashboard/shared/ScheduleSelector';

export interface AppointmentDetailProps {
  idPrefix: string;
  prevStep?: () => void;
}

const AppointmentDetail: React.FC<AppointmentDetailProps> = ({ idPrefix, prevStep }) => {
  return (
    <div className="form-step" id={`${idPrefix}-detailsStep`}>
      <h3 className="text-lg font-semibold mb-4 text-theme-rich-black flex items-center">
        <span className="bg-theme-keppel text-white rounded-full h-8 w-8 flex items-center justify-center mr-2">
          <span id={`${idPrefix}-stepNumber`}>3</span>
        </span>
        <span id={`${idPrefix}-stepTitle`}>Completa los detalles de la cita</span>
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Método de Cita */}
        <div>
          <label htmlFor={`${idPrefix}-appointmentMethod`} className="block text-sm font-medium mb-2 text-theme-rich-black/80">
            Método de Cita
          </label>
          <select 
            id={`${idPrefix}-appointmentMethod`} 
            className="w-full p-3 border rounded-lg border-theme-rich-black/30 focus:ring-2 focus:ring-theme-keppel focus:border-transparent"
          >
            <option value="">Seleccione un método</option>
            <option value="A">Personal</option>
            <option value="B">Telefónica</option>
            <option value="C">Correo electrónico</option>
            <option value="D">Chat</option>
            <option value="Otro">Otro</option>
          </select>
        </div>

        {/* Método Específico de Cita */}
        <div id={`${idPrefix}-specificMethodContainer`} className="hidden">
          <label htmlFor={`${idPrefix}-specificAppointmentMethod`} className="block text-sm font-medium mb-2 text-theme-rich-black/80">
            Método Específico
          </label>
          <input 
            type="text" 
            id={`${idPrefix}-specificAppointmentMethod`} 
            className="w-full p-3 border rounded-lg border-theme-rich-black/30 focus:ring-2 focus:ring-theme-keppel focus:border-transparent" 
            placeholder="Ej: Google Meet, Zoom, etc."
          />
        </div>

        {/* Razón de la Cita */}
        <div>
          <label htmlFor={`${idPrefix}-appointmentReason`} className="block text-sm font-medium mb-2 text-theme-rich-black/80">
            Razón de la Cita
          </label>
          <select 
            id={`${idPrefix}-appointmentReason`} 
            className="w-full p-3 border rounded-lg border-theme-rich-black/30 focus:ring-2 focus:ring-theme-keppel focus:border-transparent"
          >
            <option value="">Seleccione una razón</option>
            <option value="A">Rendimiento académico</option>
            <option value="B">Mejorar técnicas de estudio</option>
            <option value="C">Problemas de aprendizaje</option>
            <option value="D">Problemas interpersonales con estudiantes</option>
            <option value="E">Problemas de salud</option>
            <option value="F">Problemas interpersonales con docentes</option>
            <option value="G">Problemas interpersonales con otras personas</option>
            <option value="H">Problemas económicos</option>
            <option value="I">Problemas afectivos</option>
            <option value="J">Problemas familiares</option>
            <option value="Otro">Otro</option>
          </select>
        </div>

        {/* Razón Específica de la Cita */}
        <div id={`${idPrefix}-specificReasonContainer`} className="hidden">
          <label htmlFor={`${idPrefix}-specificAppointmentReason`} className="block text-sm font-medium mb-2 text-theme-rich-black/80">
            Razón Específica
          </label>
          <input 
            type="text" 
            id={`${idPrefix}-specificAppointmentReason`} 
            className="w-full p-3 border rounded-lg border-theme-rich-black/30 focus:ring-2 focus:ring-theme-keppel focus:border-transparent" 
            placeholder="Describa brevemente la razón de la cita"
          />
        </div>
      </div>

      {/* Horarios Alternativos */}
      <ScheduleSelector idPrefix={idPrefix} />

      <div className="flex justify-between">
        <PrevStepButton onClick={prevStep} />
        <button 
          type="submit" 
          className="bg-theme-keppel text-white font-medium py-2 px-6 rounded-lg hover:bg-theme-keppel-dark transition-colors duration-200"
        >
          Programar Cita
        </button>
      </div>
    </div>
  );
};

export default AppointmentDetail;