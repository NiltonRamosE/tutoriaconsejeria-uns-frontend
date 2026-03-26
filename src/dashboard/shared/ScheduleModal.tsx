// src/dashboard/shared/ScheduleModal.tsx
import React, { useState, useEffect } from 'react';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (slots: string[]) => void;
  busySchedules?: any[]; // Reemplazar con el tipo correcto
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm,
  busySchedules = [] 
}) => {
  const [selectedSlots, setSelectedSlots] = useState<Array<{time: string, day: string}>>([]);

  useEffect(() => {
    if (isOpen) {
      setSelectedSlots([]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const days = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO'];
  const hours = Array.from({ length: 14 }, (_, i) => `${(i + 7).toString().padStart(2, '0')}:00`);

  const isTimeSlotBusy = (time: string, day: string) => {
    return busySchedules.some((schedule: any) => {
      const [startTime, endTime, scheduleDay] = schedule;
      if (scheduleDay !== day) return false;
      const [timeH] = time.split(':').map(Number);
      const [startH] = startTime.split(':').map(Number);
      const [endH] = endTime.split(':').map(Number);
      return timeH >= startH && timeH < endH;
    });
  };

  const toggleSlot = (time: string, day: string) => {
    setSelectedSlots(prev => {
      const exists = prev.find(s => s.time === time && s.day === day);
      if (exists) {
        return prev.filter(s => !(s.time === time && s.day === day));
      } else {
        if (prev.length >= 3) {
          alert('Solo puedes seleccionar hasta 3 horarios');
          return prev;
        }
        return [...prev, { time, day }];
      }
    });
  };

  const calculateDateForDay = (dayName: string): string => {
    const today = new Date();
    const currentDay = today.getDay();
    const dayMap: Record<string, number> = {
      'LUNES': 1, 'MARTES': 2, 'MIERCOLES': 3, 'JUEVES': 4, 'VIERNES': 5, 'SABADO': 6
    };
    const targetDay = dayMap[dayName];
    if (targetDay === undefined) return '';
    let diff = targetDay - currentDay;
    if (diff <= 0) diff += 7;
    const target = new Date(today);
    target.setDate(today.getDate() + diff);
    return target.toISOString().split('T')[0];
  };

  const handleConfirm = () => {
    if (selectedSlots.length === 0) {
      alert('Por favor selecciona al menos un horario');
      return;
    }

    const today = new Date();
    const dateTimeSlots = selectedSlots.map((slot, i) => {
      const input = document.getElementById(`slotDate-${i}`) as HTMLInputElement;
      let date = input?.value;
      if (!date) {
        date = calculateDateForDay(slot.day);
      } else {
        const chosenDate = new Date(date);
        if (chosenDate <= today) {
          date = calculateDateForDay(slot.day);
        }
      }
      return `${date}T${slot.time}`;
    });

    onConfirm(dateTimeSlots);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50" role="dialog" aria-modal="true">
      <div className="bg-white rounded-2xl p-6 w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl border border-theme-keppel/20">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-theme-rich-black/10">
          <h3 className="text-xl font-bold text-theme-rich-black flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-theme-keppel" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Selecciona tus horarios preferidos
          </h3>
          <button 
            type="button" 
            onClick={onClose}
            className="text-theme-rich-black hover:text-red-500 transition-colors duration-200 p-1 rounded-full hover:bg-red-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Horarios seleccionados */}
        <div className="mb-6 bg-gradient-to-br from-theme-seasalt to-theme-keppel/5 p-4 rounded-xl border border-theme-keppel/20 shadow-sm">
          <h4 className="font-medium mb-3 text-theme-rich-black flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-theme-keppel" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Horarios seleccionados:
          </h4>
          <div className="space-y-2">
            {selectedSlots.length === 0 ? (
              <p className="text-sm text-gray-500 italic">No hay horarios seleccionados</p>
            ) : (
              selectedSlots.map((slot, index) => {
                const suggestedDate = calculateDateForDay(slot.day);
                return (
                  <div key={index} className="flex flex-col bg-gradient-to-r from-theme-seasalt to-theme-keppel/5 p-3 rounded-xl border border-theme-keppel/30 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="bg-theme-keppel/10 p-2 rounded-lg">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-theme-keppel" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <span className="font-medium text-theme-rich-black">{slot.day}</span>
                          <span className="block text-sm text-theme-rich-black/70">{slot.time}</span>
                        </div>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => setSelectedSlots(prev => prev.filter((_, i) => i !== index))}
                        className="bg-white/80 hover:bg-red-50 p-2 rounded-lg border border-red-200"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <input 
                      type="date" 
                      id={`slotDate-${index}`} 
                      defaultValue={suggestedDate}
                      min={suggestedDate}
                      step="7"
                      className="mt-2 p-2 border rounded-lg border-theme-rich-black/20 focus:ring-2 focus:ring-theme-keppel"
                    />
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Grid de horarios */}
        <div className="overflow-x-auto rounded-lg border border-theme-rich-black/10 shadow-sm">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-theme-keppel/10 to-theme-keppel/5">
                <th className="p-3 border border-theme-rich-black/10 text-theme-rich-black font-semibold text-sm">Hora</th>
                {days.map(day => (
                  <th key={day} className="p-3 border border-theme-rich-black/10 text-theme-rich-black font-semibold text-sm">{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {hours.map(time => (
                <tr key={time}>
                  <td className="p-2 border border-theme-rich-black/20 bg-theme-keppel/10 font-medium">{time}</td>
                  {days.map(day => {
                    const busy = isTimeSlotBusy(time, day);
                    const selected = selectedSlots.some(s => s.time === time && s.day === day);
                    return (
                      <td
                        key={day}
                        onClick={() => !busy && toggleSlot(time, day)}
                        className={`p-2 border border-theme-rich-black/20 text-center cursor-pointer transition-colors duration-200 ${
                          busy ? 'bg-red-100 text-red-500 cursor-not-allowed' : 
                          selected ? 'bg-theme-keppel text-white' : 'hover:bg-theme-keppel/20'
                        }`}
                      >
                        {busy ? '✗' : selected ? '✓' : '○'}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end mt-6 space-x-3 pt-4 border-t border-theme-rich-black/10">
          <button 
            type="button" 
            onClick={onClose}
            className="bg-theme-rich-black/5 text-theme-rich-black font-medium py-2.5 px-6 rounded-lg hover:bg-theme-rich-black/10 transition-all duration-200 border border-theme-rich-black/10 shadow-sm"
          >
            Cancelar
          </button>
          <button 
            type="button" 
            onClick={handleConfirm}
            className="bg-gradient-to-r from-theme-keppel to-theme-keppel-dark text-white font-medium py-2.5 px-6 rounded-lg hover:from-theme-keppel-dark hover:to-theme-keppel transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Confirmar horarios
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleModal;