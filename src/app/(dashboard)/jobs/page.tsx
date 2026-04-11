"use client";

import { motion } from "framer-motion";
import {
  Briefcase,
  MapPin,
  Building,
  Filter,
  Search,
  CheckCircle,
  Loader2,
  X,
  ChevronDown,
  ArrowUpDown,
  Lock,
  Crown,
  Globe,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useCallback, useMemo } from "react";
import { toast } from "sonner";

import api from "@/lib/api";
import { useJobsStore } from "@/store/jobs";
import { useProfileStore } from "@/store/profile";
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

  const { planFeatures, isLoading: isProfileLoading, fetchProfile } = useProfileStore();

  const [searchInput, setSearchInput] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isRequestingUpgrade, setIsRequestingUpgrade] = useState(false);
  const [hasRequestedUpgrade, setHasRequestedUpgrade] = useState(false);

  // Check if user has access to job board
  const hasJobAccess = planFeatures?.jobBoard ?? false;

  // Check if user has already requested upgrade (from sessionStorage, per-user + plan key)
  // Key includes plan info so it auto-resets when subscription situation changes
  const { user, subscription: subInfo } = useProfileStore();
  const planKey = subInfo?.plan ? `${subInfo.plan}_${subInfo.hasActiveSubscription ? "active" : "expired"}` : "noplan";
  const storageKey = user?.id ? `upgrade_requested_${user.id}_${planKey}` : null;

  useEffect(() => {
    if (!storageKey) return;
    const requested = sessionStorage.getItem(storageKey);
    if (requested === "true") {
      setHasRequestedUpgrade(true);
    }
  }, [storageKey]);

  const handleUpgradeRequest = useCallback(async () => {
    setIsRequestingUpgrade(true);
    try {
      await api.post("/api/contact/upgrade");
      setHasRequestedUpgrade(true);
      if (storageKey) sessionStorage.setItem(storageKey, "true");
      toast.success("Upgrade request sent successfully! Our team will get back to you soon.");
      setShowUpgradeModal(false);
    } catch {
      toast.error("Failed to send upgrade request. Please try again later.");
    } finally {
      setIsRequestingUpgrade(false);
    }
  }, [storageKey]);

  // Fetch profile to get plan features
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

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
    // Open airtable application form
    window.open("https://airtable.com/appiPekJv9PdMSORq/pagHDDxQnMHRJxILZ/form", "_blank");
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

  // Build dynamic type options from loaded jobs
  const typeOptions = useMemo(() => {
    const types = new Set<string>();
    jobs.forEach(job => {
      if (job.type) types.add(job.type);
    });
    return Array.from(types).sort();
  }, [jobs]);

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

  // Show locked view for users without job board access
  if (!hasJobAccess && !isProfileLoading) {
    return (
      <div className="relative min-h-[600px]">
        {/* Blurred background content */}
        <div className="pointer-events-none select-none blur-[2px]">
          <div className="space-y-8">
            {/* Header */}
            <div>
              <h1 className="font-display text-3xl font-bold text-brand-primary">
                Job Offers
              </h1>
              <p className="mt-2 text-lg text-gray-600">
                Find sales opportunities and apply directly
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-gray-200 bg-white p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Available Offers</p>
                    <p className="mt-1 font-display text-3xl font-bold text-brand-primary">24</p>
                  </div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand-cyan-dark/10">
                    <Briefcase className="h-7 w-7 text-brand-cyan-dark" />
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Active Applications</p>
                    <p className="mt-1 font-display text-3xl font-bold text-brand-primary">5</p>
                  </div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-green-100">
                    <CheckCircle className="h-7 w-7 text-green-600" />
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">New This Week</p>
                    <p className="mt-1 font-display text-3xl font-bold text-brand-primary">8</p>
                  </div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-purple-100">
                    <Building className="h-7 w-7 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Placeholder job cards */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="rounded-2xl border border-gray-200 bg-white p-6">
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Sales Representative</h3>
                      <p className="text-sm text-gray-500">Tech Company Inc.</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-lg bg-gray-100 px-3 py-1 text-xs text-gray-600">Remote</span>
                    <span className="rounded-lg bg-green-100 px-3 py-1 text-xs text-green-700">$50K-80K</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Overlay with upgrade message */}
        <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mx-4 max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-2xl"
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand-cyan-dark to-brand-cyan">
              <Lock className="h-8 w-8 text-white" />
            </div>
            <h2 className="font-display text-2xl font-bold text-brand-primary">
              Upgrade Your Plan
            </h2>
            <p className="mt-3 text-sm text-gray-500">
              Upgrade your subscription to access exclusive job opportunities and start applying today.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              {hasRequestedUpgrade ? (
                <div className="rounded-xl bg-green-50 border border-green-200 py-3 px-4 text-center">
                  <div className="flex items-center justify-center gap-2 text-green-700 font-semibold">
                    <CheckCircle className="h-5 w-5" />
                    Upgrade request sent
                  </div>
                  <p className="text-xs text-green-600 mt-1">
                    We will reach out shortly with next steps.
                  </p>
                </div>
              ) : (
                <button
                  onClick={() => setShowUpgradeModal(true)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-cyan-dark to-brand-cyan px-6 py-3 font-bold text-white transition-all hover:shadow-lg hover:shadow-brand-cyan-dark/30"
                >
                  <Crown className="h-5 w-5" />
                  Request Upgrade
                </button>
              )}
              <Link
                href="/dashboard"
                className="text-sm font-medium text-gray-500 hover:text-brand-cyan-dark"
              >
                Return to Dashboard
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Upgrade Confirmation Modal */}
        {showUpgradeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mx-4 max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
            >
              <h3 className="mb-3 font-display text-lg font-bold text-brand-primary">
                Confirm Upgrade Request
              </h3>
              <p className="mb-6 text-sm text-gray-600">
                This will send an upgrade request to our team. Do you want to proceed?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  disabled={isRequestingUpgrade}
                  className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpgradeRequest}
                  disabled={isRequestingUpgrade}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-cyan-dark to-brand-cyan px-4 py-2.5 text-sm font-bold text-white transition-all hover:shadow-lg disabled:opacity-50"
                >
                  {isRequestingUpgrade ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Confirm"
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-brand-primary">
          Job Offers
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Find sales opportunities and apply directly
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
              {typeOptions.map((type) => (
                <button
                  key={type}
                  onClick={() => handleFilterByType(type)}
                  className={`w-full rounded-lg px-4 py-2 text-left text-sm transition-colors ${
                    filters.type === type
                      ? "bg-brand-cyan-dark/10 font-semibold text-brand-cyan-dark"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {type}
                </button>
              ))}
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
      <div className="mb-3 flex items-start justify-between gap-2">
        <h3 className="flex-1 font-bold text-brand-primary">{job.title}</h3>
        {job.hasApplied && (
          <CheckCircle className="h-5 w-5 shrink-0 text-green-600" />
        )}
      </div>
      <p className="mb-2 text-sm font-semibold text-gray-700">{job.company}</p>
      {job.code && (
        <p className="mb-2 inline-block rounded-md bg-brand-primary/10 px-2 py-0.5 text-xs font-bold text-brand-primary">
          CODE: {job.code}
        </p>
      )}
      <div className="space-y-1 text-xs text-gray-600">
        {job.social ? (
          <a
            href={job.social.startsWith("http") ? job.social : `https://${job.social}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-2 text-brand-cyan-dark hover:underline"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Social
          </a>
        ) : job.location ? (
          <div className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5" />
            {job.location}
          </div>
        ) : null}
        {job.recruiterSocial && (
          <a
            href={job.recruiterSocial.startsWith("http") ? job.recruiterSocial : `https://${job.recruiterSocial}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-2 text-purple-600 hover:underline"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Recruiter
          </a>
        )}
        {job.website && (
          <a
            href={job.website.startsWith("http") ? job.website : `https://${job.website}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-2 text-brand-cyan-dark hover:underline"
          >
            <Globe className="h-3.5 w-3.5" />
            Website
          </a>
        )}
        <div className="flex items-center gap-2">
          {job.oteMin && job.oteMax
            ? `$${job.oteMin.toLocaleString()} - $${job.oteMax.toLocaleString()} OTE`
            : (job.salaryRange?.replace(/\$+/g, "$") || "Not specified")}
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
            {job.code && (
              <p className="mt-2 inline-block rounded-md bg-brand-primary/10 px-2.5 py-1 text-sm font-bold text-brand-primary">
                CODE: {job.code}
              </p>
            )}
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
          {job.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span>{job.location}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <span>{job.oteMin && job.oteMax
              ? `$${job.oteMin.toLocaleString()} - $${job.oteMax.toLocaleString()} OTE`
              : (job.salaryRange?.replace(/\$+/g, "$") || "Not specified")}</span>
          </div>
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-gray-400" />
            <span>{job.type}</span>
          </div>
          {job.social && (
            <a
              href={job.social.startsWith("http") ? job.social : `https://${job.social}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-brand-cyan-dark transition-colors hover:text-brand-cyan"
            >
              <ExternalLink className="h-4 w-4" />
              <span className="underline">Social</span>
            </a>
          )}
          {job.recruiterSocial && (
            <a
              href={job.recruiterSocial.startsWith("http") ? job.recruiterSocial : `https://${job.recruiterSocial}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-purple-600 transition-colors hover:text-purple-500"
            >
              <ExternalLink className="h-4 w-4" />
              <span className="underline">Recruiter Social</span>
            </a>
          )}
          {job.website && (
            <a
              href={job.website.startsWith("http") ? job.website : `https://${job.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-brand-cyan-dark transition-colors hover:text-brand-cyan"
            >
              <Globe className="h-4 w-4" />
              <span className="underline">{job.website.replace(/^https?:\/\//, "")}</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
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
              {job.requirements.map((req) => (
                <li key={`${job.id}-req-${req}`} className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="flex">
        {job.hasApplied ? (
          <button
            disabled
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-200 px-6 py-3 text-sm font-bold text-gray-500"
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
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-cyan-dark px-6 py-3 text-sm font-bold text-white shadow-lg shadow-brand-cyan-dark/20 transition-all hover:bg-brand-cyan disabled:cursor-not-allowed disabled:opacity-50"
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
      </div>
    </motion.div>
  );
}
