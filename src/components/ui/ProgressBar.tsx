"use client";

import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number; // 0-100
  className?: string;
  barClassName?: string;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-4",
};

export function ProgressBar({
  value,
  className,
  barClassName,
  showLabel = false,
  size = "md",
}: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="mb-1 flex justify-between text-xs">
          <span className="text-gray-500">Progress</span>
          <span className="font-bold text-brand-primary">{Math.round(clampedValue)}%</span>
        </div>
      )}
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-full bg-gray-100",
          sizeClasses[size],
        )}
      >
        <div
          className={cn(
            "absolute left-0 top-0 h-full rounded-full bg-brand-cyan-dark transition-all duration-500",
            barClassName,
          )}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
}
