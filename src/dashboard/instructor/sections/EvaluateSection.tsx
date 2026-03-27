import React from "react";

export default function EvaluateSection() {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-lg border-2 border-b-8 border-theme-rich-black">
        <h2 className="text-2xl font-bold mb-6 text-theme-rich-black">Evaluar Estudiantes</h2>
        
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-theme-rich-black/20 rounded-xl">
                    <h3 className="font-medium text-md mb-3">Selecciona el estudiante</h3>
                    <select className="w-full p-3 border rounded-lg border-theme-rich-black/40">
                        <option>Carlos Mendoza - Ingeniería</option>
                        <option>Ana López - Ciencias</option>
                        <option>Pedro Sánchez - Matemáticas</option>
                    </select>
                </div>
                <div className="p-4 border border-theme-rich-black/20 rounded-xl">
                    <h3 className="font-medium text-md mb-3">Curso/Materia</h3>
                    <select className="w-full p-3 border rounded-lg border-theme-rich-black/40">
                        <option>Matemáticas Avanzadas - Grupo A</option>
                        <option>Física Cuántica - Grupo B</option>
                    </select>
                </div>
            </div>
            
            <form className="space-y-6">
                <div className="space-y-8">
                    <div>
                        <p className="font-medium mb-3">1. Participación en clase</p>
                        <div className="flex justify-between text-sm text-gray-500 mb-2">
                            <span>Nunca participa</span>
                            <span>Participa activamente</span>
                        </div>
                        <input type="range" min="1" max="5" className="w-full" />
                    </div>
                    
                    <div>
                        <p className="font-medium mb-3">2. Calidad de trabajos entregados</p>
                        <div className="flex justify-between text-sm text-gray-500 mb-2">
                            <span>Deficiente</span>
                            <span>Excelente</span>
                        </div>
                        <input type="range" min="1" max="5" className="w-full" />
                    </div>
                    
                    <div>
                        <p className="font-medium mb-3">3. Asistencia y puntualidad</p>
                        <div className="flex justify-between text-sm text-gray-500 mb-2">
                            <span>Falta frecuentemente</span>
                            <span>100% asistencia</span>
                        </div>
                        <input type="range" min="1" max="5" className="w-full" />
                    </div>
                    
                    <div>
                        <label className="font-medium mb-3 block">4. Comentarios adicionales</label>
                        <textarea 
                            className="w-full p-3 border rounded-lg border-theme-rich-black/40 min-h-[120px]"
                            placeholder="Escribe tus observaciones sobre el desempeño del estudiante..."
                        ></textarea>
                    </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        type="submit"
                        className="flex-1 bg-theme-blue text-white border-2 border-b-8 border-theme-rich-black font-medium py-3 px-6 rounded-2xl hover:bg-theme-blue/90 transition-colors duration-200"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                        </svg>
                        Guardar Evaluación
                    </button>
                    <button
                        type="button"
                        className="flex-1 bg-white text-theme-rich-black border-2 border-b-8 border-theme-rich-black font-medium py-3 px-6 rounded-2xl hover:bg-gray-50 transition-colors duration-200"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                        </svg>
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    </div>
  );
}