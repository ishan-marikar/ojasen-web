import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Check if user is authenticated and is admin
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Check if user has admin role
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user || user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    // Get financial data
    const bookings = await prisma.booking.findMany({
      include: {
        facilitator: true
      }
    });

    const invoices = await prisma.invoice.findMany();
    const payments = await prisma.payment.findMany({
      include: {
        invoice: true,
        purchaseOrder: {
          include: {
            facilitator: true
          }
        }
      }
    });

    // Calculate key metrics
    const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalPrice, 0);
    const facilitatorCosts = bookings.reduce((sum, booking) => sum + booking.facilitatorFee, 0);
    const grossProfit = totalRevenue - facilitatorCosts;
    
    // Count outstanding invoices (not paid)
    const outstandingInvoices = invoices.filter(invoice => 
      invoice.status !== "paid" && invoice.status !== "cancelled"
    ).length;

    // Season breakdown (group by quarter)
    const seasonBreakdown: Record<string, any> = {};
    
    bookings.forEach(booking => {
      const date = new Date(booking.eventDate);
      const year = date.getFullYear();
      const month = date.getMonth();
      let season = "";
      
      if (month >= 0 && month <= 2) season = "Winter";
      else if (month >= 3 && month <= 5) season = "Spring";
      else if (month >= 6 && month <= 8) season = "Summer";
      else season = "Autumn";
      
      const key = `${year}-${season}`;
      
      if (!seasonBreakdown[key]) {
        seasonBreakdown[key] = {
          totalRevenue: 0,
          facilitatorCosts: 0,
          bookingCount: 0
        };
      }
      
      seasonBreakdown[key].totalRevenue += booking.totalPrice;
      seasonBreakdown[key].facilitatorCosts += booking.facilitatorFee;
      seasonBreakdown[key].bookingCount += 1;
    });

    // Revenue over time (monthly for last 6 months)
    const revenueOverTime: any[] = [];
    const today = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthKey = date.toLocaleString('default', { month: 'short' });
      
      const monthBookings = bookings.filter(booking => {
        const bookingDate = new Date(booking.eventDate);
        return bookingDate.getMonth() === date.getMonth() && 
               bookingDate.getFullYear() === date.getFullYear();
      });
      
      const monthlyRevenue = monthBookings.reduce((sum, booking) => sum + booking.totalPrice, 0);
      const monthlyProfit = monthBookings.reduce((sum, booking) => sum + (booking.totalPrice - booking.facilitatorFee), 0);
      
      revenueOverTime.push({
        month: monthKey,
        revenue: monthlyRevenue,
        profit: monthlyProfit
      });
    }

    // Top services (by revenue)
    const serviceRevenue: Record<string, { revenue: number; bookings: number }> = {};
    
    bookings.forEach(booking => {
      if (!serviceRevenue[booking.eventName]) {
        serviceRevenue[booking.eventName] = {
          revenue: 0,
          bookings: 0
        };
      }
      
      serviceRevenue[booking.eventName].revenue += booking.totalPrice;
      serviceRevenue[booking.eventName].bookings += 1;
    });

    const topServices = Object.entries(serviceRevenue)
      .map(([service, data]) => ({
        service,
        revenue: data.revenue,
        bookings: data.bookings
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    const financialData = {
      revenue: totalRevenue,
      facilitatorCosts,
      grossProfit,
      outstandingInvoices,
      seasonBreakdown,
      revenueOverTime,
      topServices
    };

    return NextResponse.json({ success: true, financialData });
  } catch (error) {
    console.error("Error fetching financial reports:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}