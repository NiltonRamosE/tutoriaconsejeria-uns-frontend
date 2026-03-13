import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/dashboard/administrator/components/AdminSidebar';
import { AdministratorProfile } from '@/dashboard/administrator/sections/AdministratorProfile';
import ManageAdministratorSection from '@/dashboard/administrator/sections/ManageAdministratorSection';
import { useAdministratorSection } from '@/dashboard/shared/hooks/useAdministratorSection';
// import AssignSection from './sections/AssignSection';
// import StudentSection from './sections/StudentSection';
// import InstructorSection from './sections/InstructorSection';
// import AcademicScheduleSection from './sections/AcademicScheduleSection';
// import InstructorScheduleSection from './sections/InstructorScheduleSection';


export function AdministratorPanel() {
  const { activeSection, changeSection } = useAdministratorSection('manage');
  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        return <AdministratorProfile />;
      case 'manage':
        return <ManageAdministratorSection />;
      // case 'assign':
      //   return <AssignSection />;
      // case 'students':
      //   return <StudentSection />;
      // case 'instructors':
      //   return <InstructorSection />;
      // case 'academic-schedule':
      //   return <AcademicScheduleSection />;
      // case 'instructor-schedule':
      //   return <InstructorScheduleSection />;
      default:
        return <ManageAdministratorSection />;
    }
  };

  return (
    <section className="min-h-screen bg-theme-seasalt p-6 md:p-10">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-theme-rich-black">
          Panel de Administrador
        </h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <AdminSidebar 
          activeSection={activeSection}
          onSectionChange={changeSection}
        />
        
        <main className="lg:col-span-3">
          {renderSection()}
        </main>
      </div>
    </section>
  );
}