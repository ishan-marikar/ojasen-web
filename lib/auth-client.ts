"use client";

import { createAuthClient } from "better-auth/react";
import { anonymousClient } from "better-auth/client/plugins";
import { AuthLogger } from "@/lib/auth-logger";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  
  plugins: [
    anonymousClient()
  ],

  fetchOptions: {
    onError(error) {
      AuthLogger.error("Auth client error", { error: error.error });
      if (error.error.status === 429) {
        console.error("Too many requests. Please try again later.");
      } else if (error.error.status === 401) {
        console.error("Unauthorized. Please sign in.");
      } else {
        // Implement graceful degradation for auth errors
        // Log the error but don't break the user experience
        console.error(error.error.message || "An error occurred");
        console.warn("Authentication service encountered an issue. Core functionality will continue to work.");
      }
    },
    onSuccess(data) {
      AuthLogger.info("Auth client success", { data });
      console.log("Auth action successful:", data);
    },
  },
});

export const { 
  signIn, 
  signUp, 
  signOut, 
  useSession,
  forgetPassword,
  resetPassword,
  verifyEmail
} = authClient;