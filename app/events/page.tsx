"use client";

import { ImageWithFallback as Image } from "@/components/shared/image-with-fallback";
import { MapPin, Clock, CalendarPlus, CalendarCheck, Info } from "lucide-react";
import { Navigation } from "@/components/navigation";
import Link from "next/link";
import { Hero } from "@/components/shared/hero";
import {
  generateGoogleCalendarLink,
  generateICalLink,
  generateOutlookCalendarLink,
  generateYahooCalendarLink,
} from "@/lib/calendar-utils";
import { useState, useEffect } from "react";
import {
  EVENT_CARDS_DATA,
  EVENTS_DATA,
  type DetailedEvent,
} from "@/lib/event-data";

function EventsHero() {
  return (
    <Hero
      title="Join our transformative events"
      subtitle="Upcoming Experiences"
      className="bg-cover bg-center bg-no-repeat"
    >
      <div className="text-[#525A52] text-center mt-8 text-lg tracking-wide max-w-3xl mx-auto px-4">
        Experience the power of community and transformation through our curated
        wellness events
      </div>
      <button className="px-8 py-3 bg-primary text-white font-medium uppercase tracking-wider text-sm hover:bg-[#5a786d] transition-colors duration-300 rounded-lg">
        View All Events
      </button>
    </Hero>
  );
}

function UpcomingEvents() {
  const events = EVENT_CARDS_DATA;

  return (
    <div className="bg-[#f7faf6] px-4 sm:px-6 text-[#191d18] pt-16 pb-20 rounded-t-4xl">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {events.map((event, index) => (
            <EventCard
              key={index}
              date={event.date}
              month={event.month}
              title={event.title}
              description={event.description}
              location={event.location}
              time={event.time}
              image={event.image}
              id={event.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function EventCard({
  id,
  date,
  month,
  title,
  description,
  location,
  time,
  image,
}: {
  id: string;
  date: string;
  month: string;
  title: string;
  description: string;
  location: string;
  time: string;
  image: string;
}) {
  const [showCalendarDropdown, setShowCalendarDropdown] = useState(false);

  // Find the full event data to get all details for calendar integration
  const fullEvent: DetailedEvent | undefined = EVENTS_DATA.find(
    (event: DetailedEvent) => event.id === id
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (showCalendarDropdown && e.target instanceof Node) {
        const dropdown = document.getElementById(`calendar-dropdown-${id}`);
        const button = document.getElementById(`calendar-button-${id}`);

        if (
          dropdown &&
          button &&
          !dropdown.contains(e.target) &&
          !button.contains(e.target)
        ) {
          setShowCalendarDropdown(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [showCalendarDropdown, id]);

  return (
    <div className="bg-white backdrop-blur-sm rounded-4xl overflow-hidden shadow-lg border border-primary/20 transition-all duration-300 hover:shadow-xl hover:border-primary/40">
      <Link href={`/events/${id}`}>
        <div className="relative aspect-[4/3] w-full cursor-pointer">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover object-top rounded-t-4xl"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </Link>
      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 pr-3">
            <Link href={`/events/${id}`}>
              <h3 className="text-xl sm:text-2xl font-light text-[#191d18] cursor-pointer hover:underline">
                {title}
              </h3>
            </Link>
            <p className="text-[#525A52] mt-2 text-sm leading-relaxed">
              {description}
            </p>
          </div>
          <div className="bg-primary min-w-[45px] sm:min-w-[50px] h-[45px] sm:h-[50px] rounded-lg flex flex-col items-center justify-center flex-shrink-0">
            <span className="text-white text-base sm:text-lg font-medium">
              {date}
            </span>
            <span className="text-white text-xs uppercase">{month}</span>
          </div>
        </div>
        <div className="mt-5 space-y-2">
          <div className="flex items-center text-[#191d18] text-sm">
            <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate">{location}</span>
          </div>
          <div className="flex items-center text-[#191d18] text-sm">
            <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{time}</span>
          </div>
        </div>
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <div className="relative">
            {/* <button
              id={`calendar-button-${id}`}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setShowCalendarDropdown(!showCalendarDropdown);
              }}
              className="rounded-lg bg-secondary hover:bg-[#b8d8c0] text-[#2C332D] px-4 py-3 text-sm transition-colors duration-300 min-h-[44px] w-full sm:w-auto flex items-center justify-center font-medium border border-primary/30"
              aria-label="Add to calendar"
            >
              <CalendarPlus className="h-5 w-5" />
            </button> */}
            {showCalendarDropdown && fullEvent && (
              <div
                id={`calendar-dropdown-${id}`}
                className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10"
              >
                <a
                  href={generateGoogleCalendarLink(
                    fullEvent.title,
                    fullEvent.date,
                    fullEvent.time,
                    fullEvent.location,
                    fullEvent.description
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-4 py-2 text-[#191d18] hover:bg-[#f7faf6] text-sm"
                >
                  Google Calendar
                </a>
                <a
                  href={generateOutlookCalendarLink(
                    fullEvent.title,
                    fullEvent.date,
                    fullEvent.time,
                    fullEvent.location,
                    fullEvent.description
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-4 py-2 text-[#191d18] hover:bg-[#f7faf6] text-sm"
                >
                  Outlook
                </a>
                <a
                  href={generateYahooCalendarLink(
                    fullEvent.title,
                    fullEvent.date,
                    fullEvent.time,
                    fullEvent.location,
                    fullEvent.description
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-4 py-2 text-[#191d18] hover:bg-[#f7faf6] text-sm"
                >
                  Yahoo Calendar
                </a>
                <a
                  href={generateICalLink(
                    fullEvent.title,
                    fullEvent.date,
                    fullEvent.time,
                    fullEvent.location,
                    fullEvent.description
                  )}
                  download={`${fullEvent.title.replace(/\s+/g, "_")}.ics`}
                  className="block px-4 py-2 text-[#191d18] hover:bg-[#f7faf6] text-sm"
                >
                  Download iCal
                </a>
              </div>
            )}
          </div>
          <div className="flex flex-col xs:flex-row gap-3 flex-1">
            <Link href={`/booking?event=${id}`} className="flex-1">
              <button className="w-full rounded-lg bg-primary hover:bg-[#5a786d] text-white px-4 py-3 text-sm transition-colors duration-300 min-h-[44px] font-medium flex items-center justify-center gap-2">
                <CalendarCheck className="h-5 w-5" />
                <span>Book Now</span>
              </button>
            </Link>
            <Link href={`/events/${id}`} className="flex-1">
              <button className="w-full rounded-lg bg-white border border-primary text-primary hover:bg-[#f7faf6] px-4 py-3 text-sm transition-colors duration-300 min-h-[44px] font-medium flex items-center justify-center gap-2">
                <Info className="h-5 w-5" />
                <span>View Details</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function EventTypes() {
  const eventTypes = [
    {
      title: "Retreats",
      description:
        "Immersive multi-day experiences for deep transformation and connection with nature.",
      icon: "🏕️",
    },
    {
      title: "Workshops",
      description:
        "Interactive sessions focused on specific wellness practices and skill development.",
      icon: "🧠",
    },
    {
      title: "Ceremonies",
      description:
        "Sacred gatherings aligned with natural cycles and spiritual traditions.",
      icon: "🕯️",
    },
    {
      title: "Community Circles",
      description:
        "Regular gatherings for sharing, support, and collective healing.",
      icon: "👥",
    },
  ];

  return (
    <div className="bg-[#2b332d] px-4 sm:px-6 text-[#dbeade] pt-16 pb-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <span className="text-sm uppercase font-medium tracking-wider text-primary">
            Event Categories
          </span>
          <h2 className="text-2xl sm:text-3xl font-light mt-2">
            Diverse experiences for your wellness journey
          </h2>
          <p className="text-[#c4c9c4] max-w-2xl mx-auto text-base sm:text-lg mt-4">
            Our events are carefully curated to offer a range of experiences
            that support your holistic well-being.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {eventTypes.map((eventType, index) => (
            <div
              key={index}
              className="bg-[#3a423b] p-5 sm:p-6 rounded-4xl border border-primary/30 text-center transition-all duration-300 hover:border-primary/50 hover:bg-[#3a423b]/80"
            >
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">
                {eventType.icon}
              </div>
              <h3 className="text-lg sm:text-xl font-medium mb-3">
                {eventType.title}
              </h3>
              <p className="text-[#c4c9c4] text-sm sm:text-base">
                {eventType.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <div className="bg-[#2b332d] text-[#dbeade] pt-12 sm:pt-16 pb-6 sm:pb-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10 sm:mb-12">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-xl sm:text-2xl font-sans">
              Ojasen Healing Arts
            </h3>
            <p className="text-[#c4c9c4] text-base sm:text-lg leading-relaxed">
              Your sanctuary for holistic wellness and transformative healing
              experiences.
            </p>
            <div className="flex space-x-4 pt-2">
              <a
                href="#"
                className="text-[#c4c9c4] hover:text-white transition-colors duration-300"
                aria-label="Facebook"
              >
                <svg
                  className="h-5 w-5 sm:h-6 sm:w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="#"
                className="text-[#c4c9c4] hover:text-white transition-colors duration-300"
                aria-label="Instagram"
              >
                <svg
                  className="h-5 w-5 sm:h-6 sm:w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.63c-2.43 0-2.784-.012-3.808-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.464C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 01-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="#"
                className="text-[#c4c9c4] hover:text-white transition-colors duration-300"
                aria-label="Twitter"
              >
                <svg
                  className="h-5 w-5 sm:h-6 sm:w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg sm:text-xl font-sans">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/"
                  className="text-[#c4c9c4] hover:text-white transition-colors duration-300 text-base sm:text-lg"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="text-[#c4c9c4] hover:text-white transition-colors duration-300 text-base sm:text-lg"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/services"
                  className="text-[#c4c9c4] hover:text-white transition-colors duration-300 text-base sm:text-lg"
                >
                  Services
                </a>
              </li>
              <li>
                <a
                  href="/events"
                  className="text-[#c4c9c4] hover:text-white transition-colors duration-300 text-base sm:text-lg"
                >
                  Events
                </a>
              </li>
              <li>
                <a
                  href="/booking"
                  className="text-[#c4c9c4] hover:text-white transition-colors duration-300 text-base sm:text-lg"
                >
                  Booking
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="text-[#c4c9c4] hover:text-white transition-colors duration-300 text-base sm:text-lg"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-lg sm:text-xl font-sans">Services</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/services/yoga-meditation"
                  className="text-[#c4c9c4] hover:text-white transition-colors duration-300 text-base sm:text-lg"
                >
                  Yoga & Meditation
                </a>
              </li>
              <li>
                <a
                  href="/services/sound-healing"
                  className="text-[#c4c9c4] hover:text-white transition-colors duration-300 text-base sm:text-lg"
                >
                  Sound Healing
                </a>
              </li>
              <li>
                <a
                  href="/services/energy-healing"
                  className="text-[#c4c9c4] hover:text-white transition-colors duration-300 text-base sm:text-lg"
                >
                  Energy Healing
                </a>
              </li>
              <li>
                <a
                  href="/services/breathwork"
                  className="text-[#c4c9c4] hover:text-white transition-colors duration-300 text-base sm:text-lg"
                >
                  Breathwork
                </a>
              </li>
              <li>
                <a
                  href="/services/wellness-retreats"
                  className="text-[#c4c9c4] hover:text-white transition-colors duration-300 text-base sm:text-lg"
                >
                  Wellness Retreats
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg sm:text-xl font-sans">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <svg
                  className="h-5 w-5 sm:h-6 sm:w-6 text-primary mr-3 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="text-[#c4c9c4] text-base sm:text-lg">
                  The Island, Palliyagoda, Ahangama, 80650
                </span>
              </li>
              <li className="flex items-center">
                <svg
                  className="h-5 w-5 sm:h-6 sm:w-6 text-primary mr-3 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span className="text-[#c4c9c4] text-base sm:text-lg">
                  <a href="tel:+94762777482">+94 076 277 7482</a>
                </span>
              </li>
              <li className="flex items-center">
                <svg
                  className="h-5 w-5 sm:h-6 sm:w-6 text-primary mr-3 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-[#c4c9c4] text-base sm:text-lg">
                  <a href="mailto:info@ojasenhealingarts.com">
                    info@ojasenhealingarts.com
                  </a>
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary/30 pt-6 sm:pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[#c4c9c4] text-base sm:text-lg text-center md:text-left">
              &copy; {new Date().getFullYear()} Ojasen Healing Arts. All rights
              reserved.
            </p>
            <div className="flex space-x-6">
              <a
                href="#"
                className="text-[#c4c9c4] hover:text-white transition-colors duration-300 text-base sm:text-lg"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-[#c4c9c4] hover:text-white transition-colors duration-300 text-base sm:text-lg"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EventsPage() {
  return (
    <>
      <Navigation />
      <div className="">
        <EventsHero />
        <UpcomingEvents />
        <EventTypes />
      </div>
      <Footer />
    </>
  );
}
