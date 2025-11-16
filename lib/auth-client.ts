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
        console.error(error.error.message || "An error occurred");
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