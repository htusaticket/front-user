import { create } from "zustand";

import api, { getErrorMessage } from "@/lib/api";
import type { ApiResponse } from "@/types/auth";
import type { Notification } from "@/types/dashboard";

interface NotificationsListResponse {
  notifications: Notification[];
  total: number;
  unreadCount: number;
}

interface UnreadCountResponse {
  count: number;
}

interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
}

interface NotificationsActions {
  fetchNotifications: () => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  clearError: () => void;
}

type NotificationsStore = NotificationsState & NotificationsActions;

const initialState: NotificationsState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
};

export const useNotificationsStore = create<NotificationsStore>((set) => ({
  ...initialState,

  fetchNotifications: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await api.get<ApiResponse<NotificationsListResponse>>(
        "/api/notifications",
      );

      const { notifications, unreadCount } = response.data.data;

      set({
        notifications,
        unreadCount,
        isLoading: false,
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({ error: errorMessage, isLoading: false });
    }
  },

  fetchUnreadCount: async () => {
    try {
      const response = await api.get<ApiResponse<UnreadCountResponse>>(
        "/api/notifications/unread-count",
      );

      set({ unreadCount: response.data.data.count });
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  },

  markAsRead: async (id: string) => {
    try {
      await api.post(`/api/notifications/${id}/read`);

      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, isRead: true } : n,
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  },

  markAllAsRead: async () => {
    try {
      await api.post("/api/notifications/mark-all-read");

      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
        unreadCount: 0,
      }));
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  },

  clearError: () => set({ error: null }),
}));
