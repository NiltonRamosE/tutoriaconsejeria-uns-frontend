import React from 'react';
import { StudentSidebar } from '@/dashboard/student/components/StudentSidebar';
import { DashboardSection } from '@/dashboard/student/sections/DashboardSection';
import { EvaluateSection } from '@/dashboard/student/sections/EvaluateSection';
import { SurveysSection } from '@/dashboard/student/sections/SurveysSection';
import AppointmentsSection from '@/dashboard/student/sections/AppointmentSection';
import { StudentProfile } from '@/dashboard/student/sections/StudentProfile';
//import AppointmentsScheduleSection from '@/dashboard/student/sections/AppointmentsScheduleSection.astro';
import { useStudentSection } from '@/dashboard/shared/hooks/useStudentSection';


export function StudentPanel() {
  const { activeSection, changeSection } = useStudentSection('dashboard');
  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        return <StudentProfile />;
      case 'dashboard':
        return <DashboardSection />;
      case 'evaluate':
        return <EvaluateSection />;
      case 'surveys':
        return <SurveysSection />;
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
        <h1 className="text-3xl md:text-4xl font-bold text-theme-rich-black">Panel de Estudiante</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <StudentSidebar 
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