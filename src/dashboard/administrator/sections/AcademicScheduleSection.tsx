import React, { useState, useRef } from 'react';
import ScheduleTable from '@/dashboard/shared/ScheduleTable';
import { createScheduleRenderer, getCycleName } from '@/dashboard/shared/scheduleManager';
import { fetchAcademicSchedules } from '@/infrastructure/api/academicSchedule';

const AcademicScheduleSection: React.FC = () => {
  const [selectedCycle, setSelectedCycle] = useState<string>('1');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const rendererRef = useRef<ReturnType<typeof createScheduleRenderer> | null>(null);

  React.useEffect(() => {
    rendererRef.current = createScheduleRenderer('academic');
    
    return () => {
      // Cleanup si es necesario
    };
  }, []);

  const cycles = [
    { value: '1', label: 'PRIMERO' },
    { value: '2', label: 'SEGUNDO' },
    { value: '3', label: 'TERCERO' },
    { value: '4', label: 'CUARTO' },
    { value: '5', label: 'QUINTO' },
    { value: '6', label: 'SEXTO' },
    { value: '7', label: 'SEPTIMO' },
    { value: '8', label: 'OCTAVO' },
    { value: '9', label: 'NOVENO' },
    { value: '10', label: 'DECIMO' },
  ];

  const handleLoadSchedule = async () => {
    if (!rendererRef.current) return;

    setIsLoading(true);
    
    // Ocultar schedule y empty state
    rendererRef.current.hide();
    const emptyState = document.getElementById('emptyState');
    if (emptyState) emptyState.classList.add('hidden');

    try {
      const scheduleData = await fetchAcademicSchedules(selectedCycle);

      if (rendererRef.current) {
        rendererRef.current.setTitle(`Horario - Ciclo ${getCycleName(selectedCycle)}`);
        rendererRef.current.render(scheduleData, { emptyStateId: 'emptyState' });
        rendererRef.current.show();
      }
    } catch (error) {
      console.error('Error al cargar los horarios:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-lg border-2 border-b-8 border-theme-rich-black">
      <h2 className="text-2xl font-bold mb-6 text-theme-rich-black">Horarios Académicos</h2>
      
      <div className="space-y-6">
        {/* Selector de Ciclo */}
        <div className="flex flex-col xs:flex-row items-start xs:items-center gap-3 xs:gap-4">
          <label htmlFor="cycleSelect" className="text-sm font-medium text-theme-rich-black xs:whitespace-nowrap">
            Seleccionar Ciclo:
          </label>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full xs:w-auto">
            <select 
              id="cycleSelect"
              value={selectedCycle}
              onChange={(e) => setSelectedCycle(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm border-theme-rich-black/40 focus:ring-theme-keppel focus:border-theme-keppel w-full sm:w-auto"
            >
              {cycles.map((cycle) => (
                <option key={cycle.value} value={cycle.value}>
                  {cycle.label}
                </option>
              ))}
            </select>
            
            <button 
              id="loadScheduleBtn"
              onClick={handleLoadSchedule}
              disabled={isLoading}
              className="bg-theme-keppel text-white px-4 py-2 rounded-md hover:bg-theme-keppel-dark transition-colors whitespace-nowrap w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cargar Horario
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div id="loadingIndicator" className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-theme-keppel"></div>
            <p className="mt-2 text-theme-rich-black">Cargando horarios...</p>
          </div>
        )}

        {/* Schedule Display */}
        <ScheduleTable idPrefix="academic" title="" />

        {/* Empty State */}
        <div id="emptyState" className="hidden text-center py-8">
          <p className="text-gray-500">No se encontraron horarios para este ciclo.</p>
        </div>
      </div>
    </div>
  );
};

export default AcademicScheduleSection;