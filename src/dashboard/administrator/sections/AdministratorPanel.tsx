import React, { useEffect } from 'react';
import { sectionManager } from '@/dashboard/shared/sectionManager';
import AssignSection from '@/dashboard/administrator/sections/AssignSection.astro';
import { AdminSidebar } from '@/dashboard/administrator/components/AdminSidebar';
import InstructorSection from '@/dashboard/administrator/sections/InstructorSection.astro';
import StudentSection from '@/dashboard/administrator/sections/StudentSection.astro';
import AcademicScheduleSection from '@/dashboard/administrator/sections/AcademicScheduleSection.astro';
import InstructorScheduleSection from '@/dashboard/administrator/sections/InstructorScheduleSection.astro';
import { AdministratorProfile } from '@/dashboard/administrator/sections/AdministratorProfile';
import ManageAdministratorSection from '@/dashboard/administrator/sections/ManageAdministratorSection';

export function AdministratorPanel(){
  useEffect(() => {
    // Inicializar el manejador de secciones
    const manager = sectionManager();
    manager.setupSectionListeners('manage-administrator');

    // Cleanup: remover event listeners cuando el componente se desmonte
    return () => {
      window.removeEventListener('popstate', () => {});
    };
  }, []);

  return (
    <section className="min-h-screen bg-theme-seasalt p-6 md:p-10">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-theme-rich-black">
          Panel de Administrador
        </h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <AdminSidebar />
        
        <main className="lg:col-span-3">
          <div id="administrator-profile-section" className="content-section">
            <AdministratorProfile />
          </div>
          <div id="manage-administrator-section" className="content-section">
            <ManageAdministratorSection />
          </div>
          <div id="assign-section" className="content-section">
            <AssignSection />
          </div>
          <div id="students-section" className="content-section">
            <StudentSection />
          </div>
          <div id="instructors-section" className="content-section">
            <InstructorSection />
          </div>
          <div id="academic-schedule-section" className="content-section">
            <AcademicScheduleSection />
          </div>
          <div id="instructor-schedule-section" className="content-section">
            <InstructorScheduleSection />
          </div>
        </main>
      </div>
    </section>
  );
};