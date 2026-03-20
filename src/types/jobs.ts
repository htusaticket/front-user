// Types for Job Board and Applications (Sprint 4 - JFAL-26 & JFAL-27)

export type ApplicationStatus = "APPLIED" | "PENDING" | "INTERVIEW" | "REJECTED";

export type JobSortBy = 
  | "best_match" 
  | "newest_first" 
  | "oldest_first" 
  | "highest_ote" 
  | "lowest_ote" 
  | "highest_revenue" 
  | "lowest_revenue";

export interface JobOffer {
  id: number;
  title: string;
  company: string;
  location: string;
  salaryRange: string;
  oteMin: number;
  oteMax: number;
  revenue: number;
  type: string;
  description: string;
  requirements: string[];
  hasApplied: boolean;
  createdAt: string;
  social?: string | null;
  website?: string | null;
  email?: string | null;
}

export interface JobFilters {
  search?: string;
  type?: string | null;
  sortBy?: JobSortBy;
}

export interface JobStats {
  availableOffers: number;
  activeApplications: number;
  newThisWeek: number;
}

export interface JobListResponse {
  stats: JobStats;
  jobs: JobOffer[];
}

export interface ApplyResponse {
  success: boolean;
  message: string;
}

export interface Application {
  id: string;
  job: {
    id: number;
    title: string;
    company: string;
  };
  appliedDate: string;
  notes: string | null;
}

export interface ApplicationsByStatus {
  applied: Application[];
  pending: Application[];
  interview: Application[];
  rejected: Application[];
}

export interface ApplicationStats {
  applied: number;
  pending: number;
  interview: number;
  rejected: number;
}

export interface MyApplicationsResponse {
  stats: ApplicationStats;
  applications: ApplicationsByStatus;
}

export interface UpdateStatusRequest {
  status: ApplicationStatus;
}

export interface UpdateStatusResponse {
  success: boolean;
  message: string;
  newStatus: ApplicationStatus;
}

export interface UpdateNotesRequest {
  notes: string;
}

export interface UpdateNotesResponse {
  success: boolean;
  message: string;
}
