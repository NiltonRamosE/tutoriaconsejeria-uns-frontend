import { isTokenPresent } from "src/dashboard/shared/auth";

export async function fetchBusySchedules(studentId, instructorId, token) {
  isTokenPresent(token);
  const response = await fetch(`http://localhost:8080/academic-schedule/compare/${studentId}/${instructorId}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }

  return await response.json();
}

export async function fetchAcademicSchedules(selectedCycle, token) {
  isTokenPresent(token);
  const response = await fetch(`http://localhost:8080/academic-schedule?cycle=${selectedCycle}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` }
  });

  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }

  return await response.json();
}