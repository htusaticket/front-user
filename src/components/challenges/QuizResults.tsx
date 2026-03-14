"use client";

import { motion } from "framer-motion";
import { CheckCircle, XCircle, Trophy, RefreshCw, Star } from "lucide-react";

import { ConfettiEffect } from "@/components/ui";
import type { QuizResult, QuizQuestion as QuizQuestionType } from "@/types/challenges";

import { QuizQuestion } from "./QuizQuestion";

interface QuizResultsProps {
  result: QuizResult;
  questions?: QuizQuestionType[];
  userAnswers?: Map<number, number>;
  onRetry?: () => void;
  onDismiss?: () => void;
}

function getScoreColor(score: number): string {
  if (score >= 100) return "#22c55e"; // green-500 
  if (score >= 70) return "#22c55e";  // green-500
  if (score >= 36) return "#f97316";  // orange-500
  return "#ef4444";                   // red-500
}

function CircularProgress({ score }: { score: number }) {
  const size = 140;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = getScoreColor(score);
  const isPerfect = score >= 100;

  return (
    <div className="relative mx-auto mb-6 flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#f3f4f6"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
        />
      </svg>
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {isPerfect ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1, type: "spring", stiffness: 200 }}
          >
            <Star className="h-10 w-10 fill-yellow-400 text-yellow-400" />
          </motion.div>
        ) : (
          <span className="font-display text-3xl font-bold" style={{ color }}>
            {score}%
          </span>
        )}
      </div>
    </div>
  );
}

export function QuizResults({ result, questions, userAnswers, onRetry: _onRetry, onDismiss }: QuizResultsProps) {
  const isPassed = result.passed;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm"
    >
      {/* Confetti for passing or perfect score */}
      <ConfettiEffect trigger={isPassed || result.score >= 100} type="celebration" />

      {/* Result Header */}
      <div className="text-center">
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

        {/* Circular Progress Ring */}
        <CircularProgress score={result.score} />

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
      </div>

      {/* Show Questions with Correct Answers */}
      {questions && questions.length > 0 && result.correctOptions && (
        <div className="mb-6 border-t border-gray-200 pt-6">
          <h3 className="mb-4 text-center font-display text-lg font-bold text-brand-primary">
            Review Your Answers
          </h3>
          <div className="space-y-4">
            {questions.map((question, index) => (
              <QuizQuestion
                key={question.id}
                question={question}
                questionNumber={index + 1}
                selectedOption={userAnswers?.get(question.id)}
                showResult={true}
                correctOption={result.correctOptions[index]}
                disabled={true}
              />
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
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
