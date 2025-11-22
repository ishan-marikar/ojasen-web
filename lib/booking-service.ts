// lib/booking-service.ts
import { PrismaClient } from "@prisma/client";
import { EVENTS_DATA } from "@/lib/event-data";
import { Booking as AppBooking, Facilitator as AppFacilitator } from "@/lib/types";

// Initialize Prisma Client
const prisma = new PrismaClient();

// Remove in-memory storage since we're now using the database
// let bookings: Booking[] = [];
// let facilitators: Facilitator[] = [ ... ];

// Function to send data to Discord webhook
async function sendToDiscordWebhook(data: any) {
  // Disable Discord notifications in development mode
  if (process.env.NODE_ENV === 'development') {
    console.log("Discord notifications are disabled in development mode.");
    console.log("Data that would have been sent to Discord:", JSON.stringify(data, null, 2));
    return { success: true };
  }

  const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;
  
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
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export class BookingService {
  // Create a new booking
  static async createBooking(bookingData: Omit<AppBooking, 'id' | 'bookingDate' | 'status'>) {
    try {
      // Validate required fields
      if (!bookingData.eventId || !bookingData.customerName || !bookingData.customerEmail) {
        throw new Error("Missing required booking information");
      }
      
      // Log booking data for debugging (excluding sensitive information)
      console.log("Creating booking with data:", {
        eventId: bookingData.eventId,
        eventName: bookingData.eventName,
        customerName: bookingData.customerName,
        customerEmail: bookingData.customerEmail,
        hasUserId: !!bookingData.userId,
        userId: bookingData.userId ? "[REDACTED]" : null, // Don't log actual user IDs for security
        numberOfPeople: bookingData.numberOfPeople,
        totalPrice: bookingData.totalPrice
      });
      
      const newBooking = await prisma.booking.create({
        data: {
          id: `booking_${Date.now()}`,
          eventId: bookingData.eventId,
          eventName: bookingData.eventName,
          customerName: bookingData.customerName,
          customerEmail: bookingData.customerEmail,
          customerPhone: bookingData.customerPhone,
          numberOfPeople: bookingData.numberOfPeople,
          specialRequests: bookingData.specialRequests,
          eventDate: bookingData.eventDate,
          status: 'pending',
          totalPrice: bookingData.totalPrice,
          ojasenFee: bookingData.ojasenFee,
          facilitatorFee: bookingData.facilitatorFee,
          facilitatorId: bookingData.facilitatorId,
          facilitatorName: bookingData.facilitatorName,
          userId: bookingData.userId,
        },
      });
      
      // Log for debugging
      console.log("Created booking:", {
        id: newBooking.id,
        eventId: newBooking.eventId,
        customerName: newBooking.customerName,
        customerEmail: newBooking.customerEmail,
        hasUserId: !!newBooking.userId,
        userId: newBooking.userId ? "[REDACTED]" : null, // Don't log actual user IDs for security
        bookingDate: newBooking.bookingDate
      });
      
      return { success: true, booking: newBooking };
    } catch (error) {
      console.error("Error creating booking:", error);
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  }

  // Get all bookings
  static async getAllBookings() {
    try {
      const bookings = await prisma.booking.findMany({
        orderBy: {
          bookingDate: 'desc',
        },
      });
      
      return { success: true, bookings };
    } catch (error) {
      console.error("Error fetching bookings:", error);
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  }

  // Get booking by ID
  static async getBookingById(id: string) {
    try {
      const booking = await prisma.booking.findUnique({
        where: { id },
      });
      return { success: true, booking };
    } catch (error) {
      console.error("Error fetching booking:", error);
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  }

  // Update booking status
  static async updateBookingStatus(id: string, status: 'pending' | 'confirmed' | 'cancelled') {
    try {
      const updatedBooking = await prisma.booking.update({
        where: { id },
        data: { status },
      });
      
      // Send Discord notification about status change
      const webhookData = {
        embeds: [
          {
            title: `Booking Status Updated`,
            color: status === 'confirmed' ? 0x00ff00 : status === 'cancelled' ? 0xff0000 : 0xffff00,
            fields: [
              {
                name: "Booking ID",
                value: updatedBooking.id,
                inline: true,
              },
              {
                name: "Event",
                value: updatedBooking.eventName,
                inline: true,
              },
              {
                name: "Customer",
                value: updatedBooking.customerName,
                inline: true,
              },
              {
                name: "Email",
                value: updatedBooking.customerEmail,
                inline: true,
              },
              {
                name: "New Status",
                value: status,
                inline: true,
              },
              {
                name: "Participants",
                value: updatedBooking.numberOfPeople.toString(),
                inline: true,
              },
              {
                name: "Total Price",
                value: `LKR ${updatedBooking.totalPrice.toFixed(2)}`,
                inline: true,
              },
            ],
            timestamp: new Date().toISOString(),
          },
        ],
      };
      
      // Send to Discord webhook
      const result = await sendToDiscordWebhook(webhookData);
      
      if (!result.success) {
        console.error("Failed to send booking status update to Discord:", result.error);
      }
      
      return { success: true, booking: updatedBooking };
    } catch (error) {
      console.error("Error updating booking status:", error);
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  }

  // Get bookings by customer email
  static async getBookingsByCustomerEmail(email: string) {
    try {
      const bookings = await prisma.booking.findMany({
        where: { customerEmail: email },
        orderBy: { bookingDate: 'desc' },
      });
      
      return { success: true, bookings };
    } catch (error) {
      console.error("Error fetching customer bookings:", error);
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  }

  // Get bookings by user ID
  static async getBookingsByUserId(userId: string) {
    try {
      const bookings = await prisma.booking.findMany({
        where: { userId: userId },
        orderBy: { bookingDate: 'desc' },
      });
      
      return { success: true, bookings };
    } catch (error) {
      console.error("Error fetching user bookings by ID:", error);
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  }

  // Get bookings by facilitator
  static async getBookingsByFacilitator(facilitatorId: string) {
    try {
      const bookings = await prisma.booking.findMany({
        where: { facilitatorId },
        orderBy: { bookingDate: 'desc' },
      });
      
      return { success: true, bookings };
    } catch (error) {
      console.error("Error fetching facilitator bookings:", error);
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  }

  // Calculate total revenue
  static async getTotalRevenue() {
    try {
      const confirmedBookings = await prisma.booking.findMany({
        where: { status: 'confirmed' },
      });
      
      const totalRevenue = confirmedBookings.reduce((sum, booking) => sum + booking.totalPrice, 0);
      const ojasenRevenue = confirmedBookings.reduce((sum, booking) => sum + booking.ojasenFee, 0);
      const facilitatorRevenue = confirmedBookings.reduce((sum, booking) => sum + booking.facilitatorFee, 0);
      
      return { 
        success: true, 
        totalRevenue,
        ojasenRevenue,
        facilitatorRevenue,
      };
    } catch (error) {
      console.error("Error calculating revenue:", error);
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  }

  // Get bookings count by status
  static async getBookingStats() {
    try {
      const allBookings = await prisma.booking.findMany();
      
      const stats: Record<string, number> = {
        pending: 0,
        confirmed: 0,
        cancelled: 0,
      };
      
      allBookings.forEach(booking => {
        stats[booking.status] = (stats[booking.status] || 0) + 1;
      });
      
      return { success: true, stats };
    } catch (error) {
      console.error("Error fetching booking stats:", error);
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  }

  // Get upcoming events with booking information
  static async getUpcomingEventsWithBookings() {
    try {
      const now = new Date();
      const upcomingEvents = EVENTS_DATA.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= now;
      });
      
      // Get all bookings
      const allBookings = await prisma.booking.findMany();
      
      // Add booking count to each event
      const eventsWithBookings = upcomingEvents.map(event => {
        const eventBookings = allBookings.filter(b => b.eventId === event.id);
        const confirmedBookings = eventBookings.filter(b => b.status === 'confirmed');
        
        return {
          ...event,
          totalBookings: eventBookings.length,
          confirmedBookings: confirmedBookings.length,
          totalParticipants: confirmedBookings.reduce((sum, booking) => sum + booking.numberOfPeople, 0),
        };
      });
      
      return { success: true, events: eventsWithBookings };
    } catch (error) {
      console.error("Error fetching events with bookings:", error);
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  }

  // Get financial metrics for admin dashboard
  static async getAdminFinancialMetrics() {
    try {
      // Get all bookings
      const allBookings = await prisma.booking.findMany();
      
      // Filter confirmed bookings for revenue calculations
      const confirmedBookings = allBookings.filter(booking => booking.status === 'confirmed');
      
      // 1. Total revenue from customers
      const totalRevenue = confirmedBookings.reduce((sum, booking) => sum + booking.totalPrice, 0);
      
      // 2. Total facilitator costs
      const totalFacilitatorCosts = confirmedBookings.reduce((sum, booking) => sum + booking.facilitatorFee, 0);
      
      // 3. Gross profit (total revenue - facilitator costs)
      const grossProfit = totalRevenue - totalFacilitatorCosts;
      
      // 4. Per-season breakdown
      const seasonBreakdown = this.calculateSeasonBreakdown(allBookings);
      
      // 5. Per-customer lifetime value
      const customerLifetimeValue = this.calculateCustomerLifetimeValue(confirmedBookings);
      
      // 6. Per-facilitator lifetime cost
      const facilitatorLifetimeCost = this.calculateFacilitatorLifetimeCost(confirmedBookings);
      
      // 7. Outstanding invoices / unpaid sessions (pending bookings)
      const outstandingInvoices = allBookings.filter(booking => booking.status === 'pending');
      
      // 8. Campaign performance / loyalty usage (placeholder for now)
      const campaignPerformance = {
        totalBookings: allBookings.length,
        confirmedBookings: confirmedBookings.length,
        pendingBookings: outstandingInvoices.length,
        cancellationRate: (allBookings.filter(b => b.status === 'cancelled').length / Math.max(allBookings.length, 1)) * 100
      };
      
      return {
        success: true,
        metrics: {
          totalRevenue,
          totalFacilitatorCosts,
          grossProfit,
          seasonBreakdown,
          customerLifetimeValue,
          facilitatorLifetimeCost,
          outstandingInvoices: outstandingInvoices.length,
          campaignPerformance
        }
      };
    } catch (error) {
      console.error("Error calculating admin financial metrics:", error);
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  }

  // Helper function to calculate season breakdown
  static calculateSeasonBreakdown(bookings: any[]) {
    const seasons: Record<string, any> = {};
    
    bookings.forEach(booking => {
      if (booking.status !== 'confirmed') return;
      
      const date = new Date(booking.eventDate);
      const year = date.getFullYear();
      const month = date.getMonth() + 1; // 1-12
      
      // Simple season calculation (can be enhanced based on actual business logic)
      let season = '';
      if (month >= 3 && month <= 5) {
        season = 'Q1';
      } else if (month >= 6 && month <= 8) {
        season = 'Q2';
      } else if (month >= 9 && month <= 11) {
        season = 'Q3';
      } else {
        season = 'Q4';
      }
      
      const seasonKey = `${year}-${season}`;
      
      if (!seasons[seasonKey]) {
        seasons[seasonKey] = {
          totalRevenue: 0,
          facilitatorCosts: 0,
          bookingCount: 0
        };
      }
      
      seasons[seasonKey].totalRevenue += booking.totalPrice;
      seasons[seasonKey].facilitatorCosts += booking.facilitatorFee;
      seasons[seasonKey].bookingCount += 1;
    });
    
    return seasons;
  }

  // Helper function to calculate customer lifetime value
  static calculateCustomerLifetimeValue(bookings: any[]) {
    const customerBookings: Record<string, any[]> = {};
    
    // Group bookings by customer email
    bookings.forEach(booking => {
      const email = booking.customerEmail;
      if (!customerBookings[email]) {
        customerBookings[email] = [];
      }
      customerBookings[email].push(booking);
    });
    
    // Calculate average value per customer
    const customerValues = Object.values(customerBookings).map(bookings => 
      bookings.reduce((sum, booking) => sum + booking.totalPrice, 0)
    );
    
    const totalValue = customerValues.reduce((sum, value) => sum + value, 0);
    const avgCustomerLifetimeValue = customerValues.length > 0 ? totalValue / customerValues.length : 0;
    
    return {
      totalCustomers: customerValues.length,
      avgCustomerLifetimeValue,
      totalCustomerValue: totalValue
    };
  }

  // Helper function to calculate facilitator lifetime cost
  static calculateFacilitatorLifetimeCost(bookings: any[]) {
    const facilitatorBookings: Record<string, any[]> = {};
    
    // Group bookings by facilitator ID
    bookings.forEach(booking => {
      if (!booking.facilitatorId) return;
      
      const facilitatorId = booking.facilitatorId;
      if (!facilitatorBookings[facilitatorId]) {
        facilitatorBookings[facilitatorId] = [];
      }
      facilitatorBookings[facilitatorId].push(booking);
    });
    
    // Calculate average cost per facilitator
    const facilitatorCosts = Object.values(facilitatorBookings).map(bookings => 
      bookings.reduce((sum, booking) => sum + booking.facilitatorFee, 0)
    );
    
    const totalCost = facilitatorCosts.reduce((sum, cost) => sum + cost, 0);
    const avgFacilitatorLifetimeCost = facilitatorCosts.length > 0 ? totalCost / facilitatorCosts.length : 0;
    
    return {
      totalFacilitators: facilitatorCosts.length,
      avgFacilitatorLifetimeCost,
      totalFacilitatorCost: totalCost
    };
  }
}

export class FacilitatorService {
  // Create a new facilitator
  static async createFacilitator(facilitatorData: Omit<AppFacilitator, 'id'>) {
    try {
      const newFacilitator = await prisma.facilitator.create({
        data: {
          id: `fac_${Date.now()}`,
          name: facilitatorData.name,
          role: facilitatorData.role,
          email: facilitatorData.email,
          phone: facilitatorData.phone,
          baseFee: facilitatorData.baseFee,
          commission: facilitatorData.commission,
        },
      });
      
      // Send Discord notification about new facilitator
      const webhookData = {
        embeds: [
          {
            title: "New Facilitator Added",
            color: 0x68887d, // Brand color
            fields: [
              {
                name: "Name",
                value: facilitatorData.name,
                inline: true,
              },
              {
                name: "Role",
                value: facilitatorData.role,
                inline: true,
              },
              {
                name: "Email",
                value: facilitatorData.email,
                inline: true,
              },
              {
                name: "Phone",
                value: facilitatorData.phone || "Not provided",
                inline: true,
              },
              {
                name: "Base Fee",
                value: `LKR ${facilitatorData.baseFee.toLocaleString()}`,
                inline: true,
              },
              {
                name: "Commission",
                value: `${(facilitatorData.commission * 100).toFixed(0)}%`,
                inline: true,
              },
            ],
            timestamp: new Date().toISOString(),
          },
        ],
      };
      
      // Send to Discord webhook
      const result = await sendToDiscordWebhook(webhookData);
      
      if (!result.success) {
        console.error("Failed to send facilitator creation notification to Discord:", result.error);
      }
      
      return { success: true, facilitator: newFacilitator };
    } catch (error) {
      console.error("Error creating facilitator:", error);
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  }

  // Get all facilitators
  static async getAllFacilitators() {
    try {
      const facilitators = await prisma.facilitator.findMany();
      return { success: true, facilitators };
    } catch (error) {
      console.error("Error fetching facilitators:", error);
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  }

  // Get facilitator by ID
  static async getFacilitatorById(id: string) {
    try {
      const facilitator = await prisma.facilitator.findUnique({
        where: { id },
      });
      return { success: true, facilitator };
    } catch (error) {
      console.error("Error fetching facilitator:", error);
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  }

  // Update facilitator
  static async updateFacilitator(id: string, facilitatorData: Partial<AppFacilitator>) {
    try {
      const updatedFacilitator = await prisma.facilitator.update({
        where: { id },
        data: {
          name: facilitatorData.name,
          role: facilitatorData.role,
          email: facilitatorData.email,
          phone: facilitatorData.phone,
          baseFee: facilitatorData.baseFee,
          commission: facilitatorData.commission,
        },
      });
      
      return { success: true, facilitator: updatedFacilitator };
    } catch (error) {
      console.error("Error updating facilitator:", error);
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  }

  // Get facilitator earnings
  static async getFacilitatorEarnings(facilitatorId: string) {
    try {
      const facilitator = await prisma.facilitator.findUnique({
        where: { id: facilitatorId },
      });
      
      if (!facilitator) {
        return { success: false, error: "Facilitator not found" };
      }
      
      const facilitatorBookings = await prisma.booking.findMany({
        where: { 
          facilitatorId,
          status: 'confirmed'
        },
      });
      
      const totalEarnings = facilitatorBookings.reduce((sum, booking) => sum + booking.facilitatorFee, 0);
      
      return { 
        success: true, 
        facilitator,
        totalEarnings,
        totalBookings: facilitatorBookings.length,
      };
    } catch (error) {
      console.error("Error calculating facilitator earnings:", error);
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  }
}