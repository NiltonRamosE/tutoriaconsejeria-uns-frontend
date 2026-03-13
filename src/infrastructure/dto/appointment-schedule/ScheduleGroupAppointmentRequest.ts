export interface ScheduleGroupAppointmentRequest {
    appointmentModalityCode: string;
    appointmentMethod: string;
    specificAppointmentMethod: string;
    appointmentReason: string;
    specificAppointmentReason: string;
    typeActivityCode: string;
    studentId: number;
    studentsId: number[];
    instructorId: number;
    altScheduleA: string;
    altScheduleB: string;
    altScheduleC: string;
}