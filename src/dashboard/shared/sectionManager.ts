export interface SectionManager {
  initSection: (defaultSection: string) => void;
  changeSection: (section: string) => void;
  updateActiveSectionStyles: (section: string) => void;
  setupSectionListeners: (defaultSection: string) => void;
}

export const sectionManager = (): SectionManager => {
  const initSection = (defaultSection: string): void => {
    // Obtener el parámetro de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const section = urlParams.get('section') || defaultSection;

    // Cambiar a la sección correspondiente
    changeSection(section);
  };

  const changeSection = (section: string): void => {
    // Ocultar todas las secciones
    document.querySelectorAll('.content-section').forEach(el => {
      (el as HTMLElement).style.display = 'none';
    });
    
    // Mostrar la sección seleccionada
    const targetSection = document.getElementById(`${section}-section`);
    if (targetSection) {
      targetSection.style.display = 'block';
    }
    
    // Actualizar estilos del sidebar
    updateActiveSectionStyles(section);
    
    // Actualizar URL
    window.history.pushState({ section }, '', `?section=${section}`);
  };

  const updateActiveSectionStyles = (section: string): void => {
    document.querySelectorAll('[data-section]').forEach(el => {
      const isActive = el.getAttribute('data-section') === section;
      el.classList.toggle('bg-theme-keppel/10', isActive);
      el.classList.toggle('border-theme-keppel', isActive);
      el.classList.toggle('hover:bg-theme-keppel/5', !isActive);
      el.classList.toggle('border-theme-rich-black/20', !isActive);
    });
  };

  const setupSectionListeners = (defaultSection: string): void => {
    initSection(defaultSection);

    // Manejar clicks en el sidebar
    document.querySelectorAll('[data-section]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const section = (e.currentTarget as HTMLElement).getAttribute('data-section');
        if (section) {
          changeSection(section);
        }
      });
    });

    // Manejar navegación con botones atrás/adelante
    window.addEventListener('popstate', () => {
      initSection(defaultSection);
    });
  };

  return {
    initSection,
    changeSection,
    updateActiveSectionStyles,
    setupSectionListeners
  };
};