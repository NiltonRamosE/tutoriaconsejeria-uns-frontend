import React, { useState, useEffect } from 'react';
import { fetchViewInstructor } from '@/infrastructure/api/administrator';
import type { InstructorProfileResponse } from '@/infrastructure/dto/instructor/InstructorProfileResponse';

interface InstructorProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  instructorId: number | null;
}

const InstructorProfileModal: React.FC<InstructorProfileModalProps> = ({ 
  isOpen, 
  onClose, 
  instructorId 
}) => {
  const [profile, setProfile] = useState<InstructorProfileResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && instructorId) {
      loadProfile();
    }
  }, [isOpen, instructorId]);

  const loadProfile = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchViewInstructor(String(instructorId));
      setProfile(data);
    } catch (err) {
      console.error('Error loading instructor profile:', err);
      setError('Error al cargar el perfil del docente');
    } finally {
      setIsLoading(false);
    }
  };

  const getGenderText = (gender: string) => {
    if (gender === 'M') return 'Masculino';
    if (gender === 'F') return 'Femenino';
    return gender || 'No especificado';
  };

  const getGenderIcon = (gender: string) => {
    if (gender === 'M') {
      return (
        <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      );
    }
    if (gender === 'F') {
      return (
        <div className="w-20 h-20 rounded-full bg-pink-100 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      );
    }
    return (
      <div className="w-20 h-20 rounded-full bg-theme-keppel/20 flex items-center justify-center">
        <img src="/icons/instructor-outline.svg" alt="Instructor" className="h-10 w-10" />
      </div>
    );
  };

  const formatValue = (value: any): string => {
    if (value === undefined || value === null || value === '') {
      return 'No especificado';
    }
    return String(value);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-theme-rich-black flex items-center gap-2">
                <img src="/icons/instructor-outline.svg" alt="Instructor" className="h-6 w-6" />
                Perfil del Docente
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-theme-keppel"></div>
                <p className="mt-2 text-gray-500">Cargando perfil...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-red-500 mb-2">
                  <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-red-500">{error}</p>
                <button
                  onClick={loadProfile}
                  className="mt-4 bg-theme-keppel text-white px-4 py-2 rounded-lg hover:bg-theme-keppel-dark transition-colors"
                >
                  Reintentar
                </button>
              </div>
            ) : profile ? (
              <>
                {/* Avatar y nombre */}
                <div className="flex flex-col items-center mb-8">
                  {getGenderIcon(profile.gender)}
                  <h3 className="text-xl font-bold text-theme-rich-black mt-4">{profile.fullName}</h3>
                  <p className="text-theme-keppel font-medium">{profile.profession}</p>
                </div>

                {/* Información Académica */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-theme-rich-black mb-4 pb-2 border-b-2 border-theme-keppel flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-theme-keppel" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    </svg>
                    Información Académica
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-theme-seasalt p-3 rounded-lg">
                      <span className="text-xs text-theme-rich-black/60 block">Grado Académico Máximo</span>
                      <span className="text-sm font-medium text-theme-rich-black">{formatValue(profile.maxAcademicDegree)}</span>
                    </div>
                    <div className="bg-theme-seasalt p-3 rounded-lg">
                      <span className="text-xs text-theme-rich-black/60 block">Departamento Académico</span>
                      <span className="text-sm font-medium text-theme-rich-black">{formatValue(profile.academicDepartment)}</span>
                    </div>
                    <div className="bg-theme-seasalt p-3 rounded-lg">
                      <span className="text-xs text-theme-rich-black/60 block">Condición del Docente</span>
                      <span className="text-sm font-medium text-theme-rich-black">{formatValue(profile.instructorCondition)}</span>
                    </div>
                    <div className="bg-theme-seasalt p-3 rounded-lg">
                      <span className="text-xs text-theme-rich-black/60 block">Categoría del Docente</span>
                      <span className="text-sm font-medium text-theme-rich-black">{formatValue(profile.instructorCategory)}</span>
                    </div>
                    <div className="bg-theme-seasalt p-3 rounded-lg">
                      <span className="text-xs text-theme-rich-black/60 block">Dedicación</span>
                      <span className="text-sm font-medium text-theme-rich-black">{formatValue(profile.instructorDedication)}</span>
                    </div>
                    <div className="bg-theme-seasalt p-3 rounded-lg">
                      <span className="text-xs text-theme-rich-black/60 block">Años de Enseñanza</span>
                      <span className="text-sm font-medium text-theme-rich-black">{formatValue(profile.yearsOfTeaching)} años</span>
                    </div>
                  </div>
                </div>

                {/* Información de Contacto */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-theme-rich-black mb-4 pb-2 border-b-2 border-theme-keppel flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-theme-keppel" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Información de Contacto
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-theme-seasalt p-3 rounded-lg">
                      <span className="text-xs text-theme-rich-black/60 block">Correo Institucional</span>
                      <span className="text-sm font-medium text-theme-rich-black break-all">{formatValue(profile.institutionalEmail)}</span>
                    </div>
                    <div className="bg-theme-seasalt p-3 rounded-lg">
                      <span className="text-xs text-theme-rich-black/60 block">Teléfono Celular</span>
                      <span className="text-sm font-medium text-theme-rich-black">{formatValue(profile.cellphoneNumber)}</span>
                    </div>
                    <div className="bg-theme-seasalt p-3 rounded-lg">
                      <span className="text-xs text-theme-rich-black/60 block">Teléfono Fijo</span>
                      <span className="text-sm font-medium text-theme-rich-black">{formatValue(profile.homePhoneNumber)}</span>
                    </div>
                    <div className="bg-theme-seasalt p-3 rounded-lg">
                      <span className="text-xs text-theme-rich-black/60 block">Género</span>
                      <span className="text-sm font-medium text-theme-rich-black">{getGenderText(profile.gender)}</span>
                    </div>
                  </div>
                </div>
              </>
            ) : null}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 rounded-b-2xl flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorProfileModal;