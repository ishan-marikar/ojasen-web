import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Data Migration Script
 * 
 * This script migrates existing bookings to the new session-based architecture:
 * 1. Creates EventSession records for all hardcoded events
 * 2. Links existing Bookings to their corresponding EventSessions
 * 3. Validates data integrity after migration
 */

// Hardcoded events from the old system
const HARDCODED_EVENTS = [
  {
    id: "yin-yoga",
    title: "Yin Yoga",
    description: "Slow, still poses that melt tension and quiet the mind.",
    category: "Yoga",
    defaultPrice: 3000,
    defaultLocation: "Ojasen Healing Arts",
  },
  {
    id: "reiki-healing",
    title: "Reiki Healing 1:1",
    description: "Energy healing to balance and restore your inner flow.",
    category: "Healing",
    defaultPrice: 6000,
    defaultLocation: "Ojasen Healing Arts",
  },
  {
    id: "sound-healing",
    title: "Sound Healing",
    description: "Vibrational therapy using singing bowls and gongs.",
    category: "Sound Healing",
    defaultPrice: 4000,
    defaultLocation: "Ojasen Healing Arts",
  },
  {
    id: "samatva-flow",
    title: "Samatva Flow",
    description: "A gentle, balanced flow to reset your energy.",
    category: "Yoga",
    defaultPrice: 3500,
    defaultLocation: "Ojasen Healing Arts",
  },
  {
    id: "anahata-flow",
    title: "Anahata Flow",
    description: "Heart-opening flow to cultivate compassion and openness.",
    category: "Yoga",
    defaultPrice: 3500,
    defaultLocation: "Ojasen Healing Arts",
  },
];

async function main() {
  console.log("🔄 Starting data migration...\n");

  // Step 1: Create Event records for hardcoded events (if they don't exist)
  console.log("📝 Step 1: Creating Event records...");
  for (const event of HARDCODED_EVENTS) {
    const existingEvent = await prisma.event.findUnique({
      where: { id: event.id },
    });

    if (!existingEvent) {
      await prisma.event.create({
        data: {
          id: event.id,
          title: event.title,
          description: event.description,
          category: event.category || "General",
          defaultPrice: event.defaultPrice,
          defaultLocation: event.defaultLocation || "TBD",
          status: "active",
        },
      });
      console.log(`  ✅ Created event: ${event.title}`);
    } else {
      console.log(`  ⏭️  Event already exists: ${event.title}`);
    }
  }

  // Step 2: Get all existing bookings that need migration
  console.log("\n📊 Step 2: Analyzing existing bookings...");
  const existingBookings = await prisma.booking.findMany({
    orderBy: { eventDate: "asc" },
  });

  console.log(`  Found ${existingBookings.length} bookings to process\n`);

  // Step 3: Create sessions for each unique event date in bookings
  console.log("🎯 Step 3: Creating EventSession records...");
  
  // Group bookings by eventId and eventDate
  const sessionMap = new Map<string, any[]>();
  
  existingBookings.forEach((booking: any) => {
    const dateKey = booking.eventDate.toISOString().split("T")[0];
    const sessionKey = `${booking.eventId}_${dateKey}`;
    
    if (!sessionMap.has(sessionKey)) {
      sessionMap.set(sessionKey, []);
    }
    sessionMap.get(sessionKey)!.push(booking);
  });

  console.log(`  Need to create ${sessionMap.size} unique sessions\n`);

  const sessionIdMap = new Map<string, string>();

  for (const [sessionKey, bookings] of sessionMap.entries()) {
    const firstBooking = bookings[0] as any;
    const eventId = firstBooking.eventId;
    const eventDate = firstBooking.eventDate;
    
    // Find the corresponding event
    const event = HARDCODED_EVENTS.find((e) => e.id === eventId);
    
    if (!event) {
      console.log(`  ⚠️  Warning: Unknown event ID ${eventId}, skipping...`);
      continue;
    }

    // Create session ID
    const dateStr = eventDate.toISOString().split("T")[0].replace(/-/g, "");
    const sessionId = `session_${eventId}_${dateStr}`;

    // Check if session already exists
    const existingSession = await prisma.eventSession.findUnique({
      where: { id: sessionId },
    });

    if (!existingSession) {
      // Calculate total attendees for capacity
      const totalAttendees = bookings.reduce(
        (sum, b) => sum + b.numberOfPeople,
        0
      );
      const capacity = Math.max(20, totalAttendees + 5); // At least 20, or current + 5

      try {
        await prisma.eventSession.create({
          data: {
            id: sessionId,
            eventId: event.id,
            date: eventDate,
            time: "6:00 PM", // Default time (could be improved)
            location: event.defaultLocation,
            price: event.defaultPrice,
            capacity,
            status: eventDate < new Date() ? "completed" : "active",
          },
        });

        sessionIdMap.set(sessionKey, sessionId);
        console.log(
          `  ✅ Created session: ${event.title} on ${eventDate.toISOString().split("T")[0]} (${bookings.length} bookings)`
        );
      } catch (error) {
        console.error(`  ❌ Failed to create session ${sessionId}:`, error);
      }
    } else {
      sessionIdMap.set(sessionKey, existingSession.id);
      console.log(
        `  ⏭️  Session already exists: ${event.title} on ${eventDate.toISOString().split("T")[0]}`
      );
    }
  }

  // Step 4: Update bookings with sessionId (THIS STEP WILL BE DONE AFTER MIGRATION)
  console.log("\n📝 Step 4: Mapping bookings to sessions...");
  console.log("  ⚠️  This step will be executed AFTER running the database migration");
  console.log("  ⚠️  Run: npm run migrate:link-bookings after migration completes\n");

  // Save the mapping to a JSON file for the next script
  const fs = await import("fs");
  const mapping: any[] = [];

  for (const [sessionKey, bookings] of sessionMap.entries()) {
    const sessionId = sessionIdMap.get(sessionKey);
    if (sessionId) {
      bookings.forEach((booking) => {
        mapping.push({
          bookingId: booking.id,
          sessionId: sessionId,
          eventName: booking.eventName,
          eventDate: booking.eventDate.toISOString(),
        });
      });
    }
  }

  fs.writeFileSync(
    "./scripts/booking-session-mapping.json",
    JSON.stringify(mapping, null, 2)
  );

  console.log(`✅ Saved mapping for ${mapping.length} bookings to booking-session-mapping.json\n`);

  // Step 5: Summary
  console.log("📊 Migration Summary:");
  console.log(`  - Events created/verified: ${HARDCODED_EVENTS.length}`);
  console.log(`  - Sessions created: ${sessionIdMap.size}`);
  console.log(`  - Bookings to link: ${mapping.length}`);
  console.log("\n✨ Pre-migration setup complete!");
  console.log("\n⚠️  NEXT STEPS:");
  console.log("  1. Review the changes above");
  console.log("  2. Run: npx prisma migrate dev --name refactor_booking_session_relationship");
  console.log("  3. Run: npm run migrate:link-bookings");
  console.log("  4. Verify data integrity\n");
}

main()
  .catch((e) => {
    console.error("❌ Migration failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
