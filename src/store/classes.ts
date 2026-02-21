import { create } from "zustand";

import api, { getErrorMessage } from "@/lib/api";
import type { ClassSession, EnrollResponse, CancelResponse } from "@/types/classes";

interface ClassesState {
  availableClasses: ClassSession[];
  mySchedule: ClassSession[];
  isLoading: boolean;
  error: string | null;
}

interface ClassesActions {
  fetchAvailableClasses: () => Promise<void>;
  fetchMySchedule: () => Promise<void>;
  enrollInClass: (classId: number) => Promise<EnrollResponse>;
  cancelEnrollment: (classId: number) => Promise<CancelResponse>;
  clearError: () => void;
  reset: () => void;
}

type ClassesStore = ClassesState & ClassesActions;

const initialState: ClassesState = {
  availableClasses: [],
  mySchedule: [],
  isLoading: false,
  error: null,
};

export const useClassesStore = create<ClassesStore>((set, get) => ({
  ...initialState,

  fetchAvailableClasses: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await api.get("/api/classes/available");
      set({ availableClasses: response.data.data || [], isLoading: false });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  fetchMySchedule: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await api.get("/api/classes/my-schedule");
      set({ mySchedule: response.data.data || [], isLoading: false });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  enrollInClass: async (classId: number) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await api.post(`/api/classes/${classId}/enroll`);
      
      // Recargar datos después de inscribirse
      await Promise.all([
        get().fetchAvailableClasses(),
        get().fetchMySchedule(),
      ]);
      
      set({ isLoading: false });
      return response.data.data;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  cancelEnrollment: async (classId: number) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await api.post<CancelResponse>(`/api/classes/${classId}/cancel`);
      
      // Recargar datos después de cancelar
      await Promise.all([
        get().fetchAvailableClasses(),
        get().fetchMySchedule(),
      ]);
      
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),

  reset: () => set(initialState),
}));
