import { config } from 'config';
import type { LoginRequest } from '@/infrastructure/dto/auth/LoginRequest';
import type { LoginResponse } from '@/infrastructure/dto/auth/LoginResponse';

export async function login(payload: LoginRequest): Promise<LoginResponse> {
  const response = await fetch(`${config.apiUrl}${config.endpoints.auth.login}`, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Error de autenticación');
  }

  return response.json();
}