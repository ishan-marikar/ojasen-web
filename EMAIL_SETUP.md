# Email Service Setup

This document explains how to configure and use the email service with Mailjet for transactional emails.

## Overview

The email service is implemented in [lib/email-service.ts](lib/email-service.ts) and provides:

1. Integration with Mailjet for production email sending
2. Fallback to mock email service for development
3. Pre-built templates for common authentication emails
4. Extensible design for custom email types

## Setup Instructions

### 1. Mailjet Account Setup

1. Create a Mailjet account at [https://www.mailjet.com/](https://www.mailjet.com/)
2. Navigate to Account Settings → API Keys
3. Copy your API Key and Secret Key
4. Add a sender email address and verify it through Mailjet's verification process

### 2. Environment Configuration

Add the following environment variables to your `.env` file:

```env
# Mailjet Email Configuration
MAILJET_API_KEY=your-mailjet-api-key
MAILJET_API_SECRET=your-mailjet-api-secret
MAILJET_SENDER_EMAIL=your-verified-sender@example.com
```

### 3. How It Works

The email service automatically detects if Mailjet credentials are configured:

- **With Mailjet credentials**: Emails are sent via Mailjet's API
- **Without Mailjet credentials**: Emails are logged to the console (development mode)

## Usage Examples

### Sending a Password Reset Email

```typescript
import { EmailService } from "@/lib/email-service";

await EmailService.sendPasswordResetEmail(
  "user@example.com",
  "https://yoursite.com/reset-password?token=abc123"
);
```

### Sending an Email Verification

```typescript
import { EmailService } from "@/lib/email-service";

await EmailService.sendEmailVerification(
  "user@example.com",
  "https://yoursite.com/verify-email?token=xyz789"
);
```

### Sending a Custom Email

```typescript
import { EmailService } from "@/lib/email-service";

await EmailService.sendTemplatedEmail({
  to: "user@example.com",
  subject: "Welcome to Our Service",
  html: "<h1>Welcome!</h1><p>Thanks for joining us.</p>",
  text: "Welcome! Thanks for joining us.",
});
```

## Better Auth Integration

The email service is automatically integrated with Better Auth for:

- Password reset emails
- Email verification emails

No additional configuration is needed for these features.

## Best Practices

1. **Environment Separation**: Use different Mailjet accounts or API keys for development, staging, and production
2. **Error Handling**: The service includes automatic fallback to console logging if Mailjet fails
3. **Security**: Never commit API keys to version control - use environment variables
4. **Testing**: Test email delivery in staging environment before going live
5. **Monitoring**: Check logs for email delivery failures

## Troubleshooting

### Emails Not Sending

1. Verify Mailjet credentials are correctly set in environment variables
2. Check that the sender email is verified in your Mailjet account
3. Ensure your Mailjet account is not suspended or rate-limited

### Development vs Production

- In development (without credentials): Emails are logged to console
- In production (with credentials): Emails are sent via Mailjet

Check logs for "Email sent via Mailjet" vs "Email sent (mock)" messages to confirm which mode is active.
