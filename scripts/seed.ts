import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {
  try {
    // Create initial facilitators
    const facilitators = [
      {
        id: "fac-1",
        name: "Oshadi",
        role: "Head Facilitator",
        email: "oshadi@ojasen.com",
        phone: "+94 77 123 4567",
        baseFee: 2000,
        commission: 0.15, // 15% commission
      },
      {
        id: "fac-2",
        name: "Alice",
        role: "Yoga Instructor",
        email: "alice@ojasen.com",
        phone: "+94 77 234 5678",
        baseFee: 1500,
        commission: 0.10, // 10% commission
      },
      {
        id: "fac-3",
        name: "Deborah",
        role: "Energy Healer",
        email: "deborah@ojasen.com",
        phone: "+94 77 345 6789",
        baseFee: 2500,
        commission: 0.20, // 20% commission
      },
    ];

    // Insert facilitators into the database
    for (const facilitatorData of facilitators) {
      const existingFacilitator = await prisma.facilitator.findUnique({
        where: { id: facilitatorData.id },
      });

      if (!existingFacilitator) {
        await prisma.facilitator.create({
          data: facilitatorData,
        });
        console.log(`Created facilitator: ${facilitatorData.name}`);
      } else {
        console.log(`Facilitator ${facilitatorData.name} already exists`);
      }
    }

    // Create admin users
    const adminUsers = [
      {
        name: "Ishan Marikar",
        email: "ishan@ojasenhealingarts.com",
      },
      {
        name: "Yatesh",
        email: "yatesh@ojasenhealingarts.com",
      },
      {
        name: "Omesh",
        email: "omesh@ojasen.com",
      },
      {
        name: "Joshem",
        email: "joshem@ojasen.com",
      }
    ];

    for (const adminUserData of adminUsers) {
      // Check if admin user already exists
      const existingAdmin = await prisma.user.findUnique({
        where: { email: adminUserData.email },
      });

      if (!existingAdmin) {
        // Create the user directly in the database with admin role
        const newUser = await prisma.user.create({
          data: {
            id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // Unique ID generation
            name: adminUserData.name,
            email: adminUserData.email,
            emailVerified: true, // Mark as verified for admin
            role: "admin", // Set role to admin
          },
        });
        
        console.log(`Created admin user with email: ${adminUserData.email}`);
        console.log("NOTE: This user has no password set. You'll need to set one through the application interface or use the forgot password flow.");
      } else {
        // Update existing user to have admin role if not already
        if (existingAdmin.role !== "admin") {
          await prisma.user.update({
            where: { email: adminUserData.email },
            data: { role: "admin" },
          });
          console.log(`Updated user ${adminUserData.email} to admin role`);
        } else {
          console.log(`Admin user with email ${adminUserData.email} already exists`);
        }
      }
    }

    console.log("Database seeding completed!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();