"use client";

import { useState, useEffect } from "react";
import { MapPin, Clock, Calendar, User, Mail, Phone } from "lucide-react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { EVENTS_DATA } from "@/lib/event-data";
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

// Event data structure
interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image: string;
  price?: string;
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
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    participants: "1",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Check if an event is selected via URL parameters
  useEffect(() => {
    const eventId = searchParams.get("event");
    if (eventId) {
      const event = EVENTS_DATA.find((e) => e.id === eventId);
      if (event) {
        setSelectedEvent(event);
      }
    }
  }, [searchParams]);

  const handleEventSelect = (event: Event) => {
    setSelectedEvent(event);
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

    // NOTE: We no longer prevent submission when no event is selected
    // This allows for general inquiries to be submitted

    setIsSubmitting(true);

    try {
      // Submit form data using server action
      const result = await submitBookingForm({
        ...formData,
        event: selectedEvent || undefined, // Pass undefined if no event selected
      });

      if (result.success) {
        setIsSubmitted(true);

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
          });
        }, 3000);
      } else {
        console.error("Form submission failed:", result.error);
        // Handle error - maybe show a message to the user
      }
    } catch (error) {
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

          {/* Event Selection Section */}
          {!selectedEvent && (
            <div className="mb-12">
              <h2 className="text-2xl font-light text-[#191d18] mb-6 text-center">
                Select an Event
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {EVENTS_DATA.map((event) => (
                  <div
                    key={event.id}
                    className="bg-white rounded-3xl overflow-hidden shadow-lg border border-primary/20 cursor-pointer hover:shadow-xl transition-shadow duration-300"
                    onClick={() => handleEventSelect(event)}
                  >
                    <div className="aspect-video bg-gray-200 relative">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                      {event.price && (
                        <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-lg text-sm font-medium">
                          {event.price}
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-light text-[#191d18] mb-2">
                        {event.title}
                      </h3>
                      <p className="text-[#525A52] text-sm mb-4 line-clamp-2">
                        {event.description}
                      </p>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-[#191d18] text-sm">
                          <Calendar className="h-4 w-4 mr-2 text-primary" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center text-[#191d18] text-sm">
                          <Clock className="h-4 w-4 mr-2 text-primary" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center text-[#191d18] text-sm">
                          <MapPin className="h-4 w-4 mr-2 text-primary" />
                          <span>{event.location}</span>
                        </div>
                      </div>
                      <button
                        className="w-full rounded-lg bg-primary hover:bg-[#5a786d] text-white uppercase px-4 py-3 text-sm font-medium transition-colors duration-300"
                        onClick={() => handleEventSelect(event)}
                      >
                        Select Event
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center mt-8">
                <Link href="/events" className="text-primary hover:underline">
                  View all events →
                </Link>
              </div>
            </div>
          )}

          {/* Booking Form Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            {/* Event Details */}
            {selectedEvent && (
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-primary/20">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-light text-[#191d18]">
                    Event Details
                  </h2>
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="text-sm text-primary hover:underline"
                  >
                    Change Event
                  </button>
                </div>
                <div className="aspect-video bg-gray-200 rounded-2xl mb-6 overflow-hidden bg-top">
                  <img
                    src={selectedEvent.image}
                    alt={selectedEvent.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-light text-[#191d18] mb-4">
                  {selectedEvent.title}
                </h3>
                <p className="text-[#525A52] mb-6">
                  {selectedEvent.description}
                </p>
                <div className="space-y-4">
                  <div className="flex items-center text-[#191d18]">
                    <Calendar className="h-5 w-5 mr-3 text-primary" />
                    <span>{selectedEvent.date}</span>
                  </div>
                  <div className="flex items-center text-[#191d18]">
                    <Clock className="h-5 w-5 mr-3 text-primary" />
                    <span>{selectedEvent.time}</span>
                  </div>
                  <div className="flex items-center text-[#191d18]">
                    <MapPin className="h-5 w-5 mr-3 text-primary" />
                    <span>{selectedEvent.location}</span>
                  </div>
                  {selectedEvent.price && (
                    <div className="flex items-center text-[#191d18]">
                      <span className="font-medium text-lg">
                        Price: {selectedEvent.price}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Booking Form */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-primary/20">
              <h2 className="text-2xl font-light text-[#191d18] mb-6">
                {selectedEvent ? "Booking Information" : "General Inquiry"}
              </h2>

              {isSubmitted ? (
                <div className="bg-secondary rounded-2xl p-8 text-center">
                  <h3 className="text-2xl font-light text-[#191d18] mb-4">
                    {selectedEvent ? "Booking Confirmed!" : "Message Sent!"}
                  </h3>
                  <p className="text-[#525A52] mb-6">
                    {selectedEvent
                      ? "Thank you for your booking. We've sent a confirmation to your email."
                      : "Thank you for your inquiry. We'll get back to you soon."}
                  </p>
                  <p className="text-[#525A52]">
                    Our team will contact you shortly to finalize the details.
                  </p>
                  {selectedEvent && (
                    <div className="mt-6">
                      <h4 className="text-lg font-medium text-[#191d18] mb-3">
                        Add to Calendar
                      </h4>
                      <div className="flex flex-wrap gap-3">
                        <a
                          href={generateGoogleCalendarLink(
                            selectedEvent.title,
                            selectedEvent.date,
                            selectedEvent.time,
                            selectedEvent.location,
                            selectedEvent.description
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-[#4285F4] text-white rounded-lg text-sm hover:bg-[#3367D6] transition-colors"
                        >
                          Google Calendar
                        </a>
                        <a
                          href={generateOutlookCalendarLink(
                            selectedEvent.title,
                            selectedEvent.date,
                            selectedEvent.time,
                            selectedEvent.location,
                            selectedEvent.description
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-[#0078D4] text-white rounded-lg text-sm hover:bg-[#005A9E] transition-colors"
                        >
                          Outlook
                        </a>
                        <a
                          href={generateYahooCalendarLink(
                            selectedEvent.title,
                            selectedEvent.date,
                            selectedEvent.time,
                            selectedEvent.location,
                            selectedEvent.description
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-[#720E9E] text-white rounded-lg text-sm hover:bg-[#50096E] transition-colors"
                        >
                          Yahoo Calendar
                        </a>
                        <a
                          href={generateICalLink(
                            selectedEvent.title,
                            selectedEvent.date,
                            selectedEvent.time,
                            selectedEvent.location,
                            selectedEvent.description
                          )}
                          download={`${selectedEvent.title.replace(
                            /\s+/g,
                            "_"
                          )}.ics`}
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
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary" />
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
                      {isNonAnonymousUser && (
                        <p className="mt-2 text-sm text-gray-500">
                          To update your phone number, please visit your profile
                          settings.
                        </p>
                      )}
                    </div>
                  </div>

                  {selectedEvent && (
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
                      {selectedEvent ? "Special Requests" : "Your Message"}
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-4 rounded-lg border border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent text-lg"
                      placeholder={
                        selectedEvent
                          ? "Any special requests or dietary requirements?"
                          : "Tell us how we can help you"
                      }
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full rounded-lg uppercase px-6 py-4 text-sm font-medium transition-colors duration-300 min-h-[44px] ${
                      selectedEvent
                        ? "bg-primary hover:bg-[#5a786d] text-white"
                        : "bg-gray-300 text-gray-500"
                    }`}
                  >
                    {isSubmitting
                      ? "Submitting..."
                      : selectedEvent
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
