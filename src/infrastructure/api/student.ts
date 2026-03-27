import { getToken, isTokenPresent } from '@/dashboard/shared/authUtils';
import { config } from 'config';
import type { AppointmentScheduleReceivedResponse } from '@/infrastructure/dto/appointment-schedule/AppointmentScheduleReceivedResponse';
import type { AppointmentScheduleSentResponse } from '@/infrastructure/dto/appointment-schedule/AppointmentScheduleSentResponse';
import type { ScheduleIndividualAppointmentRequest } from '@/infrastructure/dto/appointment-schedule/ScheduleIndividualAppointmentRequest';
import type { ScheduleGroupAppointmentRequest } from '@/infrastructure/dto/appointment-schedule/ScheduleGroupAppointmentRequest';
import type { AppointmentConfirmRequest } from '@/infrastructure/dto/appointment/AppointmentConfirmRequest';
import type { AssignedInstructorResponse } from '@/infrastructure/dto/student/AssignedInstructorResponse';
import type { AssignedStudentResponse } from '@/infrastructure/dto/student/AssignedStudentResponse';
import type { StudentProfileResponse } from '@/infrastructure/dto/student/StudentProfileResponse';

const getAuthToken = (): string => {
  const token = getToken();
  isTokenPresent(token);
  return token as string;
};

// Función para cargar instructor asignado a un estudiante
export async function fetchAssignedInstructor(
  studentId: number
): Promise<AssignedInstructorResponse[]> {
  const token = getAuthToken();
  
  const response = await fetch(
    `${config.apiUrl}${config.endpoints.student.assignedInstructor}`.replace(':studentId', String(studentId)),
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
  
  return await response.json() as AssignedInstructorResponse[];
}

// Función para cargar estudiantes asignados a un instructor
export async function fetchStudentsAssignedByInstructor(
  instructorId: number
): Promise<AssignedStudentResponse[]> {
  const token = getAuthToken();
  
  const response = await fetch(
    `${config.apiUrl}${config.endpoints.student.assignedByInstructor}`.replace(':instructorId', String(instructorId)),
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

// Función para enviar el formulario de cita individual
export async function submitIndividualAppointment(
  data: ScheduleIndividualAppointmentRequest
): Promise<Object> {
  const token = getAuthToken();
  
  const response = await fetch(
    `${config.apiUrl}${config.endpoints.student.individualAppointment}`,
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
    `${config.apiUrl}${config.endpoints.student.groupAppointment}`,
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

// Función para cargar estudiante específico
export async function fetchStudentById(
  id: number
): Promise<StudentProfileResponse> {
  const token = getAuthToken();
  
  const response = await fetch(
    `${config.apiUrl}${config.endpoints.student.getById}`.replace(':id', String(id)),
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
  
  return await response.json() as StudentProfileResponse;
}

// Función para cargar citas enviadas por el estudiante
export async function fetchAppointmentsSent(
  studentId: number
): Promise<AppointmentScheduleSentResponse[]> {
  const token = getAuthToken();
  
  const response = await fetch(
    `${config.apiUrl}${config.endpoints.student.appointmentsSent}`.replace(':studentId', String(studentId)),
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

// Función para cargar citas recibidas por el estudiante
export async function fetchAppointmentsReceived(
  studentId: number
): Promise<AppointmentScheduleReceivedResponse[]> {
  const token = getAuthToken();
  
  const response = await fetch(
    `${config.apiUrl}${config.endpoints.student.appointmentsReceived}`.replace(':studentId', String(studentId)),
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

// Función para confirmar citas individuales
export async function fetchConfirmIndividualAppointment(
  appointmentId: number,
  chosenDateTime: string
): Promise<void> {
  const token = getAuthToken();
  
  const payload: AppointmentConfirmRequest = { chosenDateTime };
  
  const response = await fetch(
    `${config.apiUrl}${config.endpoints.student.confirmIndividual}`.replace(':appointmentId', String(appointmentId)),
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

// Función para confirmar asistencia a citas grupales
export async function fetchConfirmGroupAppointment(
  appointmentId: number,
  studentId: number,
  chosenDateTime: string
): Promise<void> {
  const token = getAuthToken();
  
  const payload: AppointmentConfirmRequest = { chosenDateTime };
  
  const response = await fetch(
    `${config.apiUrl}${config.endpoints.student.confirmGroup}`
      .replace(':appointmentId', String(appointmentId))
      .replace(':studentId', String(studentId)),
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

// Función para cancelar citas individuales
export async function fetchCancelIndividualAppointment(
  appointmentId: number
): Promise<void> {
  const token = getAuthToken();
  
  const response = await fetch(
    `${config.apiUrl}${config.endpoints.student.cancelIndividual}`.replace(':appointmentId', String(appointmentId)),
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

// Función para cancelar asistencia a citas grupales
export async function fetchCancelGroupAppointmentAttendance(
  appointmentId: number,
  studentId: number
): Promise<void> {
  const token = getAuthToken();
  
  const response = await fetch(
    `${config.apiUrl}${config.endpoints.student.cancelGroup}`
      .replace(':appointmentId', String(appointmentId))
      .replace(':studentId', String(studentId)),
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