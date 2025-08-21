// Función para cargar instructores
export async function fetchAssignedInstructor(studentId, token) {
    try {
        const response = await fetch(`http://localhost:8080/student/assigned/instructor/${studentId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error(response.statusText);
        return await response.json();
    } catch (error) {
        console.error('Error al cargar los instructores:', error);
        throw error;
    }
}

// Función para cargar estudiantes asignados a un instructor
export async function fetchStudentsAssignedByInstructor(instructorId, token) {
    try {
        const response = await fetch(`http://localhost:8080/student/assigned/${instructorId}`, {
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
        const response = await fetch('http://localhost:8080/student/appointment/individual', {
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
        const response = await fetch('http://localhost:8080/student/appointment/group', {
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
