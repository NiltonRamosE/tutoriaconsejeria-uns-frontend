import React, { useState, useEffect, useRef } from 'react';
import { getUser } from '@/dashboard/shared/authUtils';
import { fetchStudentsAssignedByInstructor, submitIndividualAppointment, submitGroupAppointment } from '@/infrastructure/api/instructor';
import { fetchBusySchedules } from '@/infrastructure/api/academicSchedule';
import AppointmentModality from '@/dashboard/shared/AppointmentModality';
import TypeActivity from '@/dashboard/shared/TypeActivity';
import NextStepButton from '@/shared/components/NextStepButton';
import AppointmentDetail from '@/dashboard/shared/AppointmentDetail';
import ScheduleModal from '@/dashboard/shared/ScheduleModal';
import type { AssignedStudentResponse } from '@/infrastructure/dto/student/AssignedStudentResponse';
import type { ScheduleIndividualAppointmentRequest } from '@/infrastructure/dto/appointment-schedule/ScheduleIndividualAppointmentRequest';
import type { ScheduleGroupAppointmentRequest } from '@/infrastructure/dto/appointment-schedule/ScheduleGroupAppointmentRequest';

const InstructorAppointmentsSection: React.FC = () => {
  // Estados principales
  const [instructor, setInstructor] = useState<any>(null);
  const [selectedModality, setSelectedModality] = useState<'I' | 'G' | null>(null);
  const [activityType, setActivityType] = useState<string | undefined>(undefined);
  const [showFormContainer, setShowFormContainer] = useState(false);
  const [availableStudents, setAvailableStudents] = useState<AssignedStudentResponse[]>([]);
  const [selectedIndividualStudentId, setSelectedIndividualStudentId] = useState<number | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  
  // Estados para horarios
  const [modalOpen, setModalOpen] = useState(false);
  const [busySchedules, setBusySchedules] = useState<any[]>([]);
  const [selectedScheduleSlots, setSelectedScheduleSlots] = useState<string[]>([]);
  const [schedulePreviewVisible, setSchedulePreviewVisible] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);
  const [selectedSlotsSummary, setSelectedSlotsSummary] = useState<string>('');
  
  // Refs
  const studentSelectRef = useRef<HTMLSelectElement>(null);
  const studentsListRef = useRef<HTMLDivElement>(null);
  const selectedSchedulePreviewRef = useRef<HTMLDivElement>(null);
  const appointmentMethodRef = useRef<HTMLSelectElement>(null);
  const specificAppointmentMethodRef = useRef<HTMLInputElement>(null);
  const appointmentReasonRef = useRef<HTMLSelectElement>(null);
  const specificAppointmentReasonRef = useRef<HTMLInputElement>(null);
  const altScheduleARef = useRef<HTMLInputElement>(null);
  const altScheduleBRef = useRef<HTMLInputElement>(null);
  const altScheduleCRef = useRef<HTMLInputElement>(null);

  // Obtener datos del instructor
  useEffect(() => {
    const instructorData = getUser();
    setInstructor(instructorData);
  }, []);

  // Cargar estudiantes cuando se selecciona tipo de actividad
  useEffect(() => {
    if (activityType && instructor?.id) {
      loadStudents();
    }
  }, [activityType, instructor?.id]);

  const loadStudents = async () => {
    try {
      const students = await fetchStudentsAssignedByInstructor(instructor.id);
      const filtered = students.filter(s => s.typeActivityCode === activityType);
      setAvailableStudents(filtered);
    } catch (error) {
      console.error('Error loading students:', error);
    }
  };

  // Efecto para mostrar estudiantes en el paso correspondiente
  useEffect(() => {
    if (selectedModality === 'I' && availableStudents.length > 0) {
      populateStudentSelect();
    } else if (selectedModality === 'G' && availableStudents.length > 0) {
      populateStudentCheckboxes();
    }
  }, [availableStudents, selectedModality, activityType]);

  const populateStudentSelect = () => {
    if (!studentSelectRef.current) return;
    
    const select = studentSelectRef.current;
    select.innerHTML = '<option value="">Seleccione un estudiante</option>';
    
    availableStudents.forEach(student => {
      const option = document.createElement('option');
      option.value = String(student.id);
      option.textContent = student.fullName;
      select.appendChild(option);
    });
  };

  const populateStudentCheckboxes = () => {
    if (!studentsListRef.current) return;
    
    studentsListRef.current.innerHTML = '';
    
    availableStudents.forEach(student => {
      const div = document.createElement('div');
      div.className = 'flex items-center p-2 border border-theme-rich-black/10 rounded hover:bg-theme-keppel/5 cursor-pointer transition-colors duration-200';
      div.innerHTML = `
        <input type="checkbox" id="student-${student.id}" value="${student.id}" class="mr-2 student-checkbox">
        <label for="student-${student.id}" class="cursor-pointer flex-1">${student.fullName}</label>
      `;
      studentsListRef.current?.appendChild(div);
    });
    
    document.querySelectorAll('.student-checkbox').forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        const target = e.target as HTMLInputElement;
        const id = parseInt(target.value);
        setSelectedStudents(prev =>
          target.checked ? [...prev, id] : prev.filter(s => s !== id)
        );
      });
    });
  };

  const handleModalitySelect = (modality: 'I' | 'G') => {
    setSelectedModality(modality);
    setShowFormContainer(false);
    setSelectedIndividualStudentId(null);
    setSelectedStudents([]);
    setCurrentStep(1);
  };

  const handleActivityTypeChange = (type: string) => {
    setActivityType(type);
    setShowFormContainer(true);
  };

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const openScheduleModal = async () => {
    if (!selectedIndividualStudentId) {
      alert('Por favor selecciona un estudiante primero');
      return;
    }
    
    try {
      const data = await fetchBusySchedules(selectedIndividualStudentId, instructor.id);
      setBusySchedules(data);
      setModalOpen(true);
    } catch (error) {
      console.error('Error al cargar horarios ocupados:', error);
      alert('Error al cargar los horarios');
    }
  };

  const handleConfirmSlots = (slots: string[]) => {
    setSelectedScheduleSlots(slots);
    setSchedulePreviewVisible(true);
    
    const summary = slots.map(slot => {
      const date = new Date(slot);
      return `${date.toLocaleDateString('es-ES')} a las ${date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;
    }).join(', ');
    setSelectedSlotsSummary(summary);
    
    setPreviewKey(prev => prev + 1);
    
    setTimeout(() => {
      if (selectedSchedulePreviewRef.current) {
        selectedSchedulePreviewRef.current.innerHTML = renderSchedulePreview(slots);
      }
    }, 0);
  };

  const renderSchedulePreview = (slots: string[]) => {
    return `
      <div class="bg-gradient-to-br from-theme-seasalt to-theme-keppel/5 p-4 rounded-xl border border-theme-keppel/20 shadow-sm">
        <p class="text-sm font-medium text-theme-rich-black/80 flex items-center mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-theme-keppel" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Horarios seleccionados para la cita:
        </p>
        <div class="space-y-2">
          ${slots.map((slot, index) => {
            const date = new Date(slot);
            const formattedDate = date.toLocaleDateString('es-ES', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            });
            const formattedTime = date.toLocaleTimeString('es-ES', { 
              hour: '2-digit', 
              minute: '2-digit' 
            });
            return `
              <div class="flex items-center justify-between bg-white p-3 rounded-lg border border-theme-keppel/10 shadow-xs transition-all duration-200 hover:shadow-sm">
                <div class="flex items-center space-x-3">
                  <div class="bg-theme-keppel/10 p-1.5 rounded-lg">
                    <span class="text-sm font-medium text-theme-keppel">${index + 1}</span>
                  </div>
                  <div>
                    <span class="text-theme-rich-black font-medium">${formattedDate}</span>
                    <span class="text-theme-rich-black/70 text-sm ml-2">${formattedTime}</span>
                  </div>
                </div>
                <span class="bg-theme-keppel/10 text-theme-keppel p-1 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
              </div>
            `;
          }).join('')}
        </div>
        <p class="text-xs text-theme-rich-black/60 mt-3 pt-2 border-t border-theme-keppel/10">
          Se han seleccionado ${slots.length} horario${slots.length !== 1 ? 's' : ''} para la cita
        </p>
      </div>
    `;
  };

  useEffect(() => {
    if (schedulePreviewVisible && selectedScheduleSlots.length > 0 && selectedSchedulePreviewRef.current) {
      selectedSchedulePreviewRef.current.innerHTML = renderSchedulePreview(selectedScheduleSlots);
    }
  }, [previewKey, selectedScheduleSlots, schedulePreviewVisible]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!instructor?.id) {
      alert('No se encontró información del instructor');
      return;
    }

    if (!activityType) {
      alert('Por favor selecciona un tipo de actividad');
      return;
    }

    // Validar método de cita
    const appointmentMethod = appointmentMethodRef.current?.value || '';
    if (!appointmentMethod) {
      alert('Por favor selecciona un método de cita');
      return;
    }

    // Validar razón de cita
    const appointmentReason = appointmentReasonRef.current?.value || '';
    if (!appointmentReason) {
      alert('Por favor selecciona una razón de cita');
      return;
    }

    // Obtener horarios según la modalidad
    let altA: string, altB: string, altC: string;
    
    if (selectedModality === 'I') {
      if (selectedScheduleSlots.length < 3) {
        alert('Debes seleccionar 3 horarios para la cita individual');
        return;
      }
      if (!selectedIndividualStudentId) {
        alert('Por favor selecciona un estudiante');
        return;
      }
      [altA, altB, altC] = selectedScheduleSlots;
    } else {
      altA = altScheduleARef.current?.value || '';
      altB = altScheduleBRef.current?.value || '';
      altC = altScheduleCRef.current?.value || '';
      
      if (!altA || !altB || !altC) {
        alert('Debes completar los tres horarios alternativos');
        return;
      }
      if (selectedStudents.length === 0) {
        alert('Por favor selecciona al menos un estudiante');
        return;
      }
    }

    const basePayload = {
      appointmentModalityCode: selectedModality!,
      appointmentMethod: appointmentMethod === 'Otro' ? null : appointmentMethod,
      specificAppointmentMethod: specificAppointmentMethodRef.current?.value || null,
      appointmentReason: appointmentReason === 'Otro' ? null : appointmentReason,
      specificAppointmentReason: specificAppointmentReasonRef.current?.value || null,
      typeActivityCode: activityType,
      instructorId: instructor.id,
      altScheduleA: altA,
      altScheduleB: altB,
      altScheduleC: altC,
    };

    try {
      if (selectedModality === 'I') {
        const payload: ScheduleIndividualAppointmentRequest = {
          ...basePayload,
          studentId: selectedIndividualStudentId!,
        };
        await submitIndividualAppointment(payload);
        alert('Cita individual programada exitosamente');
      } else {
        const payload: ScheduleGroupAppointmentRequest = {
          ...basePayload,
          studentId: selectedStudents[0],
          studentsId: selectedStudents,
        };
        await submitGroupAppointment(payload);
        alert('Cita grupal programada exitosamente');
      }

      // Resetear estado
      setSelectedModality(null);
      setShowFormContainer(false);
      setActivityType(undefined);
      setSelectedIndividualStudentId(null);
      setSelectedStudents([]);
      setSelectedScheduleSlots([]);
      setSchedulePreviewVisible(false);
      setCurrentStep(1);
      
      if (appointmentMethodRef.current) appointmentMethodRef.current.value = '';
      if (appointmentReasonRef.current) appointmentReasonRef.current.value = '';
    } catch (error: any) {
      console.error('Error al programar la cita:', error);
      alert('Error al programar la cita: ' + (error.message || 'Error desconocido'));
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-lg border-2 border-b-8 border-theme-rich-black">
      <h2 className="text-2xl font-bold mb-6 text-theme-rich-black">Programación de Citas</h2>
      
      {/* Selector de Modalidad */}
      <AppointmentModality 
        selectedModality={selectedModality} 
        onSelect={handleModalitySelect} 
      />
      
      {/* Selector de Tipo de Actividad */}
      <TypeActivity 
        value={activityType} 
        onChange={handleActivityTypeChange} 
      />

      {/* Formulario de Cita */}
      {showFormContainer && (
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Paso 1: Selección de Estudiante (Individual) */}
          {selectedModality === 'I' && currentStep === 1 && (
            <div className="form-step" data-step="1">
              <h3 className="text-lg font-semibold mb-4 text-theme-rich-black flex items-center">
                <span className="bg-theme-keppel text-white rounded-full h-8 w-8 flex items-center justify-center mr-2">1</span>
                Selecciona un estudiante
              </h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-theme-rich-black/80">Estudiante</label>
                <select
                  ref={studentSelectRef}
                  className="w-full p-3 border rounded-lg border-theme-rich-black/30 focus:ring-2 focus:ring-theme-keppel focus:border-transparent transition-all duration-200"
                  onChange={(e) => setSelectedIndividualStudentId(e.target.value ? Number(e.target.value) : null)}
                >
                  <option value="">Seleccione un estudiante</option>
                  {availableStudents.map(student => (
                    <option key={student.id} value={student.id}>
                      {student.fullName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end">
                <NextStepButton onClick={nextStep} />
              </div>
            </div>
          )}

          {/* Paso 1: Selección de Estudiantes (Grupal) */}
          {selectedModality === 'G' && currentStep === 1 && (
            <div className="form-step" data-step="1">
              <h3 className="text-lg font-semibold mb-4 text-theme-rich-black flex items-center">
                <span className="bg-theme-keppel text-white rounded-full h-8 w-8 flex items-center justify-center mr-2">1</span>
                Selecciona estudiantes para la cita grupal
              </h3>

              <div className="mb-6">
                <span className="block text-sm font-medium mb-2 text-theme-rich-black/80">Selecciona estudiantes</span>
                <div className="border border-theme-rich-black/20 rounded-lg p-3 max-h-60 overflow-y-auto">
                  <div ref={studentsListRef} className="space-y-2">
                    {/* Los estudiantes se cargarán dinámicamente */}
                  </div>
                </div>
                {availableStudents.length === 0 && (
                  <p className="text-sm text-gray-500 mt-2">
                    No hay estudiantes disponibles para este tipo de actividad.
                  </p>
                )}
              </div>

              <div className="flex justify-end">
                <NextStepButton onClick={nextStep} />
              </div>
            </div>
          )}

          {/* Paso 2: Detalles de la cita */}
          {currentStep === 2 && (
            <AppointmentDetail
              prevStep={prevStep}
              onOpenScheduleModal={openScheduleModal}
              selectedModality={selectedModality}
              schedulePreviewVisible={schedulePreviewVisible}
              selectedSchedulePreviewRef={selectedSchedulePreviewRef}
              appointmentMethodRef={appointmentMethodRef}
              specificAppointmentMethodRef={specificAppointmentMethodRef}
              appointmentReasonRef={appointmentReasonRef}
              specificAppointmentReasonRef={specificAppointmentReasonRef}
              altScheduleARef={altScheduleARef}
              altScheduleBRef={altScheduleBRef}
              altScheduleCRef={altScheduleCRef}
            />
          )}
        </form>
      )}

      {/* Modal de selección de horarios */}
      <ScheduleModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmSlots}
        busySchedules={busySchedules}
      />
    </div>
  );
};

export default InstructorAppointmentsSection;