"use client";

import { motion } from "framer-motion";
import { Mic, FileQuestion, CheckCircle, XCircle, Clock, MessageSquare } from "lucide-react";

import { StatusBadge } from "@/components/ui";
import type { ChallengeHistoryItem } from "@/types/challenges";

interface HistoryCardProps {
  item: ChallengeHistoryItem;
  index?: number;
}

export function HistoryCard({ item, index = 0 }: HistoryCardProps) {
  const isAudio = item.type === "AUDIO";
  const isApproved = item.status === "APPROVED";
  const needsImprovement = item.status === "NEEDS_IMPROVEMENT";

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
    >
      {/* Header */}
      <div
        className={`px-6 py-3 ${
          isApproved
            ? "bg-green-50"
            : needsImprovement
              ? "bg-orange-50"
              : "bg-yellow-50"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isApproved ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : needsImprovement ? (
              <XCircle className="h-4 w-4 text-orange-600" />
            ) : (
              <Clock className="h-4 w-4 text-yellow-600" />
            )}
            <StatusBadge status={item.status} />
          </div>
          <span className="text-xs text-gray-600">{formatDate(item.submittedAt)}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="mb-4 flex items-start gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
              isAudio ? "bg-purple-100" : "bg-blue-100"
            }`}
          >
            {isAudio ? (
              <Mic className="h-5 w-5 text-purple-600" />
            ) : (
              <FileQuestion className="h-5 w-5 text-blue-600" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-display text-lg font-bold text-brand-primary">
              {item.title}
            </h3>
            <p className="text-sm text-gray-500">
              {isAudio ? "Speaking Challenge" : "Quiz Challenge"}
            </p>
          </div>
        </div>

        {/* Score for Quiz */}
        {!isAudio && item.score !== null && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-gray-50 p-3">
            <span className="text-sm font-medium text-gray-600">Score:</span>
            <span className={`text-lg font-bold ${
              item.score >= 70 ? "text-green-600" : "text-orange-600"
            }`}>
              {item.score}%
            </span>
          </div>
        )}

        {/* Feedback */}
        {item.feedback && (
          <div className="rounded-xl bg-gray-50 p-4">
            <div className="mb-2 flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-brand-cyan-dark" />
              <span className="text-xs font-bold uppercase tracking-wide text-gray-600">
                Teacher Feedback
              </span>
            </div>
            <p className="text-sm text-gray-700">{item.feedback}</p>
          </div>
        )}

        {/* Waiting for feedback message */}
        {!item.feedback && item.status === "PENDING" && (
          <div className="rounded-xl bg-yellow-50 p-4 text-center">
            <Clock className="mx-auto mb-2 h-5 w-5 text-yellow-600" />
            <p className="text-sm text-yellow-800">
              Waiting for teacher review...
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
