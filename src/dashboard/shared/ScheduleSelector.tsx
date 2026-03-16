import React from 'react';

export interface ScheduleSelectorProps {
  idPrefix: string;
}

const ScheduleSelector: React.FC<ScheduleSelectorProps> = ({ idPrefix }) => {
  // Función para obtener la fecha mínima (mañana)
  const getMinDate = () => {
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
    return tomorrow.toISOString().slice(0, 16);
  };

  return (
    <>
      {/* Modal para selección de horarios */}
      <div 
        id={`${idPrefix}-scheduleModal`} 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50" 
        role="dialog" 
        hidden 
        aria-modal="true"
      >
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
              id={`${idPrefix}-closeModal`} 
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
            <div id={`${idPrefix}-selectedSlots`} className="space-y-2">
              <p className="text-sm text-gray-500 italic">No hay horarios seleccionados</p>
            </div>
          </div>

          {/* Grid de horarios */}
          <div className="overflow-x-auto rounded-lg border border-theme-rich-black/10 shadow-sm">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-theme-keppel/10 to-theme-keppel/5">
                  <th className="p-3 border border-theme-rich-black/10 text-theme-rich-black font-semibold text-sm">Hora</th>
                  <th className="p-3 border border-theme-rich-black/10 text-theme-rich-black font-semibold text-sm">Lunes</th>
                  <th className="p-3 border border-theme-rich-black/10 text-theme-rich-black font-semibold text-sm">Martes</th>
                  <th className="p-3 border border-theme-rich-black/10 text-theme-rich-black font-semibold text-sm">Miércoles</th>
                  <th className="p-3 border border-theme-rich-black/10 text-theme-rich-black font-semibold text-sm">Jueves</th>
                  <th className="p-3 border border-theme-rich-black/10 text-theme-rich-black font-semibold text-sm">Viernes</th>
                  <th className="p-3 border border-theme-rich-black/10 text-theme-rich-black font-semibold text-sm">Sábado</th>
                </tr>
              </thead>
              <tbody id={`${idPrefix}-scheduleGrid`} className="divide-y divide-theme-rich-black/5">
                {/* Las filas se generarán dinámicamente */}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end mt-6 space-x-3 pt-4 border-t border-theme-rich-black/10">
            <button 
              type="button" 
              id={`${idPrefix}-cancelModal`} 
              className="bg-theme-rich-black/5 text-theme-rich-black font-medium py-2.5 px-6 rounded-lg hover:bg-theme-rich-black/10 transition-all duration-200 border border-theme-rich-black/10 shadow-sm"
            >
              Cancelar
            </button>
            <button 
              type="button" 
              id={`${idPrefix}-confirmSlots`} 
              className="bg-gradient-to-r from-theme-keppel to-theme-keppel-dark text-white font-medium py-2.5 px-6 rounded-lg hover:from-theme-keppel-dark hover:to-theme-keppel transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Confirmar horarios
            </button>
          </div>
        </div>
      </div>

      {/* Horarios Alternativos (solo para citas grupales) */}
      <div id={`${idPrefix}-groupScheduleContainer`} className="mb-4 hidden">
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

      {/* Selector de horarios interactivo (solo para citas individuales) */}
      <div id={`${idPrefix}-individualScheduleContainer`} className="mb-4 hidden">
        <span className="text-sm font-medium mb-2 text-theme-rich-black/80 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-theme-keppel" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Horarios Preferidos
        </span>
        <button 
          id={`${idPrefix}-openScheduleModal`} 
          type="button" 
          className="w-full p-5 border-2 border-dashed border-theme-keppel/40 rounded-xl text-theme-keppel hover:bg-theme-keppel/5 transition-all duration-200 flex flex-col items-center bg-gradient-to-b from-white to-theme-seasalt hover:from-theme-keppel/5 hover:to-theme-keppel/10 shadow-sm hover:shadow-md"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="font-medium">Seleccionar horarios en el calendario</span>
          <span className="text-sm text-theme-rich-black/60 mt-1">Haz clic para abrir el selector de horarios</span>
        </button>
        
        <div id={`${idPrefix}-selectedSchedulePreview`} className="mt-3 space-y-2 hidden">
          <p className="text-sm font-medium text-theme-rich-black/80 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-theme-keppel" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Horarios seleccionados:
          </p>
          {/* Se llenará dinámicamente */}
        </div>
      </div>
    </>
  );
};

export default ScheduleSelector;