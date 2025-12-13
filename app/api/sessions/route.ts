import { NextResponse } from "next/server";
import { EventService } from "@/lib/event-service";

// Public endpoint to get upcoming sessions
export async function GET() {
  try {
    // Get upcoming sessions
    const sessionsResult = await EventService.getUpcomingSessions();
    
    if (!sessionsResult.success) {
      return NextResponse.json({ success: false, error: sessionsResult.error || "Failed to fetch sessions" }, { status: 500 });
    }

    return NextResponse.json({ success: true, sessions: sessionsResult.sessions });
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
