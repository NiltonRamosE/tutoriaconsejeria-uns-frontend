import { useState, useEffect, useCallback } from 'react';
import type { Section } from '@/domain/types/SectionType';

interface UseSectionOptions {
  defaultSection: Section;
  modulePrefix?: string;
}

interface UseSectionReturn {
  activeSection: Section;
  changeSection: (section: Section) => void;
  isActive: (section: Section) => boolean;
}

export function useSection({ 
  defaultSection, 
  modulePrefix = '' 
}: UseSectionOptions): UseSectionReturn {
  const [activeSection, setActiveSection] = useState<Section>(defaultSection);

  // Función para obtener la sección de la URL
  const getSectionFromUrl = useCallback((): Section => {
    const urlParams = new URLSearchParams(window.location.search);
    const sectionParam = urlParams.get('section');
    
    // Si hay prefijo de módulo, extraer la sección (ej: "admin-dashboard" -> "dashboard")
    if (modulePrefix && sectionParam?.startsWith(`${modulePrefix}-`)) {
      return sectionParam.replace(`${modulePrefix}-`, '') as Section;
    }
    
    return (sectionParam as Section) || defaultSection;
  }, [defaultSection, modulePrefix]);

  // Actualizar URL con la sección
  const updateUrl = useCallback((section: Section) => {
    const url = new URL(window.location.href);
    
    if (modulePrefix) {
      url.searchParams.set('section', `${modulePrefix}-${section}`);
    } else {
      url.searchParams.set('section', section);
    }
    
    window.history.pushState({ section }, '', url.toString());
  }, [modulePrefix]);

  // Inicializar y escuchar cambios de navegación
  useEffect(() => {
    const section = getSectionFromUrl();
    setActiveSection(section);

    const handlePopState = () => {
      const section = getSectionFromUrl();
      setActiveSection(section);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [getSectionFromUrl]);

  // Cambiar de sección
  const changeSection = useCallback((section: Section) => {
    setActiveSection(section);
    updateUrl(section);
  }, [updateUrl]);

  // Verificar si una sección está activa (útil para estilos)
  const isActive = useCallback((section: Section): boolean => {
    return activeSection === section;
  }, [activeSection]);

  return {
    activeSection,
    changeSection,
    isActive
  };
}