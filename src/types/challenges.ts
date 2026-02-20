// Types for Challenges module - Sprint 3

// ==================== CHALLENGE TYPE ====================

export type ChallengeType = "AUDIO" | "MULTIPLE_CHOICE" | "WRITING";
export type SubmissionStatus = "PENDING" | "APPROVED" | "NEEDS_IMPROVEMENT";
export type ChallengeStatus = "pending" | "submitted" | "approved" | "needs_improvement";

// ==================== QUIZ ====================

export interface QuizQuestion {
  id: number;
  text: string;
  options: string[];
}

export interface QuizResult {
  passed: boolean;
  correctAnswers: number;
  totalQuestions: number;
  score: number;
  status: "APPROVED" | "NEEDS_IMPROVEMENT";
  message: string;
  correctOptions: number[];
}

// ==================== DAILY CHALLENGE ====================

export interface DailyChallenge {
  id: number;
  title: string;
  type: ChallengeType;
  instructions: string;
  deadline: string;
  points: number;
  status: ChallengeStatus;
  fileUrl: string | null;
}

export interface QuizChallenge extends DailyChallenge {
  questions: QuizQuestion[];
}

// ==================== AUDIO SUBMISSION ====================

export interface AudioSubmissionResult {
  success: boolean;
  fileUrl: string;
  status: "PENDING";
  message: string;
  correctOptions: number[];
}

// ==================== HISTORY ====================

export interface ChallengeHistoryItem {
  id: string;
  challengeId: number;
  title: string;
  type: ChallengeType;
  submittedAt: string;
  status: SubmissionStatus;
  score: number | null;
  feedback: string | null;
}

export interface ChallengeHistory {
  history: ChallengeHistoryItem[];
}

// ==================== QUIZ DETAIL ====================

export interface QuizDetailQuestion {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
  userAnswer: number;
}

export interface QuizDetail {
  id: string;
  challengeId: number;
  title: string;
  score: number | null;
  status: SubmissionStatus;
  submittedAt: string;
  questions: QuizDetailQuestion[];
}

// ==================== COMBINED CHALLENGE (for UI) ====================

export type Challenge = DailyChallenge | QuizChallenge;

export function isQuizChallenge(challenge: Challenge): challenge is QuizChallenge {
  return challenge.type === "MULTIPLE_CHOICE" && "questions" in challenge;
}
