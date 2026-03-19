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
        {/* Image Section - Compact */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-900">
          {/* Dark Overlay */}
          <div className="absolute inset-0 z-10 bg-black/60" />

          {/* Image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={module.title}
            referrerPolicy="no-referrer"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Centered Title on Image */}
          <div className="absolute inset-0 z-20 flex items-center justify-center p-4">
            <h3 className="text-center font-display text-xl font-extrabold uppercase leading-tight tracking-wide text-white antialiased drop-shadow-md">
              {module.title}
            </h3>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-1 flex-col p-4">
          <h4 className="font-display text-sm font-bold text-gray-900 transition-colors group-hover:text-brand-cyan-dark">
            {module.title}
          </h4>

          <p className="mt-1 line-clamp-2 text-xs text-gray-500">{module.description}</p>

          <div className="mt-3">
            <ProgressBar value={module.progress} size="sm" />
            <span className="mt-1 inline-block text-xs font-bold text-brand-primary">
              {module.progress}%
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
