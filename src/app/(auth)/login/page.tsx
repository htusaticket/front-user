"use client";

import { motion } from "framer-motion";
import Cookies from "js-cookie";
import { AlertCircle, ArrowRight, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import { InputField, PasswordField } from "@/components/auth/FormInputs";
import { useAppLogo } from "@/hooks/useAppLogo";
import { useAuthStore } from "@/store/auth";

export default function Login() {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuthStore();
  const logoUrl = useAppLogo();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Verificar si ya está autenticado
  useEffect(() => {
    const token = Cookies.get("accessToken");
    const userStatus = Cookies.get("userStatus");
    
    if (token && userStatus === "ACTIVE") {
      router.replace("/dashboard");
    }
  }, [router]);

  const validateField = (field: string, value: string) => {
    switch (field) {
    case "email": {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value) return "El correo es requerido";
      if (!emailRegex.test(value)) return "Ingresa un correo válido";
      return "";
    }
    case "password":
      if (!value) return "La contraseña es requerida";
      return "";
    default:
      return "";
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    const validationError = validateField(field, value);
    setValidationErrors((prev) => ({ ...prev, [field]: validationError }));
    // Limpiar error del servidor al escribir
    if (error) clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación del formulario
    const newErrors: Record<string, string> = {};
    Object.keys(formData).forEach((key) => {
      const validationError = validateField(key, formData[key as keyof typeof formData]);
      if (validationError) newErrors[key] = validationError;
    });

    if (Object.keys(newErrors).length > 0) {
      setValidationErrors(newErrors);
      return;
    }

    // Llamar al API
    const result = await login({
      email: formData.email,
      password: formData.password,
    });

    if (result.success) {
      // Login exitoso - redirigir al dashboard
      router.push("/dashboard");
    } else {
      // Manejar redirecciones según el código de error
      switch (result.code) {
      case "ACCOUNT_PENDING":
        router.push("/pending");
        break;
      case "ACCOUNT_SUSPENDED":
        router.push("/suspended");
        break;
        // INVALID_CREDENTIALS se muestra como error en el formulario
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mx-auto w-full max-w-lg"
    >
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="mb-4 flex h-24 w-24 items-center justify-center overflow-hidden rounded-xl bg-black">
          <Image
            src={logoUrl}
            alt="High Ticket USA"
            width={96}
            height={96}
            className="h-24 w-24 object-cover object-top"
            priority
          />
        </div>
        <h2 className="font-display text-3xl font-bold text-gray-900">
          Iniciar Sesión
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          ¡Bienvenido de nuevo! Ingresa a tu cuenta
        </p>
      </div>

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

      <form className="space-y-4" onSubmit={handleSubmit}>
        <InputField
          id="email"
          label="Correo electrónico"
          type="email"
          value={formData.email}
          onChange={(v) => handleChange("email", v)}
          error={validationErrors.email}
          placeholder="tu@email.com"
        />

        <div className="flex flex-col">
          <PasswordField
            id="password"
            label="Contraseña"
            value={formData.password}
            onChange={(v) => handleChange("password", v)}
            show={showPassword}
            onToggle={() => setShowPassword(!showPassword)}
            error={validationErrors.password}
          />
          <div className="mt-1 flex justify-end">
            <Link
              href="/forgot-password"
              className="text-sm font-bold text-brand-cyan-dark transition-colors hover:text-[#2892a5] hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="group relative mt-6 flex w-full items-center justify-center overflow-hidden rounded-xl bg-brand-cyan-dark py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-cyan-dark/20 transition-all hover:-translate-y-0.5 hover:bg-[#2eaac2] hover:shadow-xl hover:shadow-brand-cyan-dark/30 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:opacity-70"
        >
          <div className="relative flex items-center gap-2">
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Iniciando sesión...</span>
              </>
            ) : (
              <>
                <span>Ingresar</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </div>
        </button>

        <p className="mt-8 text-center text-sm text-gray-500">
          ¿No tienes cuenta?{" "}
          <Link
            href="/register"
            className="font-bold text-brand-cyan-dark transition-colors hover:text-[#2892a5] hover:underline"
          >
            Regístrate aquí
          </Link>
        </p>
      </form>
    </motion.div>
  );
}
