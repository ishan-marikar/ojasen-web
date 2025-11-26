// app/admin/test/page.tsx
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function AdminTestPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Check if user has admin role by querying the database directly
  let hasAdminRole = false;
  let user = null;
  if (session?.user?.id) {
    try {
      user = await prisma.user.findUnique({
        where: { id: session.user.id },
      });

      if (user?.role === "admin") {
        hasAdminRole = true;
      }
    } catch (error) {
      console.error(
        "AdminTestPage: Error checking user role in database",
        error
      );
    }
  }

  // Only allow admin users to access this page
  if (!session || !hasAdminRole) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen bg-background font-body p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Test Page</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">User Information</h2>
        <p>
          <strong>User ID:</strong> {user?.id}
        </p>
        <p>
          <strong>Email:</strong> {user?.email}
        </p>
        <p>
          <strong>Name:</strong> {user?.name}
        </p>
        <p>
          <strong>Role:</strong> {user?.role}
        </p>
        <p>
          <strong>Has Admin Role:</strong> {hasAdminRole ? "Yes" : "No"}
        </p>
      </div>
    </div>
  );
}
