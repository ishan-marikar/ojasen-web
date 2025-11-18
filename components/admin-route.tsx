"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AuthLogger } from "@/lib/auth-logger";

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    // If we're not pending and there's no session or user is not admin, redirect
    if (!isPending && (!session || (session.user as any).role !== "admin")) {
      AuthLogger.warn("Admin route access denied", {
        hasSession: !!session,
        userRole: session ? (session.user as any).role : "no-session",
      });
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

  // If there's no session or user is not admin, don't render children
  if (!session || (session.user as any).role !== "admin") {
    return null;
  }

  AuthLogger.info("Admin route accessed", { userId: session.user.id });

  // If user is admin, render children
  return <>{children}</>;
}
