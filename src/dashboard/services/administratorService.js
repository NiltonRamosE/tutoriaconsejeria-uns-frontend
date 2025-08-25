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