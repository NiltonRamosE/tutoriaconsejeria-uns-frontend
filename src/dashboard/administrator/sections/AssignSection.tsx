import React, { useState, useEffect, useRef } from 'react';
import Pagination from '@/dashboard/shared/Pagination';
import { createPagination } from '@/dashboard/shared/paginationManager';
import { 
  fetchStudentsList, 
  fetchDistributeStudentsAmongInstructors 
} from '@/infrastructure/api/administrator';
import type { AssignmentResponse } from '@/infrastructure/dto/assigment/AssignmentResponse';

const AssignSection: React.FC = () => {
  const [assignments, setAssignments] = useState<AssignmentResponse[]>([]);
  const [visibleAssignments, setVisibleAssignments] = useState<AssignmentResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  
  const paginationRef = useRef(createPagination('assign', 5));

  useEffect(() => {
    loadAssignments();
    paginationRef.current.setupPagination(loadAssignments);
  }, []);


  useEffect(() => {
    updateVisibleAssignments();
  }, [assignments]);

  const loadAssignments = async () => {
    setIsLoading(true);
    try {
      const data = await fetchStudentsList();
      setAssignments(data);
      
      paginationRef.current.updateIndicators(data.length);
      paginationRef.current.updatePaginationControls(loadAssignments, data.length);
    } catch (error) {
      console.error('Error al cargar la lista de asignaciones:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateVisibleAssignments = () => {
    const visible = paginationRef.current.calculateVisibleElements(assignments);
    setVisibleAssignments(visible);
  };

  const handleAssign = async (studentId: number, instructorId: number | null) => {
    // Aquí iría la lógica para asignar/reasignar un estudiante específico
    console.log('Asignar/Reasignar:', { studentId, instructorId });
    alert('Funcionalidad de asignación individual en desarrollo');
  };

  const handleDistributeAssignments = async () => {
    if (!confirm('¿Estás seguro de realizar la asignación automática de estudiantes?')) return;
    
    setIsAssigning(true);
    try {
      const result = await fetchDistributeStudentsAmongInstructors();
      alert("Asignaciones realizadas correctamente.");
      await loadAssignments();
    } catch (error) {
      console.error('Error al efectuar las asignaciones:', error);
      alert('Error al realizar las asignaciones');
    } finally {
      setIsAssigning(false);
    }
  };

  const getButtonText = () => {
    if (isAssigning) {
      return (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-theme-rich-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Asignando...
        </>
      );
    }
    return (
      <>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6z" />
          <path fillRule="evenodd" d="M15 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" clipRule="evenodd" />
        </svg>
        Asignar
      </>
    );
  };

  const renderTableBody = () => {
    if (isLoading) {
      return (
        <tr>
          <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
            Cargando...
          </td>
        </tr>
      );
    }

    if (visibleAssignments.length === 0) {
      return (
        <tr>
          <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
            No hay asignaciones para mostrar
          </td>
        </tr>
      );
    }

    return visibleAssignments.map((assignment) => (
      <tr key={assignment.studentId}>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-theme-keppel/20 flex items-center justify-center">
              <span className="text-theme-keppel">👨‍🎓</span>
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-theme-rich-black">
                {assignment.studentName}
              </div>
              <div className="text-sm text-gray-500">
                {assignment.studentInstitutionalEmail}
              </div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-theme-rich-black">
          {assignment.studentCode}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-theme-blue/20 flex items-center justify-center">
              <span className="text-theme-blue">👩‍🏫</span>
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-theme-rich-black">
                {assignment.instructorName || 'Sin asignar'}
              </div>
              <div className="text-sm text-gray-500">
                {assignment.instructorInstitutionalEmail || ''}
              </div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-theme-rich-black">
          {assignment.typeActivity}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
          <button 
            onClick={() => handleAssign(assignment.studentId, assignment.instructorId || null)}
            className="text-theme-keppel hover:text-theme-keppel-dark mr-3"
          >
            {assignment.instructorId ? 'Reasignar' : 'Asignar'}
          </button>
        </td>
      </tr>
    ));
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-lg border-2 border-b-8 border-theme-rich-black">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-theme-rich-black">Asignación de Estudiantes</h2>
        <button 
          onClick={handleDistributeAssignments}
          disabled={isAssigning}
          className="bg-theme-keppel text-theme-rich-black border-2 border-b-8 border-theme-rich-black font-medium py-2 px-4 rounded-2xl hover:bg-theme-keppel/90 transition-colors duration-200 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {getButtonText()}
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-theme-rich-black/20">
          <thead className="bg-theme-keppel/10">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-theme-rich-black uppercase tracking-wider">
                Estudiante
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-theme-rich-black uppercase tracking-wider">
                Código
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-theme-rich-black uppercase tracking-wider">
                Docente
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-theme-rich-black uppercase tracking-wider">
                Tipo
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-theme-rich-black uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-theme-rich-black/20">
            {renderTableBody()}
          </tbody>
        </table>
        
        <Pagination idPrefix="assign" />
      </div>
    </div>
  );
};

export default AssignSection;