"use server";

import { redirect } from "next/navigation";
import { BookingService, FacilitatorService } from "@/lib/booking-service";
import { auth } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

// Initialize Prisma Client
const prisma = new PrismaClient();

// Discord webhook URL - should be moved to environment variables in production
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL || "https://discord.com/api/webhooks/1439098604311810140/Uec_Qe8Wg5I0f5AffLfS1DUjwVT3kbtmP6xBqLhY5h7ZjkT4sF17zE9HftjXLpRobtcb";

// Function to send data to Discord webhook
async function sendToDiscordWebhook(data: any) {
  // If no webhook URL is configured, log to console and return success
  if (!DISCORD_WEBHOOK_URL) {
    console.log("Discord webhook URL not configured. Skipping Discord notification.");
    console.log("Data that would have been sent to Discord:", JSON.stringify(data, null, 2));
    return { success: true };
  }

  try {
    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Discord webhook request failed with status ${response.status}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to send data to Discord webhook:", error);
    // In a production environment, you might want to implement a retry mechanism or queue
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

// Server action for booking form submission
export async function submitBookingForm(formData: {
  name: string;
  email: string;
  phone: string;
  date?: string;
  participants?: string;
  message?: string;
  event?: {
    id: string;
    title: string;
    date: string;
    time: string;
    location: string;
    description: string;
    price?: string;
    priceRaw?: number;
  };
}) {
  try {
    // Get the current user session - FIXED VERSION
    // The previous approach with empty cookie header doesn't work in form actions
    // We need to get the session from the request context
    const session = await auth.api.getSession({
      headers: await (await import('next/headers')).headers(),
    });
    
    console.log("Session data retrieved:", session);
    
    // Create booking in our system
    if (formData.event) {
      // Calculate fees based on event price and facilitator
      const priceRaw = formData.event.priceRaw || 0;
      const numberOfPeople = parseInt(formData.participants || "1");
      const totalPrice = priceRaw * numberOfPeople;
      
      // For demo purposes, we'll assign the first facilitator
      // In a real app, this would be based on the event type or user selection
      let facilitator = null;
      const facilitatorsResult = await FacilitatorService.getAllFacilitators();
      if (facilitatorsResult.success && facilitatorsResult.facilitators && facilitatorsResult.facilitators.length > 0) {
        facilitator = facilitatorsResult.facilitators[0]; // Default to first facilitator
      }
      
      // Calculate fees (in a real app, this would be more complex)
      const facilitatorFee = facilitator ? totalPrice * facilitator.commission : 0;
      const ojasenFee = totalPrice - facilitatorFee;
      
      // Create booking record with user ID if available
      const bookingData: any = {
        eventId: formData.event.id,
        eventName: formData.event.title,
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        numberOfPeople,
        specialRequests: formData.message,
        eventDate: new Date(formData.event.date),
        totalPrice,
        ojasenFee,
        facilitatorFee,
        facilitatorId: facilitator?.id,
        facilitatorName: facilitator?.name,
      };
      
      // Add user ID if user is authenticated
      if (session?.user?.id) {
        bookingData.userId = session.user.id;
      }
      
      const bookingResult = await BookingService.createBooking(bookingData);
      
      if (!bookingResult.success) {
        console.error("Failed to create booking:", bookingResult.error);
      }
      
      // Update user profile with phone number when a booking is made
      if (session?.user?.id) {
        try {
          // Update user profile with information from booking form
          // We update name, phone, and email for both regular and anonymous users
          const updateData: any = {
            phone: formData.phone || undefined,
          };
          
          // Only update name if it's different from the current name and not empty
          if (formData.name && formData.name !== session.user.name) {
            updateData.name = formData.name;
          }
          
          // For anonymous users or when email doesn't match, update the email
          // This handles the case where an anonymous user provides a new email
          if (session.user.email !== formData.email) {
            updateData.email = formData.email;
            // Also mark as non-anonymous if they provided a real email
            if (session.user.isAnonymous) {
              updateData.isAnonymous = false;
            }
          }
          
          await prisma.user.update({
            where: { id: session.user.id },
            data: updateData,
          });
        } catch (profileError) {
          console.error("Failed to update user profile with booking information:", profileError);
          // Don't fail the booking if profile update fails
        }
      }
    }

    // Prepare webhook data
    const webhookData = {
      embeds: [
        {
          title: "New Booking Confirmation",
          color: 0x68887d, // Using the brand color
          fields: [
            {
              name: "Event",
              value: formData.event?.title || "General Inquiry",
              inline: true,
            },
            {
              name: "Name",
              value: formData.name,
              inline: true,
            },
            {
              name: "Email",
              value: formData.email,
              inline: true,
            },
            {
              name: "Phone",
              value: formData.phone,
              inline: true,
            },
            {
              name: "Date",
              value: formData.date || "Not specified",
              inline: true,
            },
            {
              name: "Participants",
              value: formData.participants || "Not specified",
              inline: true,
            },
            {
              name: "Special Requests",
              value: formData.message || "None",
              inline: false,
            },
          ],
          timestamp: new Date().toISOString(),
        },
      ],
    };

    // Send to Discord webhook
    const result = await sendToDiscordWebhook(webhookData);
    
    if (!result.success) {
      console.error("Failed to send booking data to Discord:", result.error);
      // In a real application, you might want to handle this error more gracefully
      // For example, you could queue the message for retry or send an email notification
    }

    // Redirect to success page or back to form
    return { success: true };
  } catch (error) {
    console.error("Error in submitBookingForm:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

// Server action for contact form submission
export async function submitContactForm(formData: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  try {
    // Prepare webhook data
    const webhookData = {
      embeds: [
        {
          title: "New Contact Form Submission",
          color: 0x68887d, // Using the brand color
          fields: [
            {
              name: "Name",
              value: formData.name,
              inline: true,
            },
            {
              name: "Email",
              value: formData.email,
              inline: true,
            },
            {
              name: "Subject",
              value: formData.subject,
              inline: false,
            },
            {
              name: "Message",
              value: formData.message,
              inline: false,
            },
          ],
          timestamp: new Date().toISOString(),
        },
      ],
    };

    // Send to Discord webhook
    const result = await sendToDiscordWebhook(webhookData);
    
    if (!result.success) {
      console.error("Failed to send contact data to Discord:", result.error);
      // In a real application, you might want to handle this error more gracefully
    }

    // Redirect to success page or back to form
    return { success: true };
  } catch (error) {
    console.error("Error in submitContactForm:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

// Server action for updating user profile
export async function updateUserProfile(formData: {
  name: string;
  email: string;
  phone?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
}) {
  try {
    // Get the current user session - FIXED VERSION
    // The previous approach with empty cookie header doesn't work in form actions
    // We need to get the session from the request context
    const session = await auth.api.getSession({
      headers: await (await import('next/headers')).headers(),
    });

    // Check if user is authenticated
    if (!session?.user?.id) {
      return { success: false, error: "User not authenticated" };
    }

    // Update user in the database with all profile information
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        emergencyContactName: formData.emergencyContactName,
        emergencyContactPhone: formData.emergencyContactPhone,
      },
    });

    // Prepare webhook data for profile update notification
    const webhookData = {
      embeds: [
        {
          title: "User Profile Updated",
          color: 0x68887d, // Using the brand color
          fields: [
            {
              name: "User ID",
              value: updatedUser.id,
              inline: true,
            },
            {
              name: "Name",
              value: updatedUser.name,
              inline: true,
            },
            {
              name: "Email",
              value: updatedUser.email,
              inline: true,
            },
            {
              name: "Phone",
              value: formData.phone || "Not provided",
              inline: true,
            },
            {
              name: "Emergency Contact",
              value: formData.emergencyContactName 
                ? `${formData.emergencyContactName} (${formData.emergencyContactPhone || "No phone"})` 
                : "Not provided",
              inline: false,
            },
          ],
          timestamp: new Date().toISOString(),
        },
      ],
    };

    // Send to Discord webhook
    const result = await sendToDiscordWebhook(webhookData);
    
    if (!result.success) {
      console.error("Failed to send profile update notification to Discord:", result.error);
      // In a real application, you might want to handle this error more gracefully
    }

    return { success: true, user: updatedUser };
  } catch (error) {
    console.error("Error in updateUserProfile:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}