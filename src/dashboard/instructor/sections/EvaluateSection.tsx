import React, { useState, useEffect } from 'react';
import { getUser } from '@/dashboard/shared/authUtils';
import { fetchStudentsAssignedByInstructor, submitEvaluationForm } from '@/infrastructure/api/instructor';
import { assessedQuestions, ratingOptions } from '@/dashboard/instructor/data/assessedQuestions';
import type { StudentWithRelation } from '@/domain/types/Assessment';
import type {AssessmentRequest} from '@/infrastructure/dto/assessment/AssessmentRequest';
import type {AssessedQuestion} from '@/infrastructure/dto/assessment/AssessedQuestion';
import { fetchIsEnabledAssessment } from '@/infrastructure/api/assessment';
import ViewAssessmentModal from '@/dashboard/instructor/components/ViewAssessmentModal';

const EvaluateSection: React.FC = () => {
  const [students, setStudents] = useState<StudentWithRelation[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<StudentWithRelation | null>(null);
  const [selectedActivityType, setSelectedActivityType] = useState<'T' | 'C' | null>(null);
  const [questions, setQuestions] = useState<Record<number, number>>({});
  const [observation, setObservation] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEvaluationForm, setShowEvaluationForm] = useState(false);

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewAssessmentId, setViewAssessmentId] = useState<number | null>(null);
  const [viewStudentName, setViewStudentName] = useState('');
  const [viewTypeActivity, setViewTypeActivity] = useState<'T' | 'C'>('T');

  const instructorData = getUser();
  const instructorId = instructorData?.id;

  useEffect(() => {
    if (instructorId) {
      loadStudents();
    }
  }, [instructorId]);

  const loadStudents = async () => {
    setIsLoading(true);
    try {
      const data = await fetchStudentsAssignedByInstructor(instructorId!);
      
      const studentMap = new Map<number, StudentWithRelation>();
      
      for (const student of data) {
        const existing = studentMap.get(student.id);
        const typeActivity = student.typeActivityCode as 'T' | 'C';
        
        if (existing) {
          if (typeActivity === 'T') {
            existing.hasTutoring = true;
            // Verificar si ya existe evaluación de tutoría
            const assessmentId = await fetchIsEnabledAssessment(student.id, instructorId!, 'T');
            existing.tutoringAssessmentId = assessmentId;
          } else if (typeActivity === 'C') {
            existing.hasCounseling = true;
            const assessmentId = await fetchIsEnabledAssessment(student.id, instructorId!, 'C');
            existing.counselingAssessmentId = assessmentId;
          }
        } else {
          const newStudent: StudentWithRelation = {
            id: student.id,
            fullName: student.fullName,
            hasTutoring: typeActivity === 'T',
            hasCounseling: typeActivity === 'C',
            tutoringAssessmentId: null,
            counselingAssessmentId: null
          };
          
          if (typeActivity === 'T') {
            const assessmentId = await fetchIsEnabledAssessment(student.id, instructorId!, 'T');
            newStudent.tutoringAssessmentId = assessmentId;
          } else if (typeActivity === 'C') {
            const assessmentId = await fetchIsEnabledAssessment(student.id, instructorId!, 'C');
            newStudent.counselingAssessmentId = assessmentId;
          }
          
          studentMap.set(student.id, newStudent);
        }
      }
      
      setStudents(Array.from(studentMap.values()));
    } catch (error) {
      console.error('Error loading students:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStudentSelect = (student: StudentWithRelation, activityType: 'T' | 'C') => {
    setSelectedStudent(student);
    setSelectedActivityType(activityType);
    setQuestions({});
    setObservation('');
    setSuggestion('');
    setShowEvaluationForm(true);
  };

  const handleBack = () => {
    setSelectedStudent(null);
    setSelectedActivityType(null);
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

    if (!selectedStudent || !selectedActivityType) {
      alert('Por favor, completa toda la información requerida.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Construir el array de preguntas con sus puntajes
      const questionsArray: AssessedQuestion[] = assessedQuestions.map(q => ({
        order: q.order,
        question: q.question,
        score: questions[q.order] ?? 0
      }));

      const formData: AssessmentRequest = {
        studentId: selectedStudent.id,
        instructorId: Number(instructorId),
        typeActivity: selectedActivityType,
        questions: questionsArray,
        observation: observation.trim() || '',
        suggestion: suggestion.trim() || ''
      };

      // Log para verificar la estructura
      console.log('📋 Evaluación a enviar:', JSON.stringify(formData, null, 2));
      
      // Llamar al endpoint
      const response = await submitEvaluationForm(formData);
      console.log('✅ Respuesta del servidor:', response);
      
      alert('Evaluación registrada exitosamente');
      
      // Resetear formulario
      handleBack();
      
    } catch (error) {
      console.error('❌ Error al enviar evaluación:', error);
      alert('No se pudo registrar la evaluación, intente nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewAssessment = (student: StudentWithRelation, type: 'T' | 'C') => {
    const assessmentId = type === 'T' ? student.tutoringAssessmentId : student.counselingAssessmentId;
    console.log('🔍 Abriendo modal de evaluación:', { studentId: student.id, type, assessmentId });
    if (assessmentId) {
      setViewAssessmentId(assessmentId);
      setViewStudentName(student.fullName);
      setViewTypeActivity(type);
      setViewModalOpen(true);
    } else {
      console.warn('⚠️ No se encontró assessmentId para:', { student, type });
    }
  };

  const handleCancel = () => {
    handleBack();
  };

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-3xl shadow-lg border-2 border-b-8 border-theme-rich-black">
        <h2 className="text-2xl font-bold mb-6 text-theme-rich-black">Evaluar Estudiantes</h2>
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-theme-keppel"></div>
          <p className="mt-2 text-gray-500">Cargando estudiantes...</p>
        </div>
      </div>
    );
  }

  // Separar tutorados y aconsejados
  const tutoringStudents = students.filter(s => s.hasTutoring);
  const counselingStudents = students.filter(s => s.hasCounseling);

  if (students.length === 0) {
    return (
      <div className="bg-white p-6 rounded-3xl shadow-lg border-2 border-b-8 border-theme-rich-black">
        <h2 className="text-2xl font-bold mb-6 text-theme-rich-black">Evaluar Estudiantes</h2>
        <div className="text-center py-12 text-gray-500 bg-gradient-to-br from-theme-seasalt to-white rounded-2xl border border-dashed border-theme-rich-black/20">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <p className="text-lg font-medium">No tiene estudiantes disponibles para evaluar</p>
          <p className="text-sm mt-1">Aún no tienes estudiantes asignados como tutor o consejero</p>
        </div>
      </div>
    );
  }

  // Si estamos en el formulario de evaluación
  if (showEvaluationForm && selectedStudent && selectedActivityType) {
    return (
      <div className="bg-white p-6 rounded-3xl shadow-lg border-2 border-b-8 border-theme-rich-black">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-theme-rich-black">Evaluar Estudiante</h2>
            <p className="text-sm text-gray-500 mt-1">
              {selectedActivityType === 'T' ? 'Tutoría' : 'Consejería'} - {selectedStudent.fullName}
            </p>
          </div>
          <button
            onClick={handleBack}
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver a la lista
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
              placeholder="Comentarios adicionales sobre el desempeño del estudiante..."
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
              placeholder="Recomendaciones para mejorar el desempeño del estudiante..."
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

  const renderStudentCard = (student: StudentWithRelation, type: 'T' | 'C', label: string, bgColor: string) => {
    const assessmentId = type === 'T' ? student.tutoringAssessmentId : student.counselingAssessmentId;
    const hasAssessment = assessmentId !== null && assessmentId !== undefined;
    
    return (
      <button
        key={`${type}-${student.id}`}
        onClick={() => hasAssessment ? handleViewAssessment(student, type) : handleStudentSelect(student, type)}
        className={`flex items-center justify-between w-full p-4 border rounded-xl transition-colors text-left ${
          hasAssessment 
            ? 'border-green-300 bg-green-50 hover:bg-green-100' 
            : 'border-theme-rich-black/20 hover:bg-theme-keppel/5'
        }`}
      >
        <div className="flex items-center">
          <div className={`w-10 h-10 ${bgColor} rounded-full flex items-center justify-center mr-3`}>
            <span className="text-lg">👨‍🎓</span>
          </div>
          <div>
            <p className="font-medium text-theme-rich-black">{student.fullName}</p>
            {hasAssessment && (
              <p className="text-xs text-green-600 mt-1">✓ Evaluación completada - Click para ver</p>
            )}
          </div>
        </div>
        {hasAssessment && (
          <svg className="h-5 w-5 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        )}
      </button>
    );
  };

  return (
    <>
      <div className="bg-white p-6 rounded-3xl shadow-lg border-2 border-b-8 border-theme-rich-black">
        <h2 className="text-2xl font-bold mb-6 text-theme-rich-black">Evaluar Estudiantes</h2>
        
        <div className="space-y-8">
          {tutoringStudents.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4 text-theme-rich-black flex items-center gap-2">
                <span className="text-2xl">📚</span>
                Tutorados
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {tutoringStudents.map(student => renderStudentCard(student, 'T', 'Tutoría', 'bg-blue-100'))}
              </div>
            </div>
          )}

          {counselingStudents.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4 text-theme-rich-black flex items-center gap-2">
                <span className="text-2xl">💬</span>
                Aconsejados
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {counselingStudents.map(student => renderStudentCard(student, 'C', 'Consejería', 'bg-green-100'))}
              </div>
            </div>
          )}
        </div>
      </div>

      <ViewAssessmentModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        assessmentId={viewAssessmentId}
        studentName={viewStudentName}
        typeActivity={viewTypeActivity}
      />
    </>
  );
};

export default EvaluateSection;