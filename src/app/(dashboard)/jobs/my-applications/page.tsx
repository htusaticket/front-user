"use client";

import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import {
  Briefcase,
  ChevronRight,
  GripVertical,
  Loader2,
  MessageSquare,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { useApplicationsStore } from "@/store/jobs";
import type { Application, ApplicationStatus } from "@/types/jobs";

// Column configuration
const COLUMNS: {
  id: ApplicationStatus;
  key: "applied" | "interview" | "offer" | "rejected";
  title: string;
  borderColor: string;
  bgColor: string;
  textColor: string;
  badgeColor: string;
}[] = [
  {
    id: "APPLIED",
    key: "applied",
    title: "Applied",
    borderColor: "border-blue-200",
    bgColor: "bg-blue-50",
    textColor: "text-blue-900",
    badgeColor: "bg-blue-100 text-blue-700",
  },
  {
    id: "INTERVIEW",
    key: "interview",
    title: "Interview",
    borderColor: "border-purple-200",
    bgColor: "bg-purple-50",
    textColor: "text-purple-900",
    badgeColor: "bg-purple-100 text-purple-700",
  },
  {
    id: "OFFER",
    key: "offer",
    title: "Offer",
    borderColor: "border-green-200",
    bgColor: "bg-green-50",
    textColor: "text-green-900",
    badgeColor: "bg-green-100 text-green-700",
  },
  {
    id: "REJECTED",
    key: "rejected",
    title: "Rejected",
    borderColor: "border-red-200",
    bgColor: "bg-red-50",
    textColor: "text-red-900",
    badgeColor: "bg-red-100 text-red-700",
  },
];

export default function MyApplicationsPage() {
  const {
    applications,
    stats,
    isLoading,
    fetchApplications,
    updateApplicationStatus,
    updateApplicationNotes,
  } = useApplicationsStore();

  const [activeApplication, setActiveApplication] = useState<Application | null>(null);
  const [notesModal, setNotesModal] = useState<{
    isOpen: boolean;
    application: Application | null;
  }>({ isOpen: false, application: null });
  const [notesText, setNotesText] = useState("");
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  // Find which column an application is in
  const findColumnByApplicationId = (id: string): ApplicationStatus | null => {
    for (const column of COLUMNS) {
      const app = applications[column.key].find((a) => a.id === id);
      if (app) return column.id;
    }
    return null;
  };

  // Find application by ID
  const findApplicationById = (id: string): Application | null => {
    for (const column of COLUMNS) {
      const app = applications[column.key].find((a) => a.id === id);
      if (app) return app;
    }
    return null;
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const id = active.id as string;
    setActiveApplication(findApplicationById(id));
  };

  const handleDragOver = (_event: DragOverEvent) => {
    // We can add visual feedback here if needed
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveApplication(null);

    if (!over) return;

    const applicationId = active.id as string;
    const overId = over.id as string;

    // Check if dropped on a column
    const targetColumn = COLUMNS.find((col) => col.id === overId);
    const sourceColumn = findColumnByApplicationId(applicationId);

    if (!sourceColumn) return;

    // If dropped on a column header
    if (targetColumn && targetColumn.id !== sourceColumn) {
      await updateApplicationStatus(applicationId, targetColumn.id, sourceColumn);
      return;
    }

    // If dropped on another card, find which column that card belongs to
    const targetCardColumn = findColumnByApplicationId(overId);
    if (targetCardColumn && targetCardColumn !== sourceColumn) {
      await updateApplicationStatus(applicationId, targetCardColumn, sourceColumn);
    }
  };

  const handleOpenNotes = (application: Application) => {
    setNotesText(application.notes || "");
    setNotesModal({ isOpen: true, application });
  };

  const handleSaveNotes = async () => {
    if (!notesModal.application) return;

    setIsSavingNotes(true);
    await updateApplicationNotes(notesModal.application.id, notesText);
    setIsSavingNotes(false);
    setNotesModal({ isOpen: false, application: null });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-cyan-dark" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Link
          href="/jobs"
          className="font-semibold text-brand-cyan-dark hover:underline"
        >
          Jobs
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-gray-900">My Applications</span>
      </div>

      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-brand-primary">
          My Applications
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Drag and drop cards to manage your application status
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {COLUMNS.map((column) => (
          <div
            key={column.id}
            className={`rounded-xl border ${column.borderColor} ${column.bgColor} p-4 text-center`}
          >
            <p className={`text-2xl font-bold ${column.textColor}`}>
              {stats[column.key]}
            </p>
            <p className={`text-xs font-semibold ${column.textColor} opacity-80`}>
              {column.title}
            </p>
          </div>
        ))}
      </div>

      {/* Kanban Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
          {COLUMNS.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              applications={applications[column.key]}
              onOpenNotes={handleOpenNotes}
            />
          ))}
        </div>

        {/* Drag Overlay */}
        <DragOverlay>
          {activeApplication ? (
            <ApplicationCard
              application={activeApplication}
              column={COLUMNS.find((c) => c.id === findColumnByApplicationId(activeApplication.id))!}
              isDragging
              onOpenNotes={() => {}}
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Info Box */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
        <p className="text-sm text-blue-900">
          💡 <strong>Tip:</strong> Drag cards between columns to update your application status.
          Click the notes icon to add personal notes.
        </p>
      </div>

      {/* Notes Modal */}
      {notesModal.isOpen && notesModal.application && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
          >
            <button
              onClick={() => setNotesModal({ isOpen: false, application: null })}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="mb-2 font-display text-lg font-bold text-brand-primary">
              Notes for {notesModal.application.job.title}
            </h3>
            <p className="mb-4 text-sm text-gray-600">
              {notesModal.application.job.company}
            </p>

            <textarea
              value={notesText}
              onChange={(e) => setNotesText(e.target.value)}
              placeholder="Add your personal notes here (e.g., 'Interview scheduled for Thursday at 3pm')"
              maxLength={500}
              className="mb-2 h-32 w-full resize-none rounded-xl border border-gray-200 p-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-brand-cyan-dark focus:ring-2 focus:ring-brand-cyan-dark/20"
            />
            <p className="mb-4 text-right text-xs text-gray-400">
              {notesText.length}/500
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setNotesModal({ isOpen: false, application: null })}
                className="flex-1 rounded-xl border border-gray-200 py-2 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50"
              >
                Cancel
              </button>
              <motion.button
                onClick={handleSaveNotes}
                disabled={isSavingNotes}
                whileHover={{ scale: isSavingNotes ? 1 : 1.02 }}
                whileTap={{ scale: isSavingNotes ? 1 : 0.98 }}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-cyan-dark py-2 text-sm font-bold text-white transition-all hover:bg-brand-cyan disabled:opacity-50"
              >
                {isSavingNotes ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Save Notes"
                )}
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

// ===============================
// SUB-COMPONENTS
// ===============================

interface KanbanColumnProps {
  column: (typeof COLUMNS)[number];
  applications: Application[];
  onOpenNotes: (application: Application) => void;
}

function KanbanColumn({ column, applications, onOpenNotes }: KanbanColumnProps) {
  const { setNodeRef } = useSortable({
    id: column.id,
    data: {
      type: "column",
    },
  });

  return (
    <div
      ref={setNodeRef}
      className="rounded-2xl border border-gray-200 bg-gray-50 p-4"
    >
      <h3 className="mb-4 font-display text-sm font-bold uppercase tracking-wider text-brand-primary">
        {column.title} ({applications.length})
      </h3>

      <SortableContext
        items={applications.map((app) => app.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="min-h-[100px] space-y-3">
          {applications.map((app) => (
            <SortableApplicationCard
              key={app.id}
              application={app}
              column={column}
              onOpenNotes={onOpenNotes}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}

interface SortableApplicationCardProps {
  application: Application;
  column: (typeof COLUMNS)[number];
  onOpenNotes: (application: Application) => void;
}

function SortableApplicationCard({
  application,
  column,
  onOpenNotes,
}: SortableApplicationCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: application.id,
    data: {
      type: "application",
      application,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <ApplicationCard
        application={application}
        column={column}
        attributes={attributes}
        listeners={listeners}
        onOpenNotes={onOpenNotes}
      />
    </div>
  );
}

interface ApplicationCardProps {
  application: Application;
  column: (typeof COLUMNS)[number];
  isDragging?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attributes?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  listeners?: any;
  onOpenNotes: (application: Application) => void;
}

function ApplicationCard({
  application,
  column,
  isDragging = false,
  attributes,
  listeners,
  onOpenNotes,
}: ApplicationCardProps) {
  return (
    <motion.div
      className={`rounded-xl border ${column.borderColor} bg-white p-4 shadow-sm transition-all ${
        isDragging ? "rotate-2 scale-105 shadow-lg" : "hover:shadow-md"
      } ${column.id === "REJECTED" ? "opacity-75" : ""}`}
    >
      <div className="mb-3 flex items-start gap-2">
        <button
          className="cursor-grab touch-none text-gray-400 hover:text-gray-600 active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <div className="flex-1">
          <h4 className="font-bold text-brand-primary">{application.job.title}</h4>
          <p className="text-sm text-gray-600">{application.job.company}</p>
        </div>
        <button
          onClick={() => onOpenNotes(application)}
          className={`rounded-lg p-1 transition-colors ${
            application.notes
              ? "bg-brand-cyan-dark/10 text-brand-cyan-dark"
              : "text-gray-400 hover:text-gray-600"
          }`}
          title={application.notes ? "Edit notes" : "Add notes"}
        >
          <MessageSquare className="h-4 w-4" />
        </button>
      </div>

      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Briefcase className="h-3 w-3" />
        <span>Applied: {application.appliedDate}</span>
      </div>

      {application.notes && (
        <div className="mt-2 rounded-lg bg-gray-50 p-2 text-xs text-gray-600">
          {application.notes.length > 50
            ? `${application.notes.substring(0, 50)}...`
            : application.notes}
        </div>
      )}
    </motion.div>
  );
}
