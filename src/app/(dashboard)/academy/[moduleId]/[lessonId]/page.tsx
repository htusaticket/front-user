"use client";

import { motion } from "framer-motion";
import { CheckCircle, ChevronRight, AlertCircle, RefreshCw, Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";

import {
  MultiVideoPlayer,
  ResourcesList,
  LessonContent,
  AcademySidebar,
} from "@/components/academy";
import { LessonSkeleton, ConfettiEffect } from "@/components/ui";
import { useAcademyStore } from "@/store/academy";

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const moduleId = Number(params.moduleId);
  const lessonId = Number(params.lessonId);

  const {
    overview,
    currentLesson,
    isLoadingLesson,
    isLoadingOverview,
    isTogglingComplete,
    error,
    fetchOverview,
    fetchLesson,
    toggleLessonComplete,
    clearError,
  } = useAcademyStore();

  const [showConfetti, setShowConfetti] = useState(false);

  // Fetch overview for sidebar if not loaded
  useEffect(() => {
    if (!overview) {
      fetchOverview();
    }
  }, [overview, fetchOverview]);

  // Fetch lesson when lessonId changes
  useEffect(() => {
    if (lessonId) {
      fetchLesson(lessonId);
    }
  }, [lessonId, fetchLesson]);

  // Handle lesson selection from sidebar (SPA navigation)
  const handleLessonSelect = useCallback((newModuleId: number, newLessonId: number) => {
    // Update URL without full page reload
    router.push(`/academy/${newModuleId}/${newLessonId}`, { scroll: false });
  }, [router]);

  const handleToggleComplete = async () => {
    try {
      const result = await toggleLessonComplete(lessonId);
      
      if (result.completed) {
        setShowConfetti(true);
        toast.success("Lesson marked as completed! 🎉");
        setTimeout(() => setShowConfetti(false), 3000);
      } else {
        toast.info("Lesson marked as not completed");
      }
    } catch {
      toast.error("Failed to update lesson status");
    }
  };

  // Loading state
  if (isLoadingLesson && !currentLesson) {
    return <LessonSkeleton />;
  }

  // Error state
  if (error && !currentLesson) {
    return (
      <div className="space-y-6">
        {/* Breadcrumb placeholder */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Link href="/academy" className="font-semibold text-brand-cyan-dark hover:underline">
            Academy
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-400">Loading...</span>
        </div>

        {/* Error Message */}
        <div className="flex flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50 p-12">
          <AlertCircle className="mb-4 h-12 w-12 text-red-500" />
          <h3 className="mb-2 font-display text-xl font-bold text-red-800">
            Failed to load lesson
          </h3>
          <p className="mb-6 text-center text-red-600">{error}</p>
          <button
            onClick={() => {
              clearError();
              fetchLesson(lessonId);
            }}
            className="flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-red-700"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Not found state
  if (!currentLesson) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Link href="/academy" className="font-semibold text-brand-cyan-dark hover:underline">
            Academy
          </Link>
        </div>

        <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-12">
          <AlertCircle className="mb-4 h-12 w-12 text-gray-400" />
          <h3 className="mb-2 font-display text-xl font-bold text-brand-primary">
            Lesson not found
          </h3>
          <p className="mb-6 text-center text-gray-600">
            The lesson you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            href="/academy"
            className="flex items-center gap-2 rounded-xl bg-brand-cyan-dark px-6 py-3 text-sm font-bold text-white transition-all hover:bg-brand-cyan"
          >
            Back to Academy
          </Link>
        </div>
      </div>
    );
  }

  // Get the current module from overview
  const currentModule = overview?.modules.find(m => m.id === moduleId);

  return (
    <div className="flex gap-6">
      {/* Sidebar - Only show current module */}
      {currentModule && !isLoadingOverview && (
        <AcademySidebar
          module={currentModule}
          currentLessonId={lessonId}
          onLessonSelect={handleLessonSelect}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 min-w-0 space-y-6">
        {/* Confetti Effect */}
        <ConfettiEffect trigger={showConfetti} type="celebration" />

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Link
            href="/academy"
            className="font-semibold text-brand-cyan-dark hover:underline"
          >
            Academy
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-900">{currentLesson.module.title}</span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-900">{currentLesson.title}</span>
        </div>

        {/* Video Player Section */}
        <motion.div
          key={currentLesson.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
        >
          <MultiVideoPlayer 
            mainVideoUrl={currentLesson.contentUrl} 
            mainVideoTitle={currentLesson.title}
            additionalVideos={currentLesson.resources}
          />
          
          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <h1 className="font-display text-xl sm:text-2xl font-bold text-brand-primary">
                  {currentLesson.title}
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                  {currentLesson.module.title} • {currentLesson.duration}
                </p>
              </div>
              <button
                onClick={handleToggleComplete}
                disabled={isTogglingComplete}
                className={`flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold transition-all ${
                  currentLesson.completed
                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                    : "bg-brand-cyan-dark text-white shadow-lg shadow-brand-cyan-dark/20 hover:bg-brand-cyan"
                } ${isTogglingComplete ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                {isTogglingComplete ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4" />
                )}
                {currentLesson.completed ? "Completed" : "Mark as Viewed"}
              </button>
            </div>

            {/* Description */}
            {currentLesson.description && (
              <div className="mt-6">
                <h2 className="font-display text-lg font-bold text-brand-primary">
                  Description
                </h2>
                <LessonContent content={currentLesson.description} className="mt-2" />
              </div>
            )}
          </div>
        </motion.div>

        {/* Resources */}
        {currentLesson.resources && currentLesson.resources.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <ResourcesList resources={currentLesson.resources} />
          </motion.div>
        )}
      </div>
    </div>
  );
}
