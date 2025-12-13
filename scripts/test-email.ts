// scripts/test-email.ts
import { EmailService } from "@/lib/email-service";

async function testEmail() {
  console.log("Testing email service...");
  
  try {
    const result = await EmailService.sendPasswordResetEmail(
      "test@example.com",
      "https://ojasenhealingarts.com/reset-password?token=abc123"
    );
    
    console.log("Email service test result:", result);
    console.log("If Mailjet is configured, email was sent via Mailjet.");
    console.log("If not configured, email was logged to console (mock mode).");
  } catch (error) {
    console.error("Error testing email service:", error);
  }
}

testEmail();