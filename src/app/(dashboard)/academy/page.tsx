"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import { useEffect } from "react";

import { ModuleCard, StatsCards } from "@/components/academy";
import { ModuleCardSkeleton, StatCardSkeleton } from "@/components/ui";
import { useAcademyStore } from "@/store/academy";

export default function AcademyPage() {
  const { overview, isLoadingOverview, error, fetchOverview, clearError } = useAcademyStore();

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  // Loading state
  if (isLoadingOverview && !overview) {
    return (
      <div className="space-y-8 pb-10">
        {/* Header */}
        <div>
          <h1 className="font-display text-2xl font-bold text-brand-primary sm:text-3xl">
            Academy
          </h1>
          <p className="mt-2 text-base text-gray-600 sm:text-lg">
            Access all learning materials and courses
          </p>
        </div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>

        {/* Modules Skeleton */}
        <div>
          <h2 className="mb-6 font-display text-xl font-bold text-brand-primary">
            Course Library
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <ModuleCardSkeleton />
            <ModuleCardSkeleton />
            <ModuleCardSkeleton />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !overview) {
    return (
      <div className="space-y-8 pb-10">
        {/* Header */}
        <div>
          <h1 className="font-display text-2xl font-bold text-brand-primary sm:text-3xl">
            Academy
          </h1>
          <p className="mt-2 text-base text-gray-600 sm:text-lg">
            Access all learning materials and courses
          </p>
        </div>

        {/* Error Message */}
        <div className="flex flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50 p-12">
          <AlertCircle className="mb-4 h-12 w-12 text-red-500" />
          <h3 className="mb-2 font-display text-xl font-bold text-red-800">
            Failed to load academy
          </h3>
          <p className="mb-6 text-center text-red-600">{error}</p>
          <button
            onClick={() => {
              clearError();
              fetchOverview();
            }}
            className="flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-red-700"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (!overview || overview.modules.length === 0) {
    return (
      <div className="space-y-8 pb-10">
        {/* Header */}
        <div>
          <h1 className="font-display text-2xl font-bold text-brand-primary sm:text-3xl">
            Academy
          </h1>
          <p className="mt-2 text-base text-gray-600 sm:text-lg">
            Access all learning materials and courses
          </p>
        </div>

        {/* Empty State */}
        <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-12">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <AlertCircle className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="mb-2 font-display text-xl font-bold text-brand-primary">
            No modules available
          </h3>
          <p className="text-center text-gray-600">
            Check back later for new learning content.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-brand-primary sm:text-3xl">
          Academy
        </h1>
        <p className="mt-2 text-base text-gray-600 sm:text-lg">
          Access all learning materials and courses
        </p>
      </div>

      {/* Progress Overview */}
      <StatsCards stats={overview.stats} />

      {/* Modules Grid */}
      <div>
        <h2 className="mb-6 font-display text-xl font-bold text-brand-primary">
          Course Library
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {overview.modules
            .sort((a, b) => a.id - b.id)
            .map((module, index) => (
              <ModuleCard key={module.id} module={module} index={index} />
            ))}
        </div>
      </div>
    </div>
  );
}
