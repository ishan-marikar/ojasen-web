"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SignInForm } from "@/components/sign-in-form";

export default function SignInPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background font-body">
      <div className="w-full max-w-md space-y-8 p-8 bg-white dark:bg-black rounded-lg shadow-lg">
        <div>
          <h1 className="text-3xl font-semibold leading-10 tracking-tight text-center">
            Ojasen Healing Arts
          </h1>
          <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Sign in to your account
          </h2>
        </div>

        <SignInForm />

        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{" "}
            <Link
              href="/sign-up"
              className="font-medium text-primary hover:text-primary/80"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
