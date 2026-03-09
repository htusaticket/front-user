"use client";

import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Calendar,
  AlertTriangle,
  Crown,
  Loader2,
  CheckCircle,
  Briefcase,
  Target,
  Clock,
  Shield,
  Edit,
  Save,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState, useCallback } from "react";

import { useProfileStore, formatResetDate, hasStrikes, getStrikeProgress } from "@/store/profile";

export default function ProfilePage() {
  const {
    user,
    subscription,
    stats,
    strikes,
    systemSettings,
    isLoading,
    isSaving,
    fetchProfile,
    updateProfile,
  } = useProfileStore();

  const [isEditing, setIsEditing] = useState(false);
  const [city, setCity] = useState(user?.city || "");
  const [country, setCountry] = useState(user?.country || "");

  // Fetch profile on mount
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Sync form data when user loads - only update if user changes and we're not editing
  const userId = user?.id;
  useEffect(() => {
    if (user && !isEditing) {
      setCity(user.city || "");
      setCountry(user.country || "");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // Calculate days remaining based on subscription endDate
  const subscriptionEndDate = subscription?.endDate;
  const daysRemaining = useMemo(() => {
    if (!subscriptionEndDate) return 0;
    const endDate = new Date(subscriptionEndDate);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  }, [subscriptionEndDate]);

  const handleEditToggle = useCallback(() => {
    if (isEditing) {
      // Cancel - restore original data
      setCity(user?.city || "");
      setCountry(user?.country || "");
    }
    setIsEditing(!isEditing);
  }, [isEditing, user]);

  const handleSave = useCallback(async () => {
    const updateData: Record<string, string> = {};
    
    if (city !== (user?.city || "")) {
      updateData.city = city;
    }
    if (country !== (user?.country || "")) {
      updateData.country = country;
    }

    if (Object.keys(updateData).length === 0) {
      setIsEditing(false);
      return;
    }

    const success = await updateProfile(updateData);
    if (success) {
      setIsEditing(false);
    }
  }, [city, country, user, updateProfile]);

  if (isLoading) {
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
          My Profile
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Manage your personal information and account settings
        </p>
      </div>

      {/* Subscription & Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {/* Subscription Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-gray-200 bg-gradient-to-br from-brand-cyan-dark to-brand-cyan p-6 text-white shadow-lg"
        >
          <div className="mb-3 flex items-center justify-between">
            <Crown className="h-8 w-8" />
          </div>
          <p className="text-sm font-medium opacity-90">Subscription</p>
          <p className="mt-1 font-display text-2xl font-bold">
            {subscription?.plan || "Loading..."}
          </p>
          <p className="mt-2 text-xs opacity-75">
            Member since {subscription?.memberSince || "..."}
          </p>
        </motion.div>

        {/* Days Remaining */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-gray-200 bg-white p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Days Remaining
              </p>
              <p className="mt-1 font-display text-3xl font-bold text-brand-primary">
                {daysRemaining}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        {/* Job Applied */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-gray-200 bg-white p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Job Applied
              </p>
              <p className="mt-1 font-display text-3xl font-bold text-brand-primary">
                {stats.jobApplications}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100">
              <Briefcase className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </motion.div>

        {/* Challenges Completed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-gray-200 bg-white p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Challenges Completed
              </p>
              <p className="mt-1 font-display text-3xl font-bold text-brand-primary">
                {stats.completedChallenges}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
              <Target className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Strikes Status - Only show if strikes are enabled globally */}
      {systemSettings.strikesEnabled && (
        hasStrikes(strikes) ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="overflow-hidden rounded-2xl border-2 border-amber-200 bg-amber-50 shadow-sm"
          >
            <div className="bg-amber-100 px-6 py-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-700" />
                <span className="text-sm font-bold uppercase tracking-wider text-amber-900">
                  Penalty Status
                </span>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-amber-900">
                    Accumulated Strikes
                  </span>
                  <span className="font-display text-lg font-bold text-amber-900">
                    {strikes.strikesCount} / {strikes.maxStrikes}
                  </span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-amber-200">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${getStrikeProgress(strikes)}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className={`h-full rounded-full transition-all ${
                      strikes.strikesCount === 1
                        ? "bg-amber-500"
                        : strikes.strikesCount === 2
                          ? "bg-orange-500"
                          : "bg-red-500"
                    }`}
                  />
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl bg-white p-4">
                <Calendar className="h-5 w-5 shrink-0 text-amber-600" />
                <div>
                  <p className="text-sm font-bold text-amber-900">
                    Strikes reset on: {formatResetDate(strikes.resetDate)}
                  </p>
                  <p className="mt-1 text-xs text-amber-800">
                    If you accumulate {strikes.maxStrikes} strikes, your account will be
                    temporarily suspended. Cancel classes more than 24 hours in
                    advance to avoid penalties.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="overflow-hidden rounded-2xl border-2 border-green-200 bg-green-50 shadow-sm"
          >
            <div className="flex items-center gap-4 p-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
                <Shield className="h-7 w-7 text-green-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-lg font-bold text-green-900">
                    Good Standing
                  </h3>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <p className="text-sm text-green-700">
                  You have no strikes. Keep it up!
                </p>
              </div>
            </div>
          </motion.div>
        )
      )}

      {/* Personal Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl font-bold text-brand-primary">
              Personal Information
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              You can update your city and country
            </p>
          </div>
          <div className="flex gap-2">
            {isEditing && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={handleEditToggle}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-700 transition-all hover:bg-gray-50"
              >
                <X className="h-4 w-4" />
                Cancel
              </motion.button>
            )}
            {!isEditing ? (
              <motion.button
                onClick={handleEditToggle}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 rounded-xl border-2 border-brand-cyan-dark bg-white px-4 py-2 text-sm font-bold text-brand-cyan-dark transition-all hover:bg-brand-cyan-dark hover:text-white"
              >
                <Edit className="h-4 w-4" />
                Edit
              </motion.button>
            ) : (
              <motion.button
                onClick={handleSave}
                disabled={isSaving}
                whileHover={{ scale: isSaving ? 1 : 1.02 }}
                whileTap={{ scale: isSaving ? 1 : 0.98 }}
                className="flex items-center gap-2 rounded-xl bg-brand-cyan-dark px-4 py-2 text-sm font-bold text-white shadow-lg shadow-brand-cyan-dark/20 transition-all hover:bg-brand-cyan disabled:opacity-50"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save Changes
              </motion.button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* First Name - Read Only */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-700">
              <User className="h-4 w-4 text-brand-cyan-dark" />
              First Name
              <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-500">
                Read only
              </span>
            </label>
            <div className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-700">
              {user?.firstName || "Not provided"}
            </div>
          </div>

          {/* Last Name - Read Only */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-700">
              <User className="h-4 w-4 text-brand-cyan-dark" />
              Last Name
              <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-500">
                Read only
              </span>
            </label>
            <div className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-700">
              {user?.lastName || "Not provided"}
            </div>
          </div>

          {/* Email - Read Only */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-700">
              <Mail className="h-4 w-4 text-brand-cyan-dark" />
              Email
              <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-500">
                Read only
              </span>
            </label>
            <div className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-700">
              {user?.email || "Not provided"}
            </div>
          </div>

          {/* Phone - Read Only */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-700">
              <Phone className="h-4 w-4 text-brand-cyan-dark" />
              Phone
              <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-500">
                Read only
              </span>
            </label>
            <div className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-700">
              {user?.phone || "Not provided"}
            </div>
          </div>

          {/* City - Editable */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-700">
              <MapPin className="h-4 w-4 text-brand-cyan-dark" />
              City
            </label>
            {isEditing ? (
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter your city"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-all focus:border-brand-cyan-dark focus:ring-2 focus:ring-brand-cyan-dark/20"
              />
            ) : (
              <div className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-700">
                {user?.city || "Not provided"}
              </div>
            )}
          </div>

          {/* Country - Editable */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-700">
              <Globe className="h-4 w-4 text-brand-cyan-dark" />
              Country
            </label>
            {isEditing ? (
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Enter your country"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-all focus:border-brand-cyan-dark focus:ring-2 focus:ring-brand-cyan-dark/20"
              />
            ) : (
              <div className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-700">
                {user?.country || "Not provided"}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
