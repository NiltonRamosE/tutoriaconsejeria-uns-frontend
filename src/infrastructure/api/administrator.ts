import { getToken, isTokenPresent } from '@/dashboard/shared/authUtils';
import { config } from 'config';
import type { AssignmentResponse } from '@/infrastructure/dto/assigment/AssignmentResponse';
import type { InstructorResponse } from '@/infrastructure/dto/administrator/InstructorResponse';
import type { AdministratorRequest } from '@/infrastructure/dto/administrator/AdministratorRequest';
import type { AdministratorResponse } from '@/infrastructure/dto/administrator/AdministratorResponse';
import type { StudentResponse } from '@/infrastructure/dto/administrator/StudentResponse';

const getAuthToken = (): string => {
  const token = getToken();
  isTokenPresent(token);
  return token as string;
};

// Función para cargar lista de asignaciones
export async function fetchStudentsList(): Promise<AssignmentResponse[]> {
  const token = getAuthToken();
  
  const response = await fetch(`${config.apiUrl}${config.endpoints.administrator.listAssignedStudents}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || response.statusText);
  }
  
  return await response.json() as AssignmentResponse[];
}

// Función para asignar estudiantes a docentes
export async function fetchDistributeStudentsAmongInstructors(): Promise<void> {
  const token = getAuthToken();
  
  const response = await fetch(`${config.apiUrl}${config.endpoints.administrator.assignStudents}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || response.statusText);
  }  
}

// Función para listar a docentes
export async function fetchInstructorsList(): Promise<InstructorResponse[]> {
  const token = getAuthToken();
  
  const response = await fetch(`${config.apiUrl}${config.endpoints.administrator.listInstructors}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || response.statusText);
  }
  
  return await response.json() as InstructorResponse[];
}

// Crear administrador
export async function fetchCreateAdministrator(formData: AdministratorRequest): Promise<void> {
  const token = getAuthToken();
  
  const response = await fetch(`${config.apiUrl}${config.endpoints.administrator.create}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || response.statusText);
  }
}

// Actualizar administrador
export async function fetchUpdateAdministrator(formData: AdministratorRequest): Promise<void> {
  const token = getAuthToken();
  
  const response = await fetch(`${config.apiUrl}${config.endpoints.administrator.update}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || response.statusText);
  }
}

// Función para eliminar administrador
export async function fetchDeleteAdministrator(id: string): Promise<void> {
  const token = getAuthToken();
  
  const response = await fetch(`${config.apiUrl}${config.endpoints.administrator.delete}`.replace(":id", id), {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || response.statusText);
  }
}

// Función para listar administradores
export async function fetchAdministratorsList(): Promise<AdministratorResponse[]> {
  const token = getAuthToken();
  
  const response = await fetch(`${config.apiUrl}${config.endpoints.administrator.list}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || response.statusText);
  }
  
  return await response.json() as AdministratorResponse[];
}

// Listar estudiantes según un filtro
export async function fetchStudentsByFilter(endpoint: string): Promise<StudentResponse[]> {
  const token = getAuthToken();
  
  const response = await fetch(`${config.apiUrl}${config.endpoints.administrator.studentsByFilter}`.replace(":endpoint", endpoint), {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || response.statusText);
  }
  
  return await response.json() as StudentResponse[];
}