import type { AssessedQuestion } from "@/infrastructure/dto/assessment/AssessedQuestion";

export interface AssessmentRequest {
  studentId: number;
  instructorId: number;
  typeActivity: 'T' | 'C';
  questions: AssessedQuestion[];
  observation: string;
  suggestion: string;
}