import type { InstructorAssessment } from "@/domain/entities/InstructorAssessment";

export type AssessmentInstructorResponse = {
  instructorFullName: string;
  typeActivity: string;
  semester: string;
  instructorAssessment: InstructorAssessment;
};