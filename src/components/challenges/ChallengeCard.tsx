"use client";

import { motion } from "framer-motion";
import { Trophy, Clock, CheckCircle, Send, Loader2 } from "lucide-react";

import { StatusBadge } from "@/components/ui";
import { isQuizChallenge, type Challenge, type QuizChallenge } from "@/types/challenges";

import { AudioRecorder } from "./AudioRecorder";
import { QuizQuestion } from "./QuizQuestion";

interface ChallengeCardProps {
  challenge: Challenge;
  // Quiz props
  quizAnswers?: Map<number, number>;
  onQuizAnswer?: (questionId: number, optionIndex: number) => void;
  onSubmitQuiz?: () => void;
  isSubmittingQuiz?: boolean;
  // Audio props
  onSubmitAudio?: (blob: Blob) => void;
  isSubmittingAudio?: boolean;
}

export function ChallengeCard({
  challenge,
  quizAnswers = new Map(),
  onQuizAnswer,
  onSubmitQuiz,
  isSubmittingQuiz = false,
  onSubmitAudio,
  isSubmittingAudio = false,
}: ChallengeCardProps) {
  const isQuiz = isQuizChallenge(challenge);
  const isAudio = challenge.type === "AUDIO";
  const isSubmitted = challenge.status !== "pending";
  const isCompleted = challenge.status === "approved" || challenge.status === "needs_improvement";

  // Calculate deadline display
  const deadline = new Date(challenge.deadline);
  const now = new Date();
  const isOverdue = deadline < now;
  const deadlineText = isOverdue
    ? "Overdue"
    : deadline.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });

  // Check if all quiz questions are answered
  const allQuestionsAnswered = isQuiz
    ? (challenge as QuizChallenge).questions.every((q) => quizAnswers.has(q.id))
    : true;

  // Show completed state for reviewed challenges (quiz)
  if (isQuiz && isCompleted) {
    const isApproved = challenge.status === "approved";
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`overflow-hidden rounded-2xl border-2 bg-white shadow-sm ${
          isApproved ? "border-green-200" : "border-orange-200"
        }`}
      >
        <div className={`px-6 py-4 ${isApproved ? "bg-green-50" : "bg-orange-50"}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className={`h-5 w-5 ${isApproved ? "text-green-700" : "text-orange-700"}`} />
              <span className={`text-sm font-bold uppercase tracking-wider ${
                isApproved ? "text-green-900" : "text-orange-900"
              }`}>
                Quiz Completed
              </span>
            </div>
            <StatusBadge status={isApproved ? "APPROVED" : "NEEDS_IMPROVEMENT"} />
          </div>
        </div>
        <div className="p-6 text-center">
          <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${
            isApproved ? "bg-green-100" : "bg-orange-100"
          }`}>
            {isApproved ? (
              <CheckCircle className="h-8 w-8 text-green-600" />
            ) : (
              <Trophy className="h-8 w-8 text-orange-600" />
            )}
          </div>
          <h3 className="font-display text-xl font-bold text-brand-primary">
            {challenge.title}
          </h3>
          <p className="mt-2 text-gray-600">
            {isApproved 
              ? "Great job! You passed this quiz challenge." 
              : "Challenge completed. Check back tomorrow for a new challenge!"}
          </p>
        </div>
      </motion.div>
    );
  }

  // Show completed state for reviewed audio challenges
  if (isAudio && isCompleted) {
    const isApproved = challenge.status === "approved";
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`overflow-hidden rounded-2xl border-2 bg-white shadow-sm ${
          isApproved ? "border-green-200" : "border-orange-200"
        }`}
      >
        <div className={`px-6 py-4 ${isApproved ? "bg-green-50" : "bg-orange-50"}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className={`h-5 w-5 ${isApproved ? "text-green-700" : "text-orange-700"}`} />
              <span className={`text-sm font-bold uppercase tracking-wider ${
                isApproved ? "text-green-900" : "text-orange-900"
              }`}>
                Speaking Challenge Reviewed
              </span>
            </div>
            <StatusBadge status={isApproved ? "APPROVED" : "NEEDS_IMPROVEMENT"} />
          </div>
        </div>
        <div className="p-6 text-center">
          <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${
            isApproved ? "bg-green-100" : "bg-orange-100"
          }`}>
            {isApproved ? (
              <CheckCircle className="h-8 w-8 text-green-600" />
            ) : (
              <Trophy className="h-8 w-8 text-orange-600" />
            )}
          </div>
          <h3 className="font-display text-xl font-bold text-brand-primary">
            {challenge.title}
          </h3>
          <p className="mt-2 text-gray-600">
            {isApproved 
              ? "Great job! Your speaking challenge has been approved." 
              : "Your teacher has reviewed your recording. Keep practicing!"}
          </p>
        </div>
      </motion.div>
    );
  }

  if (isSubmitted && !isCompleted) {
    // Submitted state - waiting for review
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="overflow-hidden rounded-2xl border-2 border-green-200 bg-white shadow-sm"
      >
        <div className="bg-green-50 px-6 py-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-sm font-bold uppercase tracking-wider text-green-900">
              Challenge Submitted
            </span>
          </div>
        </div>
        <div className="p-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="font-display text-xl font-bold text-brand-primary">
            Great work!
          </h3>
          <p className="mt-2 text-gray-600">
            Your challenge has been submitted successfully. You will receive
            feedback from your teacher within the next 24-48 hours.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
    >
      {/* Header */}
      <div className="bg-brand-cyan-dark px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-white" />
            <span className="text-sm font-bold uppercase tracking-wider text-white">
              {isQuiz ? "Quiz Challenge" : "Speaking Challenge"}
            </span>
          </div>
          {challenge.status !== "pending" && (
            <StatusBadge status={challenge.status} />
          )}
        </div>
      </div>

      <div className="p-6">
        {/* Title & Deadline */}
        <div className="mb-6">
          <h2 className="font-display text-2xl font-bold text-brand-primary">
            {challenge.title}
          </h2>
          <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
            <Clock className={`h-4 w-4 ${isOverdue ? "text-red-500" : "text-amber-500"}`} />
            <span className={isOverdue ? "text-red-600 font-medium" : ""}>
              Due: {deadlineText}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="rounded-full bg-brand-cyan-dark/10 px-2 py-0.5 text-xs font-bold text-brand-cyan-dark">
              {challenge.points} points
            </span>
          </div>
        </div>

        {/* Instructions */}
        <div className="mb-6 rounded-xl bg-blue-50 p-4">
          <h3 className="mb-2 font-bold text-blue-900">Instructions:</h3>
          <p className="text-sm text-blue-800">{challenge.instructions}</p>
        </div>

        {/* Challenge Content */}
        {isAudio ? (
          <div className="rounded-xl border-2 border-gray-200 bg-gray-50 p-6">
            {isSubmittingAudio ? (
              <div className="flex flex-col items-center py-8">
                <Loader2 className="h-12 w-12 animate-spin text-brand-cyan-dark" />
                <p className="mt-4 text-sm font-medium text-gray-600">
                  Uploading your recording...
                </p>
              </div>
            ) : (
              <AudioRecorder
                onRecordingComplete={(blob) => onSubmitAudio?.(blob)}
                disabled={isSubmitted}
              />
            )}
          </div>
        ) : isQuiz ? (
          <div className="space-y-4">
            {(challenge as QuizChallenge).questions.map((question, index) => (
              <QuizQuestion
                key={question.id}
                question={question}
                questionNumber={index + 1}
                selectedOption={quizAnswers.get(question.id)}
                onSelectOption={(optionIndex) => onQuizAnswer?.(question.id, optionIndex)}
                disabled={isSubmitted}
              />
            ))}

            {/* Submit Button */}
            <motion.button
              onClick={onSubmitQuiz}
              disabled={!allQuestionsAnswered || isSubmittingQuiz || isSubmitted}
              whileHover={{ scale: allQuestionsAnswered && !isSubmittingQuiz ? 1.02 : 1 }}
              whileTap={{ scale: allQuestionsAnswered && !isSubmittingQuiz ? 0.98 : 1 }}
              className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition-all ${
                allQuestionsAnswered && !isSubmittingQuiz && !isSubmitted
                  ? "bg-brand-cyan-dark text-white shadow-lg shadow-brand-cyan-dark/20 hover:bg-brand-cyan"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
            >
              {isSubmittingQuiz ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Submit Quiz
                </>
              )}
            </motion.button>

            {!allQuestionsAnswered && !isSubmitted && (
              <p className="text-center text-sm text-gray-500">
                Please answer all questions before submitting
              </p>
            )}
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}
