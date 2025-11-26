import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { InvoiceService } from "@/lib/invoice-service";

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

    // Get all purchase orders
    const purchaseOrdersResult = await InvoiceService.getAllPurchaseOrders();
    
    if (!purchaseOrdersResult.success) {
      return NextResponse.json({ success: false, error: purchaseOrdersResult.error || "Failed to fetch purchase orders" }, { status: 500 });
    }

    return NextResponse.json({ success: true, purchaseOrders: purchaseOrdersResult.data });
  } catch (error) {
    console.error("Error fetching purchase orders:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
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
    const body = await req.json();

    // Create new purchase order
    const purchaseOrderResult = await InvoiceService.createPurchaseOrder(body);
    
    if (!purchaseOrderResult.success) {
      return NextResponse.json({ success: false, error: purchaseOrderResult.error || "Failed to create purchase order" }, { status: 500 });
    }

    return NextResponse.json({ success: true, purchaseOrder: purchaseOrderResult.data });
  } catch (error) {
    console.error("Error creating purchase order:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
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
    const body = await req.json();
    const { id, ...updateData } = body;

    // Update purchase order
    const updatedPurchaseOrder = await prisma.purchaseOrder.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, purchaseOrder: updatedPurchaseOrder });
  } catch (error) {
    console.error("Error updating purchase order:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
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
    const body = await req.json();
    const { id } = body;

    // Delete purchase order
    await prisma.purchaseOrder.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting purchase order:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}