import { create } from "zustand";

import api, { getErrorMessage } from "@/lib/api";
import type { DashboardSummary } from "@/types/dashboard";

interface DashboardState {
  data: DashboardSummary | null;
  isLoading: boolean;
  error: string | null;
}

interface DashboardActions {
  fetchDashboard: () => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

type DashboardStore = DashboardState & DashboardActions;

const initialState: DashboardState = {
  data: null,
  isLoading: false,
  error: null,
};

export const useDashboardStore = create<DashboardStore>((set) => ({
  ...initialState,

  fetchDashboard: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await api.get("/api/dashboard/summary");
      set({ data: response.data.data || null, isLoading: false });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),

  reset: () => set(initialState),
}));
