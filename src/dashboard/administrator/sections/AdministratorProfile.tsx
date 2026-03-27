import React, { useEffect, useState } from 'react';
import { type User } from '@/domain/entities/User';
import { getUser } from '@/dashboard/shared/authUtils';

export function AdministratorProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = getUser();
    setUser(userData);
    setLoading(false);
  }, []);

  const getGenderIcon = (gender?: string): { path: string; alt: string } => {
    if (gender === 'M') {
      return { path: '/icons/male-user.svg', alt: 'Icono Masculino' };
    } else if (gender === 'F') {
      return { path: '/icons/female-user.svg', alt: 'Icono Femenino' };
    }
    return { path: '/icons/administrator-outline.svg', alt: 'Icono de Administrador' };
  };

  const handleChangePhoto = () => {
    console.log('Cambiar foto de perfil');
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
          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 w-32 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const genderIcon = getGenderIcon(user?.gender as string | undefined);
  const fullName = user?.fullName || 'Administrador';
  const institutionalEmail = user?.institutionalEmail || 'correo@uns.edu.pe';

  return (
    <div className="bg-white p-6 rounded-3xl shadow-lg border-2 border-b-8 border-theme-rich-black">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <h2 className="text-2xl font-bold text-theme-rich-black">Perfil de Administrador</h2>
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
        
        <div className="flex-1">
          <div className="space-y-4">
            <div>
              <span className="block text-sm font-medium text-theme-rich-black/70 mb-1">
                Nombre completo
              </span>
              <div className="bg-theme-seasalt p-3 rounded-lg border border-theme-rich-black/20">
                <p className="text-theme-rich-black">
                  {fullName}
                </p>
              </div>
            </div>
            
            <div>
              <span className="block text-sm font-medium text-theme-rich-black/70 mb-1">
                Correo institucional
              </span>
              <div className="bg-theme-seasalt p-3 rounded-lg border border-theme-rich-black/20">
                <p className="text-theme-rich-black">
                  {institutionalEmail}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};