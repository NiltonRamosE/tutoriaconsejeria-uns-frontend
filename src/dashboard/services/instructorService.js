// Función para cargar estudiantes asignados a un instructor
export async function fetchStudentsAssignedByInstructor(instructorId, token) {
    try {
        const response = await fetch(`http://localhost:8080/instructor/assigned/${instructorId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error(response.statusText);
        return await response.json();
    } catch (error) {
        console.error('Error al cargar los estudiantes:', error);
        throw error;
    }
}

// Función para enviar el formulario de cita individual
export async function submitIndividualAppointment(data, token) {
    try {
        const response = await fetch('http://localhost:8080/instructor/appointment/individual', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error(await response.text());
        return await response.json();
    } catch (error) {
        console.error('Error al programar la cita individual:', error);
        throw error;
    }
}

// Función para enviar el formulario de cita grupal
export async function submitGroupAppointment(data, token) {
    try {
        const response = await fetch('http://localhost:8080/instructor/appointment/group', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error(await response.text());
        return await response.json();
    } catch (error) {
        console.error('Error al programar la cita grupal:', error);
        throw error;
    }
}

// Función para cargar citas enviadas por el instructor
export async function fetchAppointmentsSent(instructorId, token) {
    try {
        const response = await fetch(`http://localhost:8080/instructor/appointments/sent/${instructorId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error(response.statusText);
        return await response.json();
    } catch (error) {
        console.error('Error al cargar las citas enviadas por el instructor:', error);
        throw error;
    }
}