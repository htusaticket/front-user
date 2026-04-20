import { toast } from "sonner";
import { create } from "zustand";

import api, { getErrorMessage } from "@/lib/api";
import type {
  ApplicationsByStatus,
  ApplicationStats,
  ApplicationStatus,
  JobFilters,
  JobListResponse,
  JobOffer,
  JobStats,
  MyApplicationsResponse,
} from "@/types/jobs";

// ===============================
// JOBS STORE (JFAL-26)
// ===============================

interface JobsState {
  // State
  jobs: JobOffer[];
  stats: JobStats;
  selectedJob: JobOffer | null;
  filters: JobFilters;
  isLoading: boolean;
  error: string | null;
}

interface JobsActions {
  fetchJobs: () => Promise<void>;
  setSelectedJob: (job: JobOffer | null) => void;
  setFilters: (filters: Partial<JobFilters>) => void;
  applyToJob: (jobId: number) => Promise<boolean>;
  resetFilters: () => void;
}

type JobsStore = JobsState & JobsActions;

const initialJobsState: JobsState = {
  jobs: [],
  stats: {
    availableOffers: 0,
    activeApplications: 0,
    newThisWeek: 0,
  },
  selectedJob: null,
  filters: {
    search: "",
    type: null,
    sortBy: "best_match",
  },
  isLoading: false,
  error: null,
};

export const useJobsStore = create<JobsStore>((set, get) => ({
  ...initialJobsState,

  fetchJobs: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const { filters } = get();
      const params: Record<string, string> = {};
      
      if (filters.search) {
        params.search = filters.search;
      }
      if (filters.type) {
        params.type = filters.type;
      }
      if (filters.sortBy) {
        params.sortBy = filters.sortBy;
      }

      const response = await api.get<{ success: boolean; data: JobListResponse }>("/api/jobs", { params });
      const { data } = response.data;

      set({
        jobs: data.jobs,
        stats: data.stats,
        selectedJob: data.jobs.length > 0 ? data.jobs[0] : null,
        isLoading: false,
      });
    } catch (error) {
      const message = getErrorMessage(error);
      set({ error: message, isLoading: false });
      toast.error(message);
    }
  },

  setSelectedJob: (job) => {
    set({ selectedJob: job });
  },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
  },

  applyToJob: async (jobId: number) => {
    try {
      await api.post(`/api/jobs/${jobId}/apply`);
      
      // Update local state to reflect the application
      set((state) => ({
        jobs: state.jobs.map((job) =>
          job.id === jobId ? { ...job, hasApplied: true } : job,
        ),
        selectedJob: state.selectedJob?.id === jobId 
          ? { ...state.selectedJob, hasApplied: true } 
          : state.selectedJob,
        stats: {
          ...state.stats,
          activeApplications: state.stats.activeApplications + 1,
        },
      }));

      toast.success("Application submitted successfully");
      return true;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(message);
      return false;
    }
  },

  resetFilters: () => {
    set({ filters: { search: "", type: null, sortBy: "best_match" } });
  },
}));

// ===============================
// APPLICATIONS STORE (JFAL-27)
// ===============================

interface ApplicationsState {
  applications: ApplicationsByStatus;
  stats: ApplicationStats;
  isLoading: boolean;
  error: string | null;
}

interface ApplicationsActions {
  fetchApplications: () => Promise<void>;
  updateApplicationStatus: (
    applicationId: string,
    newStatus: ApplicationStatus,
    previousStatus: ApplicationStatus,
    targetIndex?: number,
  ) => Promise<boolean>;
  reorderApplications: (
    status: ApplicationStatus,
    orderedIds: string[],
  ) => Promise<boolean>;
  updateApplicationNotes: (applicationId: string, notes: string) => Promise<boolean>;
}

type ApplicationsStore = ApplicationsState & ApplicationsActions;

const initialApplicationsState: ApplicationsState = {
  applications: {
    applied: [],
    pending: [],
    interview: [],
    rejected: [],
  },
  stats: {
    applied: 0,
    pending: 0,
    interview: 0,
    rejected: 0,
  },
  isLoading: false,
  error: null,
};

// Helper function to get the lowercase status key
const getStatusKey = (status: ApplicationStatus): keyof ApplicationsByStatus => {
  return status.toLowerCase() as keyof ApplicationsByStatus;
};

// Friendly labels for toasts (column titles are defined in the page component)
const STATUS_LABEL: Record<ApplicationStatus, string> = {
  APPLIED: "Initial Application",
  PENDING: "Applied",
  INTERVIEW: "Interview",
  REJECTED: "Lost",
};

export const useApplicationsStore = create<ApplicationsStore>((set, get) => ({
  ...initialApplicationsState,

  fetchApplications: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await api.get<{ success: boolean; data: MyApplicationsResponse }>("/api/applications/my");
      const { data } = response.data;

      set({
        applications: data.applications,
        stats: data.stats,
        isLoading: false,
      });
    } catch (error) {
      const message = getErrorMessage(error);
      set({ error: message, isLoading: false });
      toast.error(message);
    }
  },

  updateApplicationStatus: async (
    applicationId: string,
    newStatus: ApplicationStatus,
    previousStatus: ApplicationStatus,
    targetIndex?: number,
  ) => {
    const previousApplications = get().applications;
    const previousStats = get().stats;

    const newStatusKey = getStatusKey(newStatus);
    const previousStatusKey = getStatusKey(previousStatus);

    // Find the application
    const application = previousApplications[previousStatusKey].find(
      (app) => app.id === applicationId,
    );

    if (!application) return false;

    let orderedTargetIds: string[] | null = null;

    // Optimistic update
    set((state) => {
      const newApplications = { ...state.applications };

      // Remove from previous column
      newApplications[previousStatusKey] = newApplications[previousStatusKey].filter(
        (app) => app.id !== applicationId,
      );

      // Insert into new column at targetIndex (or append)
      const destination = [...newApplications[newStatusKey]];
      const insertAt =
        typeof targetIndex === "number" && targetIndex >= 0 && targetIndex <= destination.length
          ? targetIndex
          : destination.length;
      destination.splice(insertAt, 0, application);
      newApplications[newStatusKey] = destination;
      orderedTargetIds = destination.map((app) => app.id);

      // Update stats
      const newStats = { ...state.stats };
      newStats[previousStatusKey] = Math.max(0, newStats[previousStatusKey] - 1);
      newStats[newStatusKey] = newStats[newStatusKey] + 1;

      return {
        applications: newApplications,
        stats: newStats,
      };
    });

    try {
      await api.patch(`/api/applications/${applicationId}/status`, {
        status: newStatus,
      });

      // Persist ordering in the destination column if the card was inserted mid-list
      if (
        orderedTargetIds &&
        typeof targetIndex === "number" &&
        targetIndex < (orderedTargetIds as string[]).length - 1
      ) {
        await api.patch("/api/applications/reorder", {
          status: newStatus,
          orderedIds: orderedTargetIds,
        });
      }

      toast.success(`Moved to ${STATUS_LABEL[newStatus]}`);
      return true;
    } catch (error) {
      // Revert on error
      set({
        applications: previousApplications,
        stats: previousStats,
      });

      const message = getErrorMessage(error);
      toast.error(message);
      return false;
    }
  },

  reorderApplications: async (status: ApplicationStatus, orderedIds: string[]) => {
    const previousApplications = get().applications;
    const statusKey = getStatusKey(status);

    // Optimistic reorder
    set((state) => {
      const column = state.applications[statusKey];
      const byId = new Map(column.map((app) => [app.id, app]));
      const reordered = orderedIds
        .map((id) => byId.get(id))
        .filter((app): app is NonNullable<typeof app> => Boolean(app));

      return {
        applications: {
          ...state.applications,
          [statusKey]: reordered,
        },
      };
    });

    try {
      await api.patch("/api/applications/reorder", { status, orderedIds });
      return true;
    } catch (error) {
      set({ applications: previousApplications });
      const message = getErrorMessage(error);
      toast.error(message);
      return false;
    }
  },

  updateApplicationNotes: async (applicationId: string, notes: string) => {
    try {
      await api.patch(`/api/applications/${applicationId}/notes`, { notes });
      
      // Update local state
      set((state) => {
        const newApplications = { ...state.applications };
        
        // Find and update the application in all columns
        const columns: (keyof ApplicationsByStatus)[] = ["applied", "pending", "interview", "rejected"];
        
        for (const column of columns) {
          const index = newApplications[column].findIndex((app) => app.id === applicationId);
          if (index !== -1) {
            newApplications[column] = [
              ...newApplications[column].slice(0, index),
              { ...newApplications[column][index], notes },
              ...newApplications[column].slice(index + 1),
            ];
            break;
          }
        }

        return { applications: newApplications };
      });

      toast.success("Notes updated");
      return true;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(message);
      return false;
    }
  },
}));
