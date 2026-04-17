"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Users,
  Video,
  AlertCircle,
  CheckCircle,
  ShieldAlert,
  Sparkles,
  LayoutGrid,
  CalendarDays,
  Lock,
  Crown,
  Loader2 as Loader2Icon,
} from "lucide-react";
import Link from "next/link";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import api from "@/lib/api";
import { isClassStartingSoon, isLateCancellation } from "@/lib/utils/date-utils";
import { useAuthStore } from "@/store/auth";
import { useClassesStore } from "@/store/classes";
import { useProfileStore } from "@/store/profile";
import type { ClassSession } from "@/types/classes";

// Helper to detect if a class has already ended
const MONTH_MAP: Record<string, number> = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
};

// Turn raw URLs inside a description into clickable links. Keeps preceding
// tags like "[RECORDING]" intact — we only replace the http(s) token itself.
const URL_REGEX = /(https?:\/\/[^\s]+)/gi;

function renderDescriptionWithLinks(text: string): React.ReactNode {
  // Walk the string with exec() so each segment has a stable char offset we
  // can use as a React key (index-based keys trip `react/no-array-index-key`).
  const re = new RegExp(URL_REGEX.source, URL_REGEX.flags);
  const nodes: React.ReactNode[] = [];
  let cursor = 0;
  let match: RegExpExecArray | null;
  while ((match = re.exec(text)) !== null) {
    if (match.index > cursor) {
      const before = text.slice(cursor, match.index);
      nodes.push(<span key={`t-${cursor}`}>{before}</span>);
    }
    const url = match[0];
    nodes.push(
      <a
        key={`u-${match.index}`}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="text-brand-cyan-dark underline hover:text-brand-cyan break-all"
      >
        {url}
      </a>,
    );
    cursor = match.index + url.length;
  }
  if (cursor < text.length) {
    nodes.push(<span key={`t-${cursor}`}>{text.slice(cursor)}</span>);
  }
  return nodes;
}

function isClassPast(classItem: ClassSession): boolean {
  if (classItem.day === "Tomorrow") return false;
  if (classItem.day === "Today") {
    const endTimeStr = classItem.time.split(" - ")[1];
    if (endTimeStr) {
      const [hours, minutes] = endTimeStr.split(":").map(Number);
      if (hours !== undefined && minutes !== undefined) {
        const classEndTime = new Date();
        classEndTime.setHours(hours, minutes, 0, 0);
        return classEndTime.getTime() < Date.now();
      }
    }
    return false;
  }
  // Parse date like "Mar 25"
  if (classItem.date) {
    const parts = classItem.date.split(" ");
    if (parts.length === 2) {
      const month = MONTH_MAP[parts[0]];
      const day = parseInt(parts[1]);
      if (month !== undefined && !isNaN(day)) {
        const now = new Date();
        const classDate = new Date(now.getFullYear(), month, day, 23, 59, 59);
        return classDate < now;
      }
    }
  }
  return false;
}

export default function ClassesPage() {
  const [activeTab, setActiveTab] = useState<"available" | "booked">("available");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState<ClassSession | null>(null);
  const [willApplyStrike, setWillApplyStrike] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showMaterialsModal, setShowMaterialsModal] = useState(false);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedMaterialsTitle, setSelectedMaterialsTitle] = useState("");
  const ITEMS_PER_PAGE = 30;

  const { availableClasses, mySchedule, isLoading, fetchAvailableClasses,
    fetchMySchedule, enrollInClass, cancelEnrollment } = useClassesStore();

  const user = useAuthStore((state) => state.user);

  // Keep all enrolled classes (past + upcoming) for My Schedule
  const allSchedule = mySchedule;
  // Count only upcoming for the badge
  const upcomingCount = mySchedule.filter(c => !isClassPast(c)).length;

  // Pagination for available classes
  const paginatedAvailable = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return availableClasses.slice(start, start + ITEMS_PER_PAGE);
  }, [availableClasses, currentPage]);
  const totalAvailablePages = Math.max(1, Math.ceil(availableClasses.length / ITEMS_PER_PAGE));

  // Pagination for booked classes (shows all including past)
  const paginatedSchedule = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return allSchedule.slice(start, start + ITEMS_PER_PAGE);
  }, [allSchedule, currentPage]);
  const totalSchedulePages = Math.max(1, Math.ceil(allSchedule.length / ITEMS_PER_PAGE));

  // Check if user is currently punished (banned from live classes)
  const isPunished = user?.isPunished && user?.punishedUntil
    ? new Date(user.punishedUntil) > new Date()
    : false;

  const punishedUntilFormatted = user?.punishedUntil
    ? new Date(user.punishedUntil).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
    : null;

  useEffect(() => {
    if (activeTab === "available") {
      fetchAvailableClasses().catch((err) => {
        toast.error("Error loading available classes");
        console.error(err);
      });
    } else {
      fetchMySchedule().catch((err) => {
        toast.error("Error loading your schedule");
        console.error(err);
      });
    }
  }, [activeTab, fetchAvailableClasses, fetchMySchedule]);

  const handleCancelClick = (classItem: ClassSession) => {
    setSelectedClass(classItem);
    // Verificar si es cancelación tardía
    const isLate = isLateCancellation(classItem.day, classItem.time);
    setWillApplyStrike(isLate);
    setShowCancelModal(true);
  };

  const handleEnroll = async (classId: number) => {
    if (isPunished) {
      toast.error("Your account is temporarily restricted. You cannot enroll in classes right now.");
      return;
    }

    try {
      const response = await enrollInClass(classId);
      toast.success(response.message);
    } catch (_error: unknown) {
      const error = _error as { response?: { status?: number; data?: { message?: string } } };
      if (error.response?.status === 403) {
        toast.error("Your account doesn't have permission to enroll");
      } else if (error.response?.status === 409) {
        toast.error(error.response?.data?.message || "Already enrolled or class is full");
      } else {
        toast.error("Failed to enroll in class");
      }
    }
  };

  const confirmCancellation = async () => {
    if (!selectedClass) return;

    try {
      const response = await cancelEnrollment(selectedClass.id);
      
      if (response.strikeApplied) {
        toast.warning(response.message, { duration: 5000 });
      } else {
        toast.success(response.message);
      }

      setShowCancelModal(false);
      setSelectedClass(null);
    } catch {
      toast.error("Failed to cancel enrollment");
    }
  };

  const { planFeatures, isLoading: isProfileLoading, fetchProfile } = useProfileStore();
  const hasClassAccess = planFeatures?.liveClasses ?? false;
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isRequestingUpgrade, setIsRequestingUpgrade] = useState(false);
  const [hasRequestedUpgrade, setHasRequestedUpgrade] = useState(false);

  // Check if user has already requested upgrade (from sessionStorage, per-user + plan key)
  // Key includes plan info so it auto-resets when subscription situation changes
  const { subscription: subInfo } = useProfileStore();
  const planKey = subInfo?.plan ? `${subInfo.plan}_${subInfo.hasActiveSubscription ? "active" : "expired"}` : "noplan";
  const storageKey = user?.id ? `upgrade_requested_${user.id}_${planKey}` : null;

  useEffect(() => {
    if (!storageKey) return;
    const requested = sessionStorage.getItem(storageKey);
    if (requested === "true") {
      setHasRequestedUpgrade(true);
    }
  }, [storageKey]);

  const handleUpgradeRequest = useCallback(async () => {
    setIsRequestingUpgrade(true);
    try {
      await api.post("/api/contact/upgrade");
      setHasRequestedUpgrade(true);
      if (storageKey) sessionStorage.setItem(storageKey, "true");
      toast.success("Upgrade request sent! Our team will contact you soon.");
      setShowUpgradeModal(false);
    } catch {
      toast.error("Failed to send upgrade request. Please try again.");
    } finally {
      setIsRequestingUpgrade(false);
    }
  }, [storageKey]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Show locked view for users without live classes access
  if (!hasClassAccess && !isProfileLoading) {
    return (
      <div className="relative min-h-[600px]">
        {/* Blurred background content */}
        <div className="pointer-events-none select-none blur-[2px]">
          <div className="space-y-8 pb-10">
            <div>
              <h1 className="font-display text-2xl font-bold text-brand-primary sm:text-3xl">
                Live Classes & Workshops
              </h1>
              <p className="mt-2 text-base text-gray-600 sm:text-lg">
                Browse upcoming live sessions and reserve your spot
              </p>
            </div>
            {/* Placeholder class cards */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="rounded-2xl border border-gray-200 bg-white p-6">
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">CLASS</span>
                  <h3 className="mt-3 text-lg font-bold text-gray-900">English Conversation</h3>
                  <p className="mt-1 text-sm text-gray-500">Interactive session tailored for your level.</p>
                  <div className="mt-4 space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2"><Calendar className="h-4 w-4" /> Tomorrow</div>
                    <div className="flex items-center gap-2"><Clock className="h-4 w-4" /> 09:00 - 10:30</div>
                  </div>
                  <button className="mt-4 w-full rounded-xl bg-brand-primary py-3 text-sm font-bold text-white">Book Class</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Overlay with upgrade message */}
        <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mx-4 max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-2xl"
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand-cyan-dark to-brand-cyan">
              <Lock className="h-8 w-8 text-white" />
            </div>
            <h2 className="font-display text-2xl font-bold text-brand-primary">
              Upgrade Your Plan
            </h2>
            <p className="mt-3 text-sm text-gray-500">
              Upgrade your subscription to join live sessions with expert instructors.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              {hasRequestedUpgrade ? (
                <div className="rounded-xl bg-green-50 border border-green-200 py-3 px-4 text-center">
                  <div className="flex items-center justify-center gap-2 text-green-700 font-semibold">
                    <CheckCircle className="h-5 w-5" />
                    Upgrade request sent
                  </div>
                  <p className="text-xs text-green-600 mt-1">
                    We will reach out shortly with next steps.
                  </p>
                </div>
              ) : (
                <button
                  onClick={() => setShowUpgradeModal(true)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-cyan-dark to-brand-cyan px-6 py-3 font-bold text-white transition-all hover:shadow-lg hover:shadow-brand-cyan-dark/30"
                >
                  <Crown className="h-5 w-5" />
                  Request Upgrade
                </button>
              )}
              <Link
                href="/dashboard"
                className="text-sm font-medium text-gray-500 hover:text-brand-cyan-dark"
              >
                Return to Dashboard
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Upgrade Confirmation Modal */}
        {showUpgradeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mx-4 max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
            >
              <h3 className="mb-3 font-display text-lg font-bold text-brand-primary">
                Confirm Upgrade Request
              </h3>
              <p className="mb-6 text-sm text-gray-600">
                This will send an upgrade request to our team. Do you want to proceed?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  disabled={isRequestingUpgrade}
                  className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpgradeRequest}
                  disabled={isRequestingUpgrade}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-cyan-dark to-brand-cyan px-4 py-2.5 text-sm font-bold text-white hover:shadow-lg disabled:opacity-50"
                >
                  {isRequestingUpgrade ? (
                    <Loader2Icon className="h-4 w-4 animate-spin" />
                  ) : (
                    "Confirm"
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-brand-primary sm:text-3xl">
          Live Classes & Workshops
        </h1>
        <p className="mt-2 text-base text-gray-600 sm:text-lg">
          Browse upcoming live sessions and reserve your spot
        </p>
      </div>

      {/* Punishment Banner */}
      {isPunished && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border-2 border-red-200 bg-red-50 p-4 sm:p-6"
        >
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
              <ShieldAlert className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-red-800 sm:text-lg">
                Account Temporarily Restricted
              </h3>
              <p className="mt-1 text-sm text-red-700">
                Due to accumulated strikes, your access to live classes has been
                temporarily suspended. You will not be able to join or enroll in
                classes until{" "}
                <strong>{punishedUntilFormatted}</strong>.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tabs */}
      <div className="flex w-full border-b border-gray-200">
        <button
          onClick={() => { setActiveTab("available"); setCurrentPage(1); }}
          className={`flex items-center gap-2 border-b-2 px-6 py-4 text-sm font-bold transition-all ${
            activeTab === "available"
              ? "border-brand-primary text-brand-primary"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <LayoutGrid className="h-4 w-4" />
          Browse Sessions
        </button>
        <button
          onClick={() => { setActiveTab("booked"); setCurrentPage(1); }}
          className={`relative flex items-center gap-2 border-b-2 px-6 py-4 text-sm font-bold transition-all ${
            activeTab === "booked"
              ? "border-brand-primary text-brand-primary"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <CalendarDays className="h-4 w-4" />
          My Schedule
          {upcomingCount > 0 && (
            <span className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand-cyan-dark text-[10px] text-white">
              {upcomingCount}
            </span>
          )}
        </button>
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          {activeTab === "booked" ? (
            <motion.div
              key="booked"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {/* My Booked Classes Section */}
              <section>
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-cyan-light/20 text-brand-cyan-dark">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <h2 className="font-display text-xl font-bold text-brand-primary">
                    My Booked Classes
                  </h2>
                </div>

                {allSchedule.length > 0 ? (
                  <>
                    <div className="space-y-4">
                      {paginatedSchedule.map((classItem) => (
                        <motion.div
                          key={classItem.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="overflow-hidden rounded-2xl border-2 border-brand-cyan-dark bg-white shadow-lg transition-all hover:shadow-md"
                        >
                          <div className="bg-brand-cyan-dark px-4 py-3 sm:px-6">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-5 w-5 text-white" />
                              <span className="text-sm font-bold uppercase tracking-wider text-white">
                              Enrolled
                              </span>
                            </div>
                          </div>
                          <div className="p-4 sm:p-6">
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3">
                                  <h3 className="font-display text-lg font-bold text-brand-primary sm:text-xl">
                                    {classItem.title}
                                  </h3>
                                  {classItem.type === "workshop" && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-brand-primary/10 px-2.5 py-0.5 text-xs font-bold text-brand-primary">
                                      <Sparkles className="h-3 w-3" />
                                    Workshop
                                    </span>
                                  )}
                                </div>

                                <p className="mt-1 text-sm text-gray-500">
                                  {classItem.description
                                    ? renderDescriptionWithLinks(classItem.description)
                                    : null}
                                </p>

                                <div className="mt-4 flex flex-wrap gap-4">
                                  <div className="flex items-center gap-2 text-sm text-gray-700">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50">
                                      <Calendar className="h-4 w-4 text-brand-cyan-dark" />
                                    </div>
                                    <span className="font-semibold">
                                      {classItem.day}, {classItem.date}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-gray-700">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50">
                                      <Clock className="h-4 w-4 text-brand-cyan-dark" />
                                    </div>
                                    <span>{classItem.time}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="mt-4 flex flex-col gap-3 sm:flex-row lg:mt-0">
                                {isClassPast(classItem) ? (
                                  /* Past class - show "Class Ended" badge, no action buttons */
                                  <div className="flex items-center justify-center gap-2 rounded-xl bg-gray-100 border-2 border-gray-200 px-6 py-3 text-sm font-bold text-gray-400 cursor-default">
                                    <CheckCircle className="h-4 w-4" />
                                    Class Ended
                                  </div>
                                ) : isPunished ? (
                                  <div
                                    className="flex items-center justify-center gap-2 rounded-xl bg-red-50 border-2 border-red-200 px-6 py-3 text-sm font-bold text-red-400 cursor-not-allowed"
                                    title={`Access restricted until ${punishedUntilFormatted}`}
                                  >
                                    <ShieldAlert className="h-4 w-4" />
                                  Access Restricted
                                  </div>
                                ) : classItem.meetLink ? (
                                  <motion.a
                                    href={classItem.meetLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white shadow-lg transition-all ${
                                      isClassStartingSoon(classItem.time, classItem.day)
                                        ? "bg-brand-cyan-dark shadow-brand-cyan-dark/30 hover:bg-brand-cyan animate-pulse"
                                        : "bg-brand-cyan-dark/80 shadow-brand-cyan-dark/20 hover:bg-brand-cyan-dark"
                                    }`}
                                  >
                                    <Video className="h-4 w-4" />
                                    {isClassStartingSoon(classItem.time, classItem.day) ? "Join Class Now" : "Class Link"}
                                  </motion.a>
                                ) : (
                                  <button
                                    disabled
                                    className="flex items-center justify-center gap-2 rounded-xl bg-gray-100 px-6 py-3 text-sm font-bold text-gray-400 cursor-not-allowed"
                                  >
                                    <Video className="h-4 w-4" />
                                  Link available soon
                                  </button>
                                )}

                                {/* Hide Cancel button for past classes */}
                                {!isClassPast(classItem) && (
                                  <motion.button
                                    onClick={() => handleCancelClick(classItem)}
                                    whileHover={{
                                      scale: 1.02,
                                      backgroundColor: "#FEF2F2",
                                      borderColor: "#FCA5A5",
                                    }}
                                    whileTap={{ scale: 0.98 }}
                                    className="rounded-xl border-2 border-transparent bg-gray-50 px-4 py-3 text-sm font-bold text-gray-600 transition-all hover:text-red-600"
                                  >
                                  Cancel
                                  </motion.button>
                                )}

                                {classItem.materialsLink && (
                                  <motion.button
                                    onClick={() => {
                                      const links = classItem.materialsLink!
                                        .split(/[,\n;]+/)
                                        .map(l => l.trim())
                                        .filter(Boolean);
                                      if (links.length === 1) {
                                        window.open(links[0], "_blank");
                                      } else {
                                        setSelectedMaterials(links);
                                        setSelectedMaterialsTitle(classItem.title);
                                        setShowMaterialsModal(true);
                                      }
                                    }}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex items-center justify-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm font-bold text-brand-primary transition-all hover:border-brand-cyan-dark hover:bg-gray-50"
                                  >
                                  📄 View Materials
                                  </motion.button>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    {totalSchedulePages > 1 && (
                      <div className="mt-6 flex items-center justify-center gap-4">
                        <button
                          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                          className="flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40"
                        >
                          <ChevronLeft className="h-4 w-4" /> Previous
                        </button>
                        <span className="text-sm font-medium text-gray-700">
                        Page {currentPage} of {totalSchedulePages}
                        </span>
                        <button
                          onClick={() => setCurrentPage((p) => Math.min(totalSchedulePages, p + 1))}
                          disabled={currentPage === totalSchedulePages}
                          className="flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40"
                        >
                        Next <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 py-12 text-center">
                    <Calendar className="mb-3 h-10 w-10 text-gray-300" />
                    <h3 className="text-lg font-bold text-gray-900">
                      No classes booked
                    </h3>
                    <p className="text-sm text-gray-500">
                      Browse available classes to get started.
                    </p>
                    <button
                      onClick={() => setActiveTab("available")}
                      className="mt-4 font-bold text-brand-cyan-dark hover:underline"
                    >
                      Browse Classes &rarr;
                    </button>
                  </div>
                )}
              </section>
            </motion.div>
          ) : (
            <motion.div
              key="available"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              {/* Available Classes Section */}
              <section>
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <h2 className="font-display text-xl font-bold text-brand-primary">
                    All Sessions
                  </h2>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {paginatedAvailable.map((classItem) => {
                    const isUnlimited = classItem.capacity.max === null;

                    const typeBadge = (() => {
                      switch (classItem.type) {
                      case "workshop":
                        return { label: "Workshop", icon: <Sparkles className="h-3 w-3" />, classes: "bg-brand-primary/5 text-brand-primary ring-brand-primary/10" };
                      case "webinar":
                        return { label: "Webinar", icon: <Users className="h-3 w-3" />, classes: "bg-purple-50 text-purple-600 ring-purple-100" };
                      case "qa":
                        return { label: "Q&A", icon: <Users className="h-3 w-3" />, classes: "bg-amber-50 text-amber-600 ring-amber-100" };
                      case "masterclass":
                        return { label: "Masterclass", icon: <Sparkles className="h-3 w-3" />, classes: "bg-emerald-50 text-emerald-600 ring-emerald-100" };
                      default:
                        return { label: "Class", icon: <Users className="h-3 w-3" />, classes: "bg-blue-50 text-blue-600 ring-blue-100" };
                      }
                    })();

                    return (
                      <motion.div
                        key={classItem.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        whileHover={{
                          y: -4,
                          boxShadow: "0 10px 40px -10px rgba(0,0,0,0.1)",
                        }}
                        className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300"
                      >
                        {/* Card Header & Badges */}
                        <div className="relative p-5 pb-0">
                          <div className="flex items-start justify-between gap-3">
                            <div className="space-y-1">
                              <span className={`mb-2 inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wide ring-1 ring-inset ${typeBadge.classes}`}>
                                {typeBadge.icon}
                                {typeBadge.label}
                              </span>

                              <h3 className="font-display text-lg font-bold leading-tight text-brand-primary">
                                {classItem.title}
                              </h3>
                            </div>
                          </div>
                          <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                            {classItem.description
                              ? renderDescriptionWithLinks(classItem.description)
                              : "Join this interactive session tailored for your level."}
                          </p>
                        </div>

                        {/* Card Details */}
                        <div className="flex-1 p-5 pt-4">
                          <div className="space-y-3 rounded-xl bg-gray-50 p-3">
                            <div className="flex items-center gap-3 text-sm text-gray-700">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <span className="font-medium">
                                {classItem.day}, {classItem.date}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-700">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <span className="font-medium">
                                {classItem.time}
                              </span>
                            </div>

                            {!isUnlimited && (
                              <div className="flex items-center gap-3 text-sm">
                                <Users className="h-4 w-4 text-gray-400" />
                                <span
                                  className={`font-medium ${
                                    classItem.isFull
                                      ? "text-red-600"
                                      : "text-gray-700"
                                  }`}
                                >
                                  {classItem.capacity.current} /{" "}
                                  {classItem.capacity.max} spots filled
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Card Action */}
                        <div className="p-5 pt-0">
                          {isPunished ? (
                            // Usuario punished - sin acceso
                            <div
                              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-red-200 bg-red-50 py-3 text-sm font-bold text-red-400 cursor-not-allowed"
                              title={`Access restricted until ${punishedUntilFormatted}`}
                            >
                              <ShieldAlert className="h-4 w-4" />
                              Access Restricted
                            </div>
                          ) : classItem.isEnrolled ? (
                            // Usuario ya inscrito
                            isClassStartingSoon(classItem.time, classItem.day) ? (
                              <motion.a
                                href={classItem.meetLink ?? "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-cyan-dark py-3 text-sm font-bold text-white shadow-lg shadow-brand-cyan-dark/30 transition-all hover:bg-brand-cyan"
                              >
                                <Video className="h-4 w-4" />
                                {classItem.type !== "regular" ? `Join ${typeBadge.label}` : "Join Class"}
                              </motion.a>
                            ) : (
                              <div className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-100 py-3 text-sm font-bold text-green-700">
                                <CheckCircle className="h-4 w-4" />
                                Already Enrolled
                              </div>
                            )
                          ) : (
                            // Usuario no inscrito
                            <motion.button
                              onClick={() => handleEnroll(classItem.id)}
                              disabled={classItem.isFull}
                              whileHover={
                                !classItem.isFull ? { scale: 1.02 } : {}
                              }
                              whileTap={
                                !classItem.isFull ? { scale: 0.98 } : {}
                              }
                              className={`w-full rounded-xl py-3 text-sm font-bold transition-all ${
                                classItem.isFull
                                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                  : "bg-brand-primary text-white shadow-lg shadow-brand-primary/20 hover:bg-brand-primary/90"
                              }`}
                            >
                              {classItem.isFull
                                ? "Full"
                                : classItem.type !== "regular"
                                  ? `Join ${typeBadge.label}`
                                  : "Book Class"}
                            </motion.button>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
                {totalAvailablePages > 1 && (
                  <div className="mt-6 flex items-center justify-center gap-4">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40"
                    >
                      <ChevronLeft className="h-4 w-4" /> Previous
                    </button>
                    <span className="text-sm font-medium text-gray-700">
                      Page {currentPage} of {totalAvailablePages}
                    </span>
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalAvailablePages, p + 1))}
                      disabled={currentPage === totalAvailablePages}
                      className="flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40"
                    >
                      Next <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && selectedClass && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setShowCancelModal(false);
              setSelectedClass(null);
            }
          }}
          role="dialog"
          tabIndex={-1}
          ref={(el) => el?.focus()}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            <div className={`px-6 py-4 ${willApplyStrike ? "bg-red-50" : "bg-amber-50"}`}>
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${willApplyStrike ? "bg-red-100" : "bg-amber-100"}`}>
                  <AlertCircle className={`h-5 w-5 ${willApplyStrike ? "text-red-600" : "text-amber-600"}`} />
                </div>
                <h3 className={`font-display text-lg font-bold ${willApplyStrike ? "text-red-900" : "text-amber-900"}`}>
                  Confirm Cancellation
                </h3>
              </div>
            </div>
            <div className="p-6">
              <p className="text-sm font-medium text-gray-900">
                Are you sure you want to cancel the class &quot;
                {selectedClass.title}&quot;?
              </p>
              {willApplyStrike && (
                <div className="mt-4 rounded-xl border-2 border-red-200 bg-red-50 p-4">
                  <p className="text-sm font-bold text-red-800 mb-2">
                    ⚠️ Warning: Late Cancellation
                  </p>
                  <p className="text-sm text-red-700">
                    Canceling now will generate a <strong>Strike</strong> because
                    there are less than 24 hours until the class starts.
                  </p>
                </div>
              )}
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <motion.button
                  onClick={() => setShowCancelModal(false)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm font-bold text-gray-700 transition-all hover:bg-gray-50"
                >
                  Keep Class
                </motion.button>
                <motion.button
                  onClick={confirmCancellation}
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex-1 rounded-xl px-4 py-3 text-sm font-bold text-white transition-all ${
                    willApplyStrike
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-amber-600 hover:bg-amber-700"
                  }`}
                >
                  {isLoading ? "Canceling..." : "Confirm Cancel"}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Materials Modal */}
      {showMaterialsModal && selectedMaterials.length > 0 && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          role="dialog"
          tabIndex={-1}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            <div className="bg-brand-cyan-dark/5 border-b border-gray-100 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-lg font-bold text-brand-primary">
                    Class Materials
                  </h3>
                  <p className="text-sm text-gray-500 mt-0.5">{selectedMaterialsTitle}</p>
                </div>
                <button
                  onClick={() => setShowMaterialsModal(false)}
                  className="rounded-full p-2 hover:bg-gray-100 transition-colors"
                >
                  <AlertCircle className="h-5 w-5 text-gray-400" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-3 max-h-80 overflow-y-auto">
              {selectedMaterials.map((link, idx) => {
                const fileName = link.split("/").pop()?.split("?")[0] || `Material ${idx + 1}`;
                const isUrl = link.startsWith("http");
                return (
                  <a
                    key={link}
                    href={isUrl ? link : `https://${link}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm transition-all hover:border-brand-cyan-dark hover:bg-brand-cyan-dark/5 hover:shadow-sm group"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-cyan-dark/10 text-brand-cyan-dark group-hover:bg-brand-cyan-dark group-hover:text-white transition-colors">
                      📄
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{fileName}</p>
                      <p className="text-xs text-gray-400 truncate">{link}</p>
                    </div>
                    <span className="text-brand-cyan-dark text-xs font-bold group-hover:underline shrink-0">
                      Open →
                    </span>
                  </a>
                );
              })}
            </div>
            <div className="border-t border-gray-100 px-6 py-3 bg-gray-50">
              <button
                onClick={() => setShowMaterialsModal(false)}
                className="w-full rounded-xl border border-gray-200 bg-white py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
