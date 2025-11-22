"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthLogger } from "@/lib/auth-logger";

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    // Check admin status by calling our API endpoint
    const checkAdminStatus = async () => {
      if (!session?.user?.id) {
        setIsAdmin(false);
        return;
      }

      try {
        const response = await fetch("/api/check-admin");
        const data = await response.json();
        setIsAdmin(data.isAdmin);
      } catch (error) {
        console.error("AdminRoute: Error checking admin status", error);
        setIsAdmin(false);
      }
    };

    if (!isPending) {
      checkAdminStatus();
    }
  }, [session, isPending]);

  useEffect(() => {
    // If we're not pending and there's no session or user is not admin, redirect
    if (!isPending && (!session || isAdmin === false)) {
      AuthLogger.warn("Admin route access denied", {
        hasSession: !!session,
        userRole: session ? (session.user as any).role : "no-session",
        userId: session ? session.user.id : "no-user-id",
        isAdmin,
      });
      router.push("/sign-in");
    }
  }, [session, isPending, isAdmin, router]);

  // Show loading state while checking session
  if (isPending || isAdmin === null) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If there's no session or user is not admin, don't render children
  if (!session || isAdmin === false) {
    return null;
  }

  AuthLogger.info("Admin route accessed", { userId: session.user.id });

  // If user is admin, render children
  return <>{children}</>;
}
