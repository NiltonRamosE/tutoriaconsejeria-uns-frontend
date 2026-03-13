import React, { useEffect, useState } from 'react';
import { getUser } from '@/dashboard/shared/authUtils';
import { fetchStudentById } from '@/infrastructure/api/student';
import type { StudentProfileResponse } from '@/infrastructure/dto/student/StudentProfileResponse';

export function StudentProfile() {
  const [student, setStudent] = useState<StudentProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudentProfile();
  }, []);

  const loadStudentProfile = async () => {
    const userData = getUser();    
    if (!userData?.id) {
      console.error('No se encontró ID de estudiante');
      setLoading(false);
      return;
    }

    try {
      const studentData = await fetchStudentById(userData.id);
      setStudent(studentData);
    } catch (error) {
      console.error('Error al cargar el perfil del estudiante:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGenderIcon = (gender?: string): { path: string; alt: string } => {
    if (gender === 'M') {
      return { path: '/icons/male-user.svg', alt: 'Icono Masculino' };
    } else if (gender === 'F') {
      return { path: '/icons/female-user.svg', alt: 'Icono Femenino' };
    }
    return { path: '/icons/student-outline.svg', alt: 'Icono de Estudiante' };
  };

  const handleChangePhoto = () => {
    console.log('Cambiar foto de perfil');
    // Aquí iría la lógica para cambiar la foto
  };

  const formatValue = (value: any): string => {
    if (value === undefined || value === null || value === '') {
      return 'No especificado';
    }
    return String(value);
  };

  const formatCurrency = (value: number | undefined): string => {
    if (value === undefined) return 'No especificado';
    return `S/ ${value}`;
  };

  const formatYears = (value: number | undefined): string => {
    if (value === undefined) return 'No especificado';
    return `${value} años`;
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-3xl shadow-lg border-2 border-b-8 border-theme-rich-black animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded mb-6"></div>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-full bg-gray-200"></div>
            <div className="mt-4 h-4 w-24 bg-gray-200 rounded"></div>
          </div>
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const genderIcon = getGenderIcon(student?.gender);
  const socio = student?.socioeconomicInformation;
  const personal = student?.personalProblems;
  const family = student?.familyGroupInformation;

  return (
    <div className="bg-white p-6 rounded-3xl shadow-lg border-2 border-b-8 border-theme-rich-black">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <h2 className="text-2xl font-bold text-theme-rich-black">Perfil de Estudiante</h2>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex flex-col items-center">
          <div className="relative w-32 h-32 rounded-full bg-theme-keppel/20 flex items-center justify-center overflow-hidden border-4 border-theme-keppel/30">
            <img 
              src={genderIcon.path} 
              alt={genderIcon.alt}
              className="w-16 h-16 object-contain"
            />
          </div>
          <button 
            onClick={handleChangePhoto}
            className="mt-4 text-theme-keppel hover:text-theme-keppel-dark text-sm font-medium text-center w-full"
          >
            Cambiar foto
          </button>
        </div>
        
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="block text-sm font-medium text-theme-rich-black/70 mb-1">
              Nombre completo
            </span>
            <div className="bg-theme-seasalt p-3 rounded-lg border border-theme-rich-black/20">
              <p className="text-theme-rich-black">
                {formatValue(student?.fullName)}
              </p>
            </div>
          </div>
          
          <div>
            <span className="block text-sm font-medium text-theme-rich-black/70 mb-1">
              Código de estudiante
            </span>
            <div className="bg-theme-seasalt p-3 rounded-lg border border-theme-rich-black/20">
              <p className="text-theme-rich-black">
                {formatValue(student?.studentCode)}
              </p>
            </div>
          </div>
          
          <div>
            <span className="block text-sm font-medium text-theme-rich-black/70 mb-1">
              Correo institucional
            </span>
            <div className="bg-theme-seasalt p-3 rounded-lg border border-theme-rich-black/20">
              <p className="text-theme-rich-black">
                {formatValue(student?.institutionalEmail)}
              </p>
            </div>
          </div>
          
          <div>
            <span className="block text-sm font-medium text-theme-rich-black/70 mb-1">
              Teléfono celular
            </span>
            <div className="bg-theme-seasalt p-3 rounded-lg border border-theme-rich-black/20">
              <p className="text-theme-rich-black">
                {formatValue(student?.cellphone)}
              </p>
            </div>
          </div>
          
          <div>
            <span className="block text-sm font-medium text-theme-rich-black/70 mb-1">
              Año de estudio
            </span>
            <div className="bg-theme-seasalt p-3 rounded-lg border border-theme-rich-black/20">
              <p className="text-theme-rich-black">
                {formatValue(student?.yearOfStudy)}
              </p>
            </div>
          </div>
          
          <div>
            <span className="block text-sm font-medium text-theme-rich-black/70 mb-1">
              Fecha de nacimiento
            </span>
            <div className="bg-theme-seasalt p-3 rounded-lg border border-theme-rich-black/20">
              <p className="text-theme-rich-black">
                {formatValue(student?.dateOfBirth)}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sección de Información Socioeconómica */}
      {socio && (
        <div className="mt-8">
          <h3 className="text-xl font-bold text-theme-rich-black mb-4 border-b-2 border-theme-keppel pb-2">
            Información Socioeconómica
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <span className="block text-sm font-medium text-theme-rich-black/70 mb-1">
                Lugar de nacimiento
              </span>
              <div className="bg-theme-seasalt p-3 rounded-lg border border-theme-rich-black/20">
                <p className="text-theme-rich-black">{formatValue(socio.placeOfBirth)}</p>
              </div>
            </div>
            
            <div>
              <span className="block text-sm font-medium text-theme-rich-black/70 mb-1">
                Estado civil
              </span>
              <div className="bg-theme-seasalt p-3 rounded-lg border border-theme-rich-black/20">
                <p className="text-theme-rich-black">{formatValue(socio.maritalStatus)}</p>
              </div>
            </div>
            
            <div>
              <span className="block text-sm font-medium text-theme-rich-black/70 mb-1">
                Número de hijos
              </span>
              <div className="bg-theme-seasalt p-3 rounded-lg border border-theme-rich-black/20">
                <p className="text-theme-rich-black">{formatValue(socio.numberOfChildren)}</p>
              </div>
            </div>
            
            <div>
              <span className="block text-sm font-medium text-theme-rich-black/70 mb-1">
                Ocupación laboral actual
              </span>
              <div className="bg-theme-seasalt p-3 rounded-lg border border-theme-rich-black/20">
                <p className="text-theme-rich-black">{formatValue(socio.currentJobOccupation)}</p>
              </div>
            </div>
            
            <div>
              <span className="block text-sm font-medium text-theme-rich-black/70 mb-1">
                Centro de trabajo
              </span>
              <div className="bg-theme-seasalt p-3 rounded-lg border border-theme-rich-black/20">
                <p className="text-theme-rich-black">{formatValue(socio.workCenter)}</p>
              </div>
            </div>
            
            <div>
              <span className="block text-sm font-medium text-theme-rich-black/70 mb-1">
                Antigüedad laboral
              </span>
              <div className="bg-theme-seasalt p-3 rounded-lg border border-theme-rich-black/20">
                <p className="text-theme-rich-black">{formatYears(socio.seniorityAtWork)}</p>
              </div>
            </div>
            
            <div>
              <span className="block text-sm font-medium text-theme-rich-black/70 mb-1">
                Ingreso familiar mensual
              </span>
              <div className="bg-theme-seasalt p-3 rounded-lg border border-theme-rich-black/20">
                <p className="text-theme-rich-black">{formatCurrency(socio.monthlyFamilyIncome)}</p>
              </div>
            </div>
            
            <div>
              <span className="block text-sm font-medium text-theme-rich-black/70 mb-1">
                Teléfono fijo
              </span>
              <div className="bg-theme-seasalt p-3 rounded-lg border border-theme-rich-black/20">
                <p className="text-theme-rich-black">{formatValue(socio.homePhoneNumber)}</p>
              </div>
            </div>
            
            <div>
              <span className="block text-sm font-medium text-theme-rich-black/70 mb-1">
                Correo personal
              </span>
              <div className="bg-theme-seasalt p-3 rounded-lg border border-theme-rich-black/20">
                <p className="text-theme-rich-black">{formatValue(socio.email)}</p>
              </div>
            </div>
            
            <div>
              <span className="block text-sm font-medium text-theme-rich-black/70 mb-1">
                Dirección de domicilio
              </span>
              <div className="bg-theme-seasalt p-3 rounded-lg border border-theme-rich-black/20">
                <p className="text-theme-rich-black">{formatValue(socio.homeAddress)}</p>
              </div>
            </div>
            
            <div>
              <span className="block text-sm font-medium text-theme-rich-black/70 mb-1">
                Miembros del hogar
              </span>
              <div className="bg-theme-seasalt p-3 rounded-lg border border-theme-rich-black/20">
                <p className="text-theme-rich-black">{formatValue(socio.numberOfHouseHoldMembers)}</p>
              </div>
            </div>
            
            <div>
              <span className="block text-sm font-medium text-theme-rich-black/70 mb-1">
                Parentesco
              </span>
              <div className="bg-theme-seasalt p-3 rounded-lg border border-theme-rich-black/20">
                <p className="text-theme-rich-black">{formatValue(socio.kinshipRelationship)}</p>
              </div>
            </div>
            
            <div>
              <span className="block text-sm font-medium text-theme-rich-black/70 mb-1">
                Tipo de vivienda
              </span>
              <div className="bg-theme-seasalt p-3 rounded-lg border border-theme-rich-black/20">
                <p className="text-theme-rich-black">{formatValue(socio.housingType)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Sección de Problemas Personales */}
      {personal && (
        <div className="mt-8">
          <h3 className="text-xl font-bold text-theme-rich-black mb-4 border-b-2 border-theme-keppel pb-2">
            Problemas Personales
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <span className="block text-sm font-medium text-theme-rich-black/70 mb-1">
                Problemas identificados
              </span>
              <div className="bg-theme-seasalt p-3 rounded-lg border border-theme-rich-black/20">
                <p className="text-theme-rich-black">{formatValue(personal.problems)}</p>
              </div>
            </div>
            
            <div>
              <span className="block text-sm font-medium text-theme-rich-black/70 mb-1">
                Nombre del representante
              </span>
              <div className="bg-theme-seasalt p-3 rounded-lg border border-theme-rich-black/20">
                <p className="text-theme-rich-black">{formatValue(personal.nameOfTheRepresentative)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Sección de Información Familiar */}
      {family && (
        <div className="mt-8">
          <h3 className="text-xl font-bold text-theme-rich-black mb-4 border-b-2 border-theme-keppel pb-2">
            Información Familiar
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <span className="block text-sm font-medium text-theme-rich-black/70 mb-1">
                Nivel educativo del padre
              </span>
              <div className="bg-theme-seasalt p-3 rounded-lg border border-theme-rich-black/20">
                <p className="text-theme-rich-black">{formatValue(family.fatherEducationLevel)}</p>
              </div>
            </div>
            
            <div>
              <span className="block text-sm font-medium text-theme-rich-black/70 mb-1">
                Nivel educativo de la madre
              </span>
              <div className="bg-theme-seasalt p-3 rounded-lg border border-theme-rich-black/20">
                <p className="text-theme-rich-black">{formatValue(family.motherEducationLevel)}</p>
              </div>
            </div>
            
            <div>
              <span className="block text-sm font-medium text-theme-rich-black/70 mb-1">
                Ocupación del padre
              </span>
              <div className="bg-theme-seasalt p-3 rounded-lg border border-theme-rich-black/20">
                <p className="text-theme-rich-black">{formatValue(family.fatherOccupation)}</p>
              </div>
            </div>
            
            <div>
              <span className="block text-sm font-medium text-theme-rich-black/70 mb-1">
                Ocupación de la madre
              </span>
              <div className="bg-theme-seasalt p-3 rounded-lg border border-theme-rich-black/20">
                <p className="text-theme-rich-black">{formatValue(family.motherOccupation)}</p>
              </div>
            </div>
            
            <div>
              <span className="block text-sm font-medium text-theme-rich-black/70 mb-1">
                Composición familiar
              </span>
              <div className="bg-theme-seasalt p-3 rounded-lg border border-theme-rich-black/20">
                <p className="text-theme-rich-black">{formatValue(family.familyComposition)}</p>
              </div>
            </div>
            
            <div>
              <span className="block text-sm font-medium text-theme-rich-black/70 mb-1">
                Total de hermanos
              </span>
              <div className="bg-theme-seasalt p-3 rounded-lg border border-theme-rich-black/20">
                <p className="text-theme-rich-black">{formatValue(family.totalSiblings)}</p>
              </div>
            </div>
            
            <div>
              <span className="block text-sm font-medium text-theme-rich-black/70 mb-1">
                Número de dependientes
              </span>
              <div className="bg-theme-seasalt p-3 rounded-lg border border-theme-rich-black/20">
                <p className="text-theme-rich-black">{formatValue(family.numberOfDependents)}</p>
              </div>
            </div>
            
            <div>
              <span className="block text-sm font-medium text-theme-rich-black/70 mb-1">
                Tipo de familia
              </span>
              <div className="bg-theme-seasalt p-3 rounded-lg border border-theme-rich-black/20">
                <p className="text-theme-rich-black">{formatValue(family.familyType)}</p>
              </div>
            </div>

            <div>
              <span className="block text-sm font-medium text-theme-rich-black/70 mb-1">
                Teléfono del representante
              </span>
              <div className="bg-theme-seasalt p-3 rounded-lg border border-theme-rich-black/20">
                <p className="text-theme-rich-black">{formatValue(family.representativePhoneNumber)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}