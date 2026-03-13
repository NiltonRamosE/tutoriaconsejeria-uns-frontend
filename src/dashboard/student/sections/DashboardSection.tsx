import React from 'react';
export function DashboardSection() {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-lg border-2 border-b-8 border-theme-rich-black">
        <h2 className="text-2xl font-bold mb-6 text-theme-rich-black">Mi Panel Principal</h2>
        
        <div className="space-y-6">
            <div className="p-6 bg-theme-keppel/10 rounded-xl border border-theme-keppel">
                <h3 className="text-xl font-semibold mb-2">¡Bienvenido de vuelta!</h3>
                <p className="text-gray-600">Tienes 3 actividades pendientes para esta semana.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white rounded-xl border border-theme-rich-black/20">
                    <p className="text-sm text-gray-500">Tutorías Programadas</p>
                    <p className="text-2xl font-bold">2</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-theme-rich-black/20">
                    <p className="text-sm text-gray-500">Evaluaciones Pendientes</p>
                    <p className="text-2xl font-bold">1</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-theme-rich-black/20">
                    <p className="text-sm text-gray-500">Próxima Cita</p>
                    <p className="text-2xl font-bold">Mar 15</p>
                </div>
            </div>

            <div className="p-6 bg-white rounded-xl border border-theme-rich-black/20">
                <h3 className="text-lg font-semibold mb-4">Próximas Actividades</h3>
                <ul className="space-y-3">
                    <li className="flex items-center">
                        <div className="w-2 h-2 bg-theme-keppel rounded-full mr-3"></div>
                        <span>Tutoría de Matemáticas - Hoy 3:00 PM</span>
                    </li>
                    <li className="flex items-center">
                        <div className="w-2 h-2 bg-theme-blue rounded-full mr-3"></div>
                        <span>Evaluación a Docente - Vence en 2 días</span>
                    </li>
                    <li className="flex items-center">
                        <div className="w-2 h-2 bg-theme-yellow rounded-full mr-3"></div>
                        <span>Cita con Consejero - Mar 15, 10:00 AM</span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
  );
}