// Función para cargar horario de docente
export async function fetchFindInstructorScheduleByInstructor(emailInstructor, token) {
    try {
        const response = await fetch(`http://localhost:8080/instructor-schedule?emailInstructor=${emailInstructor}`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error(response.statusText);
        return await response.json();
    } catch (error) {
        console.error('Error al cargar horarios de docentes:', error);
        throw error;
    }
}