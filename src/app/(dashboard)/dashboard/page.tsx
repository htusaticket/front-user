"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Clock,
  Trophy,
  Video,
  BookOpen,
  CheckCircle2,
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header Section */}
      <div>
        <h1 className="font-display text-2xl font-bold text-brand-primary sm:text-3xl">
          Hello, Eugenia 👋
        </h1>
        <p className="mt-2 text-base text-gray-700 sm:text-lg">
          You have{" "}
          <span className="font-bold text-brand-cyan-dark">2 classes</span>{" "}
          pending this week
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
                Conversational Advanced II
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
                      Today, 6:00 PM
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
                  </motion.button>
                  <motion.button
                    whileHover={{ 
                      scale: 1.03,
                      borderColor: "rgb(34, 147, 165)",
                    }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    className="flex items-center justify-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-5 py-3 text-sm font-bold text-brand-primary transition-all hover:border-brand-cyan-dark hover:bg-gray-50 sm:flex-none"
                  >
                    View Materials
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
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
              {/* Completed State */}
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
                    🔥 3 day streak!
                  </p>
                </div>
              </div>

              {/* Uncomment for Incomplete State:
              <div className="flex flex-col items-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-100">
                  <Sparkles className="h-10 w-10 text-amber-600" />
                </div>

                <p className="mt-4 text-center font-display text-lg font-bold text-brand-primary">
                  Challenge Pending
                </p>
                <p className="mt-1 text-center text-sm text-gray-600">
                  Complete today&apos;s challenge to maintain your streak
                </p>

                <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-cyan-dark px-5 py-3 text-sm font-bold text-white shadow-lg shadow-brand-cyan-dark/20 transition-all hover:bg-brand-cyan">
                  <Sparkles className="h-4 w-4" />
                  Start Challenge
                </button>
              </div>
              */}
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
            <div className="flex flex-1 flex-col p-4 sm:p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-cyan-dark to-brand-cyan text-white">
                  <BookOpen className="h-8 w-8" />
                </div>
                <div className="flex-1">
                  <p className="font-display text-lg font-bold text-brand-primary">
                    Business English
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    Module 3 • Lesson 6: Negotiation Tactics
                  </p>
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-gray-500">6 of 10 Completed</span>
                      <span className="font-bold text-brand-cyan-dark">40%</span>
                    </div>
                    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-gray-100">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "40%" }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full rounded-full bg-brand-cyan-dark"
                      />
                    </div>
                  </div>
                </div>
              </div>
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
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-cyan-dark px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-brand-cyan-dark/20 transition-all hover:bg-brand-cyan"
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
            </div>
          </div>
        </motion.div>

        {/* Course Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col"
        >
          <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 sm:px-6 sm:py-4">
              <h3 className="font-display text-lg font-bold text-brand-primary">
                Course Progress
              </h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-xs font-bold text-brand-cyan-dark hover:underline"
              >
                View All
              </motion.button>
            </div>
            <div className="flex-1 p-4 sm:p-6">
              <div className="space-y-4">
                {/* Module 1 */}
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-100">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-bold text-brand-primary">
                          Module 3: Business English
                        </p>
                        <p className="text-xs text-gray-500">
                          6 of 10 Completed
                        </p>
                      </div>
                      <span className="text-sm font-bold text-brand-cyan-dark">
                        40%
                      </span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-brand-cyan-dark"
                        style={{ width: "40%" }}
                      />
                    </div>
                  </div>
                </div>

                {/* Module 2 */}
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-purple-100">
                    <BookOpen className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-bold text-brand-primary">
                          Pronunciation Workshop
                        </p>
                        <p className="text-xs text-gray-500">
                          3 of 8 Completed
                        </p>
                      </div>
                      <span className="text-sm font-bold text-brand-cyan-dark">
                        25%
                      </span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-brand-cyan-dark"
                        style={{ width: "25%" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                  2
                </span>
              </div>
            </div>
            <div className="flex-1 divide-y divide-gray-100">
              {/* Notification 1 */}
              <div className="flex gap-3 border-l-4 border-green-500 bg-green-50/50 p-4 transition-all hover:bg-green-50">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-100">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900">
                    Feedback Available
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    Teacher Sarah has reviewed your latest audio challenge
                  </p>
                  <p className="mt-2 text-xs font-semibold text-gray-500">
                    2 hours ago
                  </p>
                </div>
              </div>

              {/* Notification 2 */}
              <div className="flex gap-3 border-l-4 border-blue-500 bg-blue-50/50 p-4 transition-all hover:bg-blue-50">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100">
                  <Trophy className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900">
                    New Class Scheduled
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    Your class &quot;Business Presentation Skills&quot; is confirmed for Friday
                  </p>
                  <p className="mt-2 text-xs font-semibold text-gray-500">
                    5 hours ago
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
