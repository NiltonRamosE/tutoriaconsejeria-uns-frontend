import React from 'react';
import { siteConfig } from '@/shared/site';
import { AdminProfileCard } from '@/dashboard/administrator/components/AdminProfileCard';
import LogoutButton from '@/shared/components/LogoutButton';
import ItemSidebar from '@/shared/components/ItemSidebar';

export function AdminSidebar() {
  return (
    <aside className="lg:col-span-1 space-y-6">
      <AdminProfileCard />
      
      <div className="bg-white p-6 rounded-3xl shadow-lg border-2 border-b-8 border-theme-rich-black">
        <h2 className="text-2xl font-bold mb-6 text-theme-rich-black">Acciones</h2>
        
        <nav className="space-y-4">
          {siteConfig.administratorSidebarItems.map((item) => (
            <ItemSidebar
              key={item.section}
              href="#"
              section={item.section}
              title={item.title}
              description={item.description}
              iconSrc={item.iconSrc}
            />
          ))}
          
          <div className="pt-4 border-t border-theme-rich-black/20">
            <LogoutButton />
          </div>
        </nav>
      </div>
    </aside>
  );
};