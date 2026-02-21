"use client";

import { motion } from "framer-motion";
import { ArrowLeft, AlertCircle, RefreshCw, Inbox } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { HistoryCard, QuizDetailModal } from "@/components/challenges";
import { Skeleton } from "@/components/ui";
import { useChallengesStore } from "@/store/challenges";

export default function ChallengesHistoryPage() {
  const {
    history,
    isLoadingHistory,
    error,
    fetchHistory,
    clearError,
    quizDetail,
    isLoadingQuizDetail,
    fetchQuizDetail,
    clearQuizDetail,
  } = useChallengesStore();

  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleViewQuizDetail = async (progressId: string) => {
    setIsQuizModalOpen(true);
    await fetchQuizDetail(progressId);
  };

  const handleCloseQuizModal = () => {
    setIsQuizModalOpen(false);
    clearQuizDetail();
  };

  // Loading state
  if (isLoadingHistory && history.length === 0) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            href="/challenges"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition-all hover:border-gray-300 hover:bg-gray-50"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="font-display text-2xl font-bold text-brand-primary sm:text-3xl">
              Challenge History
            </h1>
            <p className="mt-1 text-base text-gray-600">
              View all your past submissions and teacher feedback
            </p>
          </div>
        </div>

        {/* Loading Skeletons */}
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <Skeleton className="h-12 w-full" />
              <div className="p-6">
                <div className="mb-4 flex items-start gap-3">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <div className="flex-1">
                    <Skeleton className="mb-2 h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                </div>
                <Skeleton className="h-20 w-full rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            href="/challenges"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition-all hover:border-gray-300 hover:bg-gray-50"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="font-display text-2xl font-bold text-brand-primary sm:text-3xl">
              Challenge History
            </h1>
            <p className="mt-1 text-base text-gray-600">
              View all your past submissions and teacher feedback
            </p>
          </div>
        </div>

        {/* Error Message */}
        <div className="flex flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50 p-12">
          <AlertCircle className="mb-4 h-12 w-12 text-red-500" />
          <h3 className="mb-2 font-display text-xl font-bold text-red-800">
            Failed to load history
          </h3>
          <p className="mb-6 text-center text-red-600">{error}</p>
          <button
            onClick={() => {
              clearError();
              fetchHistory();
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

  // Empty state
  if (history.length === 0) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            href="/challenges"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition-all hover:border-gray-300 hover:bg-gray-50"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="font-display text-2xl font-bold text-brand-primary sm:text-3xl">
              Challenge History
            </h1>
            <p className="mt-1 text-base text-gray-600">
              View all your past submissions and teacher feedback
            </p>
          </div>
        </div>

        {/* Empty State */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-12 text-center"
        >
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <Inbox className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="mb-2 font-display text-xl font-bold text-brand-primary">
            No submissions yet
          </h3>
          <p className="mb-6 text-gray-600">
            Complete your first challenge to see your history here.
          </p>
          <Link
            href="/challenges"
            className="flex items-center gap-2 rounded-xl bg-brand-cyan-dark px-6 py-3 text-sm font-bold text-white transition-all hover:bg-brand-cyan"
          >
            Go to Challenges
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/challenges"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition-all hover:border-gray-300 hover:bg-gray-50"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="font-display text-2xl font-bold text-brand-primary sm:text-3xl">
            Challenge History
          </h1>
          <p className="mt-1 text-base text-gray-600">
            View all your past submissions and teacher feedback
          </p>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-sm font-medium text-gray-500">Total Submissions</p>
          <p className="mt-1 text-2xl font-bold text-brand-primary">{history.length}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-sm font-medium text-gray-500">Approved</p>
          <p className="mt-1 text-2xl font-bold text-green-600">
            {history.filter((h) => h.status === "APPROVED").length}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-sm font-medium text-gray-500">Pending Review</p>
          <p className="mt-1 text-2xl font-bold text-yellow-600">
            {history.filter((h) => h.status === "PENDING").length}
          </p>
        </div>
      </div>

      {/* History List */}
      <div className="space-y-4">
        {history.map((item, index) => (
          <HistoryCard 
            key={item.id} 
            item={item} 
            index={index}
            onViewQuizDetail={handleViewQuizDetail}
          />
        ))}
      </div>

      {/* Quiz Detail Modal */}
      <QuizDetailModal
        isOpen={isQuizModalOpen}
        onClose={handleCloseQuizModal}
        quizDetail={quizDetail}
        isLoading={isLoadingQuizDetail}
      />
    </div>
  );
}
