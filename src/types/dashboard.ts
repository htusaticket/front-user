export type NotificationType =
  | "STRIKE_APPLIED"
  | "CLASS_REMINDER"
  | "MATERIAL_AVAILABLE"
  | "CHALLENGE_FEEDBACK"
  | "CLASS_CONFIRMED"
  | "GENERAL";

export interface NextClass {
  id: number;
  title: string;
  type: "regular" | "workshop";
  day: string; // "Today", "Tomorrow", "Monday", etc.
  date: string; // "Jan 29"
  time: string; // "18:00 - 19:00"
  meetLink: string | null;
  materialsLink: string | null;
}

export interface DashboardDailyChallenge {
  id: number;
  title: string;
  completed: boolean;
  streak: number;
}

export interface ContinueLearning {
  lessonId: number;
  lessonTitle: string;
  moduleId: number;
  moduleTitle: string;
  contentUrl: string | null;
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  data?: Record<string, unknown> | null;
  createdAt: string; // ISO DateTime
}

export interface DashboardSummary {
  nextClass: NextClass | null;
  dailyChallenge: DashboardDailyChallenge | null;
  continueLearning: ContinueLearning | null;
  notifications: Notification[];
}
