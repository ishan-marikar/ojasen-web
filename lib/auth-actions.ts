"use server";

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { AuthLogger } from "@/lib/auth-logger";

export async function signOutAction() {
  try {
    await auth.api.signOut({
      headers: await headers(),
    });
    AuthLogger.info("User signed out successfully");
    redirect("/sign-in");
  } catch (error) {
    AuthLogger.error("Error during sign out", { error });
    redirect("/sign-in?error=signout_failed");
  }
}