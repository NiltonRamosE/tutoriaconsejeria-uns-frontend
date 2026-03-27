import React, { useState, useEffect } from 'react';
import { fetchViewStudent } from '@/infrastructure/api/administrator';
import type { StudentProfileResponse } from '@/infrastructure/dto/student/StudentProfileResponse';

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: number | null;
}

interface CollapsibleSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ 
  title, 
  icon, 
  children, 
  defaultOpen = false 
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="mb-4 border border-theme-rich-black/10 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-theme-seasalt to-white hover:bg-theme-seasalt/80 transition-colors"
      >
        <div className="flex items-center gap-3">
          {icon}
          <h4 className="font-semibold text-theme-rich-black">{title}</h4>
        </div>
        <svg
          className={`w-5 h-5 text-theme-rich-black/60 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="p-4 bg-white border-t border-theme-rich-black/10">
          {children}
        </div>
      )}
    </div>
  );
};

interface InfoFieldProps {
  label: string;
  value: any;
  formatter?: (value: any) => string;
}

const InfoField: React.FC<InfoFieldProps> = ({ label, value, formatter }) => {
  const formatValue = (val: any): string => {
    if (val === undefined || val === null || val === '') {
      return 'No especificado';
    }
    if (formatter) {
      return formatter(val);
    }
    return String(val);
  };

  return (
    <div className="bg-theme-seasalt p-3 rounded-lg">
      <span className="text-xs text-theme-rich-black/60 block">{label}</span>
      <span className="text-sm font-medium text-theme-rich-black">{formatValue(value)}</span>
    </div>
  );
};

const StudentProfileModal: React.FC<StudentProfileModalProps> = ({ 
  isOpen, 
  onClose, 
  studentId 
}) => {
  const [profile, setProfile] = useState<StudentProfileResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && studentId) {
      loadProfile();
    }
  }, [isOpen, studentId]);

  const loadProfile = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchViewStudent(String(studentId));
      setProfile(data);
    } catch (err) {
      console.error('Error loading student profile:', err);
      setError('Error al cargar el perfil del estudiante');
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
        <span className="text-4xl">👨‍🎓</span>
      </div>
    );
  };

  const formatCurrency = (value: number): string => {
    return `S/ ${value.toLocaleString('es-PE')}`;
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return 'No especificado';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl z-10">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-theme-rich-black flex items-center gap-2">
                <span className="text-2xl">👨‍🎓</span>
                Perfil del Estudiante
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
                  <p className="text-theme-keppel font-medium">Código: {profile.studentCode}</p>
                </div>

                {/* Información Básica */}
                <CollapsibleSection 
                  title="Información Básica" 
                  defaultOpen={true}
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-theme-keppel" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  }
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoField label="Nombre completo" value={profile.fullName} />
                    <InfoField label="Código de estudiante" value={profile.studentCode} />
                    <InfoField label="Correo institucional" value={profile.institutionalEmail} />
                    <InfoField label="Teléfono celular" value={profile.cellphone} />
                    <InfoField label="Año de estudio" value={profile.yearOfStudy} />
                    <InfoField label="Género" value={getGenderText(profile.gender)} />
                    <InfoField label="Fecha de nacimiento" value={profile.dateOfBirth} formatter={formatDate} />
                  </div>
                </CollapsibleSection>

                {/* Información Socioeconómica */}
                {profile.socioeconomicInformation && (
                  <CollapsibleSection 
                    title="Información Socioeconómica" 
                    icon={
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-theme-keppel" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    }
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <InfoField label="Lugar de nacimiento" value={profile.socioeconomicInformation.placeOfBirth} />
                      <InfoField label="Estado civil" value={profile.socioeconomicInformation.maritalStatus} />
                      <InfoField label="Número de hijos" value={profile.socioeconomicInformation.numberOfChildren} />
                      <InfoField label="Ocupación actual" value={profile.socioeconomicInformation.currentJobOccupation} />
                      <InfoField label="Centro de trabajo" value={profile.socioeconomicInformation.workCenter} />
                      <InfoField label="Antigüedad laboral" value={profile.socioeconomicInformation.seniorityAtWork} formatter={(v) => `${v} años`} />
                      <InfoField label="Ingreso familiar mensual" value={profile.socioeconomicInformation.monthlyFamilyIncome} formatter={formatCurrency} />
                      <InfoField label="Teléfono fijo" value={profile.socioeconomicInformation.homePhoneNumber} />
                      <InfoField label="Correo personal" value={profile.socioeconomicInformation.email} />
                      <InfoField label="Dirección de domicilio" value={profile.socioeconomicInformation.homeAddress} />
                      <InfoField label="Miembros del hogar" value={profile.socioeconomicInformation.numberOfHouseHoldMembers} />
                      <InfoField label="Parentesco" value={profile.socioeconomicInformation.kinshipRelationship} />
                      <InfoField label="Tipo de vivienda" value={profile.socioeconomicInformation.housingType} />
                    </div>
                  </CollapsibleSection>
                )}

                {/* Problemas Personales */}
                {profile.personalProblems && (
                  <CollapsibleSection 
                    title="Problemas Personales" 
                    icon={
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-theme-keppel" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    }
                  >
                    <div className="grid grid-cols-1 gap-4">
                      <InfoField label="Problemas identificados" value={profile.personalProblems.problems} />
                      <InfoField label="Nombre del representante" value={profile.personalProblems.nameOfTheRepresentative} />
                    </div>
                  </CollapsibleSection>
                )}

                {/* Información Familiar */}
                {profile.familyGroupInformation && (
                  <CollapsibleSection 
                    title="Información Familiar" 
                    icon={
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-theme-keppel" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    }
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <InfoField label="Nivel educativo del padre" value={profile.familyGroupInformation.fatherEducationLevel} />
                      <InfoField label="Nivel educativo de la madre" value={profile.familyGroupInformation.motherEducationLevel} />
                      <InfoField label="Ocupación del padre" value={profile.familyGroupInformation.fatherOccupation} />
                      <InfoField label="Ocupación de la madre" value={profile.familyGroupInformation.motherOccupation} />
                      <InfoField label="Composición familiar" value={profile.familyGroupInformation.familyComposition} />
                      <InfoField label="Total de hermanos" value={profile.familyGroupInformation.totalSiblings} />
                      <InfoField label="Número de dependientes" value={profile.familyGroupInformation.numberOfDependents} />
                      <InfoField label="Tipo de familia" value={profile.familyGroupInformation.familyType} />
                      <InfoField label="Teléfono del representante" value={profile.familyGroupInformation.representativePhoneNumber} />
                    </div>
                  </CollapsibleSection>
                )}
              </>
            ) : null}
          </div>

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

export default StudentProfileModal;