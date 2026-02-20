import { create } from "zustand";

import api, { getErrorMessage } from "@/lib/api";
import type {
  Challenge,
  QuizChallenge,
  QuizResult,
  AudioSubmissionResult,
  ChallengeHistoryItem,
  QuizDetail,
} from "@/types/challenges";

interface ChallengesState {
  // Daily challenge
  dailyChallenge: Challenge | null;
  isLoadingDaily: boolean;
  
  // Quiz state
  quizAnswers: Map<number, number>; // questionId -> selectedOptionIndex
  quizResult: QuizResult | null;
  isSubmittingQuiz: boolean;
  
  // Quiz detail (for history)
  quizDetail: QuizDetail | null;
  isLoadingQuizDetail: boolean;
  
  // Audio state
  isSubmittingAudio: boolean;
  audioSubmissionResult: AudioSubmissionResult | null;
  
  // History
  history: ChallengeHistoryItem[];
  isLoadingHistory: boolean;
  
  // Error state
  error: string | null;
}

interface ChallengesActions {
  // Daily challenge
  fetchDailyChallenge: () => Promise<void>;
  
  // Quiz actions
  setQuizAnswer: (questionId: number, optionIndex: number) => void;
  submitQuiz: (challengeId: number) => Promise<QuizResult>;
  resetQuiz: () => void;
  clearQuizResult: () => void;
  
  // Quiz detail (for history)
  fetchQuizDetail: (progressId: string) => Promise<QuizDetail | null>;
  clearQuizDetail: () => void;
  
  // Audio actions
  submitAudio: (challengeId: number, audioBlob: Blob) => Promise<AudioSubmissionResult>;
  
  // History
  fetchHistory: () => Promise<void>;
  
  // Utility
  clearError: () => void;
  reset: () => void;
}

type ChallengesStore = ChallengesState & ChallengesActions;

const initialState: ChallengesState = {
  dailyChallenge: null,
  isLoadingDaily: false,
  quizAnswers: new Map(),
  quizResult: null,
  isSubmittingQuiz: false,
  quizDetail: null,
  isLoadingQuizDetail: false,
  isSubmittingAudio: false,
  audioSubmissionResult: null,
  history: [],
  isLoadingHistory: false,
  error: null,
};

export const useChallengesStore = create<ChallengesStore>((set, get) => ({
  ...initialState,

  fetchDailyChallenge: async () => {
    set({ isLoadingDaily: true, error: null });
    
    try {
      const response = await api.get("/api/challenges/daily");
      set({ 
        dailyChallenge: response.data.data || response.data, 
        isLoadingDaily: false,
        quizAnswers: new Map(), // Reset answers when fetching new challenge
        quizResult: null,
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({ error: errorMessage, isLoadingDaily: false });
      // Don't throw - no daily challenge is a valid state
    }
  },

  setQuizAnswer: (questionId: number, optionIndex: number) => {
    set((state) => {
      const newAnswers = new Map(state.quizAnswers);
      newAnswers.set(questionId, optionIndex);
      return { quizAnswers: newAnswers };
    });
  },

  submitQuiz: async (challengeId: number) => {
    set({ isSubmittingQuiz: true, error: null });
    
    try {
      const state = get();
      const challenge = state.dailyChallenge as QuizChallenge;
      
      if (!challenge || !challenge.questions) {
        throw new Error("No quiz questions available");
      }
      
      // Build answers array in order of questions
      const answers = challenge.questions.map((q) => {
        const answer = state.quizAnswers.get(q.id);
        return answer !== undefined ? answer : -1; // -1 for unanswered
      });
      
      const response = await api.post(`/api/challenges/${challengeId}/submit-quiz`, {
        answers,
      });
      
      const result: QuizResult = response.data.data || response.data;
      
      // Update daily challenge status
      set((state) => ({
        quizResult: result,
        isSubmittingQuiz: false,
        dailyChallenge: state.dailyChallenge
          ? {
            ...state.dailyChallenge,
            status: result.status === "APPROVED" ? "approved" : "needs_improvement",
          }
          : null,
      }));
      
      return result;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({ error: errorMessage, isSubmittingQuiz: false });
      throw error;
    }
  },

  resetQuiz: () => {
    set({
      quizAnswers: new Map(),
      quizResult: null,
    });
  },

  clearQuizResult: () => {
    set({ quizResult: null });
  },

  fetchQuizDetail: async (progressId: string) => {
    set({ isLoadingQuizDetail: true, error: null });
    
    try {
      const response = await api.get(`/api/challenges/quiz/${progressId}`);
      const detail: QuizDetail = response.data.data || response.data;
      set({ quizDetail: detail, isLoadingQuizDetail: false });
      return detail;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({ error: errorMessage, isLoadingQuizDetail: false });
      return null;
    }
  },

  clearQuizDetail: () => {
    set({ quizDetail: null });
  },

  submitAudio: async (challengeId: number, audioBlob: Blob) => {
    set({ isSubmittingAudio: true, error: null });
    
    try {
      const formData = new FormData();
      formData.append("challengeId", challengeId.toString());
      formData.append("audio", audioBlob, "recording.webm");
      
      const response = await api.post("/api/challenges/submit-audio", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      const result: AudioSubmissionResult = response.data.data || response.data;
      
      // Update daily challenge status
      set((state) => ({
        audioSubmissionResult: result,
        isSubmittingAudio: false,
        dailyChallenge: state.dailyChallenge
          ? {
            ...state.dailyChallenge,
            status: "submitted",
            fileUrl: result.fileUrl,
          }
          : null,
      }));
      
      return result;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({ error: errorMessage, isSubmittingAudio: false });
      throw error;
    }
  },

  fetchHistory: async () => {
    set({ isLoadingHistory: true, error: null });
    
    try {
      const response = await api.get("/api/challenges/history");
      const data = response.data.data || response.data;
      set({ 
        history: data.history || data, 
        isLoadingHistory: false,
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({ error: errorMessage, isLoadingHistory: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),

  reset: () => set(initialState),
}));
