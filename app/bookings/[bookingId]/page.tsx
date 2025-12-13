import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { BookingService } from "@/lib/booking-service";
import { Booking } from "@/lib/types";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  Users,
  CreditCard,
} from "lucide-react";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default async function BookingDetailsPage({
  params,
}: {
  params: Promise<{ bookingId: string }>;
}) {
  // Unwrap the params Promise
  const { bookingId } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  // Fetch booking details
  const bookingResult = await BookingService.getBookingById(bookingId);

  if (!bookingResult.success || !bookingResult.booking) {
    return (
      <div className="min-h-screen bg-background font-body flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Booking Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The booking you're looking for doesn't exist or you don't have
            permission to view it.
          </p>
          <Link
            href="/dashboard"
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const booking = bookingResult.booking;

  // Verify that the booking belongs to the current user
  if (
    booking.userId !== session.user.id &&
    booking.customerEmail !== session.user.email
  ) {
    return (
      <div className="min-h-screen bg-background font-body flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You don't have permission to view this booking.
          </p>
          <Link
            href="/dashboard"
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Booking already has denormalized event data (eventName, eventDate)
  // No need to fetch session or event separately

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
          <Link href="/dashboard">
            <h1 className="text-3xl font-semibold leading-10 tracking-tight text-primary">
              Booking Details
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
                href="/dashboard"
                className="px-4 py-2 text-sm font-medium text-primary bg-white border border-primary rounded-md hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {booking.eventName}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Booking ID: {booking.id}
                </p>
              </div>
              <span
                className={`mt-4 md:mt-0 px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusColor(
                  booking.status
                )}`}
              >
                {booking.status.charAt(0).toUpperCase() +
                  booking.status.slice(1)}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Event Details */}
              <div className="lg:col-span-2">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Session Information
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-start">
                      <Calendar className="h-5 w-5 text-primary mt-1 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Date
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {new Date(booking.eventDate).toLocaleDateString(
                            "en-US",
                            {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Details */}
              <div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Booking Information
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-start">
                      <User className="h-5 w-5 text-primary mt-1 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Name
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {booking.customerName}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Mail className="h-5 w-5 text-primary mt-1 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Email
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {booking.customerEmail}
                        </p>
                      </div>
                    </div>

                    {booking.customerPhone && (
                      <div className="flex items-start">
                        <Phone className="h-5 w-5 text-primary mt-1 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Phone
                          </p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {booking.customerPhone}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start">
                      <Users className="h-5 w-5 text-primary mt-1 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Participants
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {booking.numberOfPeople}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
                      <div className="flex justify-between">
                        <p className="text-gray-600 dark:text-gray-400">
                          Total
                        </p>
                        <p className="font-bold text-lg text-gray-900 dark:text-white">
                          LKR {booking.totalPrice.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {booking.specialRequests && (
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mt-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Special Requests
                    </h3>
                    <p className="text-gray-900 dark:text-white">
                      {booking.specialRequests}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
