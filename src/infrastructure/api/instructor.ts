import { getToken, isTokenPresent } from '@/dashboard/shared/authUtils';
import { config } from 'config';
import type { AssignedStudentResponse } from '@/infrastructure/dto/student/AssignedStudentResponse';
import type { ScheduleIndividualAppointmentRequest } from '@/infrastructure/dto/appointment-schedule/ScheduleIndividualAppointmentRequest';
import type { ScheduleGroupAppointmentRequest } from '@/infrastructure/dto/appointment-schedule/ScheduleGroupAppointmentRequest';
import type { AppointmentScheduleSentResponse } from '@/infrastructure/dto/appointment-schedule/AppointmentScheduleSentResponse';
import type { AppointmentScheduleReceivedResponse } from '@/infrastructure/dto/appointment-schedule/AppointmentScheduleReceivedResponse';
import type { AppointmentConfirmRequest } from '@/infrastructure/dto/appointment/AppointmentConfirmRequest';
import type { StudentResponse } from '@/infrastructure/dto/administrator/StudentResponse';
import type { AcademicScheduleResponse } from '@/infrastructure/dto/academic-schedule/AcademicScheduleResponse';

const getAuthToken = (): string => {
  const token = getToken();
  isTokenPresent(token);
  return token as string;
};

// Función para cargar estudiantes asignados a un instructor
export async function fetchStudentsAssignedByInstructor(
  instructorId: number
): Promise<AssignedStudentResponse[]> {
  const token = getAuthToken();
  
  const response = await fetch(
    `${config.apiUrl}${config.endpoints.instructor.assignedStudents}`.replace(':instructorId', String(instructorId)),
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || response.statusText);
  }
  
  return await response.json() as AssignedStudentResponse[];
}

export async function fetchListAssignedStudents(
  instructorId: number
): Promise<StudentResponse[]> {
  const token = getAuthToken(); 
  const response = await fetch(
    `${config.apiUrl}${config.endpoints.instructor.listAssignedStudents}`.replace(':instructorId', String(instructorId)),
    {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    }
  );
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || response.statusText);
  }

  return await response.json() as StudentResponse[];
}

// Función para enviar el formulario de cita individual
export async function submitIndividualAppointment(
  data: ScheduleIndividualAppointmentRequest
): Promise<Object> {
  const token = getAuthToken();
  
  const response = await fetch(
    `${config.apiUrl}${config.endpoints.instructor.individualAppointment}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    }
  );
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || response.statusText);
  }
  
  return await response.json() as Object;
}

// Función para enviar el formulario de cita grupal
export async function submitGroupAppointment(
  data: ScheduleGroupAppointmentRequest
): Promise<Object> {
  const token = getAuthToken();
  
  const response = await fetch(
    `${config.apiUrl}${config.endpoints.instructor.groupAppointment}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    }
  );
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || response.statusText);
  }
  
  return await response.json() as Object;
}

// Función para cargar citas enviadas por el instructor
export async function fetchAppointmentsSent(
  instructorId: number
): Promise<AppointmentScheduleSentResponse[]> {
  const token = getAuthToken();
  
  const response = await fetch(
    `${config.apiUrl}${config.endpoints.instructor.appointmentsSent}`.replace(':instructorId', String(instructorId)),
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || response.statusText);
  }
  
  return await response.json() as AppointmentScheduleSentResponse[];
}

// Función para cargar citas recibidas por el instructor
export async function fetchAppointmentsReceived(
  instructorId: number
): Promise<AppointmentScheduleReceivedResponse[]> {
  const token = getAuthToken();
  
  const response = await fetch(
    `${config.apiUrl}${config.endpoints.instructor.appointmentsReceived}`.replace(':instructorId', String(instructorId)),
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || response.statusText);
  }
  
  return await response.json() as AppointmentScheduleReceivedResponse[];
}

// Función para confirmar citas
export async function fetchPutAppointmentConfirm(
  appointmentId: number,
  chosenDateTime: string
): Promise<void> {
  const token = getAuthToken();
  
  const payload: AppointmentConfirmRequest = { chosenDateTime };
  
  const response = await fetch(
    `${config.apiUrl}${config.endpoints.instructor.confirmAppointment}`.replace(':appointmentId', String(appointmentId)),
    {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }
  );
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || response.statusText);
  }
}

// Función para cancelar citas
export async function fetchPutAppointmentCancel(
  appointmentId: number
): Promise<void> {
  const token = getAuthToken();
  
  const response = await fetch(
    `${config.apiUrl}${config.endpoints.instructor.cancelAppointment}`.replace(':appointmentId', String(appointmentId)),
    {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || response.statusText);
  }
}

export async function fetchViewStudentSchedule(studentId: number): Promise<AcademicScheduleResponse[]> {
  const token = getAuthToken(); 
  const response = await fetch(
    `${config.apiUrl}${config.endpoints.instructor.viewStudentSchedule}`.replace(':studentId', String(studentId)),
    { 
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || response.statusText);
  }

  return await response.json() as AcademicScheduleResponse[];
}