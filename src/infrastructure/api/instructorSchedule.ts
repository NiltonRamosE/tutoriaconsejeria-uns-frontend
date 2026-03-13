import { getToken, isTokenPresent } from '@/dashboard/shared/authUtils';
import { config } from 'config';
import type { InstructorScheduleResponse } from '@/infrastructure/dto/instructor-schedule/InstructorScheduleResponse';

const getAuthToken = (): string => {
  const token = getToken();
  isTokenPresent(token);
  return token as string;
};

// Función para cargar horario de docente
export async function fetchFindInstructorScheduleByInstructor(emailInstructor: string): Promise<InstructorScheduleResponse> {
    const token = getAuthToken();
    const response = await fetch( `${config.apiUrl}${config.endpoints.schedule.instructorSchedule}?emailInstructor=${emailInstructor}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Error ${response.status}: ${response.statusText}`);
      }
    
    return await response.json() as InstructorScheduleResponse;
}