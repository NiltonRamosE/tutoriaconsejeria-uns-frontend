import { useEffect, useState, useRef } from 'react';

import AppointmentModality from '@/dashboard/shared/AppointmentModality';
import TypeActivity from '@/dashboard/shared/TypeActivity';
import PrevStepButton from '@/shared/components/PrevStepButton';
import NextStepButton from '@/shared/components/NextStepButton';
import AppointmentDetail from '@/dashboard/shared/AppointmentDetail';

import { fetchAssignedInstructor, fetchStudentsAssignedByInstructor, submitIndividualAppointment, submitGroupAppointment } from '@/infrastructure/api/student';
import { resetFormSteps, resetForm, toggleFieldVisibility, setSelectedModalityButton, resetModalityButtons, initAppointmentFormListeners } from '@/dashboard/shared/appointmentManager';
import { fetchBusySchedules } from '@/infrastructure/api/academicSchedule';
import { getUser } from '@/dashboard/shared/authUtils';
import { type User } from '@/domain/entities/User';
import { type AssignedInstructorResponse } from '@/infrastructure/dto/student/AssignedInstructorResponse';
import { type AssignedStudentResponse } from '@/infrastructure/dto/student/AssignedStudentResponse';

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

  console.log('Student data:', student);
  console.log('Current step:', currentStep);
  console.log('Selected modality:', selectedModality);
  console.log('Assigned instructor:', assignedInstructor);
  console.log('Instructor selected:', instructorSelected);
  console.log('Activity type:', activityType);
  console.log('Available students:', availableStudents);

  return (
    <div className="bg-white p-6 rounded-3xl shadow-lg border-2 border-b-8 border-theme-rich-black">
      <h2 className="text-2xl font-bold mb-6 text-theme-rich-black">Programación de Citas</h2>
      
      {/* Selector de Modalidad */}
      <AppointmentModality selectedModality={selectedModality} onSelect={handleModalitySelect} />

      {/* Formulario de Cita */}
      {showFormContainer && (
        <form className="space-y-6">
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
            <AppointmentDetail idPrefix={idPrefix} prevStep={prevStep} />
          )}
        </form>
      )}
      
  </div>
  );
}