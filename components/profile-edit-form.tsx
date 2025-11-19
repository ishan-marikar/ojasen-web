"use client";

import { useState, useEffect } from "react";
import { updateUserProfile } from "@/lib/form-actions";
import Link from "next/link";
import { forgetPassword } from "@/lib/auth-client"; // Import forgetPassword for password reset

interface User {
  id: string;
  name: string | null;
  email: string;
  // Make role optional since it might not be in the session user object
  role?: string;
  isAnonymous?: boolean | null; // Add isAnonymous property
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
}

export function ProfileEditForm({
  user,
  initialPhone = "",
  initialEmergencyContactName = "",
  initialEmergencyContactPhone = "",
}: {
  user: User;
  initialPhone?: string;
  initialEmergencyContactName?: string;
  initialEmergencyContactPhone?: string;
}) {
  console.log("ProfileEditForm received user:", user);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: user.name || "",
    email: user.email,
    phone: initialPhone,
    emergencyContactName: initialEmergencyContactName,
    emergencyContactPhone: initialEmergencyContactPhone,
  });
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  // State for password reset functionality
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  const [resetError, setResetError] = useState<string | null>(null);

  // Update form data when initial values change
  useEffect(() => {
    setFormData({
      name: user.name || "",
      email: user.email,
      phone: initialPhone,
      emergencyContactName: initialEmergencyContactName,
      emergencyContactPhone: initialEmergencyContactPhone,
    });
  }, [
    user,
    initialPhone,
    initialEmergencyContactName,
    initialEmergencyContactPhone,
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    try {
      const result = await updateUserProfile(formData);

      if (result.success) {
        setFeedback({
          type: "success",
          message: "Profile updated successfully!",
        });
        setIsEditing(false);
      } else {
        setFeedback({
          type: "error",
          message:
            result.error || "Failed to update profile. Please try again.",
        });
      }
    } catch (error: any) {
      // Check if this is a redirect error from Next.js server actions
      if (error?.digest?.includes("NEXT_REDIRECT")) {
        // This is expected behavior - the redirect was successful
        // The page will automatically navigate to the dashboard
        setFeedback({
          type: "success",
          message: "Profile updated successfully!",
        });
        setIsEditing(false);
        return;
      }

      setFeedback({
        type: "error",
        message: "Failed to update profile. Please try again.",
      });
    }
  };

  // Handle password reset for anonymous users
  const handlePasswordReset = async () => {
    console.log("Attempting password reset for user:", user);

    if (!user.email) {
      setResetError("Email is required to reset password");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.email)) {
      setResetError("You need to set your email first.");
      return;
    }

    setIsResettingPassword(true);
    setResetMessage(null);
    setResetError(null);

    try {
      console.log("Calling forgetPassword with email:", user.email);
      const res = await forgetPassword(
        {
          email: user.email,
          redirectTo: "/reset-password",
        },
        {
          onSuccess: () => {
            setResetMessage(
              "Password reset email sent. Please check your inbox."
            );
          },
        }
      );
      console.log("forgetPassword response:", res);

      if (res.error) {
        console.error("forgetPassword error:", res.error);
        setResetError(
          res.error.message || "Failed to send password reset email"
        );
      }
    } catch (err: any) {
      console.error("forgetPassword exception:", err);
      // Check if this is a redirect error from Next.js
      if (err?.digest?.includes("NEXT_REDIRECT")) {
        // This is expected behavior - the redirect was successful
        setResetMessage("Password reset email sent. Please check your inbox.");
      } else {
        setResetError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsResettingPassword(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
      {/* Feedback Message */}
      {feedback && (
        <div
          className={`mb-6 p-4 rounded-md ${
            feedback.type === "success"
              ? "bg-green-50 text-green-800"
              : "bg-red-50 text-red-800"
          }`}
        >
          <p>{feedback.message}</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Personal Information
        </h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="mt-2 sm:mt-0 px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          {isEditing ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      {/* Password Reset Alert for Anonymous Users */}
      {user.isAnonymous && (
        <div className="mb-6 p-4 rounded-md bg-yellow-50 text-yellow-800">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="font-medium">Set a Password for Your Account</h3>
              <p className="text-sm mt-1">
                As an anonymous user, you haven't set a password yet. To secure
                your account, please set a password by clicking the button
                below.
              </p>
            </div>
            <div className="mt-2 md:mt-0">
              <button
                onClick={handlePasswordReset}
                disabled={isResettingPassword}
                className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
              >
                {isResettingPassword ? "Sending..." : "Set Password"}
              </button>
            </div>
          </div>
          {resetMessage && (
            <div className="mt-3 text-sm text-green-700">{resetMessage}</div>
          )}
          {resetError && (
            <div className="mt-3 text-sm text-red-700">{resetError}</div>
          )}
        </div>
      )}

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <label
                htmlFor="emergencyContactName"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Emergency Contact Name
              </label>
              <input
                type="text"
                id="emergencyContactName"
                name="emergencyContactName"
                value={formData.emergencyContactName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <label
                htmlFor="emergencyContactPhone"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Emergency Contact Phone
              </label>
              <input
                type="tel"
                id="emergencyContactPhone"
                name="emergencyContactPhone"
                value={formData.emergencyContactPhone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Save Changes
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Personal Details
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Full Name
                </p>
                <p className="font-medium">{user.name || "Not provided"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Email Address
                </p>
                <p className="font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Phone Number
                </p>
                <p className="font-medium">
                  {formData.phone || "Not provided"}
                </p>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Emergency Contact
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                <p className="font-medium">
                  {formData.emergencyContactName || "Not provided"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Phone Number
                </p>
                <p className="font-medium">
                  {formData.emergencyContactPhone || "Not provided"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
