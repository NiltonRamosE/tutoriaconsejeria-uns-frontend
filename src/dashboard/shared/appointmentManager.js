export function resetForm(appointmentForm, appointmentFormContainer) {
    appointmentForm.reset();
    resetModalityButtons();
    toggleFieldVisibility(appointmentFormContainer, false);
    resetFormSteps();
}

export function resetModalityButtons() {
  document.querySelectorAll('.modalidad-btn').forEach(btn => {
    btn.classList.remove('bg-theme-keppel/20', 'border-theme-keppel');
    btn.classList.add('bg-theme-seasalt', 'border-theme-rich-black/20');
  });
}

export function setSelectedModalityButton(modality, individualBtn, groupBtn) {
    const selectedBtn = modality === 'I' ? individualBtn : groupBtn;
    selectedBtn.classList.remove('bg-theme-seasalt', 'border-theme-rich-black/20');
    selectedBtn.classList.add('bg-theme-keppel/20', 'border-theme-keppel'); 
}

export function resetFormSteps() {
    document.querySelectorAll('.form-step').forEach(step => {
        step.classList.add('hidden');
    });
    document.querySelector('.form-step[data-step="1"]').classList.remove('hidden');
}

export function toggleFieldVisibility(field, show) {
    field?.classList.toggle('hidden', !show);
}

export function initAppointmentFormListeners(nextStep, prevStep, appointmentMethod, specificMethodContainer, appointmentReason, specificReasonContainer) {
    document.querySelectorAll('.next-step-btn').forEach(btn => {
        btn.addEventListener('click', nextStep);
    });
    
    document.querySelectorAll('.prev-step-btn').forEach(btn => {
        btn.addEventListener('click', prevStep);
    });
    
    appointmentMethod.addEventListener('change', function() {
        toggleFieldVisibility(specificMethodContainer, this.value === 'Otro');
    });
    
    appointmentReason.addEventListener('change', function() {
        toggleFieldVisibility(specificReasonContainer, this.value === 'Otro');
    });
}