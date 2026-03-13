export interface AppointmentSentResponse {
    id: number;
    date: string;
    startTime: string;
    endTime: string;
    appointmentModality: string;
    appointmentMethod: string;
    specificAppointmentMethod: string;
    appointmentReason: string;
    specificAppointmentReason: string;
    typeActivity: string;
    state: string;
}