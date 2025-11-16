"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AuthLogger } from "@/lib/auth-logger";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    // If we're not pending and there's no session, redirect to sign in
    if (!isPending && !session) {
      AuthLogger.warn("Protected route access denied - no session");
      router.push("/sign-in");
    }
  }, [session, isPending, router]);

  // Show loading state while checking session
  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If there's no session, don't render children
  if (!session) {
    return null;
  }

  AuthLogger.info("Protected route accessed", { userId: session.user.id });

  // If there is a session, render children
  return <>{children}</>;
}
