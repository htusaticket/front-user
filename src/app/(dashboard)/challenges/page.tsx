"use client";

import { motion } from "framer-motion";
import { AlertCircle, RefreshCw, History, Trophy } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { ChallengeCard, QuizResults, HistoryCard } from "@/components/challenges";
import { ChallengeSkeleton, ConfettiEffect } from "@/components/ui";
import { useChallengesStore } from "@/store/challenges";
import { isQuizChallenge } from "@/types/challenges";

export default function ChallengesPage() {
  const {
    dailyChallenge,
    isLoadingDaily,
    quizAnswers,
    quizResult,
    isSubmittingQuiz,
    isSubmittingAudio,
    history,
    isLoadingHistory,
    error,
    fetchDailyChallenge,
    setQuizAnswer,
    submitQuiz,
    resetQuiz,
    clearQuizResult,
    submitAudio,
    fetchHistory,
    clearError,
  } = useChallengesStore();

  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    fetchDailyChallenge();
    fetchHistory();
  }, [fetchDailyChallenge, fetchHistory]);

  const handleQuizSubmit = async () => {
    if (!dailyChallenge) return;
    
    try {
      const result = await submitQuiz(dailyChallenge.id);
      if (result.passed) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
      toast.success(result.message);
    } catch {
      toast.error("Failed to submit quiz");
    }
  };

  const handleAudioSubmit = async (blob: Blob) => {
    if (!dailyChallenge) return;
    
    try {
      await submitAudio(dailyChallenge.id, blob);
      toast.success("Audio submitted successfully! Waiting for teacher review.");
      // Refresh history
      fetchHistory();
    } catch {
      toast.error("Failed to submit audio");
    }
  };

  const handleRetryQuiz = () => {
    resetQuiz();
  };

  // Loading state
  if (isLoadingDaily && !dailyChallenge) {
    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-brand-primary">
              Daily Challenges
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Practice and improve your English with personalized challenges
            </p>
          </div>
          <Link
            href="/challenges/history"
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-brand-primary transition-all hover:border-gray-300 hover:bg-gray-50"
          >
            <History className="h-4 w-4" />
            View History
          </Link>
        </div>

        {/* Challenge Skeleton */}
        <ChallengeSkeleton />
      </div>
    );
  }

  // Error state
  if (error && !dailyChallenge) {
    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-brand-primary">
              Daily Challenges
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Practice and improve your English with personalized challenges
            </p>
          </div>
          <Link
            href="/challenges/history"
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-brand-primary transition-all hover:border-gray-300 hover:bg-gray-50"
          >
            <History className="h-4 w-4" />
            View History
          </Link>
        </div>

        {/* Error Message */}
        <div className="flex flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50 p-12">
          <AlertCircle className="mb-4 h-12 w-12 text-red-500" />
          <h3 className="mb-2 font-display text-xl font-bold text-red-800">
            Failed to load challenge
          </h3>
          <p className="mb-6 text-center text-red-600">{error}</p>
          <button
            onClick={() => {
              clearError();
              fetchDailyChallenge();
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

  return (
    <div className="space-y-8">
      {/* Confetti Effect */}
      <ConfettiEffect trigger={showConfetti} type="celebration" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-brand-primary">
            Daily Challenges
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Practice and improve your English with personalized challenges
          </p>
        </div>
        <Link
          href="/challenges/history"
          className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-brand-primary transition-all hover:border-gray-300 hover:bg-gray-50"
        >
          <History className="h-4 w-4" />
          View History
        </Link>
      </div>

      {/* Today's Challenge */}
      <div className="space-y-6">
        {dailyChallenge ? (
          <>
            {/* Show quiz results if available */}
            {quizResult && isQuizChallenge(dailyChallenge) ? (
              <QuizResults 
                result={quizResult} 
                onRetry={handleRetryQuiz} 
                onDismiss={clearQuizResult}
              />
            ) : (
              <ChallengeCard
                challenge={dailyChallenge}
                quizAnswers={quizAnswers}
                onQuizAnswer={setQuizAnswer}
                onSubmitQuiz={handleQuizSubmit}
                isSubmittingQuiz={isSubmittingQuiz}
                onSubmitAudio={handleAudioSubmit}
                isSubmittingAudio={isSubmittingAudio}
              />
            )}
          </>
        ) : (
          /* No challenge available */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-12 text-center"
          >
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-cyan-dark/10">
              <Trophy className="h-8 w-8 text-brand-cyan-dark" />
            </div>
            <h3 className="mb-2 font-display text-xl font-bold text-brand-primary">
              No challenge available today
            </h3>
            <p className="text-gray-600">
              Check back tomorrow for a new challenge!
            </p>
          </motion.div>
        )}
      </div>

      {/* Past Challenges (Recent) */}
      {history.length > 0 && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl font-bold text-brand-primary">
              Recent Submissions
            </h2>
            <Link
              href="/challenges/history"
              className="text-sm font-medium text-brand-cyan-dark hover:underline"
            >
              View all →
            </Link>
          </div>
          <div className="space-y-4">
            {history.slice(0, 3).map((item, index) => (
              <HistoryCard key={item.id} item={item} index={index} />
            ))}
          </div>
        </div>
      )}

      {/* Loading history skeleton */}
      {isLoadingHistory && history.length === 0 && (
        <div>
          <h2 className="mb-4 font-display text-xl font-bold text-brand-primary">
            Recent Submissions
          </h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-40 animate-pulse rounded-2xl bg-gray-100"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
