import React from "react";

export default function DashboardSection() {
    return (
        <div className="bg-white p-6 rounded-3xl shadow-lg border-2 border-b-8 border-theme-rich-black">
            <h2 className="text-2xl font-bold mb-6 text-theme-rich-black">Panel del Tutor / Consejero</h2>
            
            <div className="space-y-6">
                <div className="p-6 bg-theme-blue/10 rounded-xl border border-theme-blue">
                    <h3 className="text-xl font-semibold mb-2">¡Bienvenido, Docente!</h3>
                    <p className="text-gray-600">Tiene 5 actividades programadas para esta semana.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-white rounded-xl border border-theme-rich-black/20">
                        <p className="text-sm text-gray-500">Tutorías Asignadas</p>
                        <p className="text-2xl font-bold">8</p>
                    </div>
                    <div className="p-4 bg-white rounded-xl border border-theme-rich-black/20">
                        <p className="text-sm text-gray-500">Evaluaciones Pendientes</p>
                        <p className="text-2xl font-bold">3</p>
                    </div>
                    <div className="p-4 bg-white rounded-xl border border-theme-rich-black/20">
                        <p className="text-sm text-gray-500">Próxima Sesión</p>
                        <p className="text-2xl font-bold">Hoy</p>
                    </div>
                </div>

                <div className="p-6 bg-white rounded-xl border border-theme-rich-black/20">
                    <h3 className="text-lg font-semibold mb-4">Agenda del Día</h3>
                    <ul className="space-y-3">
                        <li className="flex items-center">
                            <div className="w-2 h-2 bg-theme-blue rounded-full mr-3"></div>
                            <div className="flex-1">
                                <span className="font-medium">Clase: Álgebra Lineal</span>
                                <span className="text-sm text-gray-500 block">9:00 AM - 11:00 AM | Aula 302</span>
                            </div>
                        </li>
                        <li className="flex items-center">
                            <div className="w-2 h-2 bg-theme-keppel rounded-full mr-3"></div>
                            <div className="flex-1">
                                <span className="font-medium">Tutoría con Juan Pérez</span>
                                <span className="text-sm text-gray-500 block">2:00 PM - 3:00 PM | Oficina D-205</span>
                            </div>
                        </li>
                        <li className="flex items-center">
                            <div className="w-2 h-2 bg-theme-yellow rounded-full mr-3"></div>
                            <div className="flex-1">
                                <span className="font-medium">Revisión de Exámenes</span>
                                <span className="text-sm text-gray-500 block">4:00 PM - 6:00 PM</span>
                            </div>
                        </li>
                    </ul>
                </div>

                <div className="p-6 bg-white rounded-xl border border-theme-rich-black/20">
                    <h3 className="text-lg font-semibold mb-4">Alertas Importantes</h3>
                    <div className="space-y-3">
                        <div className="flex items-start p-3 bg-red-50 rounded-lg">
                            <div className="text-red-500 mr-3 mt-0.5">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-medium">2 estudiantes con bajo rendimiento</p>
                                <p className="text-sm text-gray-600">Matemáticas Avanzadas - Grupo B</p>
                            </div>
                        </div>
                        <div className="flex items-start p-3 bg-yellow-50 rounded-lg">
                            <div className="text-yellow-500 mr-3 mt-0.5">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-medium">Evaluaciones pendientes de calificar</p>
                                <p className="text-sm text-gray-600">Fecha límite: 15 de marzo</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}