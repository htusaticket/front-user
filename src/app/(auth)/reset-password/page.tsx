"use client";

import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import { useAuthStore } from "@/store/auth";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const { validateResetToken, resetPassword, isLoading } = useAuthStore();

  const [isValidatingToken, setIsValidatingToken] = useState(true);
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
  });

  // Validar token al cargar la página
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setIsValidToken(false);
        setIsValidatingToken(false);
        return;
      }

      const isValid = await validateResetToken(token);
      setIsValidToken(isValid);
      setIsValidatingToken(false);
    };

    validateToken();
  }, [token, validateResetToken]);

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return "La contraseña debe tener al menos 8 caracteres";
    }
    if (!/[A-Z]/.test(password)) {
      return "Debe contener al menos una mayúscula";
    }
    if (!/[a-z]/.test(password)) {
      return "Debe contener al menos una minúscula";
    }
    if (!/[0-9]/.test(password)) {
      return "Debe contener al menos un número";
    }
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    const passwordError = validatePassword(formData.password);
    const confirmError =
      formData.password !== formData.confirmPassword
        ? "Las contraseñas no coinciden"
        : "";

    if (passwordError || confirmError) {
      setErrors({
        password: passwordError,
        confirmPassword: confirmError,
      });
      return;
    }

    if (!token) return;

    const result = await resetPassword({
      token,
      newPassword: formData.password,
    });

    if (result.success) {
      setIsSuccess(true);
      // Redirigir después de 2 segundos
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } else {
      setError(result.message || "Error al actualizar la contraseña");
    }
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.password);

  // Loading state mientras valida el token
  if (isValidatingToken) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <Loader2 className="h-8 w-8 animate-spin text-brand-cyan-dark" />
          <p className="text-gray-600">Validando enlace...</p>
        </motion.div>
      </div>
    );
  }

  // Token inválido o expirado
  if (!isValidToken) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md overflow-hidden rounded-2xl border-2 border-red-200 bg-white shadow-xl"
        >
          <div className="bg-red-50 px-6 py-4">
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <span className="text-sm font-bold uppercase tracking-wider text-red-900">
                Enlace Inválido
              </span>
            </div>
          </div>
          <div className="p-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="font-display text-2xl font-bold text-gray-900">
              El enlace ha expirado
            </h3>
            <p className="mt-2 text-gray-600">
              Este enlace de recuperación ya no es válido. Por favor, solicita
              uno nuevo.
            </p>
            <Link
              href="/forgot-password"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-brand-cyan-dark px-6 py-3 text-sm font-bold text-white transition-all hover:bg-brand-cyan"
            >
              Solicitar nuevo enlace
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // Éxito
  if (isSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md overflow-hidden rounded-2xl border-2 border-green-200 bg-white shadow-xl"
        >
          <div className="bg-green-50 px-6 py-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm font-bold uppercase tracking-wider text-green-900">
                Contraseña Actualizada
              </span>
            </div>
          </div>
          <div className="p-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="font-display text-2xl font-bold text-gray-900">
              ¡Contraseña cambiada exitosamente!
            </h3>
            <p className="mt-2 text-gray-600">
              Tu contraseña ha sido actualizada correctamente. Redirigiendo al
              inicio de sesión...
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  // Formulario de reset
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl font-bold text-gray-900">
            Nueva Contraseña
          </h1>
          <p className="mt-2 text-gray-600">
            Crea una contraseña segura para tu cuenta
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          {/* Error del servidor */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-700"
              >
                <Lock className="h-4 w-4 text-brand-cyan-dark" />
                Nueva Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    setErrors({ ...errors, password: "" });
                    setError("");
                  }}
                  className={`w-full rounded-xl border px-4 py-3 pr-12 text-sm outline-none transition-all ${
                    errors.password
                      ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                      : "border-gray-200 focus:border-brand-cyan-dark focus:ring-4 focus:ring-brand-cyan-dark/10"
                  }`}
                  placeholder="Ingresa tu nueva contraseña"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs font-medium text-red-500">
                  {errors.password}
                </p>
              )}

              {/* Password Strength */}
              {formData.password && (
                <div className="mt-3">
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="font-medium text-gray-600">
                      Fortaleza de la contraseña
                    </span>
                    <span
                      className={`font-bold ${
                        passwordStrength <= 2
                          ? "text-red-600"
                          : passwordStrength === 3
                            ? "text-amber-600"
                            : "text-green-600"
                      }`}
                    >
                      {passwordStrength <= 2
                        ? "Débil"
                        : passwordStrength === 3
                          ? "Media"
                          : "Fuerte"}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`h-1.5 flex-1 rounded-full transition-all ${
                          level <= passwordStrength
                            ? passwordStrength <= 2
                              ? "bg-red-500"
                              : passwordStrength === 3
                                ? "bg-amber-500"
                                : "bg-green-500"
                            : "bg-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-700"
              >
                <Lock className="h-4 w-4 text-brand-cyan-dark" />
                Confirmar Contraseña
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    });
                    setErrors({ ...errors, confirmPassword: "" });
                  }}
                  className={`w-full rounded-xl border px-4 py-3 pr-12 text-sm outline-none transition-all ${
                    errors.confirmPassword
                      ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                      : "border-gray-200 focus:border-brand-cyan-dark focus:ring-4 focus:ring-brand-cyan-dark/10"
                  }`}
                  placeholder="Confirma tu nueva contraseña"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs font-medium text-red-500">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-cyan-dark px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-cyan-dark/20 transition-all hover:bg-brand-cyan disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Actualizando...</span>
                </>
              ) : (
                <>
                  <span>Cambiar Contraseña</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-sm font-bold text-brand-cyan-dark transition-colors hover:text-brand-cyan hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver a Iniciar Sesión
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Wrapper con Suspense para useSearchParams
export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
          <Loader2 className="h-8 w-8 animate-spin text-brand-cyan-dark" />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
