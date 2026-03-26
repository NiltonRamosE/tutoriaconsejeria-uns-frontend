import React, { useRef } from 'react';
import PrevStepButton from '@/shared/components/PrevStepButton';
import ScheduleSelector from '@/dashboard/shared/ScheduleSelector';

export interface AppointmentDetailProps {
  prevStep?: () => void;
  onOpenScheduleModal?: () => void;
  selectedModality?: 'I' | 'G' | null;
  schedulePreviewVisible?: boolean;
  selectedSchedulePreviewRef?: React.RefObject<HTMLDivElement | null>;
  appointmentMethodRef?: React.RefObject<HTMLSelectElement | null>;
  specificAppointmentMethodRef?: React.RefObject<HTMLInputElement | null>;
  appointmentReasonRef?: React.RefObject<HTMLSelectElement | null>;
  specificAppointmentReasonRef?: React.RefObject<HTMLInputElement | null>;
  altScheduleARef?: React.RefObject<HTMLInputElement | null>;
  altScheduleBRef?: React.RefObject<HTMLInputElement | null>;
  altScheduleCRef?: React.RefObject<HTMLInputElement | null>;
}

const AppointmentDetail: React.FC<AppointmentDetailProps> = ({ 
  prevStep,
  onOpenScheduleModal,
  selectedModality,
  schedulePreviewVisible,
  selectedSchedulePreviewRef,
  appointmentMethodRef,
  specificAppointmentMethodRef,
  appointmentReasonRef,
  specificAppointmentReasonRef,
  altScheduleARef,
  altScheduleBRef,
  altScheduleCRef
}) => {
  const specificMethodContainerRef = useRef<HTMLDivElement>(null);
  const specificReasonContainerRef = useRef<HTMLDivElement>(null);

  const handleMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (specificMethodContainerRef.current) {
      specificMethodContainerRef.current.classList.toggle('hidden', value !== 'Otro');
    }
  };

  const handleReasonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (specificReasonContainerRef.current) {
      specificReasonContainerRef.current.classList.toggle('hidden', value !== 'Otro');
    }
  };

  return (
    <div className="form-step" >
      <h3 className="text-lg font-semibold mb-4 text-theme-rich-black flex items-center">
        <span className="bg-theme-keppel text-white rounded-full h-8 w-8 flex items-center justify-center mr-2">
          <span>3</span>
        </span>
        <span>Completa los detalles de la cita</span>
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-theme-rich-black/80">
            Método de Cita
          </label>
          <select 
            ref={appointmentMethodRef}
            className="w-full p-3 border rounded-lg border-theme-rich-black/30 focus:ring-2 focus:ring-theme-keppel focus:border-transparent"
            onChange={handleMethodChange}
          >
            <option value="">Seleccione un método</option>
            <option value="A">Personal</option>
            <option value="B">Telefónica</option>
            <option value="C">Correo electrónico</option>
            <option value="D">Chat</option>
            <option value="Otro">Otro</option>
          </select>
        </div>

        <div 
          ref={specificMethodContainerRef}
          className="hidden"
        >
          <label className="block text-sm font-medium mb-2 text-theme-rich-black/80">
            Método Específico
          </label>
          <input 
            ref={specificAppointmentMethodRef}
            type="text" 
            className="w-full p-3 border rounded-lg border-theme-rich-black/30 focus:ring-2 focus:ring-theme-keppel focus:border-transparent" 
            placeholder="Ej: Google Meet, Zoom, etc."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-theme-rich-black/80">
            Razón de la Cita
          </label>
          <select 
            ref={appointmentReasonRef}
            className="w-full p-3 border rounded-lg border-theme-rich-black/30 focus:ring-2 focus:ring-theme-keppel focus:border-transparent"
            onChange={handleReasonChange}
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

        <div 
          ref={specificReasonContainerRef}
          className="hidden"
        >
          <label className="block text-sm font-medium mb-2 text-theme-rich-black/80">
            Razón Específica
          </label>
          <input 
            ref={specificAppointmentReasonRef}
            type="text" 
            className="w-full p-3 border rounded-lg border-theme-rich-black/30 focus:ring-2 focus:ring-theme-keppel focus:border-transparent" 
            placeholder="Describa brevemente la razón de la cita"
          />
        </div>
      </div>

      <ScheduleSelector 
        selectedModality={selectedModality}
        onOpenScheduleModal={onOpenScheduleModal}
        schedulePreviewVisible={schedulePreviewVisible}
        selectedSchedulePreviewRef={selectedSchedulePreviewRef}
        altScheduleARef={altScheduleARef}
        altScheduleBRef={altScheduleBRef}
        altScheduleCRef={altScheduleCRef}
      />

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