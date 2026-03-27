import React, { useState, useEffect, useRef } from 'react';
import Pagination from '@/dashboard/shared/Pagination';
import { createPagination } from '@/dashboard/shared/paginationManager';
import { fetchInstructorsList } from '@/infrastructure/api/administrator';
import type { InstructorResponse } from '@/infrastructure/dto/administrator/InstructorResponse';
import InstructorProfileModal from '@/dashboard/administrator/components/InstructorProfileModal';

const InstructorSection: React.FC = () => {
  const [allInstructors, setAllInstructors] = useState<InstructorResponse[]>([]);
  const [filteredInstructors, setFilteredInstructors] = useState<InstructorResponse[]>([]);
  const [visibleInstructors, setVisibleInstructors] = useState<InstructorResponse[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedInstructorId, setSelectedInstructorId] = useState<number | null>(null);

  const paginationRef = useRef(createPagination('instructors', 5));

  useEffect(() => {
    loadInstructors();
    paginationRef.current.setupPagination(loadInstructors);
  }, []);

  useEffect(() => {
    updateVisibleInstructors();
  }, [filteredInstructors]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = allInstructors.filter(instructor => 
        instructor.instructorInstitutionalEmail.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredInstructors(filtered);
    } else {
      setFilteredInstructors(allInstructors);
    }
  }, [searchTerm, allInstructors]);

  const loadInstructors = async () => {
    setIsLoading(true);
    try {
      const data = await fetchInstructorsList();
      setAllInstructors(data);
      setFilteredInstructors(data);
      
      paginationRef.current.updateIndicators(data.length);
      paginationRef.current.updatePaginationControls(loadInstructors, data.length);
    } catch (error) {
      console.error('Error al cargar los docentes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateVisibleInstructors = () => {
    const visible = paginationRef.current.calculateVisibleElements(filteredInstructors);
    setVisibleInstructors(visible);
  };

  const handleViewProfile = (instructorId: number) => {
    setSelectedInstructorId(instructorId);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedInstructorId(null);
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

    if (visibleInstructors.length === 0) {
      return (
        <tr>
          <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
            No hay docentes para mostrar
          </td>
        </tr>
      );
    }

    return visibleInstructors.map((instructor) => (
      <tr key={instructor.instructorId}>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-theme-keppel/20 flex items-center justify-center">
              <span className="text-theme-keppel">
                <img src="/icons/instructor-outline.svg" alt="Icono de Docente" className="h-5 w-5" />
              </span>
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-theme-rich-black">
                {instructor.instructorName}
              </div>
              <div className="text-sm text-gray-500">
                {instructor.instructorInstitutionalEmail}
              </div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-theme-rich-black">
          {instructor.instructorMaxAcademicDegree}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-theme-rich-black">
          {instructor.instructorAcademicDepartment}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-theme-rich-black">
          {instructor.instructorDedication}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
          <button 
            onClick={() => handleViewProfile(instructor.instructorId)}
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
          <h2 className="text-2xl font-bold text-theme-rich-black">Relación de Docentes</h2>
          
          <div className="flex flex-col md:flex-row items-stretch gap-2 w-full sm:w-auto">
            <div className="relative flex-grow">
              <input
                type="text"
                id="instructorSearchInput"
                placeholder="Ingresar correo..."
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
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-theme-rich-black/20">
            <thead className="bg-theme-keppel/10">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-theme-rich-black uppercase tracking-wider">
                  Docente
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-theme-rich-black uppercase tracking-wider">
                  Grado Académico
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-theme-rich-black uppercase tracking-wider">
                  Departamento
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-theme-rich-black uppercase tracking-wider">
                  Dedicación
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
          
          <Pagination idPrefix="instructors" />
        </div>
      </div>
      <InstructorProfileModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        instructorId={selectedInstructorId}
      />
    </>
  );
};

export default InstructorSection;