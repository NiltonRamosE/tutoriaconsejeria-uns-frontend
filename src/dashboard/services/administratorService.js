import { isTokenPresent } from "src/dashboard/shared/auth";

// Función para cargar lista de asignaciones
export async function fetchStudentsList(token) {
    isTokenPresent(token);
    const response = await fetch(`http://localhost:8080/administrator/assign/list`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) throw new Error(response.statusText);
    return await response.json();
}

// Función para asignar estudiantes a docentes
export async function fetchDistributeStudentsAmongInstructors(token) {
    isTokenPresent(token);
    const response = await fetch(`http://localhost:8080/administrator/students/assign`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) throw new Error(response.statusText);
}

// Función para listar a docentes
export async function fetchInstructorsList(token) {
    isTokenPresent(token);
    const response = await fetch(`http://localhost:8080/administrator/instructors/list`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) throw new Error(response.statusText);
    return await response.json();
}

// Crear administrador
export async function fetchCreateAdministrator(formData, token) {
    isTokenPresent(token);
    const response = await fetch(`http://localhost:8080/administrator`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    });

    if (!response.ok) throw new Error(response.statusText);
}

// Actualizar administrador
export async function fetchUpdateAdministrator(formData, token) {
    isTokenPresent(token);
    const response = await fetch(`http://localhost:8080/administrator/update`, {
    method: 'PUT',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
    });

    if (!response.ok) throw new Error(response.statusText);
}

// Función para eliminar administrador
export async function fetchDeleteAdministrator(id, token) {
    isTokenPresent(token);
    const response = await fetch(`http://localhost:8080/administrator/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) throw new Error(response.statusText);
}

// Función para listar administradores
export async function fetchAdministratorsList(token) {
    isTokenPresent(token);
    const response = await fetch(`http://localhost:8080/administrator`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) throw new Error(response.statusText);
    return await response.json();
}

// Listar estudiantes según un filtro
export async function fetchStudentsByFilter(endpoint, token) {
    isTokenPresent(token);
    const response = await fetch(`http://localhost:8080/administrator/${endpoint}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) throw new Error(response.statusText);
    return await response.json();
}
