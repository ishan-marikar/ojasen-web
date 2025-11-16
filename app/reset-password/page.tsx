"use client";

import { useState } from "react";
import Link from "next/link";
import { resetPassword } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthLogger } from "@/lib/auth-logger";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const res = await resetPassword(
        {
          newPassword: password,
          token: token || "",
        },
        {
          onSuccess: () => {
            AuthLogger.info("Password reset successful", {
              token: token?.substring(0, 10) + "...",
            });
            setMessage(
              "Password reset successfully. Redirecting to sign in..."
            );
            setTimeout(() => {
              router.push("/sign-in");
            }, 2000);
          },
        }
      );

      if (res.error) {
        AuthLogger.warn("Password reset error", {
          token: token?.substring(0, 10) + "...",
          error: res.error.message,
        });
        setError(res.error.message || "An error occurred");
      }
    } catch (err) {
      AuthLogger.error("Password reset unexpected error", {
        token: token?.substring(0, 10) + "...",
        error: err,
      });
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background font-body">
      <div className="w-full max-w-md space-y-8 p-8 bg-white dark:bg-black rounded-lg shadow-lg">
        <div>
          <h1 className="text-3xl font-semibold leading-10 tracking-tight text-center">
            Ojasen Healing Arts
          </h1>
          <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Reset your password
          </h2>
        </div>

        {!token ? (
          <div className="text-center">
            <p className="text-red-500">Invalid or missing reset token.</p>
            <Link
              href="/forgot-password"
              className="mt-4 inline-block text-primary hover:text-primary/80"
            >
              Request a new reset link
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                New Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
                required
                minLength={8}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-background dark:text-foreground"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setConfirmPassword(e.target.value)
                }
                required
                minLength={8}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-background dark:text-foreground"
              />
            </div>

            {error && <div className="text-red-500 text-sm">{error}</div>}
            {message && <div className="text-green-500 text-sm">{message}</div>}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Remember your password?{" "}
            <Link
              href="/sign-in"
              className="font-medium text-primary hover:text-primary/80"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
