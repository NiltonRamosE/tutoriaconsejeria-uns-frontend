import { isTokenPresent } from "src/dashboard/shared/auth";

// Función para cargar estudiantes asignados a un instructor
export async function fetchStudentsAssignedByInstructor(instructorId, token) {
    isTokenPresent(token);
    const response = await fetch(`http://localhost:8080/instructor/assigned/${instructorId}`, {
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
}

// Función para enviar el formulario de cita grupal
export async function submitGroupAppointment(data, token) {
    isTokenPresent(token);
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
}

// Función para cargar citas enviadas por el instructor
export async function fetchAppointmentsSent(instructorId, token) {
    isTokenPresent(token);
    const response = await fetch(`http://localhost:8080/instructor/appointments/sent/${instructorId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) throw new Error(response.statusText);
    return await response.json();
}

// Función para cargar citas recibidas por el instructor
export async function fetchAppointmentsReceived(instructorId, token) {
    isTokenPresent(token);
    const response = await fetch(`http://localhost:8080/instructor/appointments/received/${instructorId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) throw new Error(response.statusText);
    return await response.json();
}

// Función para confirmar citas
export async function fetchPutAppointmentConfirm(appointmentId, chosenDateTime, token) {
    isTokenPresent(token);
    const response = await fetch(`http://localhost:8080/instructor/appointments/confirm/${appointmentId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ chosenDateTime })
    });
    if (!response.ok) throw new Error(response.statusText);
}

// Función para cancelar citas
export async function fetchPutAppointmentCancel(appointmentId, token) {
    isTokenPresent(token);
    const response = await fetch(`http://localhost:8080/instructor/appointments/cancel/${appointmentId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) throw new Error(response.statusText);
}