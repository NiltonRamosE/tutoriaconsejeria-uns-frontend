import type {AssessedQuestion} from '@/infrastructure/dto/assessment/AssessedQuestion';

export const assessedQuestions: AssessedQuestion[] = [
  {
    order: 1,
    question: 'El Docente Tutor/Consejero asistió a las sesiones programadas en su horario de tutoría /consejería.',
  },
  {
    order: 2,
    question: 'El Docente Tutor/Consejero te orientó e incentivó a mejorar y desarrollarse como persona.',
  },
  {
    order: 3,
    question: 'El Docente Tutor/Consejero te informó y orientó acerca de técnicas para mejorar su aprendizaje.',
  },
  {
    order: 4,
    question: 'El Docente Tutor/Consejero te brindó confianza para poder expresar sus problemas, deficiencias, virtudes, entre otros.',
  },
  {
    order: 5,
    question: 'El Docente Tutor/Consejero te derivó a las diferentes dependencias de la UNS para solucionar sus problemas.',
  },
  {
    order: 6,
    question: 'El Docente Tutor/Consejero estuvo dispuesto a atenderte cada vez que lo solicitas.',
  },
  {
    order: 7,
    question: 'El Docente Tutor/Consejero cumplió con las horas programadas de tutoría/consejería.',
  },
  {
    order: 8,
    question: 'Estás satisfecho con la tutoría y consejería recibida por tu Docente Tutor/Consejero.',
  },
];

export const ratingOptions = [
  { value: 4, label: 'Siempre' },
  { value: 3, label: 'Casi siempre' },
  { value: 2, label: 'Pocas veces' },
  { value: 1, label: 'Raras veces' },
  { value: 0, label: 'Nunca' }
];