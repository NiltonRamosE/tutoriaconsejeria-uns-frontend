import { getToken, isTokenPresent } from '@/dashboard/shared/authUtils';
import { config } from 'config';
import type { BusyScheduleResponse } from '@/infrastructure/dto/academic-schedule/BusyScheduleResponse';
import type { AcademicScheduleResponse } from '@/infrastructure/dto/academic-schedule/AcademicScheduleResponse';

const getAuthToken = (): string => {
  const token = getToken();
  isTokenPresent(token);
  return token as string;
};

// Obtener horarios ocupados comparando estudiante e instructor
export async function fetchBusySchedules(
  studentId: number, 
  instructorId: number
): Promise<BusyScheduleResponse[]> {
  const token = getAuthToken();
  
  const response = await fetch(
    `${config.apiUrl}${config.endpoints.schedule.compare}`
      .replace(':studentId', String(studentId))
      .replace(':instructorId', String(instructorId)), 
    {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${token}` 
      }
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Error ${response.status}: ${response.statusText}`);
  }

  return await response.json() as BusyScheduleResponse[];
}

// Obtener horarios académicos por ciclo
export async function fetchAcademicSchedules(
  selectedCycle: string
): Promise<AcademicScheduleResponse[]> {
  const token = getAuthToken();
  
  const response = await fetch(
    `${config.apiUrl}${config.endpoints.schedule.byCycle}?cycle=${encodeURIComponent(selectedCycle)}`, 
    {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${token}` 
      }
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Error ${response.status}: ${response.statusText}`);
  }

  return await response.json() as AcademicScheduleResponse[];
}