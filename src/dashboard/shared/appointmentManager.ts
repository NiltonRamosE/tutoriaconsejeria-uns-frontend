/**
 * Resetea completamente el formulario de citas
 * @param appointmentForm - Elemento del formulario a resetear
 * @param appointmentFormContainer - Contenedor del formulario
 */
export function resetForm(
  appointmentForm: HTMLFormElement, 
  appointmentFormContainer: HTMLElement
): void {
  appointmentForm.reset();
  resetModalityButtons();
  toggleFieldVisibility(appointmentFormContainer, false);
  resetFormSteps();
}

/**
 * Resetea los estilos de los botones de modalidad a su estado inicial
 */
export function resetModalityButtons(): void {
  document.querySelectorAll('.modalidad-btn').forEach(btn => {
    btn.classList.remove('bg-theme-keppel/20', 'border-theme-keppel');
    btn.classList.add('bg-theme-seasalt', 'border-theme-rich-black/20');
  });
}

/**
 * Establece el estilo del botón de modalidad seleccionado
 * @param modality - Modalidad seleccionada ('I' para individual, 'G' para grupal)
 * @param individualBtn - Botón de modalidad individual
 * @param groupBtn - Botón de modalidad grupal
 */
export function setSelectedModalityButton(
  modality: 'I' | 'G',
  individualBtn: HTMLElement,
  groupBtn: HTMLElement
): void {
  const selectedBtn = modality === 'I' ? individualBtn : groupBtn;
  selectedBtn.classList.remove('bg-theme-seasalt', 'border-theme-rich-black/20');
  selectedBtn.classList.add('bg-theme-keppel/20', 'border-theme-keppel');
}

/**
 * Resetea los pasos del formulario al primer paso
 */
export function resetFormSteps(): void {
  document.querySelectorAll('.form-step').forEach(step => {
    step.classList.add('hidden');
  });
  
  const firstStep = document.querySelector('.form-step[data-step="1"]');
  if (firstStep) {
    firstStep.classList.remove('hidden');
  }
}

/**
 * Muestra u oculta un campo del formulario
 * @param field - Elemento del campo a mostrar/ocultar
 * @param show - true para mostrar, false para ocultar
 */
export function toggleFieldVisibility(
  field: HTMLElement | null,
  show: boolean
): void {
  if (field) {
    field.classList.toggle('hidden', !show);
  }
}

/**
 * Inicializa los listeners del formulario de citas
 * @param nextStep - Función para ir al siguiente paso
 * @param prevStep - Función para ir al paso anterior
 * @param appointmentMethod - Selector de método de cita
 * @param specificMethodContainer - Contenedor del método específico
 * @param appointmentReason - Selector de razón de cita
 * @param specificReasonContainer - Contenedor de razón específica
 */
export function initAppointmentFormListeners(
  nextStep: () => void,
  prevStep: () => void,
  appointmentMethod: HTMLSelectElement,
  specificMethodContainer: HTMLElement,
  appointmentReason: HTMLSelectElement,
  specificReasonContainer: HTMLElement
): void {
  document.querySelectorAll('.next-step-btn').forEach(btn => {
    btn.addEventListener('click', nextStep);
  });
  
  document.querySelectorAll('.prev-step-btn').forEach(btn => {
    btn.addEventListener('click', prevStep);
  });
  
  appointmentMethod.addEventListener('change', function(this: HTMLSelectElement) {
    toggleFieldVisibility(specificMethodContainer, this.value === 'Otro');
  });
  
  appointmentReason.addEventListener('change', function(this: HTMLSelectElement) {
    toggleFieldVisibility(specificReasonContainer, this.value === 'Otro');
  });
}

// Tipos auxiliares para uso en componentes
export interface AppointmentFormElements {
  form: HTMLFormElement;
  container: HTMLElement;
  individualBtn: HTMLElement;
  groupBtn: HTMLElement;
  appointmentMethod: HTMLSelectElement;
  specificMethodContainer: HTMLElement;
  appointmentReason: HTMLSelectElement;
  specificReasonContainer: HTMLElement;
}

export type ModalityType = 'I' | 'G';