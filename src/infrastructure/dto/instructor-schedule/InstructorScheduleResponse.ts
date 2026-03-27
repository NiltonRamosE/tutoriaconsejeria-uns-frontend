import type { AcademicScheduleResponse } from "@/infrastructure/dto/academic-schedule/AcademicScheduleResponse";
export interface InstructorScheduleResponse {
    instructorName: string;
    academicSchedule: Array<AcademicScheduleResponse>;
}