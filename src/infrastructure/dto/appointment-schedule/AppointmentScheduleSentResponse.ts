import type { AppointmentSentResponse } from "@/infrastructure/dto/appointment/AppointmentSentResponse";
import type { StudentAttendanceResponse } from "@/infrastructure/dto/appointment-schedule/StudentAttendanceResponse";

export interface AppointmentScheduleSentResponse {
    appointmentResponse: AppointmentSentResponse;
    receiverStudents: Array<StudentAttendanceResponse>;
    altScheduleCounts: Record<string, number>;
    senderFullName: string;
    receiverFullName: string;
}