"use client";

import Cookies from "js-cookie";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";

import { Header } from "@/components/layout/Header";
import { Sidebar, SidebarProvider, useSidebar } from "@/components/layout/Sidebar";
import { NoSubscriptionOverlay } from "@/components/shared/NoSubscriptionOverlay";
import { getErrorCode } from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import { useProfileStore } from "@/store/profile";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const fetchUser = useAuthStore((state) => state.fetchUser);
  const _user = useAuthStore((state) => state.user);
  const _isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const fetchProfile = useProfileStore((state) => state.fetchProfile);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const hasVerified = useRef(false);

  useEffect(() => {
    // Evitar múltiples llamadas
    if (hasVerified.current) return;
    hasVerified.current = true;

    // Verificar si hay token antes de hacer la llamada
    const token = Cookies.get("accessToken");
    if (!token) {
      // No hay token, el middleware ya debería haber redirigido
      // Pero por si acaso, redirigimos manualmente
      router.replace("/login");
      return;
    }

    const verifyAuth = async () => {
      try {
        await fetchUser();
        // También cargamos el perfil para tener la info de suscripción
        await fetchProfile();
        setIsLoading(false);
      } catch (error) {
        setHasError(true);
        const code = getErrorCode(error);

        // Limpiar cookies en caso de error
        Cookies.remove("accessToken");
        Cookies.remove("userStatus");

        switch (code) {
        case "ACCOUNT_PENDING":
          router.replace("/auth/pending");
          break;
        case "ACCOUNT_SUSPENDED":
          router.replace("/auth/suspended");
          break;
        default:
          router.replace("/login");
        }
      }
    };

    verifyAuth();
  }, [fetchUser, fetchProfile, router]);

  // Si hay error, mostrar loading hasta que se complete la redirección
  if (hasError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-brand-cyan-dark" />
          <p className="text-gray-500">Redirigiendo...</p>
        </div>
      </div>
    );
  }

  // Mostrar loading mientras verifica autenticación
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-brand-cyan-dark" />
          <p className="text-gray-500">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <DashboardContent>{children}</DashboardContent>
      <NoSubscriptionOverlay />
    </SidebarProvider>
  );
}

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();

  return (
    <div className="min-h-screen bg-white">
      <Sidebar />
      <Header />
      <main className={`min-h-[calc(100vh-64px)] p-6 transition-all duration-300 lg:p-8 ${
        isCollapsed ? "lg:ml-[72px]" : "lg:ml-64"
      }`}>
        {children}
      </main>
    </div>
  );
}
