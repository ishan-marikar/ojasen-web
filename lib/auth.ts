import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const auth = betterAuth({
  appName: "Ojasen Healing Arts",
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET || "fallback_secret_for_development",
  
  database: prismaAdapter(prisma, {
    provider: "sqlite",
  }),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    sendResetPassword: async ({ user, url, token }) => {
      console.log(`Password reset URL for ${user.email}: ${url}`);
      // Implement your email sending logic here
    },
  },

  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }) => {
      console.log(`Verification URL for ${user.email}: ${url}`);
      // Implement your email sending logic here
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
});

export type Session = typeof auth.$Infer.Session;