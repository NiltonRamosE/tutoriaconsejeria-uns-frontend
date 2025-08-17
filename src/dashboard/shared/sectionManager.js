export function initSection(defaultSection) {
    // Obtener el parámetro de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const section = urlParams.get('section') || defaultSection;

    // Cambiar a la sección correspondiente
    changeSection(section);
}

export function changeSection(section) {
    // Ocultar todas las secciones
    document.querySelectorAll('.content-section').forEach(el => {
        el.style.display = 'none';
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
}

export function updateActiveSectionStyles(section) {
    document.querySelectorAll('[data-section]').forEach(el => {
        const isActive = el.getAttribute('data-section') === section;
        el.classList.toggle('bg-theme-keppel/10', isActive);
        el.classList.toggle('border-theme-keppel', isActive);
        el.classList.toggle('hover:bg-theme-keppel/5', !isActive);
        el.classList.toggle('border-theme-rich-black/20', !isActive);
    });
}

export function setupSectionListeners(defaultSection) {
    initSection(defaultSection);

    // Manejar clicks en el sidebar
    document.querySelectorAll('[data-section]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = e.currentTarget.getAttribute('data-section');
            changeSection(section);
        });
    });

    // Manejar navegación con botones atrás/adelante
    window.addEventListener('popstate', () => {
        initSection(defaultSection);
    });
}
