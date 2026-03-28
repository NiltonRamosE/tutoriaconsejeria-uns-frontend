import type {AssessedQuestion} from '@/infrastructure/dto/assessment/AssessedQuestion';

export const assessedQuestions: AssessedQuestion[] = [
  {
    order: 1,
    question: 'El estudiante tutorado/aconsejado asistió con puntualidad a las sesiones individuales programadas.',
  },
  {
    order: 2,
    question: 'El estudiante tutorado/aconsejado es una persona que solicita tener comunicación con usted.',
  },
  {
    order: 3,
    question: 'El estudiante tutorado/aconsejado demostró interés por las actividades programadas.',
  },
  {
    order: 4,
    question: 'El estudiante tutorado/aconsejado muestra respeto hacia usted.',
  },
  {
    order: 5,
    question: 'El estudiante tutorado/aconsejado muestra respeto hacia sus compañeros de clase.',
  },
  {
    order: 6,
    question: 'El estudiante tutorado/aconsejado le brindó apoyo necesario para identificar sus dificultades académicas, personales, vocacional , etc.',
  },
  {
    order: 7,
    question: 'El estudiante tutorado/aconsejado colaboró en la búsqueda de soluciones para superar sus deficiencias.',
  },
  {
    order: 8,
    question: 'El estudiante tutorado/aconsejado le proporcionó la información necesaria para derivarlo a unidades de servicio al bienestar del estudiante de la UNS.',
  },
  {
    order: 9,
    question: 'El estudiante tutorado/aconsejado estuvo atento de las actividades programadas.',
  },
  {
    order: 10,
    question: 'El estudiante tutorado/aconsejado demostró interés por las actividades relacionadas a sus asignaturas.',
  },
  {
    order: 11,
    question: 'El estudiante tutorado/aconsejado demuestra interés por actividades propias de su carrera profesional.',
  },
  {
    order: 12,
    question: 'El estudiante tutorado/aconsejado asistió puntualmente a las sesiones grupales programadas.',
  },
  {
    order: 13,
    question: 'El estudiante tutorado/aconsejado demuestra interés por la solución a problemas de sus compañeros.',
  },
];

export const ratingOptions = [
  { value: 4, label: 'Siempre' },
  { value: 3, label: 'Casi siempre' },
  { value: 2, label: 'Pocas veces' },
  { value: 1, label: 'Raras veces' },
  { value: 0, label: 'Nunca' }
];