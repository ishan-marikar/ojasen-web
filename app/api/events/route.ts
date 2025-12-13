import { NextResponse } from "next/server";
import { EventService } from "@/lib/event-service";

// Public endpoint to get active events with upcoming sessions
export async function GET() {
  try {
    // Get active events and upcoming sessions
    const eventsResult = await EventService.getActiveEvents();
    
    if (!eventsResult.success) {
      return NextResponse.json({ success: false, error: eventsResult.error || "Failed to fetch events" }, { status: 500 });
    }

    return NextResponse.json({ success: true, events: eventsResult.events });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
