"use client";

import { X, CheckCircle, XCircle } from "lucide-react";

import { QuizDetail } from "@/types/challenges";

interface QuizDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  quizDetail: QuizDetail | null;
  isLoading?: boolean;
}

export function QuizDetailModal({
  isOpen,
  onClose,
  quizDetail,
  isLoading = false,
}: QuizDetailModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-brand-cyan-dark to-brand-cyan-dark/80 p-4">
          <h2 className="text-lg font-bold text-white">Quiz Results</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[calc(90vh-140px)] overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-cyan-dark border-t-transparent" />
            </div>
          ) : quizDetail ? (
            <div className="space-y-6">
              {/* Score Summary */}
              <div className="rounded-xl bg-gray-50 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Your Score</p>
                    <p className={`text-3xl font-bold ${
                      (quizDetail.score ?? 0) >= 70 ? "text-green-600" : "text-orange-600"
                    }`}>
                      {quizDetail.score ?? 0}%
                    </p>
                  </div>
                  <div className={`rounded-full px-4 py-2 text-sm font-semibold ${
                    (quizDetail.score ?? 0) >= 70 
                      ? "bg-green-100 text-green-700" 
                      : "bg-orange-100 text-orange-700"
                  }`}>
                    {(quizDetail.score ?? 0) >= 70 ? "Passed" : "Try Again"}
                  </div>
                </div>
              </div>

              {/* Questions */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-700">Questions Review</h3>
                {quizDetail.questions.map((question, index) => {
                  const isCorrect = question.userAnswer === question.correctAnswer;
                  
                  return (
                    <div
                      key={question.id}
                      className={`rounded-xl border p-4 ${
                        isCorrect 
                          ? "border-green-200 bg-green-50" 
                          : "border-red-200 bg-red-50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {isCorrect ? (
                          <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                        ) : (
                          <XCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {index + 1}. {question.text}
                          </p>
                          
                          {/* Options */}
                          <div className="mt-3 space-y-2">
                            {question.options.map((option, optIndex) => {
                              const isUserSelected = question.userAnswer === optIndex;
                              const isCorrectOption = question.correctAnswer === optIndex;
                              
                              let optionClass = "bg-white border-gray-200 text-gray-700";
                              
                              if (isCorrectOption && isUserSelected) {
                                optionClass = "bg-green-100 border-green-400 text-green-800";
                              } else if (isCorrectOption && !isUserSelected) {
                                optionClass = "bg-green-100 border-green-400 text-green-800 border-dashed";
                              } else if (!isCorrectOption && isUserSelected) {
                                optionClass = "bg-red-100 border-red-400 text-red-800 line-through";
                              }
                              
                              return (
                                <div
                                  key={`${question.id}-option-${optIndex}`}
                                  className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${optionClass}`}
                                >
                                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 text-xs font-medium">
                                    {String.fromCharCode(65 + optIndex)}
                                  </span>
                                  <span>{option}</span>
                                  {isCorrectOption && (
                                    <CheckCircle className="ml-auto h-4 w-4 text-green-600" />
                                  )}
                                  {!isCorrectOption && isUserSelected && (
                                    <XCircle className="ml-auto h-4 w-4 text-red-600" />
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-gray-500">
              No quiz data available
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-gray-50 p-4">
          <button
            onClick={onClose}
            className="w-full rounded-xl bg-brand-cyan-dark py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-cyan-dark/90"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
