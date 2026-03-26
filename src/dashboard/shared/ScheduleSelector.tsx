import React from 'react';

export interface ScheduleSelectorProps {
  idPrefix: string;
  selectedModality?: 'I' | 'G' | null;
  onOpenScheduleModal?: () => void;
  schedulePreviewVisible?: boolean;
  selectedSchedulePreviewRef?: React.RefObject<HTMLDivElement | null>;
}

const ScheduleSelector: React.FC<ScheduleSelectorProps> = ({ 
  idPrefix, 
  selectedModality,
  onOpenScheduleModal,
  schedulePreviewVisible,
  selectedSchedulePreviewRef 
}) => {
  const getMinDate = () => {
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
    return tomorrow.toISOString().slice(0, 16);
  };

  return (
    <>
      {/* Horarios Alternativos (solo para citas grupales) */}
      {selectedModality === 'G' && (
        <div id={`${idPrefix}-groupScheduleContainer`} className="mb-4">
          <span className="text-sm font-medium mb-2 text-theme-rich-black/80 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-theme-keppel" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Horarios Alternativos
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-gradient-to-b from-white to-theme-seasalt p-3 rounded-xl border border-theme-rich-black/10 shadow-sm">
              <label htmlFor={`${idPrefix}-altScheduleA`} className="block text-sm font-medium mb-1 text-theme-rich-black/70">Primera Opción</label>
              <input 
                type="datetime-local" 
                id={`${idPrefix}-altScheduleA`}
                min={getMinDate()}
                className="w-full p-3 border rounded-lg border-theme-rich-black/20 focus:ring-2 focus:ring-theme-keppel focus:border-transparent transition-all duration-200"
              />
            </div>

            <div className="bg-gradient-to-b from-white to-theme-seasalt p-3 rounded-xl border border-theme-rich-black/10 shadow-sm">
              <label htmlFor={`${idPrefix}-altScheduleB`} className="block text-sm font-medium mb-1 text-theme-rich-black/70">Segunda Opción</label>
              <input 
                type="datetime-local" 
                id={`${idPrefix}-altScheduleB`}
                min={getMinDate()}
                className="w-full p-3 border rounded-lg border-theme-rich-black/20 focus:ring-2 focus:ring-theme-keppel focus:border-transparent transition-all duration-200"
              />
            </div>

            <div className="bg-gradient-to-b from-white to-theme-seasalt p-3 rounded-xl border border-theme-rich-black/10 shadow-sm">
              <label htmlFor={`${idPrefix}-altScheduleC`} className="block text-sm font-medium mb-1 text-theme-rich-black/70">Tercera Opción</label>
              <input 
                type="datetime-local" 
                id={`${idPrefix}-altScheduleC`}
                min={getMinDate()}
                className="w-full p-3 border rounded-lg border-theme-rich-black/20 focus:ring-2 focus:ring-theme-keppel focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
        </div>
      )}

      {/* Selector de horarios interactivo (solo para citas individuales) */}
      {selectedModality === 'I' && (
        <div id={`${idPrefix}-individualScheduleContainer`} className="mb-4">
          <span className="text-sm font-medium mb-2 text-theme-rich-black/80 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-theme-keppel" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Horarios Preferidos
          </span>
          <button 
            id={`${idPrefix}-openScheduleModal`} 
            type="button" 
            onClick={onOpenScheduleModal}
            className="w-full p-5 border-2 border-dashed border-theme-keppel/40 rounded-xl text-theme-keppel hover:bg-theme-keppel/5 transition-all duration-200 flex flex-col items-center bg-gradient-to-b from-white to-theme-seasalt hover:from-theme-keppel/5 hover:to-theme-keppel/10 shadow-sm hover:shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="font-medium">Seleccionar horarios en el calendario</span>
            <span className="text-sm text-theme-rich-black/60 mt-1">Haz clic para abrir el selector de horarios</span>
          </button>
          
          {schedulePreviewVisible && (
            <div ref={selectedSchedulePreviewRef} className="mt-3 space-y-2"></div>
          )}
        </div>
      )}
    </>
  );
};

export default ScheduleSelector;