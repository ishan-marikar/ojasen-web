import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json({ isAdmin: false, error: "No session found" }, { status: 401 });
    }

    // Check user role in database
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    const isAdmin = user?.role === "admin";

    return NextResponse.json({
      isAdmin,
      userId: session.user.id,
      userEmail: session.user.email,
    });
  } catch (error) {
    console.error("Error checking admin status:", error);
    return NextResponse.json({ isAdmin: false, error: "Internal server error" }, { status: 500 });
  }
}