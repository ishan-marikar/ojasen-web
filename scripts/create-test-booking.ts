import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createTestBooking() {
  try {
    // Create a test booking with a unique ID
    const bookingId = `booking_test_${Date.now()}`;
    
    const testBooking = await prisma.booking.create({
      data: {
        id: bookingId,
        eventId: "anahata-flow",
        eventName: "Anahata Flow",
        customerName: "Test User",
        customerEmail: "test@example.com",
        customerPhone: "+1234567890",
        numberOfPeople: 2,
        specialRequests: "Please provide extra blankets",
        eventDate: new Date("2025-11-22T18:00:00"),
        status: "confirmed",
        totalPrice: 7000,
        ojasenFee: 5000,
        facilitatorFee: 2000,
        facilitatorId: null,
        facilitatorName: null,
        userId: null,
      },
    });

    console.log("Test booking created:", testBooking);
    console.log(`You can now access the booking details at: http://localhost:3000/bookings/${bookingId}`);
  } catch (error) {
    console.error("Error creating test booking:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestBooking();