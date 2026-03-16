import React from 'react';

export interface TypeActivityProps {
  idPrefix: string;
  value?: string;
  onChange: (value: string) => void;
}

const TypeActivity: React.FC<TypeActivityProps> = ({ idPrefix, value, onChange }) => {
  return (
    <div id={`${idPrefix}-typeActivityContainer`} className="mb-4">
      <span className="block text-sm font-medium mb-2 text-theme-rich-black/80">
        Tipo de Actividad
      </span>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <label className="activity-type-option">
          <input 
            type="radio" 
            name="typeActivity" 
            value="T"
            checked={value === 'T'}
            onChange={() => onChange('T')}
            className="sr-only" 
          />
          <div className="p-4 border-2 border-theme-rich-black/20 rounded-lg text-center cursor-pointer transition-all duration-200 hover:border-theme-keppel hover:bg-theme-keppel/5">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6 mx-auto mb-2 text-theme-keppel" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 14l9-5-9-5-9 5 9 5z" 
              />
            </svg>
            <span>Tutoría</span>
          </div>
        </label>
        <label className="activity-type-option">
          <input 
            type="radio" 
            name="typeActivity" 
            value="C"
            checked={value === 'C'}
            onChange={() => onChange('C')}
            className="sr-only" 
          />
          <div className="p-4 border-2 border-theme-rich-black/20 rounded-lg text-center cursor-pointer transition-all duration-200 hover:border-theme-keppel hover:bg-theme-keppel/5">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6 mx-auto mb-2 text-theme-keppel" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" 
              />
            </svg>
            <span>Consejería</span>
          </div>
        </label>
      </div>
    </div>
  );
};

export default TypeActivity;