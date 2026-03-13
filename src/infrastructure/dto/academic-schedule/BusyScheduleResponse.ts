export interface BusyScheduleSlot {
  startTime: string;
  endTime: string;
  dayOfWeek: string;
}

export type BusyScheduleResponse = BusyScheduleSlot[];