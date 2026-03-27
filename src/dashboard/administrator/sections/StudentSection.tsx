import React, { useState, useEffect, useRef } from 'react';
import Pagination from '@/dashboard/shared/Pagination';
import { createPagination } from '@/dashboard/shared/paginationManager';
import { fetchStudentsByFilter } from '@/infrastructure/api/administrator';
import type { StudentResponse } from '@/infrastructure/dto/administrator/StudentResponse';
import type { StudentFilter } from '@/domain/types/StudentFilter';
import StudentProfileModal from '@/dashboard/administrator/components/StudentProfileModal';

const StudentSection: React.FC = () => {
  const [allStudents, setAllStudents] = useState<StudentResponse[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<StudentResponse[]>([]);
  const [visibleStudents, setVisibleStudents] = useState<StudentResponse[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentFilter, setCurrentFilter] = useState<StudentFilter>('students/list');
  const [isLoading, setIsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  
  // Opciones de filtro
  const filterOptions: { id: StudentFilter; label: string }[] = [
    { id: 'students/list', label: 'Todos' },
    { id: 'students/early-stage', label: 'Primeros ciclos' },
    { id: 'students/late-stage', label: 'Últimos ciclos' },
    { id: 'students/irregular/early-stage', label: 'Irregulares (primeros)' },
    { id: 'students/irregular/late-stage', label: 'Irregulares (últimos)' },
  ];

  // Referencia para el paginationManager
  const paginationRef = useRef(createPagination('students', 5));

  // Cargar estudiantes al montar el componente o cambiar filtro
  useEffect(() => {
    loadStudents(currentFilter);
    paginationRef.current.setupPagination(() => loadStudents(currentFilter));
  }, [currentFilter]);

  // Actualizar tabla cuando cambien los filtros
  useEffect(() => {
    updateVisibleStudents();
  }, [filteredStudents]);

  // Efecto para búsqueda en tiempo real
  useEffect(() => {
    if (searchTerm) {
      const filtered = allStudents.filter(student => 
        student.studentCode.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents(allStudents);
    }
  }, [searchTerm, allStudents]);

  const loadStudents = async (filter: StudentFilter) => {
    setIsLoading(true);
    try {
      const data = await fetchStudentsByFilter(filter);
      setAllStudents(data);
      setFilteredStudents(data);
      
      paginationRef.current.updateIndicators(data.length);
      paginationRef.current.updatePaginationControls(() => loadStudents(currentFilter), data.length);
    } catch (error) {
      console.error('Error al cargar los estudiantes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateVisibleStudents = () => {
    const visible = paginationRef.current.calculateVisibleElements(filteredStudents);
    setVisibleStudents(visible);
  };

  const handleFilterChange = (filter: StudentFilter) => {
    setCurrentFilter(filter);
  };

  const handleViewProfile = (studentId: number) => {
    setSelectedStudentId(studentId);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedStudentId(null);
  };

  const getFilterButtonClass = (filterId: StudentFilter) => {
    const baseClass = "font-medium py-2 px-4 rounded-2xl transition-colors duration-200 border-2 border-b-8 border-theme-rich-black";
    
    if (currentFilter === filterId) {
      return `bg-theme-keppel text-theme-rich-black ${baseClass}`;
    }
    return `bg-theme-keppel/20 text-theme-rich-black hover:bg-theme-keppel/30 ${baseClass}`;
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

    if (visibleStudents.length === 0) {
      return (
        <tr>
          <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
            No hay estudiantes para mostrar
          </td>
        </tr>
      );
    }

    return visibleStudents.map((student) => (
      <tr key={student.studentId}>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-theme-keppel/20 flex items-center justify-center">
              <span className="text-theme-keppel">👨‍🎓</span>
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-theme-rich-black">
                {student.studentName}
              </div>
              <div className="text-sm text-gray-500">
                {student.studentInstitutionalEmail}
              </div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-theme-rich-black">
          {student.studentCode}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-theme-rich-black">
          {student.studentCellphone}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-theme-rich-black">
          {student.yearOfStudy}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
          <button 
            onClick={() => handleViewProfile(student.studentId)}
            className="text-theme-keppel hover:text-theme-keppel-dark mr-3"
          >
            Ver perfil
          </button>
        </td>
      </tr>
    ));
  };

  return (
    <>
      <div className="bg-white p-6 rounded-3xl shadow-lg border-2 border-b-8 border-theme-rich-black">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
          <h2 className="text-2xl font-bold text-theme-rich-black">Relación de Estudiantes</h2>
          
          <div className="flex flex-col md:flex-row items-stretch gap-2 w-full sm:w-auto">
            {/* Campo de búsqueda */}
            <div className="relative flex-grow">
              <input
                type="text"
                id="studentSearchInput"
                placeholder="Ingresar código..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white text-theme-rich-black border-2 border-b-8 border-theme-rich-black font-medium py-2 px-4 pl-10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-theme-keppel focus:border-transparent transition-all duration-200 w-full xs:w-64"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-theme-rich-black/50" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="mb-6 flex flex-wrap gap-3">
          {filterOptions.map((filter) => (
            <button
              key={filter.id}
              onClick={() => handleFilterChange(filter.id)}
              className={getFilterButtonClass(filter.id)}
            >
              {filter.label}
            </button>
          ))}
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
                  Celular
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-theme-rich-black uppercase tracking-wider">
                  Año de estudio
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
          
          <Pagination idPrefix="students" />
        </div>
      </div>

      <StudentProfileModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        studentId={selectedStudentId}
      />
    </>
  );
};

export default StudentSection;