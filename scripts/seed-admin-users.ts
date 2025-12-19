import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedAdminUsers() {
  try {
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

    console.log("Starting admin user seeding...\n");

    for (const adminUserData of adminUsers) {
      // Check if admin user already exists
      const existingAdmin = await prisma.user.findUnique({
        where: { email: adminUserData.email },
      });

      if (!existingAdmin) {
        // Create the user directly in the database with admin role
        const newUser = await prisma.user.create({
          data: {
            id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: adminUserData.name,
            email: adminUserData.email,
            emailVerified: true, // Mark as verified for admin
            role: "admin", // Set role to admin
          },
        });
        
        console.log(`✓ Created admin user: ${adminUserData.name} (${adminUserData.email})`);
        console.log(`  NOTE: User has no password. Use forgot password flow for first login.\n`);
      } else {
        // Update existing user to have admin role if not already
        if (existingAdmin.role !== "admin") {
          await prisma.user.update({
            where: { email: adminUserData.email },
            data: { role: "admin" },
          });
          console.log(`✓ Updated ${adminUserData.name} (${adminUserData.email}) to admin role\n`);
        } else {
          console.log(`✓ Admin user ${adminUserData.name} (${adminUserData.email}) already exists\n`);
        }
      }
    }

    console.log("Admin user seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding admin users:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedAdminUsers();
