import { type User } from '@/domain/entities/User';

export function getUser(): User | null {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr) as User;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
}

export function getToken(): string | null {
  return localStorage.getItem('token');
}

export function isTokenPresent(token: string | null): void {
  if (!token || token !== getToken()) {
    throw new Error('No hay token de autenticación o es inválido');
  }
}