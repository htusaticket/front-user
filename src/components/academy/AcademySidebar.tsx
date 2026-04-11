"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  PlayCircle,
  CheckCircle,
  BookOpen,
  X,
  Menu,
} from "lucide-react";
import Link from "next/link";
import { useState, useCallback } from "react";

import type { ModuleWithProgress, LessonSummary } from "@/types/academy";

interface AcademySidebarProps {
  module: ModuleWithProgress;
  currentLessonId: number;
  onLessonSelect: (moduleId: number, lessonId: number) => void;
}

// Sidebar Content Component - extracted outside to avoid creating during render
interface SidebarContentProps {
  module: ModuleWithProgress;
  currentLessonId: number;
  onLessonClick: (lessonId: number) => void;
  onClose: () => void;
}

function SidebarContent({
  module,
  currentLessonId,
  onLessonClick,
  onClose,
}: SidebarContentProps) {
  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/academy"
            className="flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-brand-cyan-dark"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Academy
          </Link>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Module Info */}
        <div className="mt-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-brand-cyan-dark" />
            <h2 className="line-clamp-1 font-display font-bold text-brand-primary">
              {module.title}
            </h2>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            {module.completedLessons} of {module.totalLessons} lessons completed
          </p>
          {/* Progress Bar */}
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-200">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                module.progress === 100
                  ? "bg-green-500"
                  : "bg-gradient-to-r from-brand-cyan-dark to-brand-cyan"
              }`}
              style={{ width: `${module.progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Lessons List */}
      <div className="flex-1 overflow-y-auto p-3">
        <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
          Lessons
        </p>
        <div className="space-y-1">
          {module.lessons.map((lesson, index) => (
            <LessonItem
              key={lesson.id}
              lesson={lesson}
              index={index + 1}
              isActive={lesson.id === currentLessonId}
              onSelect={() => onLessonClick(lesson.id)}
            />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 p-4">
        <div className="text-center text-xs text-gray-500">
          {module.progress === 100 ? (
            <span className="flex items-center justify-center gap-1 text-sm font-bold text-green-600">
              <CheckCircle className="h-5 w-5" />
              Module Completed!
            </span>
          ) : (
            <span>Keep learning to complete this module</span>
          )}
        </div>
      </div>
    </div>
  );
}

export function AcademySidebar({
  module,
  currentLessonId,
  onLessonSelect,
}: AcademySidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLessonClick = useCallback(
    (lessonId: number) => {
      onLessonSelect(module.id, lessonId);
      setIsMobileOpen(false);
    },
    [module.id, onLessonSelect],
  );

  const handleClose = useCallback(() => {
    setIsMobileOpen(false);
  }, []);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="fixed bottom-4 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-brand-cyan-dark text-white shadow-lg shadow-brand-cyan-dark/30 transition-transform hover:scale-105 lg:hidden"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 z-50 h-full w-80 bg-white shadow-2xl lg:hidden"
          >
            <SidebarContent
              module={module}
              currentLessonId={currentLessonId}
              onLessonClick={handleLessonClick}
              onClose={handleClose}
            />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block lg:w-72 lg:shrink-0">
        <div className="sticky top-20 h-[calc(100vh-6rem)] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <SidebarContent
            module={module}
            currentLessonId={currentLessonId}
            onLessonClick={handleLessonClick}
            onClose={handleClose}
          />
        </div>
      </aside>
    </>
  );
}

// Lesson Item Component
interface LessonItemProps {
  lesson: LessonSummary;
  index: number;
  isActive: boolean;
  onSelect: () => void;
}

function LessonItem({ lesson, index, isActive, onSelect }: LessonItemProps) {
  return (
    <button
      onClick={onSelect}
      className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition-all ${
        isActive
          ? "bg-brand-cyan-dark text-white shadow-md"
          : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
          isActive
            ? "bg-white/20 text-white"
            : lesson.completed
              ? "bg-green-100 text-green-600"
              : "bg-gray-200 text-gray-500"
        }`}
      >
        {lesson.completed && !isActive ? (
          <CheckCircle className="h-5 w-5" />
        ) : (
          index
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium line-clamp-2 ${
          isActive ? "text-white" : ""
        }`}>
          {lesson.title}
        </p>
        <p className={`text-xs mt-0.5 ${
          isActive ? "text-white/70" : "text-gray-500"
        }`}>
          {lesson.duration ? `${lesson.duration} min` : ""}
        </p>
      </div>
      {isActive && (
        <PlayCircle className="h-5 w-5 shrink-0 text-white/80" />
      )}
    </button>
  );
}
