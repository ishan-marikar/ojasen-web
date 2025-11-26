import { NextResponse } from "next/server";
import { BookingService } from "@/lib/booking-service";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
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

    // Get admin financial metrics
    const metricsResult = await BookingService.getAdminFinancialMetrics();
    
    if (!metricsResult.success) {
      return NextResponse.json({ success: false, error: metricsResult.error || "Failed to fetch metrics" }, { status: 500 });
    }

    return NextResponse.json({ success: true, metrics: metricsResult.metrics });
  } catch (error) {
    console.error("Error fetching admin metrics:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}