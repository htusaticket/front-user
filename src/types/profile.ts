// Types for Profile (Sprint 4 - JFAL-28 & JFAL-29)

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  city: string | null;
  country: string | null;
  reference: string | null;
  avatar: string | null;
  role: string;
  status: string;
  createdAt: string;
}

export interface SubscriptionInfo {
  plan: string | null;
  memberSince: string;
  hasActiveSubscription: boolean;
  startDate: string | null;
  endDate: string | null;
}

export interface ProfileStats {
  completedClasses: number;
  jobApplications: number;
  completedChallenges: number;
}

export interface StrikeInfo {
  strikesCount: number;
  maxStrikes: number;
  resetDate: string | null;
}

export interface PlanFeatures {
  academy: boolean;
  challenges: boolean;
  liveClasses: boolean;
  jobBoard: boolean;
}

export interface SystemSettings {
  strikesEnabled: boolean;
  jobBoardEnabled: boolean;
  academyEnabled: boolean;
}

export interface ProfileResponse {
  user: UserProfile;
  subscription: SubscriptionInfo;
  stats: ProfileStats;
  strikes: StrikeInfo;
  isPunished: boolean;
  punishedUntil: string | null;
  planFeatures: PlanFeatures;
  systemSettings: SystemSettings;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  city?: string;
  country?: string;
}

export interface UpdateProfileResponse {
  success: boolean;
  message: string;
  user: UserProfile;
}

// Form validation
export interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  country: string;
}

export interface ProfileFormErrors {
  firstName?: string;
  lastName?: string;
  phone?: string;
  city?: string;
  country?: string;
}
