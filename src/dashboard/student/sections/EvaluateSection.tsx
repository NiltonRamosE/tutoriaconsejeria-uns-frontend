import React from "react";

export function EvaluateSection() {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-lg border-2 border-b-8 border-theme-rich-black">
        <h2 className="text-2xl font-bold mb-6 text-theme-rich-black">Evaluar Docente</h2>
        
        <div className="space-y-6">
            <div className="p-6 border border-theme-rich-black/20 rounded-xl">
                <h3 className="font-bold text-lg mb-4">Selecciona tu docente</h3>
                <select name="selectionIntructor" className="w-full p-3 border rounded-lg">
                    <option>Juan Pérez - Matemáticas</option>
                    <option>María Gómez - Física</option>
                </select>
            </div>
            
            <form className="space-y-6">
                <div className="space-y-8">
                    <div>
                        <p className="font-medium mb-3">1. Claridad en las explicaciones</p>
                        <div className="flex justify-between text-sm text-gray-500">
                            <span>Muy deficiente</span>
                            <span>Excelente</span>
                        </div>
                        <input type="range" min="1" max="5" className="w-full" />
                    </div>
                    
                </div>
                
                <button
                    type="submit"
                    className="w-full bg-theme-keppel text-theme-rich-black border-2 border-b-8 border-theme-rich-black font-medium py-3 px-6 rounded-2xl hover:bg-theme-keppel/90 transition-colors duration-200"
                >
                    Enviar Evaluación
                </button>
            </form>
        </div>
    </div>
  );
}