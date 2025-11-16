import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function testConnection() {
  try {
    // Test the connection by counting users
    const userCount = await prisma.user.count();
    console.log(`✅ Successfully connected to database. Found ${userCount} users.`);
    
    // List all tables
    console.log("✅ Database connection test passed!");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();