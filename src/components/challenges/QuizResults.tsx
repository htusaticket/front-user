"use client";

import { motion } from "framer-motion";
import { CheckCircle, XCircle, Trophy, RefreshCw } from "lucide-react";

import { CircularProgress, ConfettiEffect } from "@/components/ui";
import type { QuizResult } from "@/types/challenges";

interface QuizResultsProps {
  result: QuizResult;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export function QuizResults({ result, onRetry, onDismiss }: QuizResultsProps) {
  const isPassed = result.passed;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm"
    >
      {/* Confetti for passing */}
      <ConfettiEffect trigger={isPassed} type="celebration" />

      {/* Result Icon */}
      <div className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full ${
        isPassed ? "bg-green-100" : "bg-orange-100"
      }`}>
        {isPassed ? (
          <Trophy className="h-10 w-10 text-green-600" />
        ) : (
          <RefreshCw className="h-10 w-10 text-orange-600" />
        )}
      </div>

      {/* Title */}
      <h2 className="mb-2 font-display text-2xl font-bold text-brand-primary">
        {isPassed ? "Congratulations!" : "Keep Practicing!"}
      </h2>

      {/* Score Circle */}
      <div className="mx-auto mb-6">
        <CircularProgress
          value={result.score}
          size={140}
          strokeWidth={10}
          color={isPassed ? "text-green-500" : "text-orange-500"}
        />
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4">
        <div className="rounded-xl bg-gray-50 p-4">
          <div className="flex items-center justify-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="text-2xl font-bold text-green-600">{result.correctAnswers}</span>
          </div>
          <p className="mt-1 text-sm text-gray-500">Correct</p>
        </div>
        <div className="rounded-xl bg-gray-50 p-4">
          <div className="flex items-center justify-center gap-2">
            <XCircle className="h-5 w-5 text-red-500" />
            <span className="text-2xl font-bold text-red-600">
              {result.totalQuestions - result.correctAnswers}
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-500">Incorrect</p>
        </div>
      </div>

      {/* Message */}
      <p className="mb-6 text-gray-600">{result.message}</p>

      {/* Status Badge */}
      <div className={`mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${
        isPassed
          ? "bg-green-100 text-green-800"
          : "bg-orange-100 text-orange-800"
      }`}>
        {isPassed ? (
          <>
            <CheckCircle className="h-4 w-4" />
            Approved
          </>
        ) : (
          <>
            <RefreshCw className="h-4 w-4" />
            Needs Improvement
          </>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        {!isPassed && onRetry && (
          <motion.button
            onClick={onRetry}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center gap-2 rounded-xl bg-brand-cyan-dark px-6 py-3 text-sm font-bold text-white shadow-lg shadow-brand-cyan-dark/20 transition-all hover:bg-brand-cyan"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </motion.button>
        )}
        <motion.button
          onClick={onDismiss}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center justify-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-6 py-3 text-sm font-bold text-brand-primary transition-all hover:border-gray-300 hover:bg-gray-50"
        >
          Back to Challenges
        </motion.button>
      </div>
    </motion.div>
  );
}
