import type { AssessmentStudentResponse } from '@/infrastructure/dto/assessment/AssessmentStudentResponse';
import type { AssessmentInstructorResponse } from '@/infrastructure/dto/assessment/AssessmentInstructorResponse';

export interface StudentWithRelation {
  id: number;
  fullName: string;
  hasTutoring: boolean;
  hasCounseling: boolean;
  tutoringAssessmentId?: number | null;
  counselingAssessmentId?: number | null;
}

export interface InstructorWithEvaluation {
  id: number;
  fullName: string;
  typeActivity: 'T' | 'C';
  assessmentId: number | null;
}

export type AssessmentViewData = AssessmentStudentResponse | AssessmentInstructorResponse;

export interface ViewAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  assessmentId: number | null;
  personName: string;
  typeActivity: 'T' | 'C';
  assessmentData?: AssessmentViewData | null;
  viewType: 'student' | 'instructor';
}