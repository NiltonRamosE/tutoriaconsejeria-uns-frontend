import React from "react";

export default function ManageStudentsSection() {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-lg border-2 border-b-8 border-theme-rich-black">
        <h2 className="text-2xl font-bold mb-6 text-theme-rich-black">Gestión de Estudiantes</h2>
        
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Filtrar por curso</label>
                    <select className="w-full p-2 border rounded-lg border-theme-rich-black/40">
                        <option>Todos los cursos</option>
                        <option>Matemáticas Avanzadas</option>
                        <option>Física Cuántica</option>
                        <option>Programación I</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Filtrar por grupo</label>
                    <select className="w-full p-2 border rounded-lg border-theme-rich-black/40">
                        <option>Todos los grupos</option>
                        <option>Grupo A</option>
                        <option>Grupo B</option>
                        <option>Grupo C</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Buscar estudiante</label>
                    <div className="relative">
                        <input type="text" placeholder="Nombre o código" className="w-full p-2 pl-10 border rounded-lg border-theme-rich-black/40" />
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                        </svg>
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                <div className="p-4 border border-theme-rich-black/20 rounded-xl hover:bg-theme-blue/5 transition-colors">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-theme-blue/20 rounded-full flex items-center justify-center">
                                <span className="text-theme-blue">👨‍🎓</span>
                            </div>
                            <div>
                                <h3 className="font-semibold">Carlos Mendoza</h3>
                                <p className="text-sm text-gray-500">Código: 20231045 - Matemáticas Avanzadas (Grupo A)</p>
                            </div>
                        </div>
                        <button className="text-theme-blue hover:text-theme-blue-dark font-medium flex items-center">
                            Ver detalles
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                            </svg>
                        </button>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-theme-rich-black/10 hidden detail-content">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <p className="text-sm font-medium">Horario de Tutorías</p>
                                <ul className="text-sm text-gray-600 space-y-1 mt-1">
                                    <li>Lunes: 2:00 PM - 4:00 PM</li>
                                    <li>Jueves: 10:00 AM - 12:00 PM</li>
                                </ul>
                            </div>
                            <div>
                                <p className="text-sm font-medium">Contacto</p>
                                <p className="text-sm text-gray-600 mt-1">carlos.mendoza@institucion.edu</p>
                                <p className="text-sm text-gray-600">+51 987 654 321</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium">Rendimiento</p>
                                <div className="flex items-center mt-1">
                                    <span className="text-sm font-medium text-theme-blue">85%</span>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5 mx-2">
                                        <div className="bg-theme-blue h-2.5 rounded-full" ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-3 flex space-x-2">
                            <button className="text-sm bg-theme-blue/10 text-theme-blue px-3 py-1 rounded-lg hover:bg-theme-blue/20 transition-colors">
                                Programar tutoría
                            </button>
                            <button className="text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-lg hover:bg-gray-200 transition-colors">
                                Ver historial
                            </button>
                        </div>
                    </div>
                </div>

                <div className="p-4 border border-theme-rich-black/20 rounded-xl hover:bg-theme-blue/5 transition-colors">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-theme-blue/20 rounded-full flex items-center justify-center">
                                <span className="text-theme-blue">👩‍🎓</span>
                            </div>
                            <div>
                                <h3 className="font-semibold">Ana López</h3>
                                <p className="text-sm text-gray-500">Código: 20231087 - Física Cuántica (Grupo B)</p>
                            </div>
                        </div>
                        <button className="text-theme-blue hover:text-theme-blue-dark font-medium flex items-center">
                            Ver detalles
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-theme-rich-black/20">
                <span className="text-sm text-gray-500">Mostrando 1-5 de 12 estudiantes</span>
                <div className="flex space-x-1">
                    <button className="p-2 border rounded-lg border-theme-rich-black/20 hover:bg-gray-50">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                        </svg>
                    </button>
                    <button className="px-3 py-1 border rounded-lg border-theme-blue bg-theme-blue text-white">1</button>
                    <button className="px-3 py-1 border rounded-lg border-theme-rich-black/20 hover:bg-gray-50">2</button>
                    <button className="px-3 py-1 border rounded-lg border-theme-rich-black/20 hover:bg-gray-50">3</button>
                    <button className="p-2 border rounded-lg border-theme-rich-black/20 hover:bg-gray-50">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
}