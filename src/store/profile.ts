import { toast } from "sonner";
import { create } from "zustand";

import api, { getErrorMessage } from "@/lib/api";
import type {
  PlanFeatures,
  ProfileFormData,
  ProfileFormErrors,
  ProfileResponse,
  ProfileStats,
  StrikeInfo,
  SubscriptionInfo,
  SystemSettings,
  UpdateProfileRequest,
  UserProfile,
} from "@/types/profile";

// ===============================
// PROFILE STORE (JFAL-28 & JFAL-29)
// ===============================

interface ProfileState {
  user: UserProfile | null;
  subscription: SubscriptionInfo | null;
  stats: ProfileStats;
  strikes: StrikeInfo;
  isPunished: boolean;
  punishedUntil: string | null;
  planFeatures: PlanFeatures;
  systemSettings: SystemSettings;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
}

interface ProfileActions {
  fetchProfile: () => Promise<void>;
  updateProfile: (data: UpdateProfileRequest) => Promise<boolean>;
  validateForm: (formData: ProfileFormData) => ProfileFormErrors;
}

type ProfileStore = ProfileState & ProfileActions;

const initialProfileState: ProfileState = {
  user: null,
  subscription: null,
  stats: {
    completedClasses: 0,
    jobApplications: 0,
    completedChallenges: 0,
  },
  strikes: {
    strikesCount: 0,
    maxStrikes: 3,
    resetDate: null,
  },
  isPunished: false,
  punishedUntil: null,
  planFeatures: {
    academy: true,
    challenges: true,
    liveClasses: true,
    jobBoard: true,
  },
  systemSettings: {
    strikesEnabled: true,
    jobBoardEnabled: true,
    academyEnabled: true,
  },
  isLoading: false,
  isSaving: false,
  error: null,
};

export const useProfileStore = create<ProfileStore>((set) => ({
  ...initialProfileState,

  fetchProfile: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await api.get<{ success: boolean; data: ProfileResponse }>("/api/profile/me");
      const { data } = response.data;

      set({
        user: data.user,
        subscription: data.subscription,
        stats: data.stats,
        strikes: data.strikes,
        isPunished: data.isPunished,
        punishedUntil: data.punishedUntil,
        planFeatures: data.planFeatures,
        systemSettings: data.systemSettings,
        isLoading: false,
      });
    } catch (error) {
      const message = getErrorMessage(error);
      set({ error: message, isLoading: false });
      toast.error(message);
    }
  },

  updateProfile: async (data: UpdateProfileRequest) => {
    set({ isSaving: true, error: null });

    try {
      const response = await api.put<{ success: boolean; data: { user: UserProfile } }>("/api/profile/me", data);
      const { user } = response.data.data;

      set((state) => ({
        user: { ...state.user, ...user },
        isSaving: false,
      }));

      toast.success("Perfil actualizado correctamente");
      return true;
    } catch (error) {
      const message = getErrorMessage(error);
      set({ error: message, isSaving: false });
      toast.error(message);
      return false;
    }
  },

  validateForm: (formData: ProfileFormData): ProfileFormErrors => {
    const errors: ProfileFormErrors = {};

    if (!formData.firstName || formData.firstName.trim().length < 2) {
      errors.firstName = "El nombre debe tener al menos 2 caracteres";
    }

    if (!formData.lastName || formData.lastName.trim().length < 2) {
      errors.lastName = "El apellido debe tener al menos 2 caracteres";
    }

    if (formData.phone && formData.phone.length > 20) {
      errors.phone = "El teléfono no puede tener más de 20 caracteres";
    }

    if (formData.city && formData.city.length > 100) {
      errors.city = "La ciudad no puede tener más de 100 caracteres";
    }

    if (formData.country && formData.country.length > 100) {
      errors.country = "El país no puede tener más de 100 caracteres";
    }

    return errors;
  },
}));

// ===============================
// HELPER FUNCTIONS
// ===============================

/**
 * Format reset date for display
 * @param isoDate - ISO date string or null
 * @returns Formatted date string like "Feb 15, 2026"
 */
export const formatResetDate = (isoDate: string | null): string => {
  if (!isoDate) return "";
  
  return new Date(isoDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

/**
 * Check if user has strikes
 */
export const hasStrikes = (strikes: StrikeInfo): boolean => {
  return strikes.strikesCount > 0;
};

/**
 * Get strike progress percentage
 */
export const getStrikeProgress = (strikes: StrikeInfo): number => {
  return (strikes.strikesCount / strikes.maxStrikes) * 100;
};

/**
 * Get strike status color
 */
export const getStrikeStatusColor = (strikesCount: number): string => {
  if (strikesCount === 0) return "green";
  if (strikesCount === 1) return "amber";
  if (strikesCount === 2) return "orange";
  return "red";
};
