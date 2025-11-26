import { NextResponse } from "next/server";
import { FacilitatorService } from "@/lib/booking-service";
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

    // Get all facilitators
    const facilitatorsResult = await FacilitatorService.getAllFacilitators();
    
    if (!facilitatorsResult.success) {
      return NextResponse.json({ success: false, error: facilitatorsResult.error || "Failed to fetch facilitators" }, { status: 500 });
    }

    return NextResponse.json({ success: true, facilitators: facilitatorsResult.facilitators });
  } catch (error) {
    console.error("Error fetching facilitators:", error);
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

    // Create new facilitator
    const facilitatorResult = await FacilitatorService.createFacilitator(body);
    
    if (!facilitatorResult.success) {
      return NextResponse.json({ success: false, error: facilitatorResult.error || "Failed to create facilitator" }, { status: 500 });
    }

    return NextResponse.json({ success: true, facilitator: facilitatorResult.facilitator });
  } catch (error) {
    console.error("Error creating facilitator:", error);
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

    // Update facilitator
    const updatedFacilitator = await prisma.facilitator.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, facilitator: updatedFacilitator });
  } catch (error) {
    console.error("Error updating facilitator:", error);
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

    // Delete facilitator
    await prisma.facilitator.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting facilitator:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}