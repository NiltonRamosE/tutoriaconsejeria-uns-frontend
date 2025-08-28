export function formatDate(dateString) {
    if (!dateString) return '--';

    try {
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    } catch (error) {
        console.error('Error formateando fecha:', error);
        return '--';
    }
}

export function formatTime(timeString) {
    if (!timeString) return '--:--';
    
    try {
        const timeParts = timeString.split(':');
        if (timeParts.length >= 2) {
            return `${timeParts[0]}:${timeParts[1]}`;
        }
        return timeString;
    } catch (error) {
        console.error('Error formateando hora:', error);
        return '--:--';
    }
}

export function showError(message) {
    const sentContainer = document.getElementById('sentAppointmentsContainer');
    const receivedContainer = document.getElementById('receivedAppointmentsContainer');
    
    sentContainer.innerHTML = `
        <div class="text-center py-8 text-red-500">
            <p>${message}</p>
        </div>
    `;
    
    receivedContainer.innerHTML = `
        <div class="text-center py-8 text-red-500">
            <p>${message}</p>
        </div>
    `;
}

export function getDayName(dateTimeString) {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const date = new Date(dateTimeString);
    return days[date.getDay()];
}

export function getAppointmentStatusInfo(state) {
    const statusMap = {
        PENDIENTE:    { statusClass: 'bg-yellow-100 text-yellow-800 border-yellow-200', statusIcon: '⏳' },
        ACEPTADA:     { statusClass: 'bg-green-100 text-green-800 border-green-200', statusIcon: '✅' },
        EN_PROCESO:   { statusClass: 'bg-orange-100 text-orange-800 border-orange-200', statusIcon: '🔄' },
        FINALIZADA:   { statusClass: 'bg-blue-100 text-blue-800 border-blue-200', statusIcon: '✔️' },
        CANCELADA:    { statusClass: 'bg-red-100 text-red-800 border-red-200', statusIcon: '❌' }
    };

    return statusMap[state] || { statusClass: 'bg-gray-100 text-gray-800 border-gray-200', statusIcon: '❓' };
}