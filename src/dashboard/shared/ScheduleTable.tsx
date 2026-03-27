import React from 'react';

export interface ScheduleTableProps {
  idPrefix: string; // ej: "academic" o "instructor"
  title?: string;   // opcional, puedes actualizarlo luego desde el manager
}

const ScheduleTable: React.FC<ScheduleTableProps> = ({ 
  idPrefix, 
  title = "" 
}) => {
  return (
    <div id={`${idPrefix}-scheduleContainer`} className="hidden overflow-x-auto">
      <h3 id={`${idPrefix}-scheduleTitle`} className="text-xl font-semibold mb-4 text-theme-rich-black">
        {title}
      </h3>

      <div className="min-w-max">
        <div className="grid grid-cols-[auto_repeat(6,minmax(0,1fr))] gap-px bg-theme-rich-black/20">
          <div className="w-15 bg-theme-keppel/10 p-2 font-bold text-theme-rich-black text-center">Hora</div>
          <div className="bg-theme-keppel/10 p-2 font-bold text-theme-rich-black text-center">Lunes</div>
          <div className="bg-theme-keppel/10 p-2 font-bold text-theme-rich-black text-center">Martes</div>
          <div className="bg-theme-keppel/10 p-2 font-bold text-theme-rich-black text-center">Miércoles</div>
          <div className="bg-theme-keppel/10 p-2 font-bold text-theme-rich-black text-center">Jueves</div>
          <div className="bg-theme-keppel/10 p-2 font-bold text-theme-rich-black text-center">Viernes</div>
          <div className="bg-theme-keppel/10 p-2 font-bold text-theme-rich-black text-center">Sábado</div>

          {/* Time Slots */}
          <div id={`${idPrefix}-timeSlots`} className="col-span-7 grid grid-cols-[auto_repeat(6,minmax(0,1fr))] gap-px bg-theme-rich-black/20"
          >
            {/* Se llena dinámicamente por scheduleManager */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleTable;