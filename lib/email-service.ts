// lib/email-service.ts
import { AuthLogger } from "@/lib/auth-logger";
import mailjet from "node-mailjet";

// Type definitions for email functions
interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

// Initialize Mailjet client if credentials are available
let mailjetClient: ReturnType<typeof mailjet.apiConnect> | null = null;

if (process.env.MAILJET_API_KEY && process.env.MAILJET_API_SECRET) {
  mailjetClient = mailjet.apiConnect(
    process.env.MAILJET_API_KEY,
    process.env.MAILJET_API_SECRET
  );
}

// Fallback email service - replace with actual email service in production
export class EmailService {
  static async sendEmail(to: string, subject: string, html: string, text?: string) {
    // Use Mailjet if configured, otherwise fall back to mock
    if (mailjetClient && process.env.MAILJET_SENDER_EMAIL) {
      try {
        const request = mailjetClient.post("send", { version: "v3.1" }).request({
          Messages: [
            {
              From: {
                Email: process.env.MAILJET_SENDER_EMAIL,
                Name: "Ojasen Healing Arts",
              },
              To: [
                {
                  Email: to,
                },
              ],
              Subject: subject,
              HTMLPart: html,
              TextPart: text,
            },
          ],
        });

        const result: any = await request;
        AuthLogger.info("Email sent via Mailjet", { to, subject, messageId: result.body.Messages[0].To[0].MessageID });
        
        return { success: true, messageId: result.body.Messages[0].To[0].MessageID };
      } catch (error) {
        AuthLogger.error("Failed to send email via Mailjet", { to, subject, error });
        // Optionally fall back to console logging if Mailjet fails
        this.logEmail(to, subject, html);
        return { success: false, error };
      }
    } else {
      // Fall back to mock email service
      return this.logEmail(to, subject, html);
    }
  }

  private static async logEmail(to: string, subject: string, html: string) {
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
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>You have requested to reset your password. Click the link below to reset your password:</p>
        <p>
          <a href="${resetUrl}" 
             style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">
            Reset Password
          </a>
        </p>
        <p><strong>This link will expire in 1 hour.</strong></p>
        <p>If you didn't request this, please ignore this email.</p>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
        <p style="font-size: 12px; color: #666;">
          This email was sent by Ojasen Healing Arts. If you have any questions, please contact us.
        </p>
      </div>
    `;
    
    return this.sendEmail(to, subject, html);
  }

  static async sendEmailVerification(to: string, verificationUrl: string) {
    const subject = "Verify your email address";
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome! Please verify your email address</h2>
        <p>Thank you for signing up with Ojasen Healing Arts. Please click the link below to verify your email address:</p>
        <p>
          <a href="${verificationUrl}" 
             style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">
            Verify Email
          </a>
        </p>
        <p>If you didn't sign up for this account, you can ignore this email.</p>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
        <p style="font-size: 12px; color: #666;">
          This email was sent by Ojasen Healing Arts. If you have any questions, please contact us.
        </p>
      </div>
    `;
    
    return this.sendEmail(to, subject, html);
  }

  // Generic method for sending any type of email
  static async sendTemplatedEmail(options: EmailOptions) {
    return this.sendEmail(options.to, options.subject, options.html, options.text);
  }
}