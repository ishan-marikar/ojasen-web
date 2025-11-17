import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function testConnection() {
  try {
    // Test the connection by counting users
    const userCount = await prisma.user.count();
    console.log(`✅ Successfully connected to database. Found ${userCount} users.`);
    
    // Also check other tables
    const facilitatorCount = await prisma.facilitator.count();
    console.log(`✅ Found ${facilitatorCount} facilitators.`);
    
    const bookingCount = await prisma.booking.count();
    console.log(`✅ Found ${bookingCount} bookings.`);
    
    // List all users
    const users = await prisma.user.findMany();
    console.log("\nUsers in database:");
    users.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - Verified: ${user.emailVerified}`);
    });
    
    // List all tables
    console.log("\n✅ Database connection test passed!");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();