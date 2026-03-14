"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  Briefcase,
  Calendar,
  ChevronsLeft,
  ChevronsRight,
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
import { useProfileStore } from "@/store/profile";

const menuItems = [
  { icon: Home, label: "Home", href: "/dashboard", key: "home" },
  { icon: Calendar, label: "Live Classes", href: "/classes", key: "classes" },
  { icon: BookOpen, label: "Academy", href: "/academy", key: "academy" },
  { icon: Mic, label: "Challenges", href: "/challenges", key: "challenges" },
  { icon: Briefcase, label: "Job Board", href: "/jobs", key: "jobs" },
  { icon: User, label: "My Profile", href: "/profile", key: "profile" },
];

// Context for mobile menu and collapse
const SidebarContext = createContext({
  isOpen: false,
  setIsOpen: (_value: boolean) => {},
  isCollapsed: false,
  setIsCollapsed: (_value: boolean) => {},
});

export const useSidebar = () => useContext(SidebarContext);

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen, isCollapsed, setIsCollapsed }}>
      {children}
    </SidebarContext.Provider>
  );
};

// Sidebar content component (moved outside render)
const SidebarContent = ({
  pathname,
  onClose,
  onLogout,
  systemSettings,
  isCollapsed = false,
  onToggleCollapse,
}: {
  pathname: string;
  onClose?: () => void;
  onLogout: () => void;
  systemSettings: { jobBoardEnabled: boolean; academyEnabled: boolean };
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}) => {
  // Filter menu items based on system settings
  const filteredMenuItems = menuItems.filter((item) => {
    // Hide Jobs if globally disabled by admin
    if (item.key === "jobs" && !systemSettings.jobBoardEnabled) {
      return false;
    }
    return true;
  });

  return (
    <div className={`flex h-full flex-col ${isCollapsed ? "p-3" : "p-6"}`}>
      {/* Logo */}
      <div className={`mb-8 flex items-center ${isCollapsed ? "justify-center" : "justify-between"}`}>
        {isCollapsed ? (
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-black">
            <Image
              src="https://pub-edad5806cdff45b08f50aa762e6fce6c.r2.dev/HT_USA_Logo-lau.png"
              alt="High Ticket USA"
              width={40}
              height={40}
              className="h-10 w-10 object-cover object-top"
            />
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-black">
                <Image
                  src="https://pub-edad5806cdff45b08f50aa762e6fce6c.r2.dev/HT_USA_Logo-lau.png"
                  alt="High Ticket USA"
                  width={40}
                  height={40}
                  className="h-10 w-10 object-cover object-top"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-display text-lg font-bold text-brand-primary leading-tight">
                  High Ticket USA
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
          </>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1.5">
        {filteredMenuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              title={isCollapsed ? item.label : undefined}
              className={`group relative flex items-center ${isCollapsed ? "justify-center" : "gap-3"} rounded-xl ${isCollapsed ? "px-2 py-3" : "px-4 py-3"} text-sm font-semibold transition-all ${
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
              {!isCollapsed && item.label}
              {isActive && !isCollapsed && (
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

      {/* Collapse Toggle (Desktop only) */}
      {onToggleCollapse && (
        <div className="border-t border-gray-200 pt-3 mb-1">
          <button
            onClick={onToggleCollapse}
            className={`flex w-full items-center ${isCollapsed ? "justify-center" : "gap-3"} rounded-xl px-4 py-2 text-sm font-semibold text-gray-500 transition-all hover:bg-gray-50 hover:text-brand-cyan-dark`}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronsRight className="h-5 w-5" />
            ) : (
              <>
                <ChevronsLeft className="h-5 w-5" />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Logout */}
      <div className="border-t border-gray-200 pt-4">
        <button
          onClick={onLogout}
          title={isCollapsed ? "Sign Out" : undefined}
          className={`flex w-full items-center ${isCollapsed ? "justify-center" : "gap-3"} rounded-xl ${isCollapsed ? "px-2" : "px-4"} py-3 text-sm font-semibold text-red-600 transition-all hover:bg-red-50`}
        >
          <LogOut className="h-5 w-5" />
          {!isCollapsed && "Sign Out"}
        </button>
      </div>
    </div>
  );
};

export const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { isOpen, setIsOpen, isCollapsed, setIsCollapsed } = useSidebar();
  const logout = useAuthStore((state) => state.logout);
  const systemSettings = useProfileStore((state) => state.systemSettings);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 hidden h-screen flex-col border-r border-gray-200 bg-white transition-all duration-300 lg:flex ${
          isCollapsed ? "w-[72px]" : "w-64"
        }`}
      >
        <SidebarContent
          pathname={pathname}
          onLogout={handleLogout}
          systemSettings={systemSettings}
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        />
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
              <SidebarContent
                pathname={pathname}
                onClose={() => setIsOpen(false)}
                onLogout={handleLogout}
                systemSettings={systemSettings}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
