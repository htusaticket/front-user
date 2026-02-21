"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";

import type { AdjacentLesson } from "@/types/academy";

interface LessonNavigationProps {
  moduleId: number;
  previousLesson: AdjacentLesson | null;
  nextLesson: AdjacentLesson | null;
}

export function LessonNavigation({ moduleId, previousLesson, nextLesson }: LessonNavigationProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      {previousLesson ? (
        <Link
          href={`/academy/${moduleId}/${previousLesson.id}`}
          className="flex items-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-5 py-3 text-sm font-bold text-brand-primary transition-all hover:border-gray-300 hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">{previousLesson.title}</span>
          <span className="sm:hidden">Previous</span>
        </Link>
      ) : (
        <Link
          href="/academy"
          className="flex items-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-5 py-3 text-sm font-bold text-brand-primary transition-all hover:border-gray-300 hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Academy
        </Link>
      )}

      {nextLesson ? (
        <Link
          href={`/academy/${moduleId}/${nextLesson.id}`}
          className="flex items-center gap-2 rounded-xl bg-brand-cyan-dark px-5 py-3 text-sm font-bold text-white shadow-lg shadow-brand-cyan-dark/20 transition-all hover:bg-brand-cyan"
        >
          <span className="hidden sm:inline">{nextLesson.title}</span>
          <span className="sm:hidden">Next</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      ) : (
        <Link
          href="/academy"
          className="flex items-center gap-2 rounded-xl bg-brand-cyan-dark px-5 py-3 text-sm font-bold text-white shadow-lg shadow-brand-cyan-dark/20 transition-all hover:bg-brand-cyan"
        >
          Complete Module
          <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}
