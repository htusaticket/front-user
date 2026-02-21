"use client";

import { cn } from "@/lib/utils";

type Status = "PENDING" | "APPROVED" | "NEEDS_IMPROVEMENT" | "pending" | "submitted" | "approved" | "needs_improvement";

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  PENDING: {
    label: "Pending",
    className: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  pending: {
    label: "Pending",
    className: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  submitted: {
    label: "Submitted",
    className: "bg-blue-100 text-blue-800 border-blue-200",
  },
  APPROVED: {
    label: "Approved",
    className: "bg-green-100 text-green-800 border-green-200",
  },
  approved: {
    label: "Approved",
    className: "bg-green-100 text-green-800 border-green-200",
  },
  NEEDS_IMPROVEMENT: {
    label: "Needs Improvement",
    className: "bg-orange-100 text-orange-800 border-orange-200",
  },
  needs_improvement: {
    label: "Needs Improvement",
    className: "bg-orange-100 text-orange-800 border-orange-200",
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        config.className,
        className,
      )}
    >
      {config.label}
    </span>
  );
}
