"use client";

import { motion } from "framer-motion";
import {
  BookOpen,
  CheckCircle,
  Clock,
} from "lucide-react";
import Link from "next/link";

// Type definitions
type Lesson = {
  id: number;
  title: string;
  duration: string;
  completed: boolean;
  isActive?: boolean;
  locked?: boolean;
};

type Module = {
  id: number;
  title: string;
  description: string;
  image: string;
  progress: number;
  lessons: Lesson[];
};

// Mock data
const modules: Module[] = [
  {
    id: 1,
    title: "Foundations & Goals",
    description: "Start your journey by setting clear objectives and understanding the core principles of effective language learning. This module covers the essential mindset changes required for success.",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1000&auto=format&fit=crop",
    progress: 100,
    lessons: [
      { id: 1, title: "Introduction", duration: "10 min", completed: true },
      { id: 2, title: "Setting Goals", duration: "15 min", completed: true },
      { id: 3, title: "Vocabulary", duration: "20 min", completed: true },
    ],
  },
  {
    id: 2,
    title: "Conversation Basics",
    description: "Master the art of small talk and introductions. Learn how to confidently start conversations in professional settings and keep them going with active listening techniques.",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1000&auto=format&fit=crop",
    progress: 66,
    lessons: [
      { id: 4, title: "Greetings", duration: "12 min", completed: true },
      { id: 5, title: "Small Talk", duration: "18 min", completed: true },
      { id: 6, title: "Active Listening", duration: "22 min", completed: false, isActive: true },
    ],
  },
  {
    id: 3,
    title: "Business English",
    description: "Dive into the world of corporate communication. From writing professional emails to delivering impactful presentations, this module equips you with the tools for the office.",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1000&auto=format&fit=crop",
    progress: 40,
    lessons: [
      { id: 7, title: "Email Writing", duration: "25 min", completed: true },
      { id: 8, title: "Meeting Vocab", duration: "20 min", completed: true },
      { id: 9, title: "Presentations", duration: "30 min", completed: false },
    ],
  },
  {
    id: 4,
    title: "Advanced Topics",
    description: "Refine your skills with complex idioms, cultural nuances, and advanced negotiation tactics. Perfect for those looking to reach near-native fluency levels.",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1000&auto=format&fit=crop",
    progress: 0,
    lessons: [
      { id: 10, title: "Idioms", duration: "18 min", completed: false, locked: true },
      { id: 11, title: "Cultural Nuances", duration: "25 min", completed: false, locked: true },
    ],
  },
];

export default function AcademyPage() {
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
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Overall Progress
              </p>
              <p className="mt-1 font-display text-3xl font-bold text-brand-primary">
                52%
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-cyan-dark/10 text-brand-cyan-dark">
              <BookOpen className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Lessons Completed
              </p>
              <p className="mt-1 font-display text-3xl font-bold text-brand-primary">
                7/13
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600">
              <CheckCircle className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Time
              </p>
              <p className="mt-1 font-display text-3xl font-bold text-brand-primary">
                3.2h
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
              <Clock className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Modules Grid */}
      <div>
        <h2 className="mb-6 font-display text-xl font-bold text-brand-primary">
          Course Library
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((module, index) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg"
            >
              <Link href={`/academy/${module.id}/1`}>
                {/* Image Section */}
                <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 z-10 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Image */}
                  <img
                    src={module.image}
                    alt={module.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
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
                    <h4 className="font-display text-lg font-bold text-brand-primary group-hover:text-brand-cyan-dark transition-colors">
                      {module.title}
                    </h4>
                    <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-bold text-gray-600">
                      {module.lessons.length} Lessons
                    </span>
                  </div>
                  
                  <p className="mt-2 line-clamp-3 text-sm text-gray-600">
                    {module.description}
                  </p>

                  <div className="mt-6">
                    <div className="mb-1.5 flex items-center justify-between text-xs">
                      <span className="font-semibold text-gray-500">
                        {module.lessons.filter(l => l.completed).length} of {module.lessons.length} Completed
                      </span>
                      <span className="font-bold text-brand-primary">
                        {module.progress}%
                      </span>
                    </div>
                    {/* Progress Bar Container */}
                    <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
                      {/* Progress Width */}
                      <div
                        className="absolute left-0 top-0 h-full bg-brand-cyan-dark transition-all duration-500"
                        style={{ width: `${module.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
