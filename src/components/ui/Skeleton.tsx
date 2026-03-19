"use client";

import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-gray-200",
        className,
      )}
    />
  );
}

// Pre-built skeleton components for common use cases

export function CardSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("rounded-2xl border border-gray-200 bg-white p-6 shadow-sm", className)}>
      <Skeleton className="mb-4 h-48 w-full rounded-xl" />
      <Skeleton className="mb-2 h-6 w-3/4" />
      <Skeleton className="mb-4 h-4 w-full" />
      <Skeleton className="h-2.5 w-full rounded-full" />
    </div>
  );
}

export function ModuleCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <Skeleton className="aspect-[16/9] w-full" />
      <div className="p-4">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="mt-1 h-3 w-full" />
        <Skeleton className="mt-1 h-3 w-5/6" />
        <div className="mt-3">
          <Skeleton className="h-2 w-full rounded-full" />
          <Skeleton className="mt-1 h-3 w-8" />
        </div>
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <Skeleton className="mb-2 h-4 w-24" />
          <Skeleton className="h-8 w-16" />
        </div>
        <Skeleton className="h-12 w-12 rounded-xl" />
      </div>
    </div>
  );
}

export function LessonSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-6 w-64" />
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <Skeleton className="aspect-video w-full" />
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <Skeleton className="mb-2 h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <Skeleton className="h-12 w-40 rounded-xl" />
          </div>
          <div className="mt-6">
            <Skeleton className="mb-2 h-6 w-24" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="mt-1 h-4 w-5/6" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ChallengeSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <Skeleton className="h-14 w-full" />
      <div className="p-6">
        <Skeleton className="mb-4 h-8 w-2/3" />
        <Skeleton className="mb-6 h-4 w-1/3" />
        <Skeleton className="mb-6 h-24 w-full rounded-xl" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    </div>
  );
}
