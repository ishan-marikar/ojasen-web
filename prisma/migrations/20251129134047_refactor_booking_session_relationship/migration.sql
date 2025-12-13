-- AlterTable: Remove eventId from booking, add sessionId
-- Step 1: Add sessionId column (nullable first to allow data migration)
ALTER TABLE "booking" ADD COLUMN "sessionId" TEXT;

-- Step 2: Drop eventId column (WARNING: This removes the old relationship)
ALTER TABLE "booking" DROP COLUMN "eventId";

-- Step 3: Remove bookedCount from event_session (calculated from bookings now)
ALTER TABLE "event_session" DROP COLUMN "bookedCount";

-- Step 4: Add facilitator relationship to event_session
ALTER TABLE "event_session" ADD COLUMN IF NOT EXISTS "facilitatorId" TEXT;

-- AddForeignKey: Booking -> EventSession
-- Note: Cannot add NOT NULL constraint yet because existing bookings need migration
-- Will be added in a future migration after data is linked
ALTER TABLE "booking" ADD CONSTRAINT "booking_sessionId_fkey" 
  FOREIGN KEY ("sessionId") REFERENCES "event_session"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: EventSession -> Facilitator
ALTER TABLE "event_session" ADD CONSTRAINT "event_session_facilitatorId_fkey" 
  FOREIGN KEY ("facilitatorId") REFERENCES "facilitator"("id") ON DELETE SET NULL ON UPDATE CASCADE;
