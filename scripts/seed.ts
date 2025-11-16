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

    console.log("Database seeding completed!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();