export function resetForm(appointmentForm, appointmentFormContainer, selectedModality, selectedInstructor, selectedStudents, currentStep) {
    appointmentForm.reset();
    selectedModality = '';
    selectedInstructor = null;
    selectedStudents = [];
    currentStep = 1;
    
    // Reset UI
    document.querySelectorAll('.modalidad-btn').forEach(btn => {
        btn.classList.remove('bg-theme-keppel/20', 'border-theme-keppel');
        btn.classList.add('bg-theme-seasalt', 'border-theme-rich-black/20');
    });
    
    appointmentFormContainer.classList.add('hidden');
    resetFormSteps();

    return {selectedModality, selectedInstructor, selectedStudents, currentStep};
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