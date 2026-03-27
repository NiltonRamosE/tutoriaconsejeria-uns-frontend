import type { AppointmentReceivedResponse } from "@/infrastructure/dto/appointment/AppointmentReceivedResponse";
import type { StudentAttendanceResponse } from "@/infrastructure/dto/appointment-schedule/StudentAttendanceResponse";

export interface AppointmentScheduleReceivedResponse {
    appointmentResponse: AppointmentReceivedResponse;
    receiverStudents: Array<StudentAttendanceResponse>;
    altScheduleCounts: Record<string, number>;
    senderFullName: string;
    receiverFullName: string;
}