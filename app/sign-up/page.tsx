"use client";

import Link from "next/link";
import { SignUpForm } from "@/components/sign-up-form";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background font-body">
      <div className="w-full max-w-md space-y-8 p-8 bg-white dark:bg-black rounded-lg shadow-lg">
        <div>
          <h1 className="text-3xl font-semibold leading-10 tracking-tight text-center">
            Ojasen Healing Arts
          </h1>
          <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Create a new account
          </h2>
        </div>

        <SignUpForm />

        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
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
