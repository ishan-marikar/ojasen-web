// lib/booking-service.ts
import { prisma } from "@/lib/prisma";
import { EVENTS_DATA } from "@/lib/event-data";
import { Booking as AppBooking, Facilitator as AppFacilitator } from "@/lib/types";

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
  // Create a new booking (refactored to use sessionId)
  static async createBooking(bookingData: Omit<AppBooking, 'id' | 'bookingDate' | 'status'>) {
    try {
      // Validate required fields
      if (!bookingData.sessionId || !bookingData.customerName || !bookingData.customerEmail) {
        throw new Error("Missing required booking information");
      }
      
      // Get session to validate and get event info
      const session = await prisma.eventSession.findUnique({
        where: { id: bookingData.sessionId },
        include: { event: true, bookings: true }
      });
      
      if (!session) {
        throw new Error("Session not found");
      }
      
      // Check capacity
      const totalBooked = session.bookings.reduce((sum, b) => sum + b.numberOfPeople, 0);
      if (totalBooked + bookingData.numberOfPeople > session.capacity) {
        throw new Error("Session is full or doesn't have enough capacity");
      }
      
      // Log booking data for debugging (excluding sensitive information)
      console.log("Creating booking with data:", {
        sessionId: bookingData.sessionId,
        eventName: bookingData.eventName,
        customerName: bookingData.customerName,
        customerEmail: bookingData.customerEmail,
        hasUserId: !!bookingData.userId,
        userId: bookingData.userId ? "[REDACTED]" : null,
        numberOfPeople: bookingData.numberOfPeople,
        totalPrice: bookingData.totalPrice
      });
      
      const newBooking = await prisma.booking.create({
        data: {
          id: `booking_${Date.now()}`,
          sessionId: bookingData.sessionId,
          eventName: bookingData.eventName,
          eventDate: bookingData.eventDate,
          customerName: bookingData.customerName,
          customerEmail: bookingData.customerEmail,
          customerPhone: bookingData.customerPhone,
          numberOfPeople: bookingData.numberOfPeople,
          specialRequests: bookingData.specialRequests,
          status: 'pending',
          totalPrice: bookingData.totalPrice,
          ojasenFee: bookingData.ojasenFee,
          facilitatorFee: bookingData.facilitatorFee,
          facilitatorId: bookingData.facilitatorId,
          facilitatorName: bookingData.facilitatorName,
          userId: bookingData.userId,
          nationality: bookingData.nationality,
          nic: bookingData.nic,
          passport: bookingData.passport,
        },
      });
      
      // Check if session is now full and update status
      const newTotal = totalBooked + bookingData.numberOfPeople;
      if (newTotal >= session.capacity) {
        await prisma.eventSession.update({
          where: { id: bookingData.sessionId },
          data: { status: 'full' }
        });
      }
      
      // Log for debugging
      console.log("Created booking:", {
        id: newBooking.id,
        sessionId: newBooking.sessionId,
        customerName: newBooking.customerName,
        customerEmail: newBooking.customerEmail,
        hasUserId: !!newBooking.userId,
        userId: newBooking.userId ? "[REDACTED]" : null,
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
      console.error("Error fetching bookings by customer email:", error);
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  }

  // Get bookings by user ID
  static async getBookingsByUserId(userId: string) {
    try {
      const bookings = await prisma.booking.findMany({
        where: { userId },
        orderBy: { bookingDate: 'desc' },
      });
      
      return { success: true, bookings };
    } catch (error) {
      console.error("Error fetching bookings by user ID:", error);
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
      console.error("Error fetching bookings by facilitator:", error);
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  }

  // Get total revenue
  static async getTotalRevenue() {
    try {
      // Get all confirmed bookings
      const confirmedBookings = await prisma.booking.findMany({
        where: { status: 'confirmed' },
      });
      
      // Calculate total revenue (sum of all booking prices)
      const totalRevenue = confirmedBookings.reduce((sum, booking) => sum + booking.totalPrice, 0);
      
      // Calculate Ojasen revenue (sum of ojasen fees)
      const ojasenRevenue = confirmedBookings.reduce((sum, booking) => sum + booking.ojasenFee, 0);
      
      // Calculate facilitator revenue (sum of facilitator fees)
      const facilitatorRevenue = confirmedBookings.reduce((sum, booking) => sum + booking.facilitatorFee, 0);
      
      return { 
        success: true, 
        totalRevenue, 
        ojasenRevenue, 
        facilitatorRevenue 
      };
    } catch (error) {
      console.error("Error calculating total revenue:", error);
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  }

  // Get booking statistics
  static async getBookingStats() {
    try {
      // Get all bookings grouped by status
      const allBookings = await prisma.booking.findMany();
      
      const stats = {
        pending: allBookings.filter(booking => booking.status === 'pending').length,
        confirmed: allBookings.filter(booking => booking.status === 'confirmed').length,
        cancelled: allBookings.filter(booking => booking.status === 'cancelled').length,
      };
      
      return { success: true, stats };
    } catch (error) {
      console.error("Error fetching booking stats:", error);
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  }

  // Get upcoming sessions with bookings (refactored)
  static async getUpcomingSessionsWithBookings() {
    try {
      const today = new Date();
      
      // Get upcoming confirmed bookings with session info
      const upcomingBookings = await prisma.booking.findMany({
        where: { 
          status: 'confirmed',
          eventDate: {
            gte: today,
          },
        },
        include: {
          session: {
            include: {
              event: true
            }
          }
        },
        orderBy: { eventDate: 'asc' },
      });
      
      // Group bookings by session
      const sessionsMap = new Map();
      
      upcomingBookings.forEach(booking => {
        const sessionKey = booking.sessionId;
        
        if (sessionsMap.has(sessionKey)) {
          const existingSession = sessionsMap.get(sessionKey);
          existingSession.bookings.push(booking);
          existingSession.totalParticipants += booking.numberOfPeople;
        } else {
          sessionsMap.set(sessionKey, {
            sessionId: booking.sessionId,
            session: booking.session,
            eventName: booking.eventName,
            eventDate: booking.eventDate,
            facilitatorName: booking.facilitatorName,
            bookings: [booking],
            totalParticipants: booking.numberOfPeople,
          });
        }
      });
      
      // Convert map to array and sort by date
      const sessions = Array.from(sessionsMap.values()).sort(
        (a, b) => a.eventDate.getTime() - b.eventDate.getTime()
      );
      
      return { success: true, sessions };
    } catch (error) {
      console.error("Error fetching upcoming sessions:", error);
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  }

  // Get admin financial metrics
  static async getAdminFinancialMetrics() {
    try {
      // Get all bookings
      const allBookings = await prisma.booking.findMany();
      
      // 1. Total revenue from confirmed bookings
      const confirmedBookings = allBookings.filter(booking => booking.status === 'confirmed');
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
      
      // 9. Customer history metrics
      const customerHistory = this.calculateCustomerHistory(confirmedBookings);
      
      // 10. Loyalty program metrics (placeholder)
      const loyaltyProgram = {
        activeVouchers: 0,
        redeemedVouchers: 0,
        campaignEngagement: 0
      };
      
      // 11. Revenue over time
      const revenueOverTime = this.calculateRevenueOverTime(confirmedBookings);
      
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
          campaignPerformance,
          customerHistory,
          loyaltyProgram,
          revenueOverTime,
        }
      };
    } catch (error) {
      console.error("Error fetching admin financial metrics:", error);
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  }

  // Helper method to calculate season breakdown
  private static calculateSeasonBreakdown(bookings: any[]) {
    const seasons: Record<string, { totalRevenue: number; facilitatorCosts: number; bookingCount: number }> = {};
    
    bookings.forEach(booking => {
      if (booking.status !== 'confirmed') return;
      
      // Group by year and quarter
      const date = new Date(booking.eventDate);
      const year = date.getFullYear();
      const quarter = Math.floor(date.getMonth() / 3) + 1;
      const seasonKey = `${year}-Q${quarter}`;
      
      if (!seasons[seasonKey]) {
        seasons[seasonKey] = {
          totalRevenue: 0,
          facilitatorCosts: 0,
          bookingCount: 0,
        };
      }
      
      seasons[seasonKey].totalRevenue += booking.totalPrice;
      seasons[seasonKey].facilitatorCosts += booking.facilitatorFee;
      seasons[seasonKey].bookingCount += 1;
    });
    
    return seasons;
  }

  // Helper method to calculate customer lifetime value
  private static calculateCustomerLifetimeValue(bookings: any[]) {
    const customerMap = new Map();
    
    bookings.forEach(booking => {
      const customerKey = booking.customerEmail;
      
      if (!customerMap.has(customerKey)) {
        customerMap.set(customerKey, {
          totalSpent: 0,
          bookingCount: 0,
        });
      }
      
      const customer = customerMap.get(customerKey);
      customer.totalSpent += booking.totalPrice;
      customer.bookingCount += 1;
    });
    
    const totalCustomers = customerMap.size;
    const totalCustomerValue = Array.from(customerMap.values()).reduce((sum, customer) => sum + customer.totalSpent, 0);
    const avgCustomerLifetimeValue = totalCustomers > 0 ? totalCustomerValue / totalCustomers : 0;
    
    return {
      totalCustomers,
      avgCustomerLifetimeValue,
      totalCustomerValue,
    };
  }

  // Helper method to calculate facilitator lifetime cost
  private static calculateFacilitatorLifetimeCost(bookings: any[]) {
    const facilitatorMap = new Map();
    
    bookings.forEach(booking => {
      if (!booking.facilitatorId) return;
      
      const facilitatorKey = booking.facilitatorId;
      
      if (!facilitatorMap.has(facilitatorKey)) {
        facilitatorMap.set(facilitatorKey, {
          totalCost: 0,
          bookingCount: 0,
        });
      }
      
      const facilitator = facilitatorMap.get(facilitatorKey);
      facilitator.totalCost += booking.facilitatorFee;
      facilitator.bookingCount += 1;
    });
    
    const totalFacilitators = facilitatorMap.size;
    const totalFacilitatorCost = Array.from(facilitatorMap.values()).reduce((sum, facilitator) => sum + facilitator.totalCost, 0);
    const avgFacilitatorLifetimeCost = totalFacilitators > 0 ? totalFacilitatorCost / totalFacilitators : 0;
    
    return {
      totalFacilitators,
      avgFacilitatorLifetimeCost,
      totalFacilitatorCost,
    };
  }

  // Helper method to calculate customer history
  private static calculateCustomerHistory(bookings: any[]) {
    const customerMap = new Map();
    
    bookings.forEach(booking => {
      const customerKey = booking.customerEmail;
      
      if (!customerMap.has(customerKey)) {
        customerMap.set(customerKey, {
          bookingCount: 0,
        });
      }
      
      const customer = customerMap.get(customerKey);
      customer.bookingCount += 1;
    });
    
    // Count customers with multiple bookings (returning customers)
    const returningCustomers = Array.from(customerMap.values()).filter(c => c.bookingCount > 1).length;
    const newCustomers = Array.from(customerMap.values()).filter(c => c.bookingCount === 1).length;
    const totalCustomers = customerMap.size;
    const customerRetentionRate = totalCustomers > 0 ? (returningCustomers / totalCustomers) * 100 : 0;
    
    return {
      returningCustomers,
      newCustomers,
      customerRetentionRate,
    };
  }

  // Helper method to calculate revenue over time
  private static calculateRevenueOverTime(bookings: any[]) {
    const monthlyRevenue = new Map();
    
    bookings.forEach(booking => {
      const date = new Date(booking.eventDate);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyRevenue.has(monthKey)) {
        monthlyRevenue.set(monthKey, {
          month: monthKey,
          revenue: 0,
        });
      }
      
      const month = monthlyRevenue.get(monthKey);
      month.revenue += booking.totalPrice;
    });
    
    // Convert to array and sort by month
    return Array.from(monthlyRevenue.values()).sort((a, b) => a.month.localeCompare(b.month));
  }
}

// Facilitator Service
export class FacilitatorService {
  // Create a new facilitator
  static async createFacilitator(facilitatorData: Omit<AppFacilitator, 'id'>) {
    try {
      const newFacilitator = await prisma.facilitator.create({
        data: {
          id: `facilitator_${Date.now()}`,
          name: facilitatorData.name,
          role: facilitatorData.role,
          email: facilitatorData.email,
          phone: facilitatorData.phone,
          baseFee: facilitatorData.baseFee,
          commission: facilitatorData.commission,
        },
      });
      
      return { success: true, facilitator: newFacilitator };
    } catch (error) {
      console.error("Error creating facilitator:", error);
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  }

  // Get all facilitators
  static async getAllFacilitators() {
    try {
      const facilitators = await prisma.facilitator.findMany({
        orderBy: {
          name: 'asc',
        },
      });
      
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
        data: facilitatorData,
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
      // Get all confirmed bookings for this facilitator
      const bookings = await prisma.booking.findMany({
        where: { 
          facilitatorId,
          status: 'confirmed',
        },
      });
      
      // Calculate total earnings (sum of facilitator fees)
      const totalEarnings = bookings.reduce((sum, booking) => sum + booking.facilitatorFee, 0);
      
      return { 
        success: true, 
        totalEarnings,
        totalBookings: bookings.length,
      };
    } catch (error) {
      console.error("Error calculating facilitator earnings:", error);
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  }
}