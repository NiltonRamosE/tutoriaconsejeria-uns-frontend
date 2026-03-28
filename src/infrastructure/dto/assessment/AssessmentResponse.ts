import type { AssessmentStudentResponse } from '@/infrastructure/dto/assessment/AssessmentStudentResponse';
import type { AssessmentInstructorResponse } from '@/infrastructure/dto/assessment/AssessmentInstructorResponse';

export type AssessmentResponse =
  | AssessmentStudentResponse
  | AssessmentInstructorResponse;