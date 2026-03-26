import { useEffect, useState, useRef } from 'react';

import AppointmentModality from '@/dashboard/shared/AppointmentModality';
import TypeActivity from '@/dashboard/shared/TypeActivity';
import PrevStepButton from '@/shared/components/PrevStepButton';
import NextStepButton from '@/shared/components/NextStepButton';
import AppointmentDetail from '@/dashboard/shared/AppointmentDetail';

import { fetchAssignedInstructor, fetchStudentsAssignedByInstructor, submitIndividualAppointment, submitGroupAppointment } from '@/infrastructure/api/student';
import { fetchBusySchedules } from '@/infrastructure/api/academicSchedule';
import { getUser } from '@/dashboard/shared/authUtils';
import { type User } from '@/domain/entities/User';
import { type AssignedInstructorResponse } from '@/infrastructure/dto/student/AssignedInstructorResponse';
import { type AssignedStudentResponse } from '@/infrastructure/dto/student/AssignedStudentResponse';
import ScheduleModal from '@/dashboard/shared/ScheduleModal';
import {type ScheduleGroupAppointmentRequest} from '@/infrastructure/dto/appointment-schedule/ScheduleGroupAppointmentRequest';
import { type ScheduleIndividualAppointmentRequest } from '@/infrastructure/dto/appointment-schedule/ScheduleIndividualAppointmentRequest';
const idPrefix = 'studentSender';

export default function AppointmentsSection() {

  const [student, setStudent] = useState<User | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedModality, setSelectedModality] = useState<'I' | 'G' | null>(null);
  const [showFormContainer, setShowFormContainer] = useState(false);
  const [assignedInstructor, setAssignedInstructor ] = useState<AssignedInstructorResponse[] | null>(null);
  const [instructorSelected, setInstructorSelected] = useState<number| null>(null);
  const [activityType, setActivityType] = useState<string| undefined>(undefined);
  const [availableStudents, setAvailableStudents] = useState<AssignedStudentResponse[]>([]);
  const studentsListRef = useRef<HTMLDivElement>(null);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [busySchedules, setBusySchedules] = useState<any[]>([]);
  const [selectedScheduleSlots, setSelectedScheduleSlots] = useState<string[]>([]);
  const [schedulePreviewVisible, setSchedulePreviewVisible] = useState(false);
  const selectedSchedulePreviewRef = useRef<HTMLDivElement>(null);
  const [selectedSlotsSummary, setSelectedSlotsSummary] = useState<string>('');
  const [previewKey, setPreviewKey] = useState(0);

  const appointmentMethodRef = useRef<HTMLSelectElement>(null);
  const specificAppointmentMethodRef = useRef<HTMLInputElement>(null);
  const appointmentReasonRef = useRef<HTMLSelectElement>(null);
  const specificAppointmentReasonRef = useRef<HTMLInputElement>(null);
  const altScheduleARef = useRef<HTMLInputElement>(null);
  const altScheduleBRef = useRef<HTMLInputElement>(null);
  const altScheduleCRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadInstructor = async () => {
      const studentData = getUser();

      setStudent(studentData);

      if (!studentData?.id) return;

      try {
        const response = await fetchAssignedInstructor(studentData.id);
        setAssignedInstructor(response);
      } catch (error) {
        console.error("Error fetching assigned instructor:", error);
      }
    };

    loadInstructor();
  }, []);

  useEffect(() => {
    const loadStudents = async () => {
      if (selectedModality !== 'G' || !instructorSelected) return;
      try {
        const students = await fetchStudentsAssignedByInstructor(instructorSelected);
        setAvailableStudents(students);
      } catch (error) {
        console.error('Error loading students:', error);
      }
    };
    loadStudents();
  }, [instructorSelected, selectedModality]);

  const nextStep = () => {
    if (selectedModality === 'I' && currentStep === 1 && !assignedInstructor?.find(instr => instr.id === instructorSelected)?.bothActivities) {
      setCurrentStep(prev => Math.min(3, prev + 2));
    }else{
      setCurrentStep(prev => Math.min(3, prev + 1));
    }
  };

  const prevStep = () => {
    if (selectedModality === 'I' && currentStep === 3 && !assignedInstructor?.find(instr => instr.id === instructorSelected)?.bothActivities) {
      setCurrentStep(prev => Math.max(1, prev - 2));
    }else{
      setCurrentStep(prev => Math.max(1, prev - 1));
    }
  };

  const handleModalitySelect = (modality: 'I' | 'G') => {
    setSelectedModality(modality);
    setCurrentStep(1);
    setInstructorSelected(null);
    setShowFormContainer(true);
  };

  const selectedInstructor = assignedInstructor?.find(
    instr => instr.id === instructorSelected
  );

  useEffect(() => {
    if (!selectedInstructor) return;

    if (!selectedInstructor.bothActivities) {
      setActivityType(selectedInstructor.typeActivity);
    } else {
      setActivityType(undefined);
    }

  }, [selectedInstructor]);

  useEffect(() => {
    if (currentStep !== 2 || selectedModality !== 'G') return;
    
    const currentActivity = selectedInstructor?.bothActivities ? activityType : selectedInstructor?.typeActivity;
    if (!currentActivity || !availableStudents.length || !student?.id) return;

    const filtered = availableStudents.filter(
      s => s.typeActivityCode === currentActivity && s.id !== student.id
    );

    if (studentsListRef.current) {
      studentsListRef.current.innerHTML = '';
      filtered.forEach(student => {
        const div = document.createElement('div');
        div.className = 'flex items-center p-2 border border-theme-rich-black/10 rounded hover:bg-theme-keppel/5 cursor-pointer';
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
    }
  }, [currentStep, selectedModality, availableStudents, selectedInstructor, activityType, student?.id]);

  const openScheduleModal = async () => {
    if (!student?.id || !instructorSelected) {
      alert('Por favor selecciona un docente primero');
      return;
    }
    
    try {
      const data = await fetchBusySchedules(student.id, instructorSelected);
      setBusySchedules(data);
      setModalOpen(true);
    } catch (error) {
      console.error('Error al cargar horarios:', error);
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

  useEffect(() => {
    if (schedulePreviewVisible && selectedScheduleSlots.length > 0 && selectedSchedulePreviewRef.current) {
      selectedSchedulePreviewRef.current.innerHTML = renderSchedulePreview(selectedScheduleSlots);
    }
  }, [previewKey, selectedScheduleSlots, schedulePreviewVisible]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!student?.id) {
      alert('No se encontró información del estudiante');
      return;
    }

    // 1. Validar tipo de actividad
    let currentActivity = activityType;
    if (!selectedInstructor?.bothActivities) {
      currentActivity = selectedInstructor?.typeActivity || undefined;
    }
    if (!currentActivity) {
      alert('Por favor selecciona un tipo de actividad');
      return;
    }

    // 2. Validar método de cita
    const appointmentMethod = appointmentMethodRef.current?.value || '';
    if (!appointmentMethod) {
      alert('Por favor selecciona un método de cita');
      return;
    }

    // 3. Validar razón de cita
    const appointmentReason = appointmentReasonRef.current?.value || '';
    if (!appointmentReason) {
      alert('Por favor selecciona una razón de cita');
      return;
    }

    // 4. Obtener horarios según la modalidad
    let altA: string, altB: string, altC: string;
    
    if (selectedModality === 'I') {
      // Cita individual - usar horarios seleccionados del modal
      if (selectedScheduleSlots.length < 3) {
        alert('Debes seleccionar 3 horarios para la cita individual');
        return;
      }
      [altA, altB, altC] = selectedScheduleSlots;
    } else {
      // Cita grupal - usar inputs de horarios alternativos
      altA = altScheduleARef.current?.value || '';
      altB = altScheduleBRef.current?.value || '';
      altC = altScheduleCRef.current?.value || '';
      
      if (!altA || !altB || !altC) {
        alert('Debes completar los tres horarios alternativos');
        return;
      }
    }

    // 5. Construir el payload base
    const basePayload = {
      appointmentModalityCode: selectedModality!,
      appointmentMethod: appointmentMethod === 'Otro' ? null : appointmentMethod,
      specificAppointmentMethod: specificAppointmentMethodRef.current?.value || null,
      appointmentReason: appointmentReason === 'Otro' ? null : appointmentReason,
      specificAppointmentReason: specificAppointmentReasonRef.current?.value || null,
      typeActivityCode: currentActivity,
      instructorId: selectedInstructor!.id,
      altScheduleA: altA,
      altScheduleB: altB,
      altScheduleC: altC,
    };

    try {
      if (selectedModality === 'I') {
        // Cita individual
        const payload = {
          ...basePayload,
          studentId: student.id,
        };
        await submitIndividualAppointment(payload as ScheduleIndividualAppointmentRequest);
        alert('Cita individual programada exitosamente');
      } else {
        // Cita grupal
        const allStudentIds = [...selectedStudents, student.id];
        const payload = {
          ...basePayload,
          studentId: student.id,
          studentsId: allStudentIds,
        };
        await submitGroupAppointment(payload as ScheduleGroupAppointmentRequest);
        alert('Cita grupal programada exitosamente');
      }

      resetFormState();
    } catch (error: any) {
      console.error('Error al programar la cita:', error);
      alert('Error al programar la cita: ' + (error.message || 'Error desconocido'));
    }
  };

  const resetFormState = () => {
    setSelectedModality(null);
    setShowFormContainer(false);
    setCurrentStep(1);
    setInstructorSelected(null);
    setSelectedStudents([]);
    setActivityType(undefined);
    setSelectedScheduleSlots([]);
    setSchedulePreviewVisible(false);
    setModalOpen(false);
    setBusySchedules([]);
    setSelectedSlotsSummary('');
    
    if (appointmentMethodRef.current) appointmentMethodRef.current.value = '';
    if (appointmentReasonRef.current) appointmentReasonRef.current.value = '';
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-lg border-2 border-b-8 border-theme-rich-black">
      <h2 className="text-2xl font-bold mb-6 text-theme-rich-black">Programación de Citas</h2>
      
      <AppointmentModality selectedModality={selectedModality} onSelect={handleModalitySelect} />

      {showFormContainer && (
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Paso 1: Selección de Docente */}
          { currentStep === 1 && (
            <div className="form-step active" data-step="1">
              <h3 className="text-lg font-semibold mb-4 text-theme-rich-black flex items-center">
                  <span className="bg-theme-keppel text-white rounded-full h-8 w-8 flex items-center justify-center mr-2">1</span>
                  Selecciona un docente
              </h3>
              
              <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-theme-rich-black/80">Docente</label>
                  <select onChange={(e) => setInstructorSelected(e.target.value ? Number(e.target.value) : null)} value={instructorSelected ?? ""} className="w-full p-3 border rounded-lg border-theme-rich-black/30 focus:ring-2 focus:ring-theme-keppel focus:border-transparent transition-all duration-200" required>
                      <option value="">Seleccione un docente</option>
                      {assignedInstructor?.map((instructor) => (
                        <option key={instructor.id} value={instructor.id}>
                          {instructor.fullName} - {instructor.typeActivity}
                        </option>
                      ))}
                  </select>
              </div>

              <div className="flex justify-end">
                  <NextStepButton onClick={nextStep}/>
              </div>
            </div>
          )}
          
          {/* Paso 2: Tipo de Actividad y Estudiantes (solo para citas grupales) */}
          {currentStep === 2 && (
            (selectedModality === 'G' || (selectedModality === 'I' && selectedInstructor?.bothActivities)) && (
              <div className="form-step" data-step="2">
                <h3 className="text-lg font-semibold mb-4">
                  <span className="bg-theme-keppel text-white rounded-full h-8 w-8 flex items-center justify-center mr-2">2</span>
                  {selectedModality === 'I' ? 'Selecciona el tipo de actividad' : 'Selecciona estudiantes para la cita grupal'}
                </h3>

                {/* Tipo de Actividad (si bothActivities es true) */}
                {selectedInstructor?.bothActivities && (
                  <TypeActivity idPrefix={idPrefix} value={activityType} onChange={setActivityType} />
                )}

                {/* Selección de Estudiantes (solo para citas grupales) */}
                {selectedModality === 'G' && (
                  <div className="mb-6">
                    <span className="text-sm font-medium mb-2 text-theme-rich-black/80">Selecciona estudiantes</span>
                    <div className="border border-theme-rich-black/20 rounded-lg p-3 max-h-60 overflow-y-auto">
                        <div ref={studentsListRef} className="space-y-2">
                            {/* Los estudiantes se cargarán dinámicamente */}
                        </div>
                    </div>
                    <p id="noStudentsMessage" className="text-sm text-gray-500 mt-2 hidden">No hay estudiantes disponibles para este docente y tipo de actividad.</p>
                </div>
                )}

                <div className="flex justify-between">
                  <PrevStepButton onClick={prevStep} />
                  <NextStepButton onClick={nextStep} />
                </div>
              </div>
            )
          )}
          
          {/* Paso 3: Detalles de la cita */}
          { currentStep === 3 && (
            <AppointmentDetail 
              idPrefix={idPrefix} 
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

          <ScheduleModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            onConfirm={handleConfirmSlots}
            busySchedules={busySchedules}
          />
        </form>
      )}
  </div>
  );
}