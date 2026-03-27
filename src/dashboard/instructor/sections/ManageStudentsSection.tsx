import React, { useState, useEffect, useRef } from 'react';
import { getUser } from '@/dashboard/shared/authUtils';
import Pagination from '@/dashboard/shared/Pagination';
import { createPagination } from '@/dashboard/shared/paginationManager';
import { fetchListAssignedStudents } from '@/infrastructure/api/instructor';
import StudentProfileModal from '@/dashboard/administrator/components/StudentProfileModal';
import type { StudentResponse } from '@/infrastructure/dto/administrator/StudentResponse';
import StudentScheduleModal from '@/dashboard/instructor/components/StudentScheduleModal';

const ManageStudentsSection: React.FC = () => {
  const [allStudents, setAllStudents] = useState<StudentResponse[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<StudentResponse[]>([]);
  const [visibleStudents, setVisibleStudents] = useState<StudentResponse[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [expandedStudentId, setExpandedStudentId] = useState<number | null>(null);

  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [selectedScheduleStudent, setSelectedScheduleStudent] = useState<StudentResponse | null>(null);

  const paginationRef = useRef(createPagination('manage-students', 5));

  const instructorData = getUser();
  const instructorId = instructorData?.id;

  const updateViewAndControls = () => {
    const visible = paginationRef.current.calculateVisibleElements(filteredStudents);
    setVisibleStudents(visible);
    
    paginationRef.current.updateIndicators(filteredStudents.length);
    
    paginationRef.current.updatePaginationControls(updateViewAndControls, filteredStudents.length);
  };

  useEffect(() => {
    if (instructorId) {
      loadStudents();
    }
  }, [instructorId]);

  useEffect(() => {
    if (filteredStudents.length > 0) {
      paginationRef.current.setupPagination(updateViewAndControls);
      updateViewAndControls();
    }
  }, [filteredStudents]);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, allStudents]);

  const loadStudents = async () => {
    setIsLoading(true);
    try {
      if (!instructorId) {
        console.error('No se encontró información del instructor');
        return;
      }
      const data = await fetchListAssignedStudents(instructorId);
      
      const uniqueStudents = data.filter((student, index, self) => 
        index === self.findIndex(s => s.studentId === student.studentId)
      );
      
      setAllStudents(uniqueStudents);
      setFilteredStudents(uniqueStudents);
      
    } catch (error) {
      console.error('Error al cargar los estudiantes asignados:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...allStudents];
    
    if (searchTerm) {
      filtered = filtered.filter(student => 
        student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.studentCode.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredStudents(filtered);
    if (paginationRef.current.goToPage) {
      paginationRef.current.goToPage(1, updateViewAndControls);
    }
  };

  const handleViewProfile = (studentId: number) => {
    setSelectedStudentId(studentId);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedStudentId(null);
  };

  const toggleDetails = (studentId: number) => {
    setExpandedStudentId(prev => prev === studentId ? null : studentId);
  };

  const handleViewSchedule = (student: StudentResponse) => {
    setSelectedScheduleStudent(student);
    setScheduleModalOpen(true);
  };

  const handleCloseScheduleModal = () => {
    setScheduleModalOpen(false);
    setSelectedScheduleStudent(null);
  };

  const renderStudentCard = (student: StudentResponse) => {
    const isExpanded = expandedStudentId === student.studentId;
    
    return (
      <div 
        key={student.studentId} 
        className="p-4 border border-theme-rich-black/20 rounded-xl hover:bg-theme-keppel/5 transition-colors"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-theme-rich-black">{student.studentName}</h3>
            <p className="text-sm text-gray-500">
              Código: {student.studentCode} - {student.yearOfStudy}° año
            </p>
          </div>
          <button 
            onClick={() => toggleDetails(student.studentId)}
            className="text-theme-keppel hover:text-theme-keppel-dark font-medium flex items-center transition-colors"
          >
            {isExpanded ? 'Ver menos' : 'Ver detalles'}
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-4 w-4 ml-1 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-theme-rich-black/10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-theme-rich-black">Contacto</p>
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-gray-600 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {student.studentInstitutionalEmail}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {student.studentCellphone || 'No especificado'}
                  </p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-theme-rich-black">Información Académica</p>
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-gray-600">Año de estudio: {student.yearOfStudy}</p>
                  <p className="text-sm text-gray-600">Código: {student.studentCode}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex space-x-2">
              <button
                onClick={() => handleViewProfile(student.studentId)}
                className="text-sm bg-theme-keppel/10 text-theme-keppel px-3 py-1.5 rounded-lg hover:bg-theme-keppel/20 transition-colors flex items-center gap-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Ver perfil completo
              </button>
              <button
                onClick={() => handleViewSchedule(student)}
                className="text-sm bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Ver Horario
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-theme-keppel"></div>
          <p className="mt-2 text-gray-500">Cargando estudiantes asignados...</p>
        </div>
      );
    }

    if (visibleStudents.length === 0) {
      return (
        <div className="text-center py-12 text-gray-500 bg-gradient-to-br from-theme-seasalt to-white rounded-2xl border border-dashed border-theme-rich-black/20">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <p className="text-lg font-medium">No hay estudiantes asignados</p>
          <p className="text-sm mt-1">No tienes estudiantes asignados actualmente</p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {visibleStudents.map(student => renderStudentCard(student))}
      </div>
    );
  };

  return (
    <>
      <div className="bg-white p-6 rounded-3xl shadow-lg border-2 border-b-8 border-theme-rich-black">
        <h2 className="text-2xl font-bold mb-6 text-theme-rich-black">Gestión de Estudiantes</h2>
        
        <div className="space-y-6">
          <div className="max-w-md">
            <label className="block text-sm font-medium mb-2 text-theme-rich-black/80">Buscar estudiante</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Nombre o código"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 pl-10 border rounded-lg border-theme-rich-black/30 focus:ring-2 focus:ring-theme-keppel focus:border-transparent transition-all duration-200"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          {renderContent()}

          {filteredStudents.length > 0 && (
            <div className="flex justify-between items-center pt-4 border-t border-theme-rich-black/20">
              <span className="text-sm text-gray-500">
                Mostrando {visibleStudents.length} de {filteredStudents.length} estudiantes
              </span>
              <Pagination idPrefix="manage-students" />
            </div>
          )}
        </div>
      </div>

      <StudentProfileModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        studentId={selectedStudentId}
      />

      <StudentScheduleModal
        isOpen={scheduleModalOpen}
        onClose={handleCloseScheduleModal}
        studentId={selectedScheduleStudent?.studentId || null}
        studentName={selectedScheduleStudent?.studentName || ''}
      />
    </>
  );
};

export default ManageStudentsSection;