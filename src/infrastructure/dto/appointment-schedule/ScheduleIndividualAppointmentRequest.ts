export interface ScheduleIndividualAppointmentRequest {
    appointmentModalityCode: string;
    appointmentMethod: string | null;
    specificAppointmentMethod: string | null;
    appointmentReason: string | null;
    specificAppointmentReason: string | null;
    typeActivityCode: string;
    studentId: number;
    instructorId: number;
    altScheduleA: string;
    altScheduleB: string;
    altScheduleC: string;
}