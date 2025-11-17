import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import { AuthLogger } from "@/lib/auth-logger";
import { EmailService } from "@/lib/email-service";
import { anonymous } from "better-auth/plugins";

const prisma = new PrismaClient();

export const auth = betterAuth({
  appName: "Ojasen Healing Arts",
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET || "fallback_secret_for_development",

  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    sendResetPassword: async ({ user, url, token }) => {
      AuthLogger.info("Password reset requested", { userId: user.id, email: user.email });
      try {
        await EmailService.sendPasswordResetEmail(user.email, url);
        AuthLogger.info("Password reset email sent successfully", { userId: user.id, email: user.email });
      } catch (error) {
        AuthLogger.error("Failed to send password reset email", { userId: user.id, email: user.email, error });
      }
    },
  },

  // Add anonymous authentication plugin
  plugins: [
    anonymous({
      disableDeleteAnonymousUser: false, // Allow deletion of anonymous accounts when upgraded
      // Add callback for when anonymous user links account
      onLinkAccount: async ({ anonymousUser, newUser }) => {
        console.log("Anonymous user linked to new account", { anonymousUser, newUser });
        // In a real app, you might want to transfer data from anonymous user to new user
        // For example, moving cart items, preferences, etc.
      },
    }),
  ],

  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }) => {
      AuthLogger.info("Email verification sent", { userId: user.id, email: user.email });
      try {
        await EmailService.sendEmailVerification(user.email, url);
        AuthLogger.info("Email verification sent successfully", { userId: user.id, email: user.email });
      } catch (error) {
        AuthLogger.error("Failed to send email verification", { userId: user.id, email: user.email, error });
      }
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    freshAge: 60 * 10, // 10 minutes
  },

  rateLimit: {
    enabled: true,
    window: 60,
    max: 10,
  },

  cookies: nextCookies(),
  
  // Add logging for authentication events
  callbacks: {
    beforeSignIn: async (data: { email: string; password: string }) => {
      AuthLogger.info("Sign in attempt", { email: data.email });
      return data;
    },
    afterSignIn: async (data: { user: { id: string; email: string; name: string }; session: { id: string } }) => {
      AuthLogger.info("Sign in successful", { userId: data.user.id, email: data.user.email });
      return data;
    },
    beforeSignUp: async (data: { email: string; password: string; name: string }) => {
      AuthLogger.info("Sign up attempt", { email: data.email });
      return data;
    },
    afterSignUp: async (data: { user: { id: string; email: string; name: string } }) => {
      AuthLogger.info("Sign up successful", { userId: data.user.id, email: data.user.email });
      return data;
    },
    beforeSignOut: async (data: { sessionId: string }) => {
      AuthLogger.info("Sign out attempt", { sessionId: data.sessionId });
      return data;
    },
  },
});

export type Session = typeof auth.$Infer.Session;