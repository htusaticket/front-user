// Types for Academy module - Sprint 3

// ==================== LESSON ====================

export interface LessonSummary {
  id: number;
  title: string;
  duration: string;
  completed: boolean;
  sectionId?: number | null;
}

export interface SectionWithLessons {
  id: number | null; // null = virtual bucket of lessons not assigned to any real section
  title: string | null;
  order: number;
  lessons: LessonSummary[];
}

export interface LessonResource {
  id: number;
  title: string;
  fileUrl: string;
  type: "PDF" | "LINK" | "VIDEO" | "DOCUMENT";
  size: string | null;
}

export interface AdjacentLesson {
  id: number;
  title: string;
}

export interface LessonDetail {
  id: number;
  title: string;
  description: string | null;
  duration: string;
  contentUrl: string | null;
  completed: boolean;
  module: {
    id: number;
    title: string;
  };
  resources: LessonResource[];
  previousLesson: AdjacentLesson | null;
  nextLesson: AdjacentLesson | null;
}

// ==================== MODULE ====================

export interface ModuleWithProgress {
  id: number;
  title: string;
  description: string;
  image: string;
  totalLessons: number;
  completedLessons: number;
  progress: number;
  lessons: LessonSummary[];
  sections?: SectionWithLessons[];
}

// ==================== ACADEMY OVERVIEW ====================

export interface AcademyStats {
  overallProgress: number;
  lessonsCompleted: number;
  totalLessons: number;
  totalTime: string;
}

export interface AcademyOverview {
  stats: AcademyStats;
  modules: ModuleWithProgress[];
}

// ==================== TOGGLE LESSON ====================

export interface ToggleLessonResponse {
  completed: boolean;
  moduleProgress: number;
  message: string;
}
