# Authentication System

This document explains how the authentication system works in this Next.js application.

## Overview

The authentication system uses [Better Auth](https://www.better-auth.com/) with the following features:

- Email/password authentication
- Session management
- Email verification
- Password reset
- Rate limiting
- Protected routes

## Key Components

### 1. Core Authentication (`lib/auth.ts`)

This file configures the Better Auth instance with:

- Database adapter (Prisma with PostgreSQL)
- Email/password settings
- Session configuration
- Email verification
- Rate limiting
- Callbacks for logging authentication events

### 2. Client Authentication (`lib/auth-client.ts`)

This file creates the client-side authentication client with error handling.

### 3. Authentication Actions (`lib/auth-actions.ts`)

Server actions for authentication operations like sign out.

### 4. Logging (`lib/auth-logger.ts`)

Custom logger that writes authentication events to:

- Console (in development)
- Log files (`logs/auth.log`)

### 5. Email Service (`lib/email-service.ts`)

Service for sending authentication emails (currently mocked for development).

## Environment Variables

The following environment variables are required (see `.env` or `.env.example`):

```
BETTER_AUTH_SECRET=your-super-secret-key-change-this-in-production
BETTER_AUTH_URL=https://ojasenhealingarts.com
DATABASE_URL=postgresql://neondb_owner:npg_i7sIUaB4LReT@ep-young-bar-a179rbv0-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
NEXT_PUBLIC_APP_URL=https://ojasenhealingarts.com
```

## Authentication Flow

1. **Sign Up**: Users can create an account with email and password
2. **Email Verification**: New users receive an email verification link
3. **Sign In**: Verified users can sign in with email and password
4. **Session Management**: Authenticated users receive a session cookie
5. **Protected Routes**: Access to protected pages is restricted to authenticated users
6. **Password Reset**: Users can reset their password via email

## Logging

All authentication events are logged with the following levels:

- `info`: Successful operations (sign in, sign up, etc.)
- `warn`: Client errors (invalid credentials, etc.)
- `error`: Server errors (database issues, etc.)

Logs are stored in `logs/auth.log` in JSON format.

## Extending the System

To use a real email service in production:

1. Update `lib/email-service.ts` with your email provider's API
2. Add email configuration to `.env`
3. Update the email sending functions to use the real service
