import React, { useEffect, useState } from 'react';
import { type User } from '@/domain/entities/User';
import { getUser } from '@/dashboard/shared/authUtils';

interface StudentProfileCardProps {
  onViewProfile?: () => void;
}

export function StudentProfileCard({ onViewProfile }: StudentProfileCardProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = getUser();
    setUser(userData);
    setLoading(false);
  }, []);

  const displayName = user?.fullName || 'Estudiante';

  const handleViewProfile = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (onViewProfile) {
      onViewProfile();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center space-x-4 bg-white p-4 rounded-2xl shadow-md border-2 border-theme-rich-black/10 animate-pulse">
        <div className="w-12 h-12 rounded-full bg-theme-keppel/50"></div>
        <div className="space-y-2">
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
          <div className="h-3 w-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (

    <div className="bg-white p-6 rounded-3xl shadow-lg border-2 border-b-8 border-theme-rich-black">
        <div className="flex items-center">
            <div className="mr-4 w-16 h-16 bg-theme-keppel/20 rounded-2xl flex items-center justify-center">
                <span className="text-2xl text-theme-keppel">
                    <img src="/icons/student-outline.svg" alt="Icono de Estudiante" className="h-5 w-5" />
                </span>
            </div>
            <div>
                <h2 className="text-xl font-bold text-theme-rich-black">{ displayName }</h2>
                <p className="text-sm text-gray-600">{ user?.institutionalEmail }</p>
            </div>
        </div>
        <div className="mt-4 pt-4 border-t border-theme-rich-black/20">
            <p className="text-sm font-light text-gray-600"><span className="font-bold">Carrera:</span> Ingeniería de Sistemas e Informática</p>
            <a href="#" onClick={handleViewProfile} className="text-sm text-theme-keppel hover:underline">Ver perfil</a>
        </div>
    </div>
  );
};