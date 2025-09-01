import { isTokenPresent } from "src/dashboard/shared/auth";

// Función para cargar instructores
export async function fetchAssignedInstructor(studentId, token) {
    isTokenPresent(token);
    const response = await fetch(`http://localhost:8080/student/assigned/instructor/${studentId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) throw new Error(response.statusText);
    return await response.json();
}

// Función para cargar estudiantes asignados a un instructor
export async function fetchStudentsAssignedByInstructor(instructorId, token) {
    isTokenPresent(token);
    const response = await fetch(`http://localhost:8080/student/assigned/${instructorId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) throw new Error(response.statusText);
    return await response.json();
}

// Función para enviar el formulario de cita individual
export async function submitIndividualAppointment(data, token) {
    isTokenPresent(token);
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
}

// Función para enviar el formulario de cita grupal
export async function submitGroupAppointment(data, token) {
    isTokenPresent(token);
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
}

// Función para cargar estudiante específico
export async function fetchStudentById(id, token) {
    isTokenPresent(token);
    const response = await fetch(`http://localhost:8080/student/${id}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) throw new Error(response.statusText);
    return await response.json();
}

// Función para cargar citas enviadas por el estudiante
export async function fetchAppointmentsSent(studentId, token) {
    isTokenPresent(token);
    const response = await fetch(`http://localhost:8080/student/appointments/sent/${studentId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) throw new Error(response.statusText);
    return await response.json();
}

// Función para cargar citas recibidas por el estudiante
export async function fetchAppointmentsReceived(studentId, token) {
    isTokenPresent(token);
    const response = await fetch(`http://localhost:8080/student/appointments/received/${studentId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) throw new Error(response.statusText);
    return await response.json();
}

// Función para confirmar citas individuales
export async function fetchConfirmIndividualAppointment(appointmentId, chosenDateTime, token) {
    isTokenPresent(token);
    const response = await fetch(`http://localhost:8080/student/appointments/confirm/${appointmentId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ chosenDateTime })
    });
    if (!response.ok) throw new Error(response.statusText);
}

// Función para confirmar asistencia a citas grupales
export async function fetchConfirmGroupAppointment(appointmentId, studentId, chosenDateTime, token) {
    isTokenPresent(token);
    const response = await fetch(`http://localhost:8080/student/appointments/confirm/${appointmentId}/${studentId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ chosenDateTime })
    });
    if (!response.ok) throw new Error(response.statusText);
}

// Función para cancelar citas individuales
export async function fetchCancelIndividualAppointment(appointmentId, token) {
    isTokenPresent(token);
    const response = await fetch(`http://localhost:8080/student/appointments/cancel/${appointmentId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) throw new Error(response.statusText);
}

// Función para cancelar asistencia a citas grupales
export async function fetchCancelGroupAppointmentAttendance(appointmentId, studentId, token) {
    isTokenPresent(token);
    const response = await fetch(`http://localhost:8080/student/appointments/cancel/${appointmentId}/${studentId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) throw new Error(response.statusText);
}