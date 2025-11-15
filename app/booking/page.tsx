"use client";

import { useState, useEffect } from "react";
import { MapPin, Clock, Calendar, User, Mail, Phone } from "lucide-react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { EVENTS_DATA } from "@/lib/event-data";
import { PageLayout } from "@/components/shared/page-layout";
import { Hero } from "@/components/shared/hero";

const DISCORD_WEBHOOK =
  "https://discord.com/api/webhooks/1439098604311810140/Uec_Qe8Wg5I0f5AffLfS1DUjwVT3kbtmP6xBqLhY5h7ZjkT4sF17zE9HftjXLpRobtcb";

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

    // If no event selected, don't submit
    if (!selectedEvent) return;

    // In a real application, you would send this data to your backend
    console.log("Booking data:", { ...formData, event: selectedEvent });

    // Send Discord webhook
    try {
      const webhookData = {
        embeds: [
          {
            title: "New Booking Confirmation",
            color: 0x68887d, // Using the brand color
            fields: [
              {
                name: "Event",
                value: selectedEvent.title,
                inline: true,
              },
              {
                name: "Name",
                value: formData.name,
                inline: true,
              },
              {
                name: "Email",
                value: formData.email,
                inline: true,
              },
              {
                name: "Phone",
                value: formData.phone,
                inline: true,
              },
              {
                name: "Date",
                value: formData.date || "Not specified",
                inline: true,
              },
              {
                name: "Participants",
                value: formData.participants,
                inline: true,
              },
              {
                name: "Special Requests",
                value: formData.message || "None",
                inline: false,
              },
            ],
            timestamp: new Date().toISOString(),
          },
        ],
      };

      await fetch(DISCORD_WEBHOOK, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(webhookData),
      });
    } catch (error) {
      console.error("Failed to send Discord webhook:", error);
    }

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
  };

  return (
    <PageLayout>
      <BookingHero />
      <div className="min-h-screen bg-[#f7faf6] py-16">
        <div className="max-w-6xl mx-auto px-6">
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
                    className="bg-white rounded-3xl overflow-hidden shadow-lg border border-[#68887d]/20 cursor-pointer hover:shadow-xl transition-shadow duration-300"
                    onClick={() => handleEventSelect(event)}
                  >
                    <div className="aspect-video bg-gray-200 relative">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                      {event.price && (
                        <div className="absolute top-4 right-4 bg-[#68887d] text-white px-3 py-1 rounded-lg text-sm font-medium">
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
                          <Calendar className="h-4 w-4 mr-2 text-[#68887d]" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center text-[#191d18] text-sm">
                          <Clock className="h-4 w-4 mr-2 text-[#68887d]" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center text-[#191d18] text-sm">
                          <MapPin className="h-4 w-4 mr-2 text-[#68887d]" />
                          <span>{event.location}</span>
                        </div>
                      </div>
                      <button
                        className="w-full rounded-lg bg-[#68887d] hover:bg-[#5a786d] text-white uppercase px-4 py-3 text-sm font-medium transition-colors duration-300"
                        onClick={() => handleEventSelect(event)}
                      >
                        Select Event
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center mt-8">
                <Link href="/events" className="text-[#68887d] hover:underline">
                  View all events →
                </Link>
              </div>
            </div>
          )}

          {/* Booking Form Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            {/* Event Details */}
            {selectedEvent && (
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-[#68887d]/20">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-light text-[#191d18]">
                    Event Details
                  </h2>
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="text-sm text-[#68887d] hover:underline"
                  >
                    Change Event
                  </button>
                </div>
                <div className="aspect-video bg-gray-200 rounded-2xl mb-6 overflow-hidden">
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
                    <Calendar className="h-5 w-5 mr-3 text-[#68887d]" />
                    <span>{selectedEvent.date}</span>
                  </div>
                  <div className="flex items-center text-[#191d18]">
                    <Clock className="h-5 w-5 mr-3 text-[#68887d]" />
                    <span>{selectedEvent.time}</span>
                  </div>
                  <div className="flex items-center text-[#191d18]">
                    <MapPin className="h-5 w-5 mr-3 text-[#68887d]" />
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
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-[#68887d]/20">
              <h2 className="text-2xl font-light text-[#191d18] mb-6">
                {selectedEvent ? "Booking Information" : "General Inquiry"}
              </h2>

              {isSubmitted ? (
                <div className="bg-[#CDEDD4] rounded-2xl p-8 text-center">
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
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#68887d]" />
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-4 rounded-lg border border-[#68887d]/30 focus:outline-none focus:ring-2 focus:ring-[#68887d]/50 focus:border-transparent text-lg"
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
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#68887d]" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-4 rounded-lg border border-[#68887d]/30 focus:outline-none focus:ring-2 focus:ring-[#68887d]/50 focus:border-transparent text-lg"
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
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#68887d]" />
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-4 rounded-lg border border-[#68887d]/30 focus:outline-none focus:ring-2 focus:ring-[#68887d]/50 focus:border-transparent text-lg"
                        placeholder="Enter your phone number"
                        autoComplete="tel"
                      />
                    </div>
                  </div>

                  {selectedEvent && (
                    <>
                      <div>
                        <label
                          htmlFor="date"
                          className="block text-[#191d18] mb-2"
                        >
                          Preferred Date
                        </label>
                        <input
                          type="date"
                          id="date"
                          name="date"
                          value={formData.date}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-4 rounded-lg border border-[#68887d]/30 focus:outline-none focus:ring-2 focus:ring-[#68887d]/50 focus:border-transparent text-lg"
                        />
                      </div>

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
                          className="w-full px-4 py-4 rounded-lg border border-[#68887d]/30 focus:outline-none focus:ring-2 focus:ring-[#68887d]/50 focus:border-transparent text-lg"
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
                      className="w-full px-4 py-4 rounded-lg border border-[#68887d]/30 focus:outline-none focus:ring-2 focus:ring-[#68887d]/50 focus:border-transparent text-lg"
                      placeholder={
                        selectedEvent
                          ? "Any special requests or dietary requirements?"
                          : "Tell us how we can help you"
                      }
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={!selectedEvent}
                    className={`w-full rounded-lg uppercase px-6 py-4 text-sm font-medium transition-colors duration-300 min-h-[44px] ${
                      selectedEvent
                        ? "bg-[#68887d] hover:bg-[#5a786d] text-white"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {selectedEvent ? "Confirm Booking" : "Send Inquiry"}
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
