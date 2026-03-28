import type { StudentAssessment } from "@/domain/entities/StudentAssessment";

export type AssessmentStudentResponse = {
  studentFullName: string;
  typeActivity: string;
  semester: string;
  studentAssessment: StudentAssessment;
};