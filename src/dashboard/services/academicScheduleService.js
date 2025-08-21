export async function fetchBusySchedules(studentId, instructorId, token) {
  try {
    const response = await fetch(
      `http://localhost:8080/academic-schedule/compare/${studentId}/${instructorId}`,
      {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error al cargar los horarios ocupados:', error);
    throw error;
  }
}
