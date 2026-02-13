"use client";

import { BookOpen, CheckCircle, Clock } from "lucide-react";

import type { AcademyStats } from "@/types/academy";

interface StatsCardsProps {
  stats: AcademyStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {/* Overall Progress */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Overall Progress</p>
            <p className="mt-1 font-display text-3xl font-bold text-brand-primary">
              {stats.overallProgress}%
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-cyan-dark/10 text-brand-cyan-dark">
            <BookOpen className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Lessons Completed */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Lessons Completed</p>
            <p className="mt-1 font-display text-3xl font-bold text-brand-primary">
              {stats.lessonsCompleted}/{stats.totalLessons}
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600">
            <CheckCircle className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Total Time */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Total Time</p>
            <p className="mt-1 font-display text-3xl font-bold text-brand-primary">
              {stats.totalTime}
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
            <Clock className="h-6 w-6" />
          </div>
        </div>
      </div>
    </div>
  );
}
