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

    // Get all customers (users who are not admins)
    const customers = await prisma.user.findMany({
      where: {
        role: {
          not: "admin"
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    // Add computed fields for bookings and total spent
    const customersWithStats = await Promise.all(
      customers.map(async (customer) => {
        const bookings = await prisma.booking.findMany({
          where: {
            userId: customer.id
          }
        });
        
        const totalSpent = bookings.reduce((sum, booking) => sum + booking.totalPrice, 0);
        
        return {
          ...customer,
          totalBookings: bookings.length,
          totalSpent,
          joinDate: customer.createdAt
        };
      })
    );

    return NextResponse.json({ success: true, customers: customersWithStats });
  } catch (error) {
    console.error("Error fetching customers:", error);
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
    
    // Validate required fields
    if (!body.name || !body.email) {
      return NextResponse.json({ success: false, error: "Name and email are required" }, { status: 400 });
    }
    
    // Check if customer with email already exists
    const existingCustomer = await prisma.user.findUnique({
      where: { email: body.email }
    });
    
    if (existingCustomer) {
      return NextResponse.json({ success: false, error: "Customer with this email already exists" }, { status: 400 });
    }
    
    // Create new customer
    const newCustomer = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone || null,
        role: "user",
        emailVerified: false,
        isAnonymous: false
      }
    });

    return NextResponse.json({ success: true, customer: newCustomer });
  } catch (error) {
    console.error("Error creating customer:", error);
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
    
    // Validate required fields
    if (!body.id) {
      return NextResponse.json({ success: false, error: "Customer ID is required" }, { status: 400 });
    }
    
    // Update customer
    const updatedCustomer = await prisma.user.update({
      where: { id: body.id },
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone
      }
    });

    return NextResponse.json({ success: true, customer: updatedCustomer });
  } catch (error) {
    console.error("Error updating customer:", error);
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
    
    // Validate required fields
    if (!body.id) {
      return NextResponse.json({ success: false, error: "Customer ID is required" }, { status: 400 });
    }
    
    // Check if customer has bookings
    const bookings = await prisma.booking.findMany({
      where: { userId: body.id }
    });
    
    if (bookings.length > 0) {
      return NextResponse.json({ success: false, error: "Cannot delete customer with existing bookings" }, { status: 400 });
    }
    
    // Delete customer
    await prisma.user.delete({
      where: { id: body.id }
    });

    return NextResponse.json({ success: true, message: "Customer deleted successfully" });
  } catch (error) {
    console.error("Error deleting customer:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}