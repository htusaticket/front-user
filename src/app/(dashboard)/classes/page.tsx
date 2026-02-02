"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  Users,
  Video,
  AlertCircle,
  CheckCircle,
  Sparkles,
  Infinity as InfinityIcon,
  LayoutGrid,
  CalendarDays,
} from "lucide-react";
import { useState } from "react";

// Mock data
type ClassType = "regular" | "workshop";

interface ClassSession {
  id: number;
  title: string;
  type: ClassType;
  day: string;
  date: string;
  time: string;
  capacity: { current: number; max: number | null }; // null max means unlimited
  isEnrolled: boolean;
  meetLink?: string;
  isFull?: boolean;
  description?: string;
}

const upcomingClasses: ClassSession[] = [
  {
    id: 1,
    title: "Conversational Advanced II",
    type: "regular",
    day: "Today",
    date: "Jan 29",
    time: "18:00 - 19:00",
    capacity: { current: 3, max: 5 },
    isEnrolled: true,
    meetLink: "https://meet.google.com/xxx",
    description: "Advanced conversation practice focusing on current events.",
  },
  {
    id: 2,
    title: "Grammar Review Session",
    type: "regular",
    day: "Tomorrow",
    date: "Jan 30",
    time: "17:00 - 18:00",
    capacity: { current: 5, max: 5 },
    isEnrolled: false,
    isFull: true,
    description: "Deep dive into complex grammar structures and common mistakes.",
  },
  {
    id: 3,
    title: "Business English Masterclass",
    type: "workshop",
    day: "Friday",
    date: "Jan 31",
    time: "19:00 - 20:30",
    capacity: { current: 12, max: null },
    isEnrolled: false,
    description: "Open workshop on professional communication skills.",
  },
  {
    id: 4,
    title: "Pronunciation Workshop",
    type: "workshop",
    day: "Saturday",
    date: "Feb 01",
    time: "10:00 - 11:30",
    capacity: { current: 45, max: null },
    isEnrolled: false,
    description: "Interactive session to master difficult phonemes and intonation.",
  },
  {
    id: 5,
    title: "Debate Club: A.I. Ethics",
    type: "regular",
    day: "Saturday",
    date: "Feb 01",
    time: "14:00 - 15:30",
    capacity: { current: 4, max: 8 },
    isEnrolled: false,
    description: "Structured debate practice. Topic: Artificial Intelligence Ethics.",
  },
  {
    id: 6,
    title: "IELTS Prep: Writing Task 2",
    type: "regular",
    day: "Monday",
    date: "Feb 03",
    time: "18:00 - 19:00",
    capacity: { current: 2, max: 6 },
    isEnrolled: false,
    description: "Focused strategy session for the IELTS writing component.",
  },
  {
    id: 7,
    title: "Casual Coffee Chat",
    type: "regular",
    day: "Tuesday",
    date: "Feb 04",
    time: "09:00 - 10:00",
    capacity: { current: 3, max: 5 },
    isEnrolled: false,
    description: "Informal conversation practice over morning coffee.",
  },
  {
    id: 8,
    title: "Tech Vocabulary Workshop",
    type: "workshop",
    day: "Wednesday",
    date: "Feb 05",
    time: "20:00 - 21:30",
    capacity: { current: 28, max: null },
    isEnrolled: false,
    description: "Learn essential terminology for the technology sector.",
  },
];

export default function ClassesPage() {
  const [activeTab, setActiveTab] = useState<"available" | "booked">("available");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState<ClassSession | null>(null);

  const handleCancelClick = (classItem: ClassSession) => {
    setSelectedClass(classItem);
    setShowCancelModal(true);
  };

  const handleEnroll = (_classId: number) => {
    // Implement enrollment logic
  };

  const isClassStartingSoon = (timeString: string) => {
    // Simulation: today's class at 18:00
    return timeString.includes("18:00");
  };

  const bookedClasses = upcomingClasses.filter((c) => c.isEnrolled);
  const availableClasses = upcomingClasses.filter((c) => !c.isEnrolled);

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-brand-primary sm:text-3xl">
          Live Classes & Workshops
        </h1>
        <p className="mt-2 text-base text-gray-600 sm:text-lg">
          Join interactive sessions to accelerate your learning
        </p>
      </div>

      {/* Tabs */}
      <div className="flex w-full border-b border-gray-200">
        <button
          onClick={() => setActiveTab("available")}
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
          onClick={() => setActiveTab("booked")}
          className={`relative flex items-center gap-2 border-b-2 px-6 py-4 text-sm font-bold transition-all ${
            activeTab === "booked"
              ? "border-brand-primary text-brand-primary"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <CalendarDays className="h-4 w-4" />
          My Schedule
          {bookedClasses.length > 0 && (
            <span className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand-cyan-dark text-[10px] text-white">
              {bookedClasses.length}
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

                {bookedClasses.length > 0 ? (
                  <div className="space-y-4">
                    {bookedClasses.map((classItem) => (
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
                                {classItem.description}
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
                              {isClassStartingSoon(classItem.time) ? (
                                <motion.a
                                  href={classItem.meetLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  className="flex items-center justify-center gap-2 rounded-xl bg-brand-cyan-dark px-6 py-3 text-sm font-bold text-white shadow-lg shadow-brand-cyan-dark/30 transition-all hover:bg-brand-cyan"
                                >
                                  <Video className="h-4 w-4" />
                                  Join Class
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
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
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
                    Available Sessions
                  </h2>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {availableClasses.map((classItem) => {
                    const isUnlimited = classItem.capacity.max === null;
                    const isWorkshop = classItem.type === "workshop";

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
                              {isWorkshop && (
                                <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-brand-primary/5 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-brand-primary ring-1 ring-inset ring-brand-primary/10">
                                  <Sparkles className="h-3 w-3" />
                                  Workshop
                                </span>
                              )}
                              {!isWorkshop && (
                                <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-blue-600 ring-1 ring-inset ring-blue-100">
                                  <Users className="h-3 w-3" />
                                  Class
                                </span>
                              )}

                              <h3 className="font-display text-lg font-bold leading-tight text-brand-primary">
                                {classItem.title}
                              </h3>
                            </div>
                          </div>
                          <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                            {classItem.description ||
                              "Join this interactive session tailored for your level."}
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

                            <div className="flex items-center gap-3 text-sm">
                              {isUnlimited ? (
                                <>
                                  <InfinityIcon className="h-4 w-4 text-brand-primary" />
                                  <span className="font-medium text-brand-primary">
                                    Unlimited Spots
                                  </span>
                                </>
                              ) : (
                                <>
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
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Card Action */}
                        <div className="p-5 pt-0">
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
                                : isWorkshop
                                  ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20 hover:bg-brand-primary/90 hover:shadow-brand-primary/30"
                                  : "bg-brand-primary text-white shadow-lg shadow-brand-primary/20 hover:bg-brand-primary/90"
                            }`}
                          >
                            {classItem.isFull
                              ? "Full"
                              : isWorkshop
                                ? "Join Workshop"
                                : "Book Class"}
                          </motion.button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && selectedClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            <div className="bg-red-50 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                </div>
                <h3 className="font-display text-lg font-bold text-red-900">
                  Confirm Cancellation
                </h3>
              </div>
            </div>
            <div className="p-6">
              <p className="text-sm font-medium text-gray-900">
                Are you sure you want to cancel the class &quot;
                {selectedClass.title}&quot;?
              </p>
              <div className="mt-4 rounded-xl border-2 border-amber-200 bg-amber-50 p-4">
                <p className="text-sm font-bold text-amber-900">
                  ⚠️ Warning: Penalty
                </p>
                <p className="mt-1 text-xs text-amber-800">
                  Less than 24 hours remain before the class. By canceling,
                  you will receive <strong>1 Strike</strong> on your account. Strikes
                  may affect your system access.
                </p>
              </div>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <motion.button
                  onClick={() => setShowCancelModal(false)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm font-bold text-gray-700 transition-all hover:bg-gray-50"
                >
                  No, Keep Reservation
                </motion.button>
                <motion.button
                  onClick={() => {
                    setShowCancelModal(false);
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white transition-all hover:bg-red-700"
                >
                  Yes, Cancel Class
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
