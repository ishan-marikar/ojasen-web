"use client";

import { useSession } from "@/lib/auth-client";
import { useEffect, useState } from "react";

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Don't render children until mounted to avoid hydration errors
  if (!isMounted) {
    return null;
  }

  // Show loading state while checking session
  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return children;
}
