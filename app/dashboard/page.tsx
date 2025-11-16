import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { signOutAction } from "@/lib/auth-actions";
import { AuthLogger } from "@/lib/auth-logger";
import { BookingService, FacilitatorService } from "@/lib/booking-service";
import { Facilitator } from "@/lib/types";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    AuthLogger.warn("Unauthorized dashboard access attempt");
    redirect("/sign-in");
  }

  AuthLogger.info("Dashboard accessed", { userId: session.user.id });

  // Initialize default values
  let stats: Record<string, number> = {
    pending: 0,
    confirmed: 0,
    cancelled: 0,
  };
  let totalRevenue = 0;
  let ojasenRevenue = 0;
  let facilitatorRevenue = 0;
  let facilitators: Facilitator[] = [];
  let facilitatorEarnings: (Facilitator & {
    totalEarnings: number;
    totalBookings: number;
  })[] = [];

  // Get booking statistics
  try {
    const statsResult = await BookingService.getBookingStats();
    if (statsResult.success) {
      stats = statsResult.stats || stats;
    }
  } catch (error) {
    console.error("Error fetching booking stats:", error);
  }

  // Get revenue data
  try {
    const revenueResult = await BookingService.getTotalRevenue();
    if (revenueResult.success) {
      totalRevenue = revenueResult.totalRevenue || 0;
      ojasenRevenue = revenueResult.ojasenRevenue || 0;
      facilitatorRevenue = revenueResult.facilitatorRevenue || 0;
    }
  } catch (error) {
    console.error("Error fetching revenue data:", error);
  }

  // Get facilitators
  try {
    const facilitatorsResult = await FacilitatorService.getAllFacilitators();
    if (facilitatorsResult.success) {
      facilitators = facilitatorsResult.facilitators || [];
    }
  } catch (error) {
    console.error("Error fetching facilitators:", error);
  }

  // Get facilitator earnings
  try {
    const earningsPromises = facilitators.map(async (facilitator) => {
      const earningsResult = await FacilitatorService.getFacilitatorEarnings(
        facilitator.id
      );
      const totalEarnings = earningsResult.success
        ? earningsResult.totalEarnings || 0
        : 0;
      const totalBookings = earningsResult.success
        ? earningsResult.totalBookings || 0
        : 0;

      return {
        ...facilitator,
        totalEarnings,
        totalBookings,
      };
    });

    facilitatorEarnings = await Promise.all(earningsPromises);
  } catch (error) {
    console.error("Error fetching facilitator earnings:", error);
    // Use facilitators with zero earnings as fallback
    facilitatorEarnings = facilitators.map((facilitator) => ({
      ...facilitator,
      totalEarnings: 0,
      totalBookings: 0,
    }));
  }

  return (
    <div className="min-h-screen bg-background font-body">
      <header className="bg-white dark:bg-black shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-semibold leading-10 tracking-tight">
            Ojasen Healing Arts
          </h1>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Welcome, {session.user.name || session.user.email}
              </span>
            </div>
            <div className="flex gap-2">
              <Link
                href="/booking"
                className="px-4 py-2 text-sm font-medium text-primary bg-white border border-primary rounded-md hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Book New Session
              </Link>
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
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Business Dashboard
          </h2>

          {/* Revenue Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Total Revenue
              </h3>
              <p className="text-3xl font-bold text-primary">
                LKR {totalRevenue.toLocaleString()}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Ojasen Revenue
              </h3>
              <p className="text-3xl font-bold text-primary">
                LKR {ojasenRevenue.toLocaleString()}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Facilitator Revenue
              </h3>
              <p className="text-3xl font-bold text-primary">
                LKR {facilitatorRevenue.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Booking Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Pending Bookings
              </h3>
              <p className="text-3xl font-bold text-yellow-500">
                {stats.pending || 0}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Confirmed Bookings
              </h3>
              <p className="text-3xl font-bold text-green-500">
                {stats.confirmed || 0}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Cancelled Bookings
              </h3>
              <p className="text-3xl font-bold text-red-500">
                {stats.cancelled || 0}
              </p>
            </div>
          </div>

          {/* Facilitator Earnings */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-4">
              Facilitator Earnings
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Role
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Bookings
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Earnings
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {facilitatorEarnings.map((facilitator) => (
                    <tr key={facilitator.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {facilitator.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {facilitator.role}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {facilitator.totalBookings}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
                        LKR {facilitator.totalEarnings.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

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
