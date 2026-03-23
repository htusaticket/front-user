"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, LogOut, CheckCircle, Loader2 } from "lucide-react";
import { useEffect, useState, useMemo, useCallback } from "react";
import { toast } from "sonner";

import api from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import { useProfileStore } from "@/store/profile";

export function NoSubscriptionOverlay() {
  const { subscription, isLoading, user } = useProfileStore();
  const { logout } = useAuthStore();
  const [showOverlay, setShowOverlay] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [hasRequested, setHasRequested] = useState(false);

  // Calculate whether overlay should be visible based on conditions
  const shouldShowOverlay = useMemo(() => {
    if (isLoading) return false;
    if (!subscription) return false;
    return !subscription.hasActiveSubscription;
  }, [subscription, isLoading]);

  useEffect(() => {
    if (shouldShowOverlay) {
      // Small delay to prevent flash
      const timer = setTimeout(() => setShowOverlay(true), 500);
      return () => clearTimeout(timer);
    }
    // Use timeout for hiding as well to satisfy lint rules
    const hideTimer = setTimeout(() => setShowOverlay(false), 0);
    return () => clearTimeout(hideTimer);
  }, [shouldShowOverlay]);

  // Check if user has already requested (from sessionStorage)
  useEffect(() => {
    const requested = sessionStorage.getItem("upgrade_requested");
    if (requested === "true") {
      setHasRequested(true);
    }
  }, []);

  const handleUpgradeRequest = useCallback(async () => {
    setIsRequesting(true);
    try {
      await api.post("/api/contact/upgrade");
      setHasRequested(true);
      sessionStorage.setItem("upgrade_requested", "true");
      toast.success("¡Solicitud enviada! Nuestro equipo se pondrá en contacto contigo pronto.");
    } catch {
      toast.error("Error al enviar la solicitud. Inténtalo de nuevo más tarde.");
    } finally {
      setIsRequesting(false);
    }
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    window.location.href = "/login";
  }, [logout]);

  // Don't show for staff/admin users
  if (user?.role === "ADMIN" || user?.role === "SUPERADMIN") {
    return null;
  }

  return (
    <AnimatePresence>
      {showOverlay && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl"
          >

            {/* Icon */}
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-orange-100">
              <CreditCard className="h-10 w-10 text-amber-600" />
            </div>

            {/* Content */}
            <div className="text-center">
              <h2 className="font-display text-2xl font-bold text-gray-900 mb-2">
                Welcome, {user?.firstName}! 🎉
              </h2>
              <p className="text-gray-600 mb-6">
                Debes renovar tu plan para continuar. Para acceder a las funciones premium como
                <strong> clases en vivo</strong>, <strong>challenges</strong>, y el 
                <strong> job board</strong>, necesitas un plan de suscripción activo.
              </p>

              {/* Features list */}
              <div className="mb-6 text-left bg-gray-50 rounded-xl p-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">With a subscription you get:</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>✅ Access to all Academy content</li>
                  <li>✅ Live classes with expert teachers</li>
                  <li>✅ Daily challenges with feedback</li>
                  <li>✅ Job opportunities (select plans)</li>
                </ul>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3">
                {hasRequested ? (
                  <div className="w-full rounded-xl bg-green-50 border border-green-200 py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-2 text-green-700 font-semibold">
                      <CheckCircle className="h-5 w-5" />
                      ¡Solicitud de renovación enviada!
                    </div>
                    <p className="text-xs text-green-600 mt-1">
                      Nuestro equipo se pondrá en contacto contigo pronto.
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={handleUpgradeRequest}
                    disabled={isRequesting}
                    className="w-full rounded-xl bg-brand-primary py-3 text-center font-bold text-white hover:bg-brand-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isRequesting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Enviando solicitud...
                      </>
                    ) : (
                      "Solicitar renovación de plan"
                    )}
                  </button>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full rounded-xl border border-gray-200 py-3 text-center font-semibold text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
