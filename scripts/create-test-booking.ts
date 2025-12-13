import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createTestBooking() {
  try {
    // NOTE: This script is outdated. Bookings now require a sessionId.
    // You need to create an event and session first via the admin panel.
    // Then use that sessionId to create a booking.
    
    console.log("⚠️  This script is outdated. Please use the admin panel to:");
    console.log("1. Create an Event");
    console.log("2. Create a Session for that Event");
    console.log("3. Book that Session via the booking page");
    console.log("\nOr update this script to create a session first.");
    
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestBooking();