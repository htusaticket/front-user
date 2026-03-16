"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import { ProgressBar } from "@/components/ui";
import type { ModuleWithProgress } from "@/types/academy";

function convertGoogleDriveUrl(url: string): string {
  const trimmed = url.trim();
  let fileId: string | null = null;

  const fileMatch = trimmed.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (fileMatch?.[1]) fileId = fileMatch[1];

  if (!fileId) {
    const openMatch = trimmed.match(/drive\.google\.com\/open\?id=([^&]+)/);
    if (openMatch?.[1]) fileId = openMatch[1];
  }

  if (!fileId) {
    const ucMatch = trimmed.match(/drive\.google\.com\/uc\?.*id=([^&]+)/);
    if (ucMatch?.[1]) fileId = ucMatch[1];
  }

  if (fileId) {
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
  }

  return trimmed;
}

interface ModuleCardProps {
  module: ModuleWithProgress;
  index?: number;
}

export function ModuleCard({ module, index = 0 }: ModuleCardProps) {
  const imageUrl = module.image ? convertGoogleDriveUrl(module.image) : "/placeholder-module.jpg";
  // Find the first incomplete lesson, or default to first lesson
  const firstIncompleteLessonId = module.lessons.find((l) => !l.completed)?.id || module.lessons[0]?.id;
  const href = `/academy/${module.id}/${firstIncompleteLessonId || 1}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg"
    >
      <Link href={href}>
        {/* Image Section */}
        <div className="relative h-48 w-full overflow-hidden bg-gray-100">
          {/* Overlay Gradient */}
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={module.title}
            referrerPolicy="no-referrer"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Text Overlay on Image */}
          <div className="absolute bottom-0 left-0 right-0 z-20 p-5">
            <h3 className="font-display text-lg font-bold leading-tight text-white antialiased drop-shadow-sm">
              {module.title}
            </h3>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-start justify-between">
            <h4 className="font-display text-lg font-bold text-brand-primary transition-colors group-hover:text-brand-cyan-dark">
              {module.title}
            </h4>
            <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-bold text-gray-600">
              {module.totalLessons} Lessons
            </span>
          </div>

          <p className="mt-2 line-clamp-3 text-sm text-gray-600">{module.description}</p>

          <div className="mt-6">
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <span className="font-semibold text-gray-500">
                {module.completedLessons} of {module.totalLessons} Completed
              </span>
              <span className="font-bold text-brand-primary">{module.progress}%</span>
            </div>
            <ProgressBar value={module.progress} size="md" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
