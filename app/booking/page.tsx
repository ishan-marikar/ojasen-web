"use client";

import { useState, useEffect } from "react";
import { MapPin, Clock, Calendar, User, Mail, Phone } from "lucide-react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { PageLayout } from "@/components/shared/page-layout";
import { Hero } from "@/components/shared/hero";
import { useSession, signIn } from "@/lib/auth-client";
import {
  generateGoogleCalendarLink,
  generateICalLink,
  generateOutlookCalendarLink,
  generateYahooCalendarLink,
} from "@/lib/calendar-utils";
import { submitBookingForm } from "@/lib/form-actions";
import { trackBookingEvent } from "@/lib/analytics";

// Session data structure (sessions are instances of events)
interface Session {
  id: string;
  eventId: string;
  title?: string; // Optional custom title
  date: Date;
  time: string;
  location: string;
  description?: string;
  price: number;
  capacity: number;
  status: string;
  event: {
    id: string;
    title: string;
    description: string;
    image: string;
    category?: string;
  };
  _count?: { bookings: number };
}

function BookingHero() {
  return (
    <Hero
      title="Book Your Experience"
      subtitle="Reservations"
      className="bg-[#f7faf6]"
    >
      <div className="text-[#525A52] text-center mt-8 text-lg tracking-wide max-w-3xl mx-auto px-4">
        Reserve your spot for our transformative wellness events
      </div>
    </Hero>
  );
}

export default function BookingPage() {
  const searchParams = useSearchParams();
  const { data: session, isPending } = useSession();
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    participants: "1",
    message: "",
    nationality: "Local", // Default to Local
    nic: "",
    passport: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load sessions from database
  useEffect(() => {
    async function loadSessions() {
      try {
        const response = await fetch("/api/sessions");
        const data = await response.json();

        if (data.success) {
          setSessions(data.sessions);
        } else {
          console.error("Failed to fetch sessions:", data.error);
        }
      } catch (error) {
        console.error("Error loading sessions:", error);
      } finally {
        setLoadingSessions(false);
      }
    }

    loadSessions();
  }, []);

  // Determine if user is anonymous
  const isAnonymousUser = session?.user?.isAnonymous ?? true;
  const isNonAnonymousUser = session?.user && !session.user.isAnonymous;

  // Debug logging
  useEffect(() => {
    if (session?.user) {
      console.log("User session data:", session.user);
      console.log("isAnonymousUser:", isAnonymousUser);
      console.log("isNonAnonymousUser:", isNonAnonymousUser);
    }
  }, [session, isAnonymousUser, isNonAnonymousUser]);

  // Pre-fill form data for authenticated users
  useEffect(() => {
    if (session?.user && !session.user.isAnonymous) {
      setFormData((prev) => ({
        ...prev,
        name: session.user.name || prev.name,
        email: session.user.email || prev.email,
        // Keep existing phone if already entered, otherwise use user's phone if available
        phone: prev.phone || "", // We'll get phone from user profile in a separate call if needed
      }));
    }
  }, [session]);

  // Automatically create anonymous session for unauthenticated users
  useEffect(() => {
    if (!isPending && !session) {
      // Create an anonymous session
      signIn.anonymous(
        {},
        {
          onSuccess: (ctx) => {
            console.log("Anonymous session created");
          },
          onError: (ctx) => {
            console.error("Failed to create anonymous session", ctx.error);
            // Implement graceful degradation - log the error but allow booking to proceed
            // This follows the project's practice of not failing when external services are unavailable
            console.warn(
              "Proceeding with booking without anonymous session. User data will be collected in the form."
            );
          },
        }
      );
    }
  }, [isPending, session]);

  // Check if a session is selected via URL parameters
  useEffect(() => {
    const eventParam = searchParams.get("session") || searchParams.get("event");

    if (eventParam && sessions.length > 0) {
      // First, try to find by session ID
      let foundSession = sessions.find((s) => s.id === eventParam);

      // If not found, try to find by event ID or slug
      if (!foundSession) {
        foundSession = sessions.find(
          (s) => s.eventId === eventParam || s.event.id === eventParam
        );
      }

      // If still not found, try to match event slug (check event.slug if it exists)
      if (!foundSession) {
        foundSession = sessions.find((s) => {
          // Fetch event from database to check slug
          const eventSlug = eventParam.toLowerCase().replace(/[^a-z0-9-]/g, "");
          const eventTitle = s.event.title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-");
          return eventSlug === eventTitle;
        });
      }

      if (foundSession) {
        setSelectedSession(foundSession);
      }
    }
  }, [searchParams, sessions]);

  const handleSessionSelect = (session: Session) => {
    setSelectedSession(session);
    trackBookingEvent("session_selected", session.title || session.event.title);
    // Scroll to booking form
    document
      .getElementById("booking-form")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields based on nationality - only for actual bookings
    if (selectedSession) {
      if (formData.nationality === "Local" && !formData.nic.trim()) {
        alert("NIC number is required for local visitors.");
        return;
      }

      if (formData.nationality === "Foreigner" && !formData.passport.trim()) {
        alert("Passport number is required for foreign visitors.");
        return;
      }
    }

    // NOTE: We no longer prevent submission when no event is selected
    // This allows for general inquiries to be submitted

    setIsSubmitting(true);

    try {
      // Submit form data using server action
      const result = await submitBookingForm({
        ...formData,
        session: selectedSession
          ? {
              id: selectedSession.id,
              title: selectedSession.title || selectedSession.event.title,
              date: new Date(selectedSession.date).toISOString(),
              time: selectedSession.time,
              location: selectedSession.location,
              description:
                selectedSession.description ||
                selectedSession.event.description,
              price: `LKR ${selectedSession.price.toLocaleString()}`,
              priceRaw: selectedSession.price,
              eventName: selectedSession.event.title, // Include parent event name
            }
          : undefined,
      });

      if (result.success) {
        setIsSubmitted(true);

        // Track booking event
        if (selectedSession) {
          trackBookingEvent(
            "booking_completed",
            selectedSession.title || selectedSession.event.title
          );
        } else {
          trackBookingEvent("inquiry_submitted", "general");
        }

        // Reset form after 3 seconds
        setTimeout(() => {
          setIsSubmitted(false);
          setFormData({
            name: "",
            email: "",
            phone: "",
            date: "",
            participants: "1",
            message: "",
            nationality: "Local",
            nic: "",
            passport: "",
          });
        }, 3000);
      } else {
        console.error("Form submission failed:", result.error);
        // Handle error - maybe show a message to the user
      }
    } catch (error: any) {
      // Check if this is a redirect error from Next.js server actions
      if (error?.digest?.includes("NEXT_REDIRECT")) {
        // This is expected behavior - the redirect was successful
        // Use hard redirect to dashboard
        window.location.href = "/dashboard";
        return;
      }

      console.error("Form submission error:", error);
      // Handle error - maybe show a message to the user
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout>
      <BookingHero />
      <div className="min-h-screen bg-[#f7faf6] py-16">
        <div className="max-w-6xl mx-auto px-6">
          {/* Authentication Prompt for Anonymous Users */}
          {!session?.user?.email && !isPending && (
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-primary/20 mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-xl font-light text-[#191d18] mb-2">
                    Create an Account
                  </h3>
                  <p className="text-[#525A52]">
                    Save your information for faster booking and access your
                    booking history.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/sign-in"
                    className="px-6 py-3 rounded-lg bg-primary hover:bg-[#5a786d] text-white text-center text-sm font-medium transition-colors duration-300 min-h-[44px] flex items-center justify-center"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/sign-up"
                    className="px-6 py-3 rounded-lg bg-white border border-primary text-primary hover:bg-[#f0f4f1] text-center text-sm font-medium transition-colors duration-300 min-h-[44px] flex items-center justify-center"
                  >
                    Create Account
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Session Selection Section */}
          {!selectedSession && (
            <div className="mb-12">
              <h2 className="text-2xl font-light text-[#191d18] mb-6 text-center">
                Select a Session
              </h2>
              {loadingSessions ? (
                <div className="text-center py-12">
                  <p className="text-lg text-[#525A52]">Loading sessions...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {sessions.map((session) => {
                    const displayTitle = session.title || session.event.title;
                    const displayDescription =
                      session.description || session.event.description;
                    const bookedCount = session._count?.bookings || 0;
                    const availableSpots = session.capacity - bookedCount;

                    return (
                      <div
                        key={session.id}
                        className="bg-white rounded-3xl overflow-hidden shadow-lg border border-primary/20 cursor-pointer hover:shadow-xl transition-shadow duration-300"
                        onClick={() => handleSessionSelect(session)}
                      >
                        <div className="aspect-video bg-gray-200 relative">
                          <img
                            src={session.event.image}
                            alt={displayTitle}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-lg text-sm font-medium">
                            LKR {session.price.toLocaleString()}
                          </div>
                          {availableSpots <= 3 && availableSpots > 0 && (
                            <div className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-lg text-sm font-medium">
                              Only {availableSpots} spots left!
                            </div>
                          )}
                          {session.status === "full" && (
                            <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-medium">
                              FULL
                            </div>
                          )}
                        </div>
                        <div className="p-6">
                          <h3 className="text-xl font-light text-[#191d18] mb-2">
                            {displayTitle}
                          </h3>
                          <p className="text-[#525A52] text-sm mb-4 line-clamp-2">
                            {displayDescription}
                          </p>
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center text-[#191d18] text-sm">
                              <Calendar className="h-4 w-4 mr-2 text-primary" />
                              <span>
                                {new Date(session.date).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center text-[#191d18] text-sm">
                              <Clock className="h-4 w-4 mr-2 text-primary" />
                              <span>{session.time}</span>
                            </div>
                            <div className="flex items-center text-[#191d18] text-sm">
                              <MapPin className="h-4 w-4 mr-2 text-primary" />
                              <span>{session.location}</span>
                            </div>
                          </div>
                          <button
                            className="w-full rounded-lg bg-primary hover:bg-[#5a786d] text-white uppercase px-4 py-3 text-sm font-medium transition-colors duration-300"
                            onClick={() => handleSessionSelect(session)}
                            disabled={session.status === "full"}
                          >
                            {session.status === "full"
                              ? "Session Full"
                              : "Select Session"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              <div className="text-center mt-8">
                <Link href="/events" className="text-primary hover:underline">
                  View all sessions
                </Link>
              </div>
            </div>
          )}

          {/* Booking Form Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            {/* Session Details */}
            {selectedSession && (
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-primary/20">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-light text-[#191d18]">
                    Session Details
                  </h2>
                  <button
                    onClick={() => setSelectedSession(null)}
                    className="text-sm text-primary hover:underline"
                  >
                    Change Session
                  </button>
                </div>
                <div className="aspect-video bg-gray-200 rounded-2xl mb-6 overflow-hidden bg-top">
                  <img
                    src={selectedSession.event.image}
                    alt={selectedSession.title || selectedSession.event.title}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <h3 className="text-xl font-light text-[#191d18] mb-4">
                  {selectedSession.title || selectedSession.event.title}
                </h3>
                <p className="text-[#525A52] mb-6">
                  {selectedSession.description ||
                    selectedSession.event.description}
                </p>
                <div className="space-y-4">
                  <div className="flex items-center text-[#191d18]">
                    <Calendar className="h-5 w-5 mr-3 text-primary" />
                    <span>
                      {new Date(selectedSession.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center text-[#191d18]">
                    <Clock className="h-5 w-5 mr-3 text-primary" />
                    <span>{selectedSession.time}</span>
                  </div>
                  <div className="flex items-center text-[#191d18]">
                    <MapPin className="h-5 w-5 mr-3 text-primary" />
                    <span>{selectedSession.location}</span>
                  </div>
                  <div className="flex items-center text-[#191d18]">
                    <span className="font-medium text-lg">
                      Price: LKR {selectedSession.price.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Booking Form */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-primary/20">
              <h2 className="text-2xl font-light text-[#191d18] mb-6">
                {selectedSession ? "Booking Information" : "General Inquiry"}
              </h2>

              {isSubmitted ? (
                <div className="bg-secondary rounded-2xl p-8 text-center">
                  <h3 className="text-2xl font-light text-[#191d18] mb-4">
                    {selectedSession ? "Booking Confirmed!" : "Message Sent!"}
                  </h3>
                  <p className="text-[#525A52] mb-6">
                    {selectedSession
                      ? "Thank you for your booking. We've sent a confirmation to your email."
                      : "Thank you for your inquiry. We'll get back to you soon."}
                  </p>
                  <p className="text-[#525A52]">
                    Our team will contact you shortly to finalize the details.
                  </p>
                  {selectedSession && (
                    <div className="mt-6">
                      <h4 className="text-lg font-medium text-[#191d18] mb-3">
                        Add to Calendar
                      </h4>
                      <div className="flex flex-wrap gap-3">
                        <a
                          href={generateGoogleCalendarLink(
                            selectedSession.title ||
                              selectedSession.event.title,
                            new Date(selectedSession.date).toLocaleDateString(),
                            selectedSession.time,
                            selectedSession.location,
                            selectedSession.description ||
                              selectedSession.event.description
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-[#4285F4] text-white rounded-lg text-sm hover:bg-[#3367D6] transition-colors"
                        >
                          Google Calendar
                        </a>
                        <a
                          href={generateOutlookCalendarLink(
                            selectedSession.title ||
                              selectedSession.event.title,
                            new Date(selectedSession.date).toLocaleDateString(),
                            selectedSession.time,
                            selectedSession.location,
                            selectedSession.description ||
                              selectedSession.event.description
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-[#0078D4] text-white rounded-lg text-sm hover:bg-[#005A9E] transition-colors"
                        >
                          Outlook
                        </a>
                        <a
                          href={generateYahooCalendarLink(
                            selectedSession.title ||
                              selectedSession.event.title,
                            new Date(selectedSession.date).toLocaleDateString(),
                            selectedSession.time,
                            selectedSession.location,
                            selectedSession.description ||
                              selectedSession.event.description
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-[#720E9E] text-white rounded-lg text-sm hover:bg-[#50096E] transition-colors"
                        >
                          Yahoo Calendar
                        </a>
                        <a
                          href={generateICalLink(
                            selectedSession.title ||
                              selectedSession.event.title,
                            new Date(selectedSession.date).toLocaleDateString(),
                            selectedSession.time,
                            selectedSession.location,
                            selectedSession.description ||
                              selectedSession.event.description
                          )}
                          download={`${(
                            selectedSession.title || selectedSession.event.title
                          ).replace(/\s+/g, "_")}.ics`}
                          className="px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-[#5a786d] transition-colors"
                        >
                          Download iCal
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="space-y-6"
                  id="booking-form"
                >
                  <div>
                    <label htmlFor="name" className="block text-[#191d18] mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary" />
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        disabled={isNonAnonymousUser}
                        className={`w-full pl-10 pr-4 py-4 rounded-lg border border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent text-lg ${
                          isNonAnonymousUser
                            ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                            : "bg-white"
                        }`}
                        placeholder="Enter your full name"
                        autoComplete="name"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-[#191d18] mb-2"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        disabled={isNonAnonymousUser}
                        className={`w-full pl-10 pr-4 py-4 rounded-lg border border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent text-lg ${
                          isNonAnonymousUser
                            ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                            : "bg-white"
                        }`}
                        placeholder="Enter your email"
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-[#191d18] mb-2"
                    >
                      Phone Number
                    </label>
                    <div className="relative flex items-center">
                      <Phone className="absolute left-3 h-5 w-5 text-primary" />
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-4 rounded-lg border border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent text-lg"
                        placeholder="Enter your phone number"
                        autoComplete="tel"
                      />
                    </div>
                    {isNonAnonymousUser && (
                      <p className="mt-2 text-sm text-gray-500">
                        To update your phone number, please visit your profile
                        settings.
                      </p>
                    )}
                  </div>

                  {/* Nationality Selector - only shown for actual bookings, not general inquiries */}
                  {selectedSession && (
                    <>
                      <div>
                        <label
                          htmlFor="nationality"
                          className="block text-[#191d18] mb-2"
                        >
                          Nationality
                        </label>
                        <select
                          id="nationality"
                          name="nationality"
                          value={formData.nationality}
                          onChange={handleChange}
                          className="w-full px-4 py-4 rounded-lg border border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent text-lg"
                        >
                          <option value="Local">Local</option>
                          <option value="Foreigner">Foreigner</option>
                        </select>
                      </div>

                      {/* NIC Field - shown when Local is selected */}
                      {formData.nationality === "Local" && (
                        <div>
                          <label
                            htmlFor="nic"
                            className="block text-[#191d18] mb-2"
                          >
                            NIC Number *
                          </label>
                          <input
                            type="text"
                            id="nic"
                            name="nic"
                            value={formData.nic}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-4 rounded-lg border border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent text-lg"
                            placeholder="Enter your NIC number"
                          />
                        </div>
                      )}

                      {/* Passport Field - shown when Foreigner is selected */}
                      {formData.nationality === "Foreigner" && (
                        <div>
                          <label
                            htmlFor="passport"
                            className="block text-[#191d18] mb-2"
                          >
                            Passport Number *
                          </label>
                          <input
                            type="text"
                            id="passport"
                            name="passport"
                            value={formData.passport}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-4 rounded-lg border border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent text-lg"
                            placeholder="Enter your passport number"
                          />
                        </div>
                      )}
                    </>
                  )}

                  {selectedSession && (
                    <>
                      <div>
                        <label
                          htmlFor="participants"
                          className="block text-[#191d18] mb-2"
                        >
                          Number of Participants
                        </label>
                        <select
                          id="participants"
                          name="participants"
                          value={formData.participants}
                          onChange={handleChange}
                          className="w-full px-4 py-4 rounded-lg border border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent text-lg"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                            <option key={num} value={num}>
                              {num} {num === 1 ? "person" : "people"}
                            </option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-[#191d18] mb-2"
                    >
                      {selectedSession ? "Special Requests" : "Your Message"}
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-4 rounded-lg border border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent text-lg"
                      placeholder={
                        selectedSession
                          ? "Any special requests or dietary requirements?"
                          : "Tell us how we can help you"
                      }
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-lg bg-primary hover:bg-[#5a786d] text-white uppercase px-6 py-4 text-sm font-medium transition-colors duration-300 min-h-[44px]"
                  >
                    {isSubmitting
                      ? "Submitting..."
                      : selectedSession
                      ? "Confirm Booking"
                      : "Send Inquiry"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
