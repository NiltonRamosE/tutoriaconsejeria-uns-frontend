import React, { useState, useRef } from 'react';
import ScheduleTable from '@/dashboard/shared/ScheduleTable';
import { createScheduleRenderer } from '@/dashboard/shared/scheduleManager';
import { fetchFindInstructorScheduleByInstructor } from '@/infrastructure/api/instructorSchedule';

const InstructorScheduleSection: React.FC = () => {
  const [searchEmail, setSearchEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Referencia para el scheduleRenderer
  const rendererRef = useRef<ReturnType<typeof createScheduleRenderer> | null>(null);

  // Inicializar el renderer
  React.useEffect(() => {
    rendererRef.current = createScheduleRenderer('instructor');
    
    return () => {
      // Cleanup si es necesario
    };
  }, []);

  const handleSearch = async () => {
    if (!rendererRef.current) return;

    const trimmedEmail = searchEmail.trim();
    if (!trimmedEmail) {
      alert('Por favor, ingresa el correo del docente.');
      return;
    }

    setIsLoading(true);
    
    // Ocultar schedule y empty state
    rendererRef.current.hide();
    const emptyState = document.getElementById('instructorEmptyState');
    if (emptyState) emptyState.classList.add('hidden');

    try {
      const data = await fetchFindInstructorScheduleByInstructor(trimmedEmail);
      
      if (rendererRef.current) {
        rendererRef.current.setTitle(`Horario - ${data.instructorName || trimmedEmail}`);
        rendererRef.current.render(data.academicSchedule || [], { 
          emptyStateId: 'instructorEmptyState' 
        });
        rendererRef.current.show();
      }
    } catch (error) {
      console.error('Error al cargar horarios de docentes:', error);
      alert('Error al cargar el horario del docente. Por favor, verifica el correo e intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-lg border-2 border-b-8 border-theme-rich-black">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <h2 className="text-2xl font-bold text-theme-rich-black">Horario de Docentes</h2>
        
        <div className="flex flex-col md:flex-row items-stretch gap-2 w-full sm:w-auto">
          {/* Campo de búsqueda */}
          <div className="relative flex-grow">
            <input
              type="text"
              id="instructorScheduleSearchInput"
              placeholder="Ingresar correo..."
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              className="bg-white text-theme-rich-black border-2 border-b-8 border-theme-rich-black font-medium py-2 px-4 pl-10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-theme-keppel focus:border-transparent transition-all duration-200 w-full xs:w-64"
              disabled={isLoading}
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-theme-rich-black/50" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>

          {/* Botón Buscar */}
          <button
            id="searchInstructorScheduleBtn"
            onClick={handleSearch}
            disabled={isLoading}
            className="bg-theme-keppel text-theme-rich-black border-2 border-b-8 border-theme-rich-black font-medium py-2 px-4 rounded-2xl hover:bg-theme-keppel/90 transition-colors duration-200 flex items-center justify-center xs:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Buscando...' : 'Buscar'}
          </button>
        </div>
      </div>
      
      <div className="space-y-6">
        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-theme-keppel"></div>
            <p className="mt-2 text-sm text-gray-600">Cargando horario...</p>
          </div>
        )}

        {/* Schedule Display */}
        <ScheduleTable idPrefix="instructor" title="" />

        {/* Empty State */}
        <div id="instructorEmptyState" className="hidden text-center py-8">
          <p className="text-gray-500">No se encontraron horarios para este docente.</p>
        </div>
      </div>
    </div>
  );
};

export default InstructorScheduleSection;