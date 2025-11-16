// lib/email-service.ts
import { AuthLogger } from "@/lib/auth-logger";

// Mock email service - replace with actual email service in production
export class EmailService {
  static async sendEmail(to: string, subject: string, html: string) {
    // In production, integrate with an email service like SendGrid, Nodemailer, etc.
    AuthLogger.info("Email sent (mock)", { to, subject });
    
    // For development, just log the email content
    console.log(`
      ================== MOCK EMAIL ==================
      To: ${to}
      Subject: ${subject}
      Body: ${html}
      =================================================
    `);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return { success: true };
  }

  static async sendPasswordResetEmail(to: string, resetUrl: string) {
    const subject = "Reset your password";
    const html = `
      <h2>Password Reset Request</h2>
      <p>You have requested to reset your password. Click the link below to reset your password:</p>
      <p><a href="${resetUrl}">Reset Password</a></p>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `;
    
    return this.sendEmail(to, subject, html);
  }

  static async sendEmailVerification(to: string, verificationUrl: string) {
    const subject = "Verify your email address";
    const html = `
      <h2>Welcome! Please verify your email address</h2>
      <p>Thank you for signing up. Please click the link below to verify your email address:</p>
      <p><a href="${verificationUrl}">Verify Email</a></p>
      <p>If you didn't sign up for this account, you can ignore this email.</p>
    `;
    
    return this.sendEmail(to, subject, html);
  }
}