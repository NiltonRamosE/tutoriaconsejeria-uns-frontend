import type { Section } from "@/domain/types/SectionType";

export const siteConfig = {
  name: "Tutoría y Consejería EPISI",
  description:
    "La tutoría y consejería es un servicio que brinda la Universidad Nacional del Santa",
  navItems: [
    {
      label: "Docentes",
      href: "/docentes",
    },
    {
      label: "Tutoría",
      href: "/tutoria",
    },
    {
      label: "Nosotros",
      href: "/nosotros",
    },
  ],
  navMenuItems: [
    {
      label: "Docentes",
      href: "/docentes",
    },
    {
      label: "Tutoría",
      href: "/tutoria",
    },
    {
      label: "Nosotros",
      href: "/nosotros",
    },
  ],
  administratorSidebarItems: [
    {
      section: 'manage' as Section,
      title: 'Gestión de Administradores',
      description: 'Administración de cuentas de administradores',
      iconSrc: '/icons/administrator-outline.svg'
    },
    {
      section: 'assign' as Section,
      title: 'Asignar Estudiantes',
      description: 'Gestiona la asignación de tutorados',
      iconSrc: '/icons/team-person-outline.svg'
    },
    {
      section: 'students' as Section,
      title: 'Gestión de Estudiantes',
      description: 'Administra estudiantes',
      iconSrc: '/icons/student-outline.svg'
    },
    {
      section: 'instructors' as Section,
      title: 'Gestión de Docentes',
      description: 'Administra docentes',
      iconSrc: '/icons/instructor-outline.svg'
    },
    {
      section: 'academic-schedule' as Section,
      title: 'Horarios Académicos Estudiantes',
      description: 'Verifica horarios de estudiantes en el semestre lectivo',
      iconSrc: '/icons/schedule-double-fill.svg'
    },
    {
      section: 'instructor-schedule' as Section,
      title: 'Horarios Académicos Docentes',
      description: 'Verifica horarios de docentes en el semestre lectivo',
      iconSrc: '/icons/schedule-fill.svg'
    }
  ],
  studentSidebarItems: [
      {
        section: 'dashboard' as Section,
        title: 'Inicio',
        description: 'Resumen de actividades',
        iconSrc: '/icons/four-square.svg'
      },
      {
        section: 'evaluate' as Section,
        title: "Evaluar Docente",
        description: "Comparte tu retroalimentación",
        iconSrc: "/icons/writing-in-paper.svg",
      },
      {
        section: 'surveys' as Section,
        title: 'Cuestionarios',
        description: 'Registro de evaluaciones',
        iconSrc: '/icons/paper.svg'
      },
      {
        section: 'appointments-schedule' as Section,
        title: 'Ver Citas Programadas',
        description: 'Consulta tus citas',
        iconSrc: '/icons/calendar-blank.svg'
      },
      {
        section: 'appointments' as Section,
        title: 'Programar Cita',
        description: 'Agenda tutorías o consejería',
        iconSrc: '/icons/calendar-blank.svg'
      },
  ],
  instructorSidebarItems: [
    {
        section: 'dashboard' as Section,
        title: 'Inicio',
        description: 'Resumen de actividades',
        iconSrc: '/icons/four-square.svg'
      },
      {
        section: 'evaluate' as Section,
        title: "Evaluar Estudiante",
        description: "Comparte tu retroalimentación",
        iconSrc: "/icons/writing-in-paper.svg",
      },
      {
        section: 'surveys' as Section,
        title: 'Gestionar Estudiantes',
        description: 'Consultar estudiantes y horarios',
        iconSrc: '/icons/paper.svg'
      },
      {
        section: 'appointments-schedule' as Section,
        title: 'Ver Citas Programadas',
        description: 'Consulta tus citas',
        iconSrc: '/icons/calendar-blank.svg'
      },
      {
        section: 'appointments' as Section,
        title: 'Programar Cita',
        description: 'Agenda tutorías o consejería',
        iconSrc: '/icons/calendar-blank.svg'
      },
  ]
};