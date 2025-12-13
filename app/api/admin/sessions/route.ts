import { NextResponse } from "next/server";
import { EventService } from "@/lib/event-service";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
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

    // Check if eventId query parameter is provided
    const url = new URL(request.url);
    const eventId = url.searchParams.get('eventId');

    let sessionsResult;
    if (eventId) {
      // Get sessions for specific event
      sessionsResult = await EventService.getSessionsByEventId(eventId);
    } else {
      // Get all sessions
      sessionsResult = await EventService.getAllSessions();
    }
    
    if (!sessionsResult.success) {
      return NextResponse.json({ success: false, error: sessionsResult.error || "Failed to fetch sessions" }, { status: 500 });
    }

    return NextResponse.json({ success: true, sessions: sessionsResult.sessions });
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
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

    // Parse request body
    const body = await request.json();

    // Ensure date is a Date object
    if (body.date) {
      body.date = new Date(body.date);
    }

    // Create new session
    const sessionResult = await EventService.createSession(body);
    
    if (!sessionResult.success) {
      return NextResponse.json({ success: false, error: sessionResult.error || "Failed to create session" }, { status: 500 });
    }

    return NextResponse.json({ success: true, session: sessionResult.session });
  } catch (error) {
    console.error("Error creating session:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
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

    // Parse request body
    const body = await request.json();
    const { id, ...updateData } = body;

    // Ensure date is a Date object if provided
    if (updateData.date) {
      updateData.date = new Date(updateData.date);
    }

    // Update session
    const sessionResult = await EventService.updateSession(id, updateData);
    
    if (!sessionResult.success) {
      return NextResponse.json({ success: false, error: sessionResult.error || "Failed to update session" }, { status: 500 });
    }

    return NextResponse.json({ success: true, session: sessionResult.session });
  } catch (error) {
    console.error("Error updating session:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
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

    // Parse request body
    const body = await request.json();
    const { id } = body;

    // Delete session
    const result = await EventService.deleteSession(id);
    
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error || "Failed to delete session" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting session:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
