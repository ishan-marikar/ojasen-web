import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { signOutAction } from "@/lib/auth-actions";
import { AuthLogger } from "@/lib/auth-logger";
import { BookingService, FacilitatorService } from "@/lib/booking-service";
import { Facilitator, Booking } from "@/lib/types";
import Link from "next/link";
import { ProfileEditForm } from "@/components/profile-edit-form";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Extend the User type to include role
interface UserWithRole {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  emailVerified: boolean;
  name: string;
  image?: string | null;
  isAnonymous?: boolean | null;
  role: string;
  phone?: string | null;
  emergencyContactName?: string | null;
  emergencyContactPhone?: string | null;
}

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    AuthLogger.warn("Unauthorized dashboard access attempt");
    redirect("/sign-in");
  }

  // Cast session user to include role and contact information
  const userWithRole = session.user as UserWithRole;

  // Check user role and redirect accordingly
  if (userWithRole.role === "admin") {
    // Admin dashboard (existing implementation)
    AuthLogger.info("Admin dashboard accessed", { userId: session.user.id });

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
                  This is a protected page. Only authenticated users can see
                  this content.
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
  } else {
    // Regular user profile page - ENHANCED VERSION
    AuthLogger.info("User profile accessed", { userId: session.user.id });

    // Log user session data for debugging
    console.log("User session data:", session.user);

    // Get user bookings
    let userBookings: Booking[] = [];
    try {
      // Log the user information for debugging
      console.log("Fetching bookings for user:", {
        id: session.user.id,
        email: session.user.email,
        isAnonymous: session.user.isAnonymous,
      });

      // Get bookings by user email
      const bookingsResult = await BookingService.getBookingsByCustomerEmail(
        session.user.email
      );
      if (bookingsResult.success) {
        userBookings = bookingsResult.bookings || [];
        console.log(
          "Found",
          userBookings.length,
          "bookings by email for user",
          session.user.email
        );
      }

      // If no bookings found by email and user has an ID, try by user ID as fallback
      if (userBookings.length === 0 && session.user.id) {
        console.log(
          "No bookings found by email, trying by user ID:",
          session.user.id
        );
        const bookingsByIdResult = await BookingService.getBookingsByUserId(
          session.user.id
        );
        if (bookingsByIdResult.success) {
          userBookings = bookingsByIdResult.bookings || [];
          console.log("Found", userBookings.length, "bookings by user ID");

          // Log details of bookings found by user ID for debugging
          if (userBookings.length > 0) {
            console.log(
              "Bookings found by user ID:",
              userBookings.map((b) => ({
                id: b.id,
                eventId: b.eventId,
                customerEmail: b.customerEmail,
                userId: b.userId,
              }))
            );
          }
        }
      }

      // Additional verification: if we have a user ID, also fetch by user ID and merge results
      // This ensures we don't miss any bookings that might be associated with the user ID but not email
      if (session.user.id) {
        const bookingsByIdResult = await BookingService.getBookingsByUserId(
          session.user.id
        );
        if (bookingsByIdResult.success && bookingsByIdResult.bookings) {
          // Merge bookings, avoiding duplicates
          const existingBookingIds = new Set(userBookings.map((b) => b.id));
          const additionalBookings = bookingsByIdResult.bookings.filter(
            (booking) => !existingBookingIds.has(booking.id)
          );

          if (additionalBookings.length > 0) {
            console.log(
              "Found",
              additionalBookings.length,
              "additional bookings by user ID"
            );
            userBookings = [...userBookings, ...additionalBookings];
          }
        }
      }

      // Log for debugging purposes
      console.log(
        "Final fetched bookings for user:",
        session.user.email,
        userBookings.length
      );
    } catch (error) {
      console.error("Error fetching user bookings:", error);
    }

    // Get user's contact information from the database
    let userContactInfo = {
      phone: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
    };

    try {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          phone: true,
          emergencyContactName: true,
          emergencyContactPhone: true,
        },
      });

      if (user) {
        userContactInfo = {
          phone: user.phone || "",
          emergencyContactName: user.emergencyContactName || "",
          emergencyContactPhone: user.emergencyContactPhone || "",
        };
      }
    } catch (error) {
      console.error("Error fetching user contact information:", error);
    }

    // Separate upcoming and past bookings
    const now = new Date();
    const upcomingBookings = userBookings
      .filter((booking) => new Date(booking.eventDate) >= now)
      .sort(
        (a, b) =>
          new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()
      );

    const pastBookings = userBookings
      .filter((booking) => new Date(booking.eventDate) < now)
      .sort(
        (a, b) =>
          new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime()
      );

    const getStatusColor = (status: string) => {
      switch (status.toLowerCase()) {
        case "confirmed":
          return "bg-green-100 text-green-800";
        case "pending":
          return "bg-yellow-100 text-yellow-800";
        case "cancelled":
          return "bg-red-100 text-red-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    };

    return (
      <div className="min-h-screen bg-background font-body">
        <header className="bg-white dark:bg-black shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <Link href="/">
              <h1 className="text-3xl font-semibold leading-10 tracking-tight text-primary">
                My Wellness Profile
              </h1>
            </Link>
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
            {/* Personal Information Management */}
            <ProfileEditForm
              user={session.user}
              initialPhone={userContactInfo.phone}
              initialEmergencyContactName={userContactInfo.emergencyContactName}
              initialEmergencyContactPhone={
                userContactInfo.emergencyContactPhone
              }
            />

            {/* Upcoming Bookings */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Upcoming Bookings
              </h2>

              {upcomingBookings.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 dark:text-gray-400">
                    You don't have any upcoming bookings.
                  </p>
                  <Link
                    href="/booking"
                    className="mt-4 inline-block px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    Book a Session
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Event
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Date
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Participants
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {upcomingBookings.map((booking) => (
                        <tr key={booking.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {booking.eventName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            {new Date(booking.eventDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            {booking.numberOfPeople}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                                booking.status
                              )}`}
                            >
                              {booking.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
                            LKR {booking.totalPrice.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Booking History */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Booking History
              </h2>

              {pastBookings.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 dark:text-gray-400">
                    You haven't made any bookings yet.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Event
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Date
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Participants
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {pastBookings.map((booking) => (
                        <tr key={booking.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {booking.eventName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            {new Date(booking.eventDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            {booking.numberOfPeople}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                                booking.status
                              )}`}
                            >
                              {booking.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
                            LKR {booking.totalPrice.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    );
  }
}
