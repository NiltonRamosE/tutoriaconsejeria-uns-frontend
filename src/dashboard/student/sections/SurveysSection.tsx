import React from "react";

export function SurveysSection() {
    return (
        <div className="bg-white p-6 rounded-3xl shadow-lg border-2 border-b-8 border-theme-rich-black">
            <h2 className="text-2xl font-bold mb-6 text-theme-rich-black">Cuestionarios y Evaluaciones</h2>
            
            <div className="space-y-6">
                <div className="space-y-4">
                    <div className="p-4 border border-theme-rich-black/20 rounded-xl hover:bg-theme-keppel/5 transition-colors">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="font-semibold">Evaluación de Desempeño Docente</h3>
                                <p className="text-sm text-gray-500">Matemáticas Avanzadas</p>
                            </div>
                            <span className="px-3 py-1 bg-theme-yellow/20 text-theme-yellow-dark rounded-full text-sm">Pendiente</span>
                        </div>
                    </div>

                    <div className="p-4 border border-theme-rich-black/20 rounded-xl hover:bg-theme-keppel/5 transition-colors">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="font-semibold">Satisfacción con Tutorías</h3>
                                <p className="text-sm text-gray-500">Programación I</p>
                            </div>
                            <span className="px-3 py-1 bg-theme-keppel/20 text-theme-keppel-dark rounded-full text-sm">Completado</span>
                        </div>
                    </div>

                    <div className="p-4 border border-theme-rich-black/20 rounded-xl hover:bg-theme-keppel/5 transition-colors">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="font-semibold">Encuesta de Servicios Universitarios</h3>
                                <p className="text-sm text-gray-500">General</p>
                            </div>
                            <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-sm">Disponible en 3 días</span>
                        </div>
                    </div>
                </div>

                <button className="mt-6 w-full md:w-auto bg-theme-keppel text-theme-rich-black border-2 border-b-8 border-theme-rich-black font-medium py-2 px-6 rounded-2xl hover:bg-theme-keppel/90 transition-colors duration-200">
                    Comenzar Nueva Evaluación
                </button>
            </div>
        </div>
    );
}
