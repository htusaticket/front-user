import Cookies from "js-cookie";
import { create } from "zustand";

import api, { getErrorCode, getErrorMessage } from "@/lib/api";
import type {
  ApiResponse,
  AuthErrorCode,
  ForgotPasswordResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  User,
  ValidateResetTokenResponse,
} from "@/types/auth";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  errorCode: AuthErrorCode | null;
}

interface AuthActions {
  login: (credentials: LoginRequest) => Promise<{ success: boolean; code?: AuthErrorCode }>;
  register: (data: RegisterRequest) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  fetchUser: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  validateResetToken: (token: string) => Promise<boolean>;
  resetPassword: (data: ResetPasswordRequest) => Promise<{ success: boolean; message?: string }>;
  clearError: () => void;
  setUser: (user: User | null) => void;
}

type AuthStore = AuthState & AuthActions;

const COOKIE_OPTIONS = {
  expires: 7, // 7 días
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  // Initial state
  user: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,
  errorCode: null,

  // Actions
  login: async (credentials: LoginRequest) => {
    set({ isLoading: true, error: null, errorCode: null });

    try {
      const response = await api.post<{ success: boolean; data: LoginResponse }>("/auth/login", credentials);
      
      // El backend envuelve la respuesta en { success, message, data, timestamp }
      const { data } = response.data;
      
      if (!data || !data.accessToken || !data.user) {
        throw new Error("Respuesta del servidor inválida");
      }

      const { accessToken, user } = data;

      // Guardar token y status en cookies
      Cookies.set("accessToken", accessToken, COOKIE_OPTIONS);
      Cookies.set("userStatus", user.status, COOKIE_OPTIONS);

      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        errorCode: null,
      });

      return { success: true };
    } catch (error) {
      const message = getErrorMessage(error);
      const code = getErrorCode(error) as AuthErrorCode | undefined;

      set({
        isLoading: false,
        error: message,
        errorCode: code || null,
      });

      return { success: false, code };
    }
  },

  register: async (data: RegisterRequest) => {
    set({ isLoading: true, error: null, errorCode: null });

    try {
      const response = await api.post<ApiResponse<RegisterResponse>>("/auth/register", data);

      set({ isLoading: false, error: null, errorCode: null });

      return { success: true, message: response.data.data?.message || response.data.message };
    } catch (error) {
      const message = getErrorMessage(error);
      const code = getErrorCode(error) as AuthErrorCode | undefined;

      set({
        isLoading: false,
        error: message,
        errorCode: code || null,
      });

      return { success: false, message };
    }
  },

  logout: () => {
    Cookies.remove("accessToken");
    Cookies.remove("userStatus");

    set({
      user: null,
      isAuthenticated: false,
      error: null,
      errorCode: null,
    });
  },

  fetchUser: async () => {
    const token = Cookies.get("accessToken");
    if (!token) {
      set({ user: null, isAuthenticated: false });
      return;
    }

    set({ isLoading: true });

    try {
      const response = await api.get<ApiResponse<User>>("/auth/me");
      const user = response.data.data;

      // Actualizar status en cookie
      Cookies.set("userStatus", user.status, COOKIE_OPTIONS);

      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      const code = getErrorCode(error) as AuthErrorCode | undefined;

      // Si el token es inválido o la cuenta está suspendida/pendiente
      if (code === "INVALID_TOKEN" || code === "ACCOUNT_SUSPENDED" || code === "ACCOUNT_PENDING") {
        get().logout();
      }

      set({
        isLoading: false,
        errorCode: code || null,
      });

      throw error;
    }
  },

  forgotPassword: async (email: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await api.post<ApiResponse<ForgotPasswordResponse>>("/auth/forgot-password", { email });

      set({ isLoading: false });

      return { success: true, message: response.data.data?.message || response.data.message };
    } catch (error) {
      const message = getErrorMessage(error);

      set({ isLoading: false, error: message });

      return { success: false, message };
    }
  },

  validateResetToken: async (token: string) => {
    try {
      const response = await api.get<ApiResponse<ValidateResetTokenResponse>>(
        `/auth/validate-reset-token?token=${token}`,
      );
      return response.data.data?.valid ?? false;
    } catch {
      return false;
    }
  },

  resetPassword: async (data: ResetPasswordRequest) => {
    set({ isLoading: true, error: null, errorCode: null });

    try {
      const response = await api.post<ApiResponse<ResetPasswordResponse>>("/auth/reset-password", data);

      set({ isLoading: false });

      return { success: true, message: response.data.data?.message || response.data.message };
    } catch (error) {
      const message = getErrorMessage(error);
      const code = getErrorCode(error) as AuthErrorCode | undefined;

      set({
        isLoading: false,
        error: message,
        errorCode: code || null,
      });

      return { success: false, message };
    }
  },

  clearError: () => {
    set({ error: null, errorCode: null });
  },

  setUser: (user: User | null) => {
    set({ user, isAuthenticated: !!user });
  },
}));
