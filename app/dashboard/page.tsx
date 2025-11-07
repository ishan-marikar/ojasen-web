import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { signOutAction } from "@/lib/auth-actions";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen bg-background font-body">
      <header className="bg-white dark:bg-black shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-semibold leading-10 tracking-tight">
            Ojasen Healing Arts
          </h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Welcome, {session.user.name}
            </span>
            <form action={signOutAction}>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 dark:border-gray-700 rounded-lg h-96 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Dashboard
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                This is a protected page. Only authenticated users can see this
                content.
              </p>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                You are signed in as: {session.user.email}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
