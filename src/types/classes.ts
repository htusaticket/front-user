export type ClassType = "regular" | "workshop" | "webinar" | "qa" | "masterclass";

export interface Capacity {
  current: number;
  max: number | null; // null = unlimited
}

export interface ClassSession {
  id: number;
  title: string;
  type: ClassType;
  day: string; // "Today", "Tomorrow", "Monday", etc. (zona fija del backend; usar startTime/endTime para mostrar)
  date: string; // "Jan 29"
  time: string; // "18:00 - 19:00"
  startTime: string; // ISO 8601 (UTC) — fuente de verdad para mostrar en la zona local
  endTime: string; // ISO 8601 (UTC)
  capacity: Capacity;
  isEnrolled: boolean;
  isFull: boolean;
  meetLink: string | null;
  materialsLink: string | null;
  description: string | null;
}

export interface EnrollResponse {
  success: boolean;
  message: string;
}

export interface CancelResponse {
  success: boolean;
  message: string;
  strikeApplied?: boolean;
}
