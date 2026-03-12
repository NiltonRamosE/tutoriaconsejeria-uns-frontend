import React, { useEffect, useState } from 'react';
import { type User } from '@/domain/entities/User';
import { getUser } from '@/dashboard/shared/authUtils';

export function AdminProfileCard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = getUser();
    setUser(userData);
    setLoading(false);
  }, []);

  const displayName = user?.fullName || 'Administrador';

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
    <div className="flex items-center space-x-4 bg-white p-4 rounded-2xl shadow-md border-2 border-theme-rich-black/10">
      <div className="w-12 h-12 rounded-full bg-theme-keppel flex items-center justify-center text-white text-xl">
        <img 
          src="/icons/administrator-outline.svg" 
          alt="Icono de Administrador" 
          className="h-5 w-5" 
        />
      </div>
      <div>
        <p className="font-semibold text-theme-rich-black">
          {displayName}
        </p>
        <a 
          href="#" 
          data-section="administrator-profile" 
          className="text-sm text-theme-keppel hover:underline"
        >
          Ver perfil
        </a>
      </div>
    </div>
  );
};