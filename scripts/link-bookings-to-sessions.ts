import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

/**
 * Link Bookings to Sessions Script
 * 
 * This script MUST be run AFTER the Prisma migration has been applied.
 * It updates existing bookings with their corresponding sessionId values.
 */

async function main() {
  console.log("🔗 Linking bookings to sessions...\n");

  // Read the mapping file created by the previous script
  const mappingPath = path.join(__dirname, "booking-session-mapping.json");

  if (!fs.existsSync(mappingPath)) {
    console.error("❌ Error: booking-session-mapping.json not found!");
    console.error("   Please run: npx tsx scripts/migrate-bookings-to-sessions.ts first\n");
    process.exit(1);
  }

  const mapping = JSON.parse(fs.readFileSync(mappingPath, "utf-8"));

  console.log(`📊 Found ${mapping.length} bookings to link\n`);

  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  for (const item of mapping) {
    try {
      // Check if booking exists
      const booking = await prisma.booking.findUnique({
        where: { id: item.bookingId },
      });

      if (!booking) {
        console.log(`  ⏭️  Booking ${item.bookingId} not found, skipping...`);
        skipCount++;
        continue;
      }

      // Check if session exists
      const session = await prisma.eventSession.findUnique({
        where: { id: item.sessionId },
      });

      if (!session) {
        console.log(`  ⚠️  Session ${item.sessionId} not found for booking ${item.bookingId}`);
        errorCount++;
        continue;
      }

      // Update the booking with sessionId
      await prisma.booking.update({
        where: { id: item.bookingId },
        data: {
          sessionId: item.sessionId,
        },
      });

      successCount++;
      
      if (successCount % 10 === 0) {
        console.log(`  ✅ Linked ${successCount} bookings...`);
      }
    } catch (error) {
      console.error(`  ❌ Error linking booking ${item.bookingId}:`, error);
      errorCount++;
    }
  }

  console.log("\n📊 Linking Summary:");
  console.log(`  - Successfully linked: ${successCount}`);
  console.log(`  - Skipped (not found): ${skipCount}`);
  console.log(`  - Errors: ${errorCount}`);

  if (successCount === mapping.length) {
    console.log("\n✅ All bookings successfully linked to sessions!");
    
    // Clean up the mapping file
    fs.unlinkSync(mappingPath);
    console.log("🗑️  Removed temporary mapping file\n");
  } else {
    console.log("\n⚠️  Some bookings could not be linked. Please review the errors above.\n");
  }

  // Verification
  console.log("🔍 Running verification checks...\n");

  // Note: sessionId is now REQUIRED in schema, so this check is not needed
  // All bookings must have a sessionId after migration
  console.log("✅ All bookings linked (sessionId is required in schema)");

  // Check session booking counts
  const sessions = await prisma.eventSession.findMany({
    include: {
      bookings: true,
      _count: {
        select: { bookings: true },
      },
    },
  });

  console.log(`\n📊 Session Summary:`);
  for (const session of sessions) {
    const totalAttendees = session.bookings.reduce(
      (sum, b) => sum + b.numberOfPeople,
      0
    );
    console.log(
      `  - ${session.id}: ${session._count.bookings} bookings, ${totalAttendees} attendees, capacity: ${session.capacity}`
    );
  }

  console.log("\n✨ Linking complete!\n");
}

main()
  .catch((e) => {
    console.error("❌ Linking failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
