import { isTokenPresent } from "src/dashboard/shared/auth";

// Función para cargar horario de docente
export async function fetchFindInstructorScheduleByInstructor(emailInstructor, token) {
    isTokenPresent(token);
    const response = await fetch(`http://localhost:8080/instructor-schedule?emailInstructor=${emailInstructor}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error(response.statusText);
    return await response.json();
}