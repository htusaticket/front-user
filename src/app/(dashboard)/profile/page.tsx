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
  Edit,
  Save,
  X,
  Loader2,
  CheckCircle,
  BookOpen,
  Target,
  GraduationCap,
  Shield,
} from "lucide-react";
import { useEffect, useState, useCallback } from "react";

import { useProfileStore, formatResetDate, hasStrikes, getStrikeProgress } from "@/store/profile";
import type { ProfileFormData, ProfileFormErrors } from "@/types/profile";

export default function ProfilePage() {
  const {
    user,
    subscription,
    stats,
    strikes,
    isLoading,
    isSaving,
    fetchProfile,
    updateProfile,
    validateForm,
  } = useProfileStore();

  const [isEditing, setIsEditing] = useState(false);
  const [formErrors, setFormErrors] = useState<ProfileFormErrors>({});
  const [isFormInitialized, setIsFormInitialized] = useState(false);

  // Compute form data from user
  const userFormData: ProfileFormData = {
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    city: user?.city || "",
    country: user?.country || "",
  };

  const [formData, setFormData] = useState<ProfileFormData>(userFormData);
  const [originalFormData, setOriginalFormData] = useState<ProfileFormData>(userFormData);

  // Fetch profile on mount
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Sync form data when user loads (only once)
  useEffect(() => {
    if (user && !isFormInitialized) {
      const data: ProfileFormData = {
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        city: user.city || "",
        country: user.country || "",
      };
      setFormData(data);
      setOriginalFormData(data);
      setIsFormInitialized(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const handleEditToggle = useCallback(() => {
    if (isEditing && originalFormData) {
      // Cancel - restore original data
      setFormData(originalFormData);
      setFormErrors({});
    }
    setIsEditing(!isEditing);
  }, [isEditing, originalFormData]);

  const handleInputChange = useCallback((field: keyof ProfileFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (formErrors[field as keyof ProfileFormErrors]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }, [formErrors]);

  const handleSave = useCallback(async () => {
    // Validate
    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Only send changed fields
    const updateData: Record<string, string> = {};
    if (formData.firstName !== originalFormData.firstName) {
      updateData.firstName = formData.firstName;
    }
    if (formData.lastName !== originalFormData.lastName) {
      updateData.lastName = formData.lastName;
    }
    if (formData.phone !== originalFormData.phone) {
      updateData.phone = formData.phone;
    }
    if (formData.city !== originalFormData.city) {
      updateData.city = formData.city;
    }
    if (formData.country !== originalFormData.country) {
      updateData.country = formData.country;
    }

    if (Object.keys(updateData).length === 0) {
      setIsEditing(false);
      return;
    }

    const success = await updateProfile(updateData);
    if (success) {
      setIsEditing(false);
      setOriginalFormData(formData);
    }
  }, [formData, originalFormData, updateProfile, validateForm]);

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

        {/* Classes Completed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-gray-200 bg-white p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Classes Completed
              </p>
              <p className="mt-1 font-display text-3xl font-bold text-brand-primary">
                {stats.completedClasses}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
              <GraduationCap className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        {/* Lessons Viewed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-gray-200 bg-white p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Lessons Viewed
              </p>
              <p className="mt-1 font-display text-3xl font-bold text-brand-primary">
                {stats.completedLessons}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100">
              <BookOpen className="h-6 w-6 text-purple-600" />
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

      {/* Strikes Status */}
      {hasStrikes(strikes) ? (
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
      )}

      {/* Personal Information Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-brand-primary">
            Personal Information
          </h2>
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
          {/* First Name */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-700">
              <User className="h-4 w-4 text-brand-cyan-dark" />
              First Name
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              disabled={!isEditing}
              className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all ${
                formErrors.firstName
                  ? "border-red-300 bg-red-50 text-gray-900 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                  : isEditing
                    ? "border-gray-200 bg-white text-gray-900 focus:border-brand-cyan-dark focus:ring-2 focus:ring-brand-cyan-dark/20"
                    : "border-gray-100 bg-gray-50 text-gray-700"
              }`}
            />
            {formErrors.firstName && (
              <p className="mt-1 text-xs text-red-500">{formErrors.firstName}</p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-700">
              <User className="h-4 w-4 text-brand-cyan-dark" />
              Last Name
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              disabled={!isEditing}
              className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all ${
                formErrors.lastName
                  ? "border-red-300 bg-red-50 text-gray-900 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                  : isEditing
                    ? "border-gray-200 bg-white text-gray-900 focus:border-brand-cyan-dark focus:ring-2 focus:ring-brand-cyan-dark/20"
                    : "border-gray-100 bg-gray-50 text-gray-700"
              }`}
            />
            {formErrors.lastName && (
              <p className="mt-1 text-xs text-red-500">{formErrors.lastName}</p>
            )}
          </div>

          {/* Email - Always disabled */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-700">
              <Mail className="h-4 w-4 text-brand-cyan-dark" />
              Email
              <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-500">
                Read only
              </span>
            </label>
            <input
              type="email"
              value={formData.email}
              disabled
              className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-700">
              <Phone className="h-4 w-4 text-brand-cyan-dark" />
              Phone
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              disabled={!isEditing}
              placeholder={isEditing ? "Enter your phone number" : "Not provided"}
              className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all ${
                formErrors.phone
                  ? "border-red-300 bg-red-50 text-gray-900 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                  : isEditing
                    ? "border-gray-200 bg-white text-gray-900 focus:border-brand-cyan-dark focus:ring-2 focus:ring-brand-cyan-dark/20"
                    : "border-gray-100 bg-gray-50 text-gray-700"
              }`}
            />
            {formErrors.phone && (
              <p className="mt-1 text-xs text-red-500">{formErrors.phone}</p>
            )}
          </div>

          {/* City */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-700">
              <MapPin className="h-4 w-4 text-brand-cyan-dark" />
              City
            </label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => handleInputChange("city", e.target.value)}
              disabled={!isEditing}
              placeholder={isEditing ? "Enter your city" : "Not provided"}
              className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all ${
                formErrors.city
                  ? "border-red-300 bg-red-50 text-gray-900 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                  : isEditing
                    ? "border-gray-200 bg-white text-gray-900 focus:border-brand-cyan-dark focus:ring-2 focus:ring-brand-cyan-dark/20"
                    : "border-gray-100 bg-gray-50 text-gray-700"
              }`}
            />
            {formErrors.city && (
              <p className="mt-1 text-xs text-red-500">{formErrors.city}</p>
            )}
          </div>

          {/* Country */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-700">
              <Globe className="h-4 w-4 text-brand-cyan-dark" />
              Country
            </label>
            <input
              type="text"
              value={formData.country}
              onChange={(e) => handleInputChange("country", e.target.value)}
              disabled={!isEditing}
              placeholder={isEditing ? "Enter your country" : "Not provided"}
              className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all ${
                formErrors.country
                  ? "border-red-300 bg-red-50 text-gray-900 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                  : isEditing
                    ? "border-gray-200 bg-white text-gray-900 focus:border-brand-cyan-dark focus:ring-2 focus:ring-brand-cyan-dark/20"
                    : "border-gray-100 bg-gray-50 text-gray-700"
              }`}
            />
            {formErrors.country && (
              <p className="mt-1 text-xs text-red-500">{formErrors.country}</p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
