export interface ScheduleIndividualAppointmentRequest {
    appointmentModalityCode: string;
    appointmentMethod: string;
    specificAppointmentMethod: string;
    appointmentReason: string;
    specificAppointmentReason: string;
    typeActivityCode: string;
    studentId: number;
    instructorId: number;
    altScheduleA: string;
    altScheduleB: string;
    altScheduleC: string;
}