import React from 'react';
import { InstructorSidebar } from '@/dashboard/instructor/components/InstructorSidebar';
import DashboardSection from '@/dashboard/instructor/sections/DashboardSection';
import EvaluateSection from '@/dashboard/instructor/sections/EvaluateSection';
import ManageStudentsSection from '@/dashboard/instructor/sections/ManageStudentsSection';
import AppointmentsSection from '@/dashboard/instructor/sections/AppointmentsSection';
//import AppointmentsScheduleSection from '@/dashboard/instructor/sections/AppointmentsScheduleSection.astro';
import { useInstructorSection } from '@/dashboard/shared/hooks/useInstructorSection';

export function InstructorPanel() {
  const { activeSection, changeSection } = useInstructorSection('dashboard');
  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardSection />;
      case 'evaluate':
        return <EvaluateSection />;
      case 'surveys':
        return <ManageStudentsSection />;
      /*case 'appointments-schedule':
        return <AppointmentsScheduleSection />;*/
      case 'appointments':
        return <AppointmentsSection />;
      default:
        return <DashboardSection />;
    }
  };

  return (
    <section className="min-h-screen bg-theme-seasalt p-6 md:p-10">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-theme-rich-black">
          Panel de Docente
        </h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <InstructorSidebar 
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