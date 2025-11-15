"use client";

import { useParams } from "next/navigation";
import { ImageWithFallback as Image } from "@/components/shared/image-with-fallback";
import { MapPin, Clock, Calendar } from "lucide-react";
import { Navigation } from "@/components/navigation";
import Link from "next/link";
import { getEventById } from "@/lib/event-data";

export default function EventDetailPage() {
  const params = useParams();
  const eventId = params.eventId as string;

  // Find the event based on the ID from the URL
  const event = getEventById(eventId);

  // If event not found, show a 404-like message
  if (!event) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-[#f7faf6] pt-24 pb-16">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-3xl md:text-4xl font-light text-[#191d18] mb-6">
              Event Not Found
            </h1>
            <p className="text-[#525A52] text-lg mb-8">
              The event you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/events">
              <button className="px-8 py-3 bg-[#68887d] text-white font-medium uppercase tracking-wider text-sm hover:bg-[#5a786d] transition-colors duration-300 rounded-lg">
                View All Events
              </button>
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-[#f7faf6] pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-6 mt-8">
          <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-[#68887d]/20">
            {/* Event Hero Image */}
            <div className="relative h-96 w-full">
              <Image
                src={event.image}
                alt={event.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-8 text-white">
                {event.category && (
                  <span className="inline-block px-3 py-1 bg-[#68887d] text-xs uppercase tracking-wider rounded-full mb-3">
                    {event.category}
                  </span>
                )}
                <h1 className="text-4xl font-light mb-2">{event.title}</h1>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Event Details */}
            <div className="p-8">
              <div className="prose max-w-none mb-8">
                <p className="text-xl text-[#525A52] leading-relaxed">
                  {event.description}
                </p>
              </div>

              {/* Full Description */}
              {event.fullDescription && (
                <div className="prose max-w-none mb-10">
                  {event.fullDescription
                    .split("\n\n")
                    .map((paragraph, index) => (
                      <p
                        key={index}
                        className="text-[#191d18] mb-4 leading-relaxed"
                      >
                        {paragraph}
                      </p>
                    ))}
                </div>
              )}

              {/* Event Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-[#f7faf6] rounded-2xl p-6 border border-[#68887d]/20">
                  <div className="flex items-center mb-3">
                    <Calendar className="h-6 w-6 text-[#68887d] mr-3" />
                    <h3 className="text-lg font-medium text-[#191d18]">Date</h3>
                  </div>
                  <p className="text-[#525A52]">{event.date}</p>
                </div>

                <div className="bg-[#f7faf6] rounded-2xl p-6 border border-[#68887d]/20">
                  <div className="flex items-center mb-3">
                    <Clock className="h-6 w-6 text-[#68887d] mr-3" />
                    <h3 className="text-lg font-medium text-[#191d18]">Time</h3>
                  </div>
                  <p className="text-[#525A52]">{event.time}</p>
                </div>

                <div className="bg-[#f7faf6] rounded-2xl p-6 border border-[#68887d]/20">
                  <div className="flex items-center mb-3">
                    <MapPin className="h-6 w-6 text-[#68887d] mr-3" />
                    <h3 className="text-lg font-medium text-[#191d18]">
                      Location
                    </h3>
                  </div>
                  <p className="text-[#525A52]">{event.location}</p>
                </div>
              </div>

              {/* Price and Booking */}
              <div className="bg-[#2b332d] rounded-2xl p-8 text-white">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <div className="mb-6 md:mb-0">
                    <h3 className="text-2xl font-light mb-2">
                      Reserve Your Spot
                    </h3>
                    {event.price && (
                      <p className="text-3xl font-light text-[#CDEDD4]">
                        {event.price}
                      </p>
                    )}
                    <p className="text-[#c4c9c4] mt-1">
                      Secure your place in this transformative experience
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link href={`/booking?event=${event.id}`}>
                      <button className="px-8 py-4 bg-[#68887d] text-white font-medium uppercase tracking-wider text-sm hover:bg-[#5a786d] transition-colors duration-300 rounded-lg whitespace-nowrap">
                        Book Now
                      </button>
                    </Link>
                    <button className="px-8 py-4 bg-transparent text-white font-medium uppercase tracking-wider text-sm hover:bg-white/10 transition-colors duration-300 rounded-lg border border-white/30 whitespace-nowrap">
                      Add to Calendar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
