export interface StudentWithRelation {
  id: number;
  fullName: string;
  hasTutoring: boolean;
  hasCounseling: boolean;
  tutoringAssessmentId?: number | null;
  counselingAssessmentId?: number | null;
}