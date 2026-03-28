export interface AssessedQuestion {
  order: number;
  question: string;
  score?: number | 0;
}

export interface AssessmentRequest {
  studentId: number;
  instructorId: number;
  typeActivity: 'T' | 'C';
  questions: AssessedQuestion[];
  observation: string;
  suggestion: string;
}

export interface AssessmentResponse {
  id: number;
  studentId: number;
  instructorId: number;
  typeActivity: string;
  answers: Record<string, number>;
  observation: string;
  suggestion: string;
  createdAt: string;
}

export interface StudentWithRelation {
  id: number;
  fullName: string;
  hasTutoring: boolean;
  hasCounseling: boolean;
}