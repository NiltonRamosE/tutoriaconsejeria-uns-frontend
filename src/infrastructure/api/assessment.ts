import { getToken, isTokenPresent } from '@/dashboard/shared/authUtils';
import { config } from 'config';
import type { AssessmentStudentResponse } from '@/infrastructure/dto/assessment/AssessmentStudentResponse';
import type { AssessmentInstructorResponse } from '@/infrastructure/dto/assessment/AssessmentInstructorResponse';

const getAuthToken = (): string => {
  const token = getToken();
  isTokenPresent(token);
  return token as string;
};

// Función para comprobar existencia del assessment
export async function fetchIsEnabledAssessment(
  studentId: number,
  instructorId: number,
  typeActivity: string,
  isStudentEvaluating: boolean
): Promise<number | null> {
  const token = getAuthToken();
  
  const response = await fetch(
    `${config.apiUrl}${config.endpoints.assessment.isEnabled}`
    .replace(':studentId', String(studentId))
    .replace(':instructorId', String(instructorId))
    .replace(':typeActivity', String(typeActivity))
    .replace(':isStudentEvaluating', String(isStudentEvaluating)),
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );
  
  if (response.status === 204) {
    return null;
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || response.statusText);
  }

  return await response.json(); 
}

//Función para buscar un assessment
export async function fetchAssessmentById(
  id: number,
): Promise<AssessmentStudentResponse | AssessmentInstructorResponse> {

  const token = getAuthToken();

  const response = await fetch(
    `${config.apiUrl}${config.endpoints.assessment.search}`
      .replace(':id', String(id)),
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

  return await response.json();
}