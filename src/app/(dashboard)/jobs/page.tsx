"use client";

import { motion } from "framer-motion";
import {
  Briefcase,
  DollarSign,
  MapPin,
  Building,
  Filter,
  Search,
  ExternalLink,
  CheckCircle,
  Loader2,
  X,
  ChevronDown,
  ArrowUpDown,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useCallback, useMemo } from "react";

import { useJobsStore } from "@/store/jobs";
import type { JobOffer, JobSortBy } from "@/types/jobs";

const SORT_OPTIONS: { value: JobSortBy; label: string }[] = [
  { value: "best_match", label: "Best Match" },
  { value: "newest_first", label: "Newest First" },
  { value: "oldest_first", label: "Oldest First" },
  { value: "highest_ote", label: "Highest OTE" },
  { value: "lowest_ote", label: "Lowest OTE" },
  { value: "highest_revenue", label: "Highest Revenue" },
  { value: "lowest_revenue", label: "Lowest Revenue" },
];

export default function JobsPage() {
  const {
    jobs,
    stats,
    selectedJob,
    filters,
    isLoading,
    fetchJobs,
    setSelectedJob,
    setFilters,
    applyToJob,
    resetFilters,
  } = useJobsStore();

  const [searchInput, setSearchInput] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  // Fetch jobs on mount and when filters change
  useEffect(() => {
    fetchJobs();
  }, [fetchJobs, filters.type, filters.sortBy]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filters.search) {
        setFilters({ search: searchInput });
        fetchJobs();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput, filters.search, setFilters, fetchJobs]);

  const handleApply = useCallback(async (jobId: number) => {
    setIsApplying(true);
    await applyToJob(jobId);
    setIsApplying(false);
  }, [applyToJob]);

  const handleFilterByType = useCallback((type: string | null) => {
    setFilters({ type });
    setShowFilters(false);
  }, [setFilters]);

  const handleSortChange = useCallback((sortBy: JobSortBy) => {
    setFilters({ sortBy });
    setShowSortDropdown(false);
  }, [setFilters]);

  const handleClearFilters = useCallback(() => {
    setSearchInput("");
    resetFilters();
    fetchJobs();
  }, [resetFilters, fetchJobs]);

  const currentSortLabel = useMemo(() => {
    return SORT_OPTIONS.find(o => o.value === filters.sortBy)?.label || "Best Match";
  }, [filters.sortBy]);

  // Filter jobs locally based on current filters
  const filteredJobs = useMemo(() => {
    return jobs;
  }, [jobs]);

  if (isLoading && jobs.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-cyan-dark" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-brand-primary">
          Job Opportunities
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Find job offers where you can use your English skills
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Available Offers
              </p>
              <p className="mt-1 font-display text-3xl font-bold text-brand-primary">
                {stats.availableOffers}
              </p>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand-cyan-dark/10">
              <Briefcase className="h-7 w-7 text-brand-cyan-dark" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Active Applications
              </p>
              <p className="mt-1 font-display text-3xl font-bold text-brand-primary">
                {stats.activeApplications}
              </p>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-green-100">
              <CheckCircle className="h-7 w-7 text-green-600" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                New This Week
              </p>
              <p className="mt-1 font-display text-3xl font-bold text-brand-primary">
                {stats.newThisWeek}
              </p>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-purple-100">
              <Building className="h-7 w-7 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title, company..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-10 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-brand-cyan-dark focus:ring-2 focus:ring-brand-cyan-dark/20"
          />
          {searchInput && (
            <button
              onClick={() => {
                setSearchInput("");
                setFilters({ search: "" });
                fetchJobs();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filter Dropdown */}
        <div className="relative">
          <motion.button
            onClick={() => setShowFilters(!showFilters)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex h-12 items-center gap-2 rounded-xl border px-6 text-sm font-semibold transition-all ${
              filters.type
                ? "border-brand-cyan-dark bg-brand-cyan-dark/10 text-brand-cyan-dark"
                : "border-gray-200 bg-white text-gray-700 hover:border-brand-cyan-dark hover:bg-gray-50"
            }`}
          >
            <Filter className="h-4 w-4" />
            {filters.type || "Filters"}
          </motion.button>

          {showFilters && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute right-0 top-14 z-10 w-48 rounded-xl border border-gray-200 bg-white p-2 shadow-lg"
            >
              <button
                onClick={() => handleFilterByType(null)}
                className={`w-full rounded-lg px-4 py-2 text-left text-sm transition-colors ${
                  !filters.type
                    ? "bg-brand-cyan-dark/10 font-semibold text-brand-cyan-dark"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                All Types
              </button>
              <button
                onClick={() => handleFilterByType("Full-time")}
                className={`w-full rounded-lg px-4 py-2 text-left text-sm transition-colors ${
                  filters.type === "Full-time"
                    ? "bg-brand-cyan-dark/10 font-semibold text-brand-cyan-dark"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Full-time
              </button>
              <button
                onClick={() => handleFilterByType("Part-time")}
                className={`w-full rounded-lg px-4 py-2 text-left text-sm transition-colors ${
                  filters.type === "Part-time"
                    ? "bg-brand-cyan-dark/10 font-semibold text-brand-cyan-dark"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Part-time
              </button>
            </motion.div>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="relative">
          <motion.button
            onClick={() => setShowSortDropdown(!showSortDropdown)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex h-12 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 transition-all hover:border-brand-cyan-dark hover:bg-gray-50"
          >
            <ArrowUpDown className="h-4 w-4" />
            {currentSortLabel}
            <ChevronDown className={`h-4 w-4 transition-transform ${showSortDropdown ? "rotate-180" : ""}`} />
          </motion.button>

          {showSortDropdown && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute right-0 top-14 z-10 w-48 rounded-xl border border-gray-200 bg-white p-2 shadow-lg"
            >
              {SORT_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSortChange(option.value)}
                  className={`w-full rounded-lg px-4 py-2 text-left text-sm transition-colors ${
                    filters.sortBy === option.value
                      ? "bg-brand-cyan-dark/10 font-semibold text-brand-cyan-dark"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {filters.sortBy === option.value && (
                    <CheckCircle className="mr-2 inline h-4 w-4" />
                  )}
                  {option.label}
                </button>
              ))}
            </motion.div>
          )}
        </div>

        {/* Clear Filters */}
        {(filters.search || filters.type || (filters.sortBy && filters.sortBy !== "best_match")) && (
          <motion.button
            onClick={handleClearFilters}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex h-12 items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 text-sm font-semibold text-red-600 transition-all hover:bg-red-100"
          >
            <X className="h-4 w-4" />
            Clear
          </motion.button>
        )}

        <Link href="/jobs/my-applications">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex h-12 items-center gap-2 rounded-xl bg-brand-cyan-dark px-6 text-sm font-bold text-white shadow-lg shadow-brand-cyan-dark/20 transition-all hover:bg-brand-cyan"
          >
            <Briefcase className="h-4 w-4" />
            My Applications
          </motion.div>
        </Link>
      </div>

      {/* Close dropdown when clicking outside */}
      {(showFilters || showSortDropdown) && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => {
            setShowFilters(false);
            setShowSortDropdown(false);
          }}
        />
      )}

      {/* Job Board */}
      {filteredJobs.length === 0 ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-8">
          <Briefcase className="mb-4 h-12 w-12 text-gray-300" />
          <h3 className="mb-2 font-display text-lg font-bold text-gray-700">
            No jobs found
          </h3>
          <p className="text-sm text-gray-500">
            Try adjusting your search or filters
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Job List */}
          <div className="space-y-4 lg:col-span-1">
            {filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                isSelected={selectedJob?.id === job.id}
                onClick={() => setSelectedJob(job)}
              />
            ))}
          </div>

          {/* Job Detail */}
          <div className="lg:col-span-2">
            {selectedJob && (
              <JobDetail
                job={selectedJob}
                onApply={handleApply}
                isApplying={isApplying}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ===============================
// SUB-COMPONENTS
// ===============================

interface JobCardProps {
  job: JobOffer;
  isSelected: boolean;
  onClick: () => void;
}

function JobCard({ job, isSelected, onClick }: JobCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      className={`cursor-pointer rounded-2xl border bg-white p-4 shadow-sm transition-all hover:shadow-md ${
        isSelected ? "border-brand-cyan-dark" : "border-gray-200"
      }`}
    >
      <div className="mb-3 flex items-start justify-between">
        <h3 className="flex-1 font-bold text-brand-primary">{job.title}</h3>
        {job.hasApplied && (
          <CheckCircle className="h-5 w-5 shrink-0 text-green-600" />
        )}
      </div>
      <p className="mb-2 text-sm font-semibold text-gray-700">{job.company}</p>
      <div className="space-y-1 text-xs text-gray-600">
        <div className="flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5" />
          {job.location}
        </div>
        <div className="flex items-center gap-2">
          <DollarSign className="h-3.5 w-3.5" />
          {job.salaryRange}
        </div>
      </div>
      <div className="mt-3">
        <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">
          {job.type}
        </span>
      </div>
    </motion.div>
  );
}

interface JobDetailProps {
  job: JobOffer;
  onApply: (jobId: number) => void;
  isApplying: boolean;
}

function JobDetail({ job, onApply, isApplying }: JobDetailProps) {
  return (
    <motion.div
      key={job.id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <div className="mb-6">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex-1">
            <h2 className="font-display text-2xl font-bold text-brand-primary">
              {job.title}
            </h2>
            <p className="mt-1 text-lg font-semibold text-gray-700">
              {job.company}
            </p>
          </div>
          {job.hasApplied && (
            <div className="rounded-xl bg-green-100 px-4 py-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-bold text-green-700">Applied</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-400" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-gray-400" />
            <span>{job.salaryRange}</span>
          </div>
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-gray-400" />
            <span>{job.type}</span>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="mb-3 font-display text-lg font-bold text-brand-primary">
          Job Description
        </h3>
        <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">
          {job.description}
        </p>

        {job.requirements.length > 0 && (
          <div className="mt-6">
            <h4 className="mb-2 font-bold text-brand-primary">Requirements:</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              {job.requirements.map((req, index) => (
                <li key={`${job.id}-req-${index}`} className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        {job.hasApplied ? (
          <button
            disabled
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gray-200 px-6 py-3 text-sm font-bold text-gray-500"
          >
            <CheckCircle className="h-4 w-4" />
            Applied
          </button>
        ) : (
          <motion.button
            onClick={() => onApply(job.id)}
            disabled={isApplying}
            whileHover={{ scale: isApplying ? 1 : 1.02 }}
            whileTap={{ scale: isApplying ? 1 : 0.98 }}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-cyan-dark px-6 py-3 text-sm font-bold text-white shadow-lg shadow-brand-cyan-dark/20 transition-all hover:bg-brand-cyan disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isApplying ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Applying...
              </>
            ) : (
              "Apply Now"
            )}
          </motion.button>
        )}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-6 py-3 text-sm font-bold text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50"
        >
          <ExternalLink className="h-4 w-4" />
          View More
        </motion.button>
      </div>
    </motion.div>
  );
}
