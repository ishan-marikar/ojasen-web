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

    // Get all payments
    const paymentsResult = await InvoiceService.getAllPayments();
    
    if (!paymentsResult.success) {
      return NextResponse.json({ success: false, error: paymentsResult.error || "Failed to fetch payments" }, { status: 500 });
    }

    return NextResponse.json({ success: true, payments: paymentsResult.data });
  } catch (error) {
    console.error("Error fetching payments:", error);
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

    // Determine if this is an invoice payment or purchase order payment
    if (body.invoiceId) {
      // Record invoice payment
      const paymentResult = await InvoiceService.recordInvoicePayment(body);
      
      if (!paymentResult.success) {
        return NextResponse.json({ success: false, error: paymentResult.error || "Failed to record invoice payment" }, { status: 500 });
      }

      return NextResponse.json({ success: true, payment: paymentResult.data });
    } else if (body.purchaseOrderId) {
      // Record purchase order payment
      const paymentResult = await InvoiceService.recordPOPayment(body);
      
      if (!paymentResult.success) {
        return NextResponse.json({ success: false, error: paymentResult.error || "Failed to record purchase order payment" }, { status: 500 });
      }

      return NextResponse.json({ success: true, payment: paymentResult.data });
    } else {
      return NextResponse.json({ success: false, error: "Either invoiceId or purchaseOrderId is required" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error creating payment:", error);
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

    // Update payment
    const updatedPayment = await prisma.payment.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, payment: updatedPayment });
  } catch (error) {
    console.error("Error updating payment:", error);
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

    // Delete payment
    await prisma.payment.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting payment:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}