// src/components/shared/scheduleManager.js

export function createScheduleRenderer(idPrefix, options = {}) {
  const daysOrder = options.daysOrder || ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO'];

  // Paleta por curso
  const courseColors = options.courseColors || [
    'bg-blue-100 border-blue-300',
    'bg-green-100 border-green-300',
    'bg-yellow-100 border-yellow-300',
    'bg-purple-100 border-purple-300',
    'bg-pink-100 border-pink-300',
    'bg-indigo-100 border-indigo-300',
    'bg-red-100 border-red-300',
    'bg-amber-100 border-amber-300',
    'bg-lime-100 border-lime-300'
  ];

  const el = (suffix) => document.getElementById(`${idPrefix}-${suffix}`);

  // Utilidades
  function generateTimeSlots(startHour = 7, endHour = 20) {
    const hours = [];
    for (let i = startHour; i <= endHour; i++) {
      hours.push(`${i.toString().padStart(2, '0')}:00`);
    }
    return hours;
  }

  function calculateDuration(startTime, endTime) {
    const start = new Date(`2000-01-01T${startTime}`);
    const end   = new Date(`2000-01-01T${endTime}`);
    const diffHours = (end - start) / (1000 * 60 * 60);
    return Math.max(1, Math.round(diffHours));
  }

  function formatDisplayTime(time) {
    const [hour, minute] = time.split(':');
    const hourNum = parseInt(hour);
    return `${hourNum <= 12 ? hourNum : hourNum - 12}:${minute} ${hourNum < 12 ? 'AM' : 'PM'}`;
  }

  function setTitle(text) {
    const titleNode = el('scheduleTitle');
    if (titleNode) titleNode.textContent = text || '';
  }

  function show() {
    const container = el('scheduleContainer');
    if (container) container.classList.remove('hidden');
  }

  function hide() {
    const container = el('scheduleContainer');
    if (container) container.classList.add('hidden');
  }

  /**
   * Renderiza el calendario semanal.
   * @param {Array<{day:string, course:string, type:'TEO'|'LAB', startTime:string, endTime:string}>} schedules
   */
  function render(schedules = [], { emptyStateId } = {}) {
    const timeSlotsContainer = el('timeSlots');
    if (!timeSlotsContainer) return;

    timeSlotsContainer.innerHTML = '';

    // Manejo de estado vacío opcional
    if (emptyStateId) {
      const empty = document.getElementById(emptyStateId);
      if (empty) {
        if (!schedules || schedules.length === 0) empty.classList.remove('hidden');
        else empty.classList.add('hidden');
      }
    }

    if (!schedules || schedules.length === 0) return;

    // Mapeo curso->color
    const courseColorMap = {};
    const allCourses = [...new Set(schedules.map(s => s.course))];
    allCourses.forEach((course, idx) => {
      courseColorMap[course] = courseColors[idx % courseColors.length];
    });

    const timeSlots = generateTimeSlots();

    // Matriz [día][hora] -> array de cursos concurrentes
    const scheduleMatrix = {};
    daysOrder.forEach(day => {
      scheduleMatrix[day] = {};
      timeSlots.forEach(time => {
        scheduleMatrix[day][time] = [];
      });
    });

    // Llenar matriz
    schedules.forEach(item => {
      if (!daysOrder.includes(item.day)) return;
      const startHour = parseInt(item.startTime.split(':')[0]);
      const duration = calculateDuration(item.startTime, item.endTime);
      for (let i = 0; i < duration; i++) {
        const currentHour = startHour + i;
        const timeSlot = `${currentHour.toString().padStart(2, '0')}:00`;
        scheduleMatrix[item.day][timeSlot].push({
          ...item,
          isFirstHour: i === 0
        });
      }
    });

    // Render
    timeSlots.forEach(time => {
      // Columna de la hora
      const timeCol = document.createElement('div');
      timeCol.className = 'col-span-1 bg-theme-seasalt p-1 text-xs text-theme-rich-black text-center border-b border-theme-rich-black/10';
      timeCol.textContent = formatDisplayTime(time);
      timeSlotsContainer.appendChild(timeCol);

      // 6 días
      daysOrder.forEach(day => {
        const courses = scheduleMatrix[day][time];
        const cell = document.createElement('div');
        cell.className = 'p-1 bg-white border-b border-theme-rich-black/10 h-16';

        if (courses && courses.length > 0) {
          cell.innerHTML = `
            <div class="h-full flex">
              ${courses.map(course => {
                const baseColor = courseColorMap[course.course];
                const typeStyle = course.type === 'TEO'
                  ? 'border-l-4 border-l-blue-500'
                  : 'border-l-4 border-l-green-500';
                return `
                  <div class="h-full flex flex-col justify-center items-center p-1 rounded-sm ${baseColor} ${typeStyle}">
                    <span class="font-medium text-xs text-center truncate px-1">${course.course}</span>
                    <span class="text-2xs mt-0.5 font-semibold">${course.type}</span>
                  </div>
                `;
              }).join('')}
            </div>
          `;
        } else {
          cell.innerHTML = `<span class="text-gray-400 text-xs">Libre</span>`;
        }

        timeSlotsContainer.appendChild(cell);
      });
    });
  }

  return {
    setTitle,
    show,
    hide,
    render,
    generateTimeSlots,
    calculateDuration,
    formatDisplayTime,
  };
}

export function getCycleName(cycleNumber) {
  const cycleNames = { '1':'I','2':'II','3':'III','4':'IV','5':'V','6':'VI','7':'VII','8':'VIII','9':'IX','10':'X' };
  return cycleNames[cycleNumber] || cycleNumber;
}
