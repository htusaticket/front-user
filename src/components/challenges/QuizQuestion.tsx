"use client";

import { motion } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";

import type { QuizQuestion as QuizQuestionType } from "@/types/challenges";

interface QuizQuestionProps {
  question: QuizQuestionType;
  questionNumber: number;
  selectedOption: number | undefined;
  onSelectOption: (optionIndex: number) => void;
  showResult?: boolean;
  correctOption?: number;
  disabled?: boolean;
}

export function QuizQuestion({
  question,
  questionNumber,
  selectedOption,
  onSelectOption,
  showResult = false,
  correctOption,
  disabled = false,
}: QuizQuestionProps) {
  const getOptionStyle = (optionIndex: number) => {
    const isSelected = selectedOption === optionIndex;
    const isCorrect = correctOption === optionIndex;
    const wasWrong = showResult && isSelected && !isCorrect;

    if (showResult) {
      if (isCorrect) {
        return "border-green-500 bg-green-50";
      }
      if (wasWrong) {
        return "border-red-500 bg-red-50";
      }
      return "border-gray-200 opacity-60";
    }

    if (isSelected) {
      return "border-brand-cyan-dark bg-brand-cyan-dark/5";
    }

    return "border-gray-200 hover:bg-gray-50";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-gray-200 bg-white p-5"
    >
      <p className="mb-4 font-bold text-gray-900">
        {questionNumber}. {question.text}
      </p>
      <div className="space-y-2">
        {question.options.map((option, optionIndex) => {
          const isSelected = selectedOption === optionIndex;
          const isCorrect = correctOption === optionIndex;
          const wasWrong = showResult && isSelected && !isCorrect;
          const optionId = `${question.id}-${option}-${optionIndex}`;

          return (
            <label
              key={optionId}
              className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-all ${getOptionStyle(optionIndex)} ${disabled ? "cursor-not-allowed" : ""}`}
            >
              <input
                type="radio"
                name={`question-${question.id}`}
                className="h-4 w-4 text-brand-cyan-dark focus:ring-brand-cyan-dark"
                checked={isSelected}
                onChange={() => !disabled && onSelectOption(optionIndex)}
                disabled={disabled}
              />
              <span className="flex-1 text-sm text-gray-700">{option}</span>
              {showResult && isCorrect && (
                <CheckCircle className="h-5 w-5 text-green-500" />
              )}
              {showResult && wasWrong && (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
            </label>
          );
        })}
      </div>
    </motion.div>
  );
}
