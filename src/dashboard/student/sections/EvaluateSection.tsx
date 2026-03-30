import React, { useState, useEffect } from 'react';
import { getUser } from '@/dashboard/shared/authUtils';
import { fetchAssignedInstructor, submitEvaluationInstructor } from '@/infrastructure/api/student';
import { fetchIsEnabledAssessment, fetchAssessmentById } from '@/infrastructure/api/assessment';
import { assessedQuestions, ratingOptions } from '../data/assessedQuestions';
import ViewAssessmentModal from '@/dashboard/instructor/components/ViewAssessmentModal';
import type { AssessmentRequest } from '@/infrastructure/dto/assessment/AssessmentRequest';
import type { AssessedQuestion } from '@/infrastructure/dto/assessment/AssessedQuestion';
import type { AssessmentInstructorResponse } from '@/infrastructure/dto/assessment/AssessmentInstructorResponse';
import type { InstructorWithEvaluation } from '@/domain/types/Assessment';

const EvaluateInstructorSection: React.FC = () => {
  const [instructors, setInstructors] = useState<InstructorWithEvaluation[]>([]);
  const [selectedInstructor, setSelectedInstructor] = useState<InstructorWithEvaluation | null>(null);
  const [questions, setQuestions] = useState<Record<number, number>>({});
  const [observation, setObservation] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEvaluationForm, setShowEvaluationForm] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewAssessmentData, setViewAssessmentData] = useState<AssessmentInstructorResponse | null>(null);
  const [viewAssessmentId, setViewAssessmentId] = useState<number | null>(null);

  const studentData = getUser();
  const studentId = studentData?.id;

  useEffect(() => {
    if (studentId) {
      loadInstructors();
    }
  }, [studentId]);

  const loadInstructors = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAssignedInstructor(studentId!);
      
      const instructorsWithEval: InstructorWithEvaluation[] = [];
      
      for (const instructor of data) {
        const typeActivity = instructor.typeActivity as 'T' | 'C';
        const assessmentId = await fetchIsEnabledAssessment(studentId!, instructor.id, typeActivity, true);
        
        instructorsWithEval.push({
          id: instructor.id,
          fullName: instructor.fullName,
          typeActivity,
          assessmentId
        });
      }
      
      setInstructors(instructorsWithEval);
    } catch (error) {
      console.error('Error loading instructors:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartEvaluation = (instructor: InstructorWithEvaluation) => {
    setSelectedInstructor(instructor);
    setQuestions({});
    setObservation('');
    setSuggestion('');
    setShowEvaluationForm(true);
  };

  const handleViewEvaluation = async (instructor: InstructorWithEvaluation) => {
    if (instructor.assessmentId) {
      try {
        const data = await fetchAssessmentById(instructor.assessmentId);
        setViewAssessmentData(data as AssessmentInstructorResponse);
        setViewAssessmentId(instructor.assessmentId);
        setViewModalOpen(true);
      } catch (error) {
        console.error('Error loading assessment:', error);
        alert('Error al cargar la evaluación');
      }
    }
  };

  const handleBack = () => {
    setSelectedInstructor(null);
    setQuestions({});
    setObservation('');
    setSuggestion('');
    setShowEvaluationForm(false);
  };

  const handleRatingChange = (order: number, value: number) => {
    setQuestions(prev => ({ ...prev, [order]: value }));
  };

  const isFormValid = () => {
    const allQuestionsAnswered = assessedQuestions.every(q => questions[q.order] !== undefined);
    return allQuestionsAnswered;
  };

  const handleSubmit = async () => {
    if (!isFormValid()) {
      alert('Por favor, responde todas las preguntas antes de enviar la evaluación.');
      return;
    }

    if (!selectedInstructor) {
      alert('Por favor, selecciona un docente para evaluar.');
      return;
    }

    setIsSubmitting(true);

    try {
      const questionsArray: AssessedQuestion[] = assessedQuestions.map(q => ({
        order: q.order,
        question: q.question,
        score: questions[q.order] ?? 0
      }));

      const formData: AssessmentRequest = {
        studentId: Number(studentId),
        instructorId: selectedInstructor.id,
        typeActivity: selectedInstructor.typeActivity,
        questions: questionsArray,
        observation: observation.trim() || '',
        suggestion: suggestion.trim() || ''
      };

      console.log('📋 Evaluación a enviar:', JSON.stringify(formData, null, 2));
      
      await submitEvaluationInstructor(formData);
      alert('Evaluación registrada exitosamente');
      
      // Recargar instructores para actualizar estados
      await loadInstructors();
      handleBack();
      
    } catch (error) {
      console.error('❌ Error al enviar evaluación:', error);
      alert('No se pudo registrar la evaluación, intente nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    handleBack();
  };

  const getActivityLabel = (type: 'T' | 'C') => {
    return type === 'T' ? 'Tutoría' : 'Consejería';
  };

  const getActivityColor = (type: 'T' | 'C') => {
    return type === 'T' 
      ? 'border-blue-200 bg-blue-50 hover:bg-blue-100' 
      : 'border-green-200 bg-green-50 hover:bg-green-100';
  };

  const getActivityIcon = (type: 'T' | 'C') => {
    return type === 'T' ? '📚' : '💬';
  };

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-3xl shadow-lg border-2 border-b-8 border-theme-rich-black">
        <h2 className="text-2xl font-bold mb-6 text-theme-rich-black">Evaluar Docente</h2>
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-theme-keppel"></div>
          <p className="mt-2 text-gray-500">Cargando docentes asignados...</p>
        </div>
      </div>
    );
  }

  if (instructors.length === 0) {
    return (
      <div className="bg-white p-6 rounded-3xl shadow-lg border-2 border-b-8 border-theme-rich-black">
        <h2 className="text-2xl font-bold mb-6 text-theme-rich-black">Evaluar Docente</h2>
        <div className="text-center py-12 text-gray-500 bg-gradient-to-br from-theme-seasalt to-white rounded-2xl border border-dashed border-theme-rich-black/20">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <p className="text-lg font-medium">No tienes docentes asignados</p>
          <p className="text-sm mt-1">Aún no se te ha asignado un tutor o consejero</p>
        </div>
      </div>
    );
  }

  // Si estamos en el formulario de evaluación
  if (showEvaluationForm && selectedInstructor) {
    return (
      <div className="bg-white p-6 rounded-3xl shadow-lg border-2 border-b-8 border-theme-rich-black">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-theme-rich-black">Evaluar Docente</h2>
            <p className="text-sm text-gray-500 mt-1">
              {getActivityLabel(selectedInstructor.typeActivity)} - {selectedInstructor.fullName}
            </p>
          </div>
          <button
            onClick={handleBack}
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver
          </button>
        </div>

        {/* Preguntas de evaluación */}
        <div className="space-y-6 mb-6">
          {assessedQuestions.map((question, index) => (
            <div key={question.order} className="border border-theme-rich-black/20 rounded-xl p-4 bg-gradient-to-r from-white to-theme-seasalt">
              <p className="font-medium text-theme-rich-black mb-3">
                {index + 1}. {question.question}
              </p>
              <div className="grid grid-cols-5 gap-2">
                {ratingOptions.map(option => (
                  <label
                    key={option.value}
                    className={`flex flex-col items-center p-2 rounded-lg cursor-pointer transition-all ${
                      questions[question.order] === option.value
                        ? 'bg-theme-keppel/10 border-2 border-theme-keppel'
                        : 'bg-white border-2 border-theme-rich-black/20 hover:border-theme-keppel/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${question.order}`}
                      value={option.value}
                      checked={questions[question.order] === option.value}
                      onChange={() => handleRatingChange(question.order, option.value)}
                      className="sr-only"
                    />
                    <span className="text-sm font-semibold text-theme-rich-black">{option.value}</span>
                    <span className="text-xs text-gray-500 text-center">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Observación y sugerencia */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-theme-rich-black/80">
              Observación <span className="text-gray-400 text-xs">(opcional)</span>
            </label>
            <textarea
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              rows={3}
              placeholder="Comentarios adicionales sobre el desempeño del docente..."
              className="w-full p-3 border rounded-lg border-theme-rich-black/30 focus:ring-2 focus:ring-theme-keppel focus:border-transparent transition-all duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-theme-rich-black/80">
              Sugerencia <span className="text-gray-400 text-xs">(opcional)</span>
            </label>
            <textarea
              value={suggestion}
              onChange={(e) => setSuggestion(e.target.value)}
              rows={3}
              placeholder="Recomendaciones para mejorar el desempeño del docente..."
              className="w-full p-3 border rounded-lg border-theme-rich-black/30 focus:ring-2 focus:ring-theme-keppel focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end gap-3 pt-4 border-t border-theme-rich-black/20">
          <button
            onClick={handleCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !isFormValid()}
            className={`px-6 py-2 bg-theme-keppel text-white rounded-lg hover:bg-theme-keppel-dark transition-colors flex items-center gap-2 ${
              (isSubmitting || !isFormValid()) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Enviando...
              </>
            ) : (
              'Enviar Evaluación'
            )}
          </button>
        </div>
      </div>
    );
  }

  // Vista de selección de docentes (tarjetas destacadas)
  return (
    <>
      <div className="bg-white p-6 rounded-3xl shadow-lg border-2 border-b-8 border-theme-rich-black">
        <h2 className="text-2xl font-bold mb-6 text-theme-rich-black">Evaluar Docente</h2>
        
        <div className="space-y-6">
          <p className="text-gray-600">
            Evalúa el desempeño de tus docentes asignados. Tu opinión es importante para mejorar la calidad de la tutoría y consejería.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {instructors.map(instructor => {
              const hasEvaluation = instructor.assessmentId !== null;
              const activityColor = getActivityColor(instructor.typeActivity);
              const activityIcon = getActivityIcon(instructor.typeActivity);
              const activityLabel = getActivityLabel(instructor.typeActivity);
              
              return (
                <div
                  key={instructor.id}
                  className={`rounded-2xl border-2 p-6 transition-all duration-300 ${
                    hasEvaluation 
                      ? 'border-green-300 bg-gradient-to-br from-green-50 to-white' 
                      : 'border-theme-rich-black/20 hover:shadow-lg'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl ${activityColor.replace('border', 'bg').replace('hover:', '')}`}>
                        <span>{activityIcon}</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-theme-rich-black">{instructor.fullName}</h3>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                          instructor.typeActivity === 'T' 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {activityLabel}
                        </span>
                      </div>
                    </div>
                    {hasEvaluation && (
                      <div className="bg-green-100 rounded-full p-2">
                        <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4">
                    {hasEvaluation 
                      ? 'Ya has realizado la evaluación de este docente. Puedes ver los resultados.'
                      : `Evalúa el desempeño de tu ${activityLabel.toLowerCase()}. Tu opinión es completamente confidencial.`}
                  </p>
                  
                  <button
                    onClick={() => hasEvaluation ? handleViewEvaluation(instructor) : handleStartEvaluation(instructor)}
                    className={`w-full py-3 rounded-xl font-medium transition-all duration-200 ${
                      hasEvaluation
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : 'bg-theme-keppel text-white hover:bg-theme-keppel-dark shadow-md hover:shadow-lg'
                    }`}
                  >
                    {hasEvaluation ? 'Ver evaluación realizada' : 'Comenzar evaluación'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <ViewAssessmentModal
        isOpen={viewModalOpen}
        onClose={() => {
            setViewModalOpen(false);
            setViewAssessmentData(null);
            setViewAssessmentId(null);
        }}
        assessmentId={viewAssessmentId}
        personName={viewAssessmentData?.instructorFullName || ''}
        typeActivity={viewAssessmentData?.typeActivity === 'T' ? 'T' : 'C'}
        viewType="instructor"
        assessmentData={viewAssessmentData}
        />
    </>
  );
};

export default EvaluateInstructorSection;