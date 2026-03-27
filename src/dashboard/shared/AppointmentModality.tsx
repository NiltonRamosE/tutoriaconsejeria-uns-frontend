import React from 'react';

export interface AppointmentModalityProps {
  selectedModality?: 'I' | 'G' | null;
  onSelect: (modality: 'I' | 'G') => void;
}

const AppointmentModality: React.FC<AppointmentModalityProps> = ({ 
  selectedModality,
  onSelect 
}) => {
  const getIndividualButtonClass = () => {
    const baseClass = "p-4 rounded-xl text-center transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]";
    if (selectedModality === 'I') {
      return `bg-theme-keppel/20 border-2 border-theme-keppel text-theme-rich-black ${baseClass}`;
    }
    return `bg-theme-seasalt border-2 border-theme-rich-black/20 text-theme-rich-black hover:bg-theme-seasalt-dark ${baseClass}`;
  };

  const getGroupButtonClass = () => {
    const baseClass = "p-4 rounded-xl text-center transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]";
    if (selectedModality === 'G') {
      return `bg-theme-keppel/20 border-2 border-theme-keppel text-theme-rich-black ${baseClass}`;
    }
    return `bg-theme-seasalt border-2 border-theme-rich-black/20 text-theme-rich-black hover:bg-theme-seasalt-dark ${baseClass}`;
  };

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4 text-theme-rich-black">
        Selecciona el tipo de cita
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button 
          onClick={() => onSelect('I')}
          className={getIndividualButtonClass()}
        >
          <div className="flex flex-col items-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-10 w-10 mb-2 text-theme-keppel" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
              />
            </svg>
            <span className="font-medium">Cita Individual</span>
            <p className="text-sm mt-1 text-theme-rich-black/70">Solo para ti</p>
          </div>
        </button>
        
        <button 
          onClick={() => onSelect('G')}
          className={getGroupButtonClass()}
        >
          <div className="flex flex-col items-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-10 w-10 mb-2 text-theme-rich-black/70" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" 
              />
            </svg>
            <span className="font-medium">Cita Grupal</span>
            <p className="text-sm mt-1 text-theme-rich-black/70">Con otros estudiantes</p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default AppointmentModality;