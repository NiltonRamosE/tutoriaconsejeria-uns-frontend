import type {AssessedQuestion} from '@/infrastructure/dto/assessment/AssessedQuestion';

export interface AssessmentSection{
    questions: AssessedQuestion[];
    observation: string;
    suggestion: string;
}