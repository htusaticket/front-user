"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, Mail, X } from "lucide-react";
import { useEffect, useState } from "react";

import { useProfileStore } from "@/store/profile";

export function NoSubscriptionOverlay() {
  const { subscription, isLoading, user } = useProfileStore();
  const [showOverlay, setShowOverlay] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Show overlay if user has no active subscription and hasn't dismissed it
    if (!isLoading && subscription && !subscription.hasActiveSubscription && !dismissed) {
      // Small delay to prevent flash
      const timer = setTimeout(() => setShowOverlay(true), 500);
      return () => clearTimeout(timer);
    } else {
      setShowOverlay(false);
    }
  }, [subscription, isLoading, dismissed]);

  const handleDismiss = () => {
    setDismissed(true);
    setShowOverlay(false);
  };

  // Don't show for staff/admin users
  if (user?.role === "ADMIN" || user?.role === "SUPERADMIN") {
    return null;
  }

  return (
    <AnimatePresence>
      {showOverlay && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl"
          >
            {/* Close button */}
            <button
              onClick={handleDismiss}
              className="absolute right-4 top-4 rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Icon */}
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-orange-100">
              <CreditCard className="h-10 w-10 text-amber-600" />
            </div>

            {/* Content */}
            <div className="text-center">
              <h2 className="font-display text-2xl font-bold text-gray-900 mb-2">
                Welcome, {user?.firstName}! 🎉
              </h2>
              <p className="text-gray-600 mb-6">
                Your account has been approved! To access all premium features like 
                <strong> live classes</strong>, <strong>challenges</strong>, and the 
                <strong> job board</strong>, you need an active subscription plan.
              </p>

              {/* Features list */}
              <div className="mb-6 text-left bg-gray-50 rounded-xl p-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">With a subscription you get:</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>✅ Access to all Academy content</li>
                  <li>✅ Live classes with expert teachers</li>
                  <li>✅ Daily challenges with feedback</li>
                  <li>✅ Job opportunities (select plans)</li>
                </ul>
              </div>

              {/* Contact info */}
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-6">
                <Mail className="h-4 w-4" />
                <span>Contact us to get your subscription activated</span>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3">
                <a
                  href="mailto:support@jfalcon.com?subject=Subscription%20Request"
                  className="w-full rounded-xl bg-brand-primary py-3 text-center font-bold text-white hover:bg-brand-primary/90 transition-colors"
                >
                  Contact Support
                </a>
                <button
                  onClick={handleDismiss}
                  className="w-full rounded-xl border border-gray-200 py-3 text-center font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Continue with limited access
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
