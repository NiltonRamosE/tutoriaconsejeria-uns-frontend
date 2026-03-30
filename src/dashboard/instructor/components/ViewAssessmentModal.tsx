import React, { useState, useEffect } from 'react';
import { fetchAssessmentById } from '@/infrastructure/api/assessment';
import { ratingOptions } from '@/dashboard/instructor/data/assessedQuestions';
import type { AssessmentViewData, ViewAssessmentModalProps } from '@/domain/types/Assessment';

const ViewAssessmentModal: React.FC<ViewAssessmentModalProps> = ({ 
  isOpen, 
  onClose, 
  assessmentId,
  personName,
  typeActivity,
  assessmentData: initialAssessmentData,
  viewType
}) => {
  const [assessment, setAssessment] = useState<AssessmentViewData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && assessmentId && !initialAssessmentData) {
      loadAssessment();
    } else if (isOpen && initialAssessmentData) {
      setAssessment(initialAssessmentData);
      setIsLoading(false);
    }
  }, [isOpen, assessmentId, initialAssessmentData]);

  const loadAssessment = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchAssessmentById(assessmentId!);
      setAssessment(data);
    } catch (err) {
      console.error('Error loading assessment:', err);
      setError('Error al cargar la evaluación');
    } finally {
      setIsLoading(false);
    }
  };

  const getRatingLabel = (score: number) => {
    const option = ratingOptions.find(opt => opt.value === score);
    return option?.label || 'No especificado';
  };

  const getRatingClass = (score: number) => {
    if (score >= 3) return 'bg-green-100 text-green-800 border-green-200';
    if (score >= 2) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const getTitle = () => {
    return viewType === 'student' ? 'Evaluación del Docente' : 'Evaluación del Estudiante';
  };

  const getSemesterInfo = () => {
    if (!assessment) return null;
    if ('studentAssessment' in assessment) {
      return assessment.semester;
    }
    if ('instructorAssessment' in assessment) {
      return assessment.semester;
    }
    return null;
  };

  const getQuestions = () => {
    if (!assessment) return [];
    if ('studentAssessment' in assessment) {
      return assessment.studentAssessment.questions;
    }
    if ('instructorAssessment' in assessment) {
      return assessment.instructorAssessment.questions;
    }
    return [];
  };

  const getObservationAndSuggestion = () => {
    if (!assessment) return { observation: '', suggestion: '' };
    if ('studentAssessment' in assessment) {
      return {
        observation: assessment.studentAssessment.observation,
        suggestion: assessment.studentAssessment.suggestion
      };
    }
    if ('instructorAssessment' in assessment) {
      return {
        observation: assessment.instructorAssessment.observation,
        suggestion: assessment.instructorAssessment.suggestion
      };
    }
    return { observation: '', suggestion: '' };
  };

  const getEvaluatedName = () => {
    if (!assessment) return personName;
    if ('studentFullName' in assessment) {
      return assessment.studentFullName;
    }
    if ('instructorFullName' in assessment) {
      return assessment.instructorFullName;
    }
    return personName;
  };

  if (!isOpen) return null;

  const questions = getQuestions();
  const { observation, suggestion } = getObservationAndSuggestion();
  const semester = getSemesterInfo();
  const evaluatedName = getEvaluatedName();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl z-20">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-theme-rich-black flex items-center gap-2">
                  <span className="text-2xl">📋</span>
                  {getTitle()}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {typeActivity === 'T' ? 'Tutoría' : 'Consejería'} - {evaluatedName}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto px-6 py-6">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-theme-keppel"></div>
                <p className="mt-2 text-gray-500">Cargando evaluación...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-red-500 mb-2">
                  <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-red-500">{error}</p>
                <button
                  onClick={loadAssessment}
                  className="mt-4 bg-theme-keppel text-white px-4 py-2 rounded-lg hover:bg-theme-keppel-dark transition-colors"
                >
                  Reintentar
                </button>
              </div>
            ) : assessment ? (
              <>
                {/* Información del período */}
                {semester && (
                  <div className="bg-theme-seasalt rounded-xl p-4 mb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Semestre</p>
                        <p className="font-semibold text-theme-rich-black">{semester}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Estado:</span>
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          Evaluación Completada
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Preguntas y respuestas */}
                <div className="space-y-4 mb-6">
                  <h3 className="font-semibold text-theme-rich-black">Preguntas de Evaluación</h3>
                  {questions.map((q, index) => (
                    <div key={q.order} className="border border-theme-rich-black/20 rounded-xl p-4 bg-white">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <p className="font-medium text-theme-rich-black">
                            {index + 1}. {q.question}
                          </p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getRatingClass(q.score || 0)}`}>
                          {q.score} - {getRatingLabel(q.score || 0)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Observación y sugerencia */}
                {(observation || suggestion) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {observation && (
                      <div className="bg-theme-seasalt rounded-xl p-4">
                        <h4 className="font-medium text-theme-rich-black mb-2 flex items-center gap-2">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          Observación
                        </h4>
                        <p className="text-gray-700 whitespace-pre-wrap">{observation}</p>
                      </div>
                    )}
                    {suggestion && (
                      <div className="bg-theme-seasalt rounded-xl p-4">
                        <h4 className="font-medium text-theme-rich-black mb-2 flex items-center gap-2">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                          Sugerencia
                        </h4>
                        <p className="text-gray-700 whitespace-pre-wrap">{suggestion}</p>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : null}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 rounded-b-2xl flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewAssessmentModal;