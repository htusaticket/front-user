import { create } from "zustand";

import api, { getErrorMessage } from "@/lib/api";
import type {
  AcademyOverview,
  LessonDetail,
  ToggleLessonResponse,
} from "@/types/academy";

interface AcademyState {
  // Overview data
  overview: AcademyOverview | null;
  isLoadingOverview: boolean;
  
  // Lesson data
  currentLesson: LessonDetail | null;
  isLoadingLesson: boolean;
  
  // Toggle state
  isTogglingComplete: boolean;
  
  // Error state
  error: string | null;
}

interface AcademyActions {
  fetchOverview: () => Promise<void>;
  fetchLesson: (lessonId: number) => Promise<void>;
  toggleLessonComplete: (lessonId: number) => Promise<ToggleLessonResponse>;
  clearError: () => void;
  reset: () => void;
}

type AcademyStore = AcademyState & AcademyActions;

const initialState: AcademyState = {
  overview: null,
  isLoadingOverview: false,
  currentLesson: null,
  isLoadingLesson: false,
  isTogglingComplete: false,
  error: null,
};

export const useAcademyStore = create<AcademyStore>((set, get) => ({
  ...initialState,

  fetchOverview: async () => {
    set({ isLoadingOverview: true, error: null });
    
    try {
      const response = await api.get("/api/academy/overview");
      set({ overview: response.data.data || response.data, isLoadingOverview: false });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({ error: errorMessage, isLoadingOverview: false });
      throw error;
    }
  },

  fetchLesson: async (lessonId: number) => {
    set({ isLoadingLesson: true, error: null });
    
    try {
      const response = await api.get(`/api/academy/lessons/${lessonId}`);
      set({ currentLesson: response.data.data || response.data, isLoadingLesson: false });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({ error: errorMessage, isLoadingLesson: false });
      throw error;
    }
  },

  toggleLessonComplete: async (lessonId: number) => {
    set({ isTogglingComplete: true, error: null });
    
    try {
      const response = await api.post(`/api/academy/lessons/${lessonId}/toggle-complete`);
      const result: ToggleLessonResponse = response.data.data || response.data;
      
      // Update current lesson state
      const currentLesson = get().currentLesson;
      if (currentLesson && currentLesson.id === lessonId) {
        set({
          currentLesson: { ...currentLesson, completed: result.completed },
        });
      }
      
      // Update overview if loaded (update module progress)
      const overview = get().overview;
      if (overview) {
        // Find the module that contains this lesson
        const updatedModules = overview.modules.map((module) => {
          const lessonInModule = module.lessons.find((l) => l.id === lessonId);
          if (lessonInModule) {
            // Find and update the lesson
            const updatedLessons = module.lessons.map((lesson) =>
              lesson.id === lessonId
                ? { ...lesson, completed: result.completed }
                : lesson,
            );
            
            // Recalculate completed lessons count
            const completedLessons = updatedLessons.filter((l) => l.completed).length;
            
            return {
              ...module,
              lessons: updatedLessons,
              completedLessons,
              progress: result.moduleProgress,
            };
          }
          return module;
        });
        
        // Recalculate overall stats
        const totalCompleted = updatedModules.reduce((sum, m) => sum + m.completedLessons, 0);
        const totalLessons = updatedModules.reduce((sum, m) => sum + m.totalLessons, 0);
        const overallProgress = totalLessons > 0 
          ? Math.round((totalCompleted / totalLessons) * 100) 
          : 0;
        
        set({
          overview: {
            ...overview,
            modules: updatedModules,
            stats: {
              ...overview.stats,
              lessonsCompleted: totalCompleted,
              overallProgress,
            },
          },
        });
      }
      
      set({ isTogglingComplete: false });
      return result;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({ error: errorMessage, isTogglingComplete: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),

  reset: () => set(initialState),
}));
