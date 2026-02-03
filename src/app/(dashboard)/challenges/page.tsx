"use client";

import { motion } from "framer-motion";
import {
  Mic,
  Play,
  Pause,
  Send,
  Trash2,
  CheckCircle,
  Clock,
  Trophy,
  MessageSquare,
} from "lucide-react";
import { useState } from "react";

// Mock data
type ChallengeType = "audio" | "quiz";

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
}

interface Challenge {
  id: number;
  title: string;
  type: ChallengeType;
  instructions: string;
  deadline: string;
  status: "pending" | "completed";
  questions?: Question[];
}

const pendingChallenges: Challenge[] = [
  {
    id: 1,
    title: "Describe Your Morning Routine",
    type: "audio",
    instructions:
      "Record a 2-3 minute audio describing your morning routine in English. Try to use present simple tense and vocabulary related to daily activities.",
    deadline: "Today, 23:59",
    status: "pending",
  },
  {
    id: 5,
    title: "Business Vocabulary Quiz",
    type: "quiz",
    instructions:
      "Select the correct definition for each business term. You need 100% to pass.",
    deadline: "Tomorrow, 12:00",
    status: "pending",
    questions: [
      {
        id: 1,
        text: "What does 'ROI' stand for?",
        options: [
          "Rate of Inflation",
          "Return on Investment",
          "Risk of Insolvency",
          "Royal Operating Income",
        ],
        correctAnswer: 1,
      },
      {
        id: 2,
        text: "Which phrase means 'to postpone a meeting'?",
        options: [
          "Call off",
          "Bring forward",
          "Put off",
          "Get across",
        ],
        correctAnswer: 2,
      },
      {
        id: 3,
        text: "A 'stakeholder' is...",
        options: [
          "Someone who holds the bets",
          "A person with an interest in a company",
          "The owner of a steakhouse",
          "An employee who is fired",
        ],
        correctAnswer: 1,
      },
    ],
  },
];

const pastChallenges = [
  {
    id: 2,
    title: "Tell Us About Your Hometown",
    type: "audio",
    submittedAt: "Jan 28, 2026",
    status: "approved",
    feedback:
      "Excellent work! Your pronunciation has improved significantly. Try to work on using more descriptive adjectives.",
    teacher: "Sarah Johnson",
  },
  {
    id: 3,
    title: "Grammar Quiz: Present Perfect",
    type: "quiz",
    submittedAt: "Jan 27, 2026",
    status: "approved",
    score: 9,
    totalQuestions: 10,
    feedback: "Great job! Only one small mistake on question 7.",
    teacher: "Michael Brown",
  },
  {
    id: 4,
    title: "Describe Your Dream Job",
    type: "audio",
    submittedAt: "Jan 26, 2026",
    status: "rejected",
    feedback:
      "You need to focus more on clarity. Some words were mumbled. Please re-record and resubmit.",
    teacher: "Sarah Johnson",
  },
];

export default function ChallengesPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [submittedChallenges, setSubmittedChallenges] = useState<number[]>([]);
  
  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<number, Record<number, number>>>({});

  const handleStartRecording = () => {
    setIsRecording(true);
    setTimeout(() => setIsRecording(false), 1000);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setHasRecording(true);
  };

  const handleSubmit = (id: number) => {
    setSubmittedChallenges([...submittedChallenges, id]);
  };

  const handleQuizSelect = (challengeId: number, questionId: number, optionIndex: number) => {
    setQuizAnswers(prev => ({
      ...prev,
      [challengeId]: {
        ...(prev[challengeId] || {}),
        [questionId]: optionIndex,
      },
    }));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-brand-primary">
          Daily Challenges
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Practice and improve your English with personalized challenges
        </p>
      </div>

      {/* Pending Challenges */}
      <div className="space-y-6">
        {pendingChallenges.map((challenge) => {
          const isSubmitted = submittedChallenges.includes(challenge.id);

          if (isSubmitted) {
            return (
              <motion.div
                key={challenge.id}
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
              key={challenge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
            >
              <div className="bg-brand-cyan-dark px-6 py-4">
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-white" />
                  <span className="text-sm font-bold uppercase tracking-wider text-white">
                    {challenge.type === "audio" ? "Speaking Challenge" : "Quiz Challenge"}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-6">
                  <h2 className="font-display text-2xl font-bold text-brand-primary">
                    {challenge.title}
                  </h2>
                  <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4 text-amber-500" />
                    <span>Due: {challenge.deadline}</span>
                  </div>
                </div>

                {/* Instructions */}
                <div className="mb-6 rounded-xl bg-blue-50 p-4">
                  <h3 className="mb-2 font-bold text-blue-900">Instructions:</h3>
                  <p className="text-sm text-blue-800">
                    {challenge.instructions}
                  </p>
                </div>

                {/* Challenge Content Based on Type */}
                {challenge.type === "audio" ? (
                  <div className="rounded-xl border-2 border-gray-200 bg-gray-50 p-6">
                    <div className="flex flex-col items-center">
                      {/* Recorder Button */}
                      <button
                        onClick={
                          isRecording ? handleStopRecording : handleStartRecording
                        }
                        className={`mb-6 flex h-24 w-24 items-center justify-center rounded-full transition-all ${
                          isRecording
                            ? "bg-red-500 shadow-2xl shadow-red-500/50"
                            : "bg-brand-cyan-dark shadow-xl shadow-brand-cyan-dark/30 hover:bg-brand-cyan"
                        }`}
                      >
                        <Mic className="h-10 w-10 text-white" />
                      </button>

                      <p className="mb-4 text-center text-sm font-bold text-gray-900">
                        {isRecording
                          ? "Recording... Press to stop"
                          : hasRecording
                            ? "Recording ready"
                            : "Press to record"}
                      </p>

                      {/* Playback Controls */}
                      {hasRecording && (
                        <div className="w-full space-y-3">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => setIsPlaying(!isPlaying)}
                              className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-primary text-white transition-all hover:bg-brand-primary/90"
                            >
                              {isPlaying ? (
                                <Pause className="h-5 w-5" />
                              ) : (
                                <Play className="h-5 w-5" />
                              )}
                            </button>
                            <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
                              <div className="h-full w-1/3 rounded-full bg-brand-cyan-dark" />
                            </div>
                            <span className="text-xs font-semibold text-gray-600">
                              0:45 / 2:15
                            </span>
                          </div>
                          <div className="flex gap-3">
                            <motion.button
                              onClick={() => setHasRecording(false)}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-gray-700 transition-all hover:bg-gray-50"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </motion.button>
                            <motion.button
                              onClick={() => handleSubmit(challenge.id)}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-cyan-dark px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-brand-cyan-dark/20 transition-all hover:bg-brand-cyan"
                            >
                              <Send className="h-4 w-4" />
                              Submit Challenge
                            </motion.button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  // Quiz UI
                  <div className="space-y-6">
                    {challenge.questions?.map((question, qIndex) => (
                      <div key={question.id} className="rounded-xl border border-gray-200 p-4">
                        <p className="mb-3 font-bold text-gray-900">
                          {qIndex + 1}. {question.text}
                        </p>
                        <div className="space-y-2">
                          {question.options.map((option, oIndex) => (
                            <label
                              key={`${question.id}-${option}`}
                              className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-all ${
                                quizAnswers[challenge.id]?.[question.id] === oIndex
                                  ? "border-brand-cyan-dark bg-brand-cyan-dark/5"
                                  : "border-gray-200 hover:bg-gray-50"
                              }`}
                            >
                              <input
                                type="radio"
                                name={`q-${challenge.id}-${question.id}`}
                                className="h-4 w-4 text-brand-cyan-dark focus:ring-brand-cyan-dark"
                                checked={quizAnswers[challenge.id]?.[question.id] === oIndex}
                                onChange={() => handleQuizSelect(challenge.id, question.id, oIndex)}
                              />
                              <span className="text-sm text-gray-700">{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                    <motion.button
                      onClick={() => handleSubmit(challenge.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-cyan-dark px-4 py-3 text-sm font-bold text-white shadow-lg shadow-brand-cyan-dark/20 transition-all hover:bg-brand-cyan"
                    >
                      <Send className="h-4 w-4" />
                      Submit Quiz
                    </motion.button>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Past Challenges */}
      <div>
        <h2 className="mb-4 font-display text-xl font-bold text-brand-primary">
          Past Challenges
        </h2>
        <div className="space-y-4">
          {pastChallenges.map((challenge, index) => (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
            >
              <div
                className={`px-6 py-3 ${
                  challenge.status === "approved"
                    ? "bg-green-50"
                    : "bg-red-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {challenge.status === "approved" ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <MessageSquare className="h-4 w-4 text-red-600" />
                    )}
                    <span
                      className={`text-xs font-bold uppercase tracking-wider ${
                        challenge.status === "approved"
                          ? "text-green-900"
                          : "text-red-900"
                      }`}
                    >
                      {challenge.status === "approved"
                        ? "Approved"
                        : "Needs Improvement"}
                    </span>
                  </div>
                  <span className="text-xs text-gray-600">
                    {challenge.submittedAt}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-display text-lg font-bold text-brand-primary">
                  {challenge.title}
                </h3>
                {challenge.type === "quiz" && challenge.score && (
                  <p className="mt-1 text-sm font-semibold text-gray-600">
                    Score: {challenge.score}/{challenge.totalQuestions}
                  </p>
                )}
                <div className="mt-4 rounded-xl bg-gray-50 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-brand-cyan-dark" />
                    <span className="text-xs font-bold uppercase tracking-wide text-gray-600">
                      Feedback from {challenge.teacher}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{challenge.feedback}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
