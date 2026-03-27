export type UserRole = "ADMIN" | "USER" | "GUEST" | "MODERATOR";
export type UserStatus = "PENDING" | "ACTIVE" | "SUSPENDED";

// Wrapper de respuesta del backend - todas las respuestas vienen envueltas así
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export type UserPlan = "PRO" | "ELITE" | "LEVEL_UP" | "HIRING_HUB" | "SKILL_BUILDER" | "SKILL_BUILDER_LIVE";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  city?: string;
  country?: string;
  reference?: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  isPunished: boolean;
  punishedUntil: string | null;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  reference?: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface ValidateResetTokenResponse {
  valid: boolean;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  message: string;
}

// Error codes from backend
export type AuthErrorCode =
  | "INVALID_CREDENTIALS"
  | "ACCOUNT_PENDING"
  | "ACCOUNT_INACTIVE"
  | "ACCOUNT_SUSPENDED"
  | "EMAIL_ALREADY_EXISTS"
  | "INVALID_TOKEN"
  | "TOKEN_EXPIRED"
  | "MISSING_TOKEN";
