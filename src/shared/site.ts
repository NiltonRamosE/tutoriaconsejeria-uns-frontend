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
      section: 'manage-administrator',
      title: 'Gestión de Administradores',
      description: 'Administración de cuentas de administradores',
      iconSrc: '/icons/administrator-outline.svg'
    },
    {
      section: 'assign',
      title: 'Asignar Estudiantes',
      description: 'Gestiona la asignación de tutorados',
      iconSrc: '/icons/team-person-outline.svg'
    },
    {
      section: 'students',
      title: 'Gestión de Estudiantes',
      description: 'Administra estudiantes',
      iconSrc: '/icons/student-outline.svg'
    },
    {
      section: 'instructors',
      title: 'Gestión de Docentes',
      description: 'Administra docentes',
      iconSrc: '/icons/instructor-outline.svg'
    },
    {
      section: 'academic-schedule',
      title: 'Horarios Académicos Estudiantes',
      description: 'Verifica horarios de estudiantes en el semestre lectivo',
      iconSrc: '/icons/schedule-double-fill.svg'
    },
    {
      section: 'instructor-schedule',
      title: 'Horarios Académicos Docentes',
      description: 'Verifica horarios de docentes en el semestre lectivo',
      iconSrc: '/icons/schedule-fill.svg'
    }
  ]
};