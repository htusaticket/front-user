"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Clock,
  Trophy,
  Video,
  BookOpen,
  CheckCircle2,
  Sparkles,
  Calendar,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

import { isClassStartingSoon, formatRelativeTime } from "@/lib/utils/date-utils";
import { useAuthStore } from "@/store/auth";
import { useDashboardStore } from "@/store/dashboard";
import type { NotificationType } from "@/types/dashboard";

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { data, fetchDashboard } = useDashboardStore();

  useEffect(() => {
    fetchDashboard().catch((err) => {
      toast.error("Error loading dashboard data");
      console.error(err);
    });
  }, [fetchDashboard]);

  // Get notification icon based on type
  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
    case "STRIKE_APPLIED":
      return <AlertCircle className="h-5 w-5 text-red-600" />;
    case "CLASS_CONFIRMED":
      return <CheckCircle2 className="h-5 w-5 text-green-600" />;
    case "CLASS_REMINDER":
      return <Clock className="h-5 w-5 text-blue-600" />;
    case "MATERIAL_AVAILABLE":
      return <BookOpen className="h-5 w-5 text-purple-600" />;
    case "CHALLENGE_FEEDBACK":
      return <Trophy className="h-5 w-5 text-amber-600" />;
    default:
      return <AlertCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getNotificationColor = (type: NotificationType) => {
    switch (type) {
    case "STRIKE_APPLIED":
      return { border: "border-red-500", bg: "bg-red-50/50", iconBg: "bg-red-100" };
    case "CLASS_CONFIRMED":
      return { border: "border-green-500", bg: "bg-green-50/50", iconBg: "bg-green-100" };
    case "CLASS_REMINDER":
      return { border: "border-blue-500", bg: "bg-blue-50/50", iconBg: "bg-blue-100" };
    case "MATERIAL_AVAILABLE":
      return { border: "border-purple-500", bg: "bg-purple-50/50", iconBg: "bg-purple-100" };
    case "CHALLENGE_FEEDBACK":
      return { border: "border-amber-500", bg: "bg-amber-50/50", iconBg: "bg-amber-100" };
    default:
      return { border: "border-gray-500", bg: "bg-gray-50/50", iconBg: "bg-gray-100" };
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header Section */}
      <div>
        <h1 className="font-display text-2xl font-bold text-brand-primary sm:text-3xl">
          Hello {user?.firstName || "Guest"} 👋
        </h1>
        <p className="mt-2 text-base text-gray-700 sm:text-lg">
          Welcome to your Dashboard
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Next Class - Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:col-span-2"
        >
          {data?.nextClass ? (
            <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              {/* Header cyan */}
              <div className="bg-brand-cyan-dark px-4 py-3 sm:px-6 sm:py-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-2 w-2 items-center">
                    <span className="absolute h-2 w-2 animate-ping rounded-full bg-white opacity-75" />
                    <span className="relative h-2 w-2 rounded-full bg-white" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-white">
                    Next Class
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col p-4 sm:p-6">
                <h2 className="font-display text-xl font-bold text-brand-primary sm:text-2xl">
                  {data.nextClass.title}
                </h2>

                <div className="mt-4 grid grid-cols-1 gap-4 sm:mt-6 sm:grid-cols-2">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-cyan-dark/10">
                      <Clock className="h-5 w-5 text-brand-cyan-dark" />
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Schedule
                      </p>
                      <p className="mt-1 text-base font-bold text-gray-900">
                        {data.nextClass.day}, {data.nextClass.time}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-cyan/10">
                      <Video className="h-5 w-5 text-brand-cyan" />
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Platform
                      </p>
                      <p className="mt-1 text-base font-bold text-gray-900">
                        Google Meet
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-4 sm:pt-6">
                  <div className="flex flex-col gap-3 sm:flex-row">
                    {isClassStartingSoon(data.nextClass.time, data.nextClass.day) ? (
                      <motion.a
                        href={data.nextClass.meetLink || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial="initial"
                        whileHover="hover"
                        whileTap="tap"
                        variants={{
                          initial: { scale: 1, boxShadow: "0 0 0 0 rgba(0,0,0,0)" },
                          hover: { 
                            scale: 1.03, 
                            boxShadow: "0 20px 40px -12px rgba(34, 147, 165, 0.4)", 
                          },
                          tap: { scale: 0.97 },
                        }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-cyan-dark px-5 py-3 text-sm font-bold text-white shadow-lg shadow-brand-cyan-dark/30 transition-all hover:bg-brand-cyan"
                      >
                        Join Now
                        <motion.div
                          variants={{
                            initial: { x: 0 },
                            hover: { 
                              x: [0, 3, 0],
                              transition: { repeat: Infinity, duration: 1.5, ease: "easeInOut" },
                            },
                          }}
                        >
                          <ArrowRight className="h-4 w-4" />
                        </motion.div>
                      </motion.a>
                    ) : (
                      <button
                        disabled
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gray-100 px-5 py-3 text-sm font-bold text-gray-400 cursor-not-allowed"
                      >
                        Join Now
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    )}
                    {data.nextClass.materialsLink && (
                      <motion.a
                        href={data.nextClass.materialsLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ 
                          scale: 1.03,
                          borderColor: "rgb(34, 147, 165)",
                        }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        className="flex items-center justify-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-5 py-3 text-sm font-bold text-brand-primary transition-all hover:border-brand-cyan-dark hover:bg-gray-50 sm:flex-none"
                      >
                        View Materials
                      </motion.a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-8">
              <Calendar className="h-12 w-12 text-gray-300 mb-3" />
              <p className="text-lg font-bold text-gray-900">No upcoming classes</p>
              <p className="text-sm text-gray-500">Browse available sessions to get started</p>
              <Link
                href="/classes"
                className="mt-4 font-bold text-brand-cyan-dark hover:underline"
              >
                Browse Classes →
              </Link>
            </div>
          )}
        </motion.div>

        {/* Daily Challenge Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col"
        >
          <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="bg-amber-50 px-4 py-3 sm:px-6 sm:py-4">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
                  Daily Challenge
                </span>
              </div>
            </div>

            <div className="flex flex-1 flex-col items-center justify-center p-4 sm:p-6">
              {data?.dailyChallenge ? (
                data.dailyChallenge.completed ? (
                  /* Completed State */
                  <div className="flex flex-col items-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                      <CheckCircle2 className="h-10 w-10 text-green-600" />
                    </div>

                    <p className="mt-4 text-center font-display text-lg font-bold text-brand-primary">
                      Today&apos;s Challenge Complete!
                    </p>
                    <p className="mt-1 text-center text-sm text-gray-600">
                      Great job! Come back tomorrow for a new challenge
                    </p>

                    <div className="mt-4 w-full rounded-xl bg-green-50 p-3">
                      <p className="text-center text-xs font-semibold text-green-800">
                        🔥 {data.dailyChallenge.streak} day streak!
                      </p>
                    </div>
                  </div>
                ) : (
                  /* Pending State */
                  <div className="flex flex-col items-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-100">
                      <Sparkles className="h-10 w-10 text-amber-600" />
                    </div>

                    <p className="mt-4 text-center font-display text-lg font-bold text-brand-primary">
                      {data.dailyChallenge.title}
                    </p>
                    <p className="mt-1 text-center text-sm text-gray-600">
                      Complete today&apos;s challenge to maintain your streak
                    </p>

                    <button
                      onClick={() => router.push("/challenges")}
                      className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl
                        bg-brand-cyan-dark px-5 py-3 text-sm font-bold text-white shadow-lg
                        shadow-brand-cyan-dark/20 transition-all hover:bg-brand-cyan"
                    >
                      <Sparkles className="h-4 w-4" />
                      Start Challenge
                    </button>

                    {data.dailyChallenge.streak > 0 && (
                      <div className="mt-4 w-full rounded-xl bg-amber-50 p-3">
                        <p className="text-center text-xs font-semibold text-amber-800">
                          🔥 {data.dailyChallenge.streak} day streak! Don&apos;t break it!
                        </p>
                      </div>
                    )}
                  </div>
                )
              ) : (
                <p className="text-center text-gray-500">No challenge available today</p>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Continue Learning & Course Progress */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Continue Learning Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col"
        >
          <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 sm:px-6 sm:py-4">
              <h3 className="font-display text-lg font-bold text-brand-primary">
                Continue Learning
              </h3>
            </div>
            {data?.continueLearning ? (
              <div className="flex flex-1 flex-col p-4 sm:p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-cyan-dark to-brand-cyan text-white">
                    <BookOpen className="h-8 w-8" />
                  </div>
                  <div className="flex-1">
                    <p className="font-display text-lg font-bold text-brand-primary">
                      {data.continueLearning.moduleTitle}
                    </p>
                    <p className="mt-1 text-sm text-gray-600">
                      {data.continueLearning.lessonTitle}
                    </p>
                  </div>
                </div>
                <Link
                  href={`/academy/${data.continueLearning.moduleId}/${data.continueLearning.lessonId}`}
                  className="mt-6"
                >
                  <motion.button
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                    variants={{
                      initial: { scale: 1, boxShadow: "0 0 0 0 rgba(0,0,0,0)" },
                      hover: { 
                        scale: 1.03, 
                        boxShadow: "0 20px 40px -12px rgba(34, 147, 165, 0.4)",
                      },
                      tap: { scale: 0.97 },
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-cyan-dark px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-brand-cyan-dark/20 transition-all hover:bg-brand-cyan"
                  >
                    Resume Lesson
                    <motion.div
                      variants={{
                        initial: { x: 0 },
                        hover: { 
                          x: [0, 3, 0],
                          transition: { repeat: Infinity, duration: 1.5, ease: "easeInOut" },
                        },
                      }}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </motion.div>
                  </motion.button>
                </Link>
              </div>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center p-6">
                <BookOpen className="h-12 w-12 text-gray-300 mb-3" />
                <p className="text-center text-sm text-gray-500">
                  No lessons in progress. Start learning today!
                </p>
                <Link
                  href="/academy"
                  className="mt-4 font-bold text-brand-cyan-dark hover:underline"
                >
                  Browse Academy →
                </Link>
              </div>
            )}
          </div>
        </motion.div>

        {/* Recent Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col"
        >
          <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 sm:px-6 sm:py-4">
              <div className="flex items-center gap-2">
                <h3 className="font-display text-lg font-bold text-brand-primary">
                  Recent Notifications
                </h3>
                {data?.notifications && data.notifications.length > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                    {data.notifications.length}
                  </span>
                )}
              </div>
            </div>
            {data?.notifications && data.notifications.length > 0 ? (
              <div className="flex-1 divide-y divide-gray-100">
                {data.notifications.map((notification) => {
                  const colors = getNotificationColor(notification.type);
                  return (
                    <div
                      key={notification.id}
                      className={`flex gap-3 border-l-4 ${colors.border} ${colors.bg} p-4 transition-all hover:opacity-80`}
                    >
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${colors.iconBg}`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-900">
                          {notification.title}
                        </p>
                        <p className="mt-1 text-sm text-gray-600">
                          {notification.message}
                        </p>
                        <p className="mt-2 text-xs font-semibold text-gray-500">
                          {formatRelativeTime(notification.createdAt)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center p-6">
                <CheckCircle2 className="h-12 w-12 text-gray-300 mb-3" />
                <p className="text-center text-sm text-gray-500">
                  No new notifications
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
