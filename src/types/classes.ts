export type ClassType = "regular" | "workshop" | "webinar" | "qa" | "masterclass";

export interface Capacity {
  current: number;
  max: number | null; // null = unlimited
}

export interface ClassSession {
  id: number;
  title: string;
  type: ClassType;
  day: string; // "Today", "Tomorrow", "Monday", etc.
  date: string; // "Jan 29"
  time: string; // "18:00 - 19:00"
  capacity: Capacity;
  isEnrolled: boolean;
  isFull: boolean;
  meetLink: string | null;
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
