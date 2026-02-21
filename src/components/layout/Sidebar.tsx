"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  Briefcase,
  Calendar,
  Home,
  LogOut,
  Mic,
  User,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useState } from "react";

import { useAuthStore } from "@/store/auth";

const menuItems = [
  { icon: Home, label: "Home", href: "/dashboard" },
  { icon: Calendar, label: "Live Classes", href: "/classes" },
  { icon: BookOpen, label: "Academy", href: "/academy" },
  { icon: Mic, label: "Challenges", href: "/challenges" },
  { icon: Briefcase, label: "Jobs", href: "/jobs" },
  { icon: User, label: "My Profile", href: "/profile" },
];

// Context for mobile menu
const SidebarContext = createContext({
  isOpen: false,
  setIsOpen: (_value: boolean) => {},
});

export const useSidebar = () => useContext(SidebarContext);

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </SidebarContext.Provider>
  );
};

// Sidebar content component (moved outside render)
const SidebarContent = ({
  pathname,
  onClose,
  onLogout,
}: {
  pathname: string;
  onClose?: () => void;
  onLogout: () => void;
}) => (
  <div className="flex h-full flex-col p-6">
    {/* Logo */}
    <div className="mb-8 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-brand-cyan-dark shadow-lg shadow-brand-cyan-dark/30">
          <Image
            src="/logo.webp"
            alt="JFalcon"
            width={44}
            height={44}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-col">
          <span className="font-display text-xl font-bold text-brand-primary">
            JFalcon
          </span>
          <span className="text-xs font-medium text-gray-500">
            High Ticket English
          </span>
        </div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>

    {/* Navigation */}
    <nav className="flex-1 space-y-1.5">
      {menuItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className={`group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
              isActive
                ? "bg-brand-cyan-dark text-white shadow-lg shadow-brand-cyan-dark/20"
                : "text-gray-700 hover:bg-gray-50 hover:text-brand-cyan-dark"
            }`}
          >
            <item.icon
              className={`h-5 w-5 transition-colors ${
                isActive
                  ? "text-white"
                  : "text-gray-500 group-hover:text-brand-cyan-dark"
              }`}
            />
            {item.label}
            {isActive && (
              <motion.div
                layoutId="sidebar-indicator"
                className="absolute right-3 h-2 w-2 rounded-full bg-white"
                initial={false}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </Link>
        );
      })}
    </nav>

    {/* Logout */}
    <div className="border-t border-gray-200 pt-4">
      <button 
        onClick={onLogout}
        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-red-600 transition-all hover:bg-red-50"
      >
        <LogOut className="h-5 w-5" />
        Sign Out
      </button>
    </div>
  </div>
);

export const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { isOpen, setIsOpen } = useSidebar();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col border-r border-gray-200 bg-white lg:flex">
        <SidebarContent pathname={pathname} onLogout={handleLogout} />
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            />
            {/* Sidebar */}
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 z-50 h-screen w-64 border-r border-gray-200 bg-white lg:hidden"
            >
              <SidebarContent pathname={pathname} onClose={() => setIsOpen(false)} onLogout={handleLogout} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
