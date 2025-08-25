// Función para cargar lista de asignaciones
export async function fetchStudentsList(token) {
    try {
        const response = await fetch(`http://localhost:8080/administrator/assign/list`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error(response.statusText);
        return await response.json();
    } catch (error) {
        console.error('Error al cargar la lista de asignaciones:', error);
        throw error;
    }
}

// Función para asignar estudiantes a docentes
export async function fetchDistributeStudentsAmongInstructors(token) {
    try {
        const response = await fetch(`http://localhost:8080/administrator/students/assign`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error(response.statusText);
        return await response.json();
    } catch (error) {
        console.error('Error al efectuar las asignaciones:', error);
        throw error;
    }
}

// Función para listar a docentes
export async function fetchInstructorsList(token) {
    try {
        const response = await fetch(`http://localhost:8080/administrator/instructors/list`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error(response.statusText);
        return await response.json();
    } catch (error) {
        console.error('Error al cargar los docentes:', error);
        throw error;
    }
}

// Crear administrador
export async function fetchCreateAdministrator(formData, token) {
    try {
        const response = await fetch(`http://localhost:8080/administrator`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
        });

        if (!response.ok) throw new Error(response.statusText);
        return response;
    } catch (error) {
        console.error('Error al crear administrador:', error);
        throw error;
    }
}

// Actualizar administrador
export async function fetchUpdateAdministrator(formData, token) {
    try {
        const response = await fetch(`http://localhost:8080/administrator/update`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
        });

        if (!response.ok) throw new Error(response.statusText);
        return response;
    } catch (error) {
        console.error('Error al actualizar administrador:', error);
        throw error;
    }
}

// Función para eliminar administrador
export async function fetchDeleteAdministrator(id, token) {
    try {
        const response = await fetch(`http://localhost:8080/administrator/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error(response.statusText);
        return response;
    } catch (error) {
        console.error('Error al eliminar el administrador:', error);
        throw error;
    }
}

// Función para listar administradores
export async function fetchAdministratorsList(token) {
    try {
        const response = await fetch(`http://localhost:8080/administrator`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error(response.statusText);
        return await response.json();
    } catch (error) {
        console.error('Error al cargar los administradores:', error);
        throw error;
    }
}