"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { MapPin, Clock, Calendar } from "lucide-react";
import { Navigation } from "@/components/navigation";
import Link from "next/link";

// Event data structure based on existing events
interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  fullDescription: string;
  image: string;
  price?: string;
  category: string;
}

// Event data - extending the existing events with more detailed information
const eventsData: Event[] = [
  {
    id: "anahata-flow",
    title: "Anahata Flow",
    date: "November 22, 2025",
    time: "6:00 PM",
    location: "The Island - Ahangama",
    description: "A heart-centered sound healing journey crafted to soften your emotional body and bring you back into harmony with yourself.",
    fullDescription: "A heart-centered sound healing journey crafted to soften your emotional body and bring you back into harmony with yourself. Guided by Oshi's intuitive blend of crystal bowls, vocal toning, and frequency work, this session awakens the energy of the heart — the space where compassion, release, and renewal unfold.\n\nYou'll be invited to slow down, breathe deeply, and allow vibrational medicine to move through your system. As sound ripples through your body, it helps dissolve heaviness, calm the nervous system, and create gentle openings where clarity and lightness can return.\n\nThis is not just a sound bath — it is a space to feel, to let go, and to reconnect with the softness you often forget you carry. Anahata Flow is ideal for anyone seeking emotional balance, energetic reset, or a moment of pure presence within the stillness of Ojasen's natural surroundings.",
    image: "/images/hero-night.jpg",
    category: "Sound Healing",
  },
  {
    id: "panchali-saadhan",
    title: "Panchali Sādhanā",
    date: "November 29, 2025",
    time: "6:00 PM",
    location: "The Island - Ahangama",
    description: "A sacred WOMEN'S gathering inspired by the strength and grace of Panchali.",
    fullDescription: "Panchali Sadhana is a sacred WOMEN'S gathering inspired by the strength and grace of Panchali. This evening is crafted to help you release emotional weight, reconnect with your heart, and step into a new cycle with clarity and intention.\n\nThe journey weaves together a trauma-safe release ritual, an intention and manifest circle, sound healing with Oshi, lunar yoga and breathwork, energy clearing, and a symbolic fire offering to let go of what no longer serves you. You'll be guided through gentle New-Moon journaling, followed by a sisterhood sharing circle and a grounding tea ritual to close the night with softness.\n\nPanchali Sadhana is a sacred WOMEN'S gathering inspired by the strength and grace of Panchali. This evening is crafted to help you release emotional weight, reconnect with your heart, and step into a new cycle with clarity and intention. The journey weaves together a trauma-safe release ritual, an intention and manifest circle, sound healing with Oshi, lunar yoga and breathwork, energy clearing, and a symbolic fire offering to let go of what no longer serves you.\n\nYou'll be guided through gentle New-Moon journaling, followed by a sisterhood sharing circle and a grounding tea ritual to close the night with softness. Panchali Sadhana is a space to be held, seen, and supported — a return to your inner flame, your truth, and your feminine wisdom. Come as you are. Leave renewed.",
    image: "/images/hero-fantasy.png",
    category: "Ceremonies",
  },
  {
    id: "zen-balance-retreat",
    title: "Zen & Balance Retreat",
    date: "November 29, 2025",
    time: "7:00 AM - 9:00 AM",
    location: "The Island - Ahangama",
    description: "Join us for a rejuvenating weekend retreat focused on finding inner peace and balance.",
    fullDescription: "Join us for a rejuvenating weekend retreat focused on finding inner peace and balance through yoga, meditation, and holistic healing practices. This immersive experience is designed to help you disconnect from the daily chaos and reconnect with your inner wisdom.\n\nThe retreat begins with a sunrise yoga session, followed by guided meditation and mindfulness practices. Throughout the day, you'll participate in workshops on stress management, emotional healing, and energy balancing. Our experienced healers will guide you through sound healing sessions and breathwork exercises.\n\nThe day concludes with a nourishing plant-based meal and a closing circle where you can share your experiences and insights. This retreat is perfect for anyone seeking a reset, whether you're dealing with stress, burnout, or simply craving deeper connection with yourself.",
    image: "/images/events/event-01.jpg",
    price: "LKR 15,000",
    category: "Retreats",
  },
  {
    id: "sound-healing-journey",
    title: "Sound Healing Journey",
    date: "December 5, 2025",
    time: "5:00 PM - 7:00 PM",
    location: "The Island - Ahangama",
    description: "Experience deep relaxation through the power of sound vibrations and crystal bowls.",
    fullDescription: "Experience deep relaxation through the power of sound vibrations and crystal bowls. This transformative session will take you on a journey through different sound frequencies, each designed to heal and balance specific energy centers in your body.\n\nOur sound healers will guide you through a carefully curated sequence of sounds using crystal bowls, gongs, and other sacred instruments. The vibrations will help release tension, clear energetic blockages, and promote deep healing on physical, emotional, and spiritual levels.\n\nThis session is particularly beneficial for those dealing with stress, anxiety, or emotional imbalances. Many participants report feeling deeply relaxed, emotionally cleared, and spiritually uplifted after the experience. Come prepared to let go and receive the healing frequencies that resonate with your highest good.",
    image: "/images/events/event-02.jpg",
    category: "Sound Healing",
  },
  {
    id: "ecstatic-dance-workshop",
    title: "Ecstatic Dance Workshop",
    date: "December 12, 2025",
    time: "6:00 PM - 8:00 PM",
    location: "The Island - Ahangama",
    description: "Free your body and soul through movement in our safe and judgment-free space.",
    fullDescription: "Free your body and soul through movement in our safe and judgment-free space. This workshop is designed to help you break free from mental constraints and connect with your authentic self through the power of dance.\n\nThe session begins with gentle warm-up exercises to prepare your body and mind. We then move into guided movement practices that help you explore different qualities of motion - from flowing like water to sharp and precise movements. The workshop culminates in a free dance segment where you're invited to express whatever is moving through you in the moment.\n\nNo dance experience is necessary - just a willingness to move and be present with yourself. This practice is deeply therapeutic and can help release stored emotions, boost creativity, and increase body awareness. Come as you are and allow yourself to be moved by the music and your inner wisdom.",
    image: "/images/events/event-03.jpg",
    category: "Workshops",
  },
  {
    id: "winter-solstice-ceremony",
    title: "Winter Solstice Ceremony",
    date: "December 20, 2025",
    time: "7:00 PM - 9:00 PM",
    location: "The Island - Ahangama",
    description: "Celebrate the longest night of the year with our sacred solstice ceremony.",
    fullDescription: "Celebrate the longest night of the year with our sacred solstice ceremony. This ancient tradition honors the return of the light and the cyclical nature of life. Our ceremony is designed to help you release what no longer serves you and set intentions for the coming year.\n\nThe evening begins with a guided meditation to center and ground ourselves. We then participate in a ritual of release where we write down what we wish to let go of and symbolically burn it in our sacred fire. This is followed by a sound healing session with crystal bowls and chimes to align our energies with the cosmic rhythms.\n\nWe conclude with a sharing circle where participants can express their intentions for the coming year. Light refreshments and herbal tea are provided. This ceremony is a beautiful way to honor the natural cycles and connect with the deeper rhythms of life.",
    image: "/images/events/event-04.jpg",
    category: "Ceremonies",
  },
  {
    id: "new-year-wellness-workshop",
    title: "New Year Wellness Workshop",
    date: "December 28, 2025",
    time: "10:00 AM - 12:00 PM",
    location: "The Island - Ahangama",
    description: "Set intentions for the new year with our guided wellness workshop.",
    fullDescription: "Set intentions for the new year with our guided wellness workshop. This comprehensive session is designed to help you create a strong foundation for health and well-being in the coming year.\n\nThe workshop covers various aspects of holistic wellness including nutrition, movement, mental health, and spiritual practices. Our expert facilitators will guide you through interactive exercises to identify your core values, set meaningful goals, and create actionable plans.\n\nYou'll learn practical tools for stress management, mindfulness techniques you can incorporate into daily life, and simple movement practices to keep your body energized. The session also includes a guided meditation focused on self-compassion and a group intention-setting exercise.\n\nParticipants will leave with a personalized wellness plan and a toolkit of practices they can implement immediately. This workshop is perfect for anyone looking to start the new year with clarity, purpose, and renewed energy.",
    image: "/images/events/event-05.jpg",
    category: "Workshops",
  },
  {
    id: "mindfulness-meditation-series",
    title: "Mindfulness Meditation Series",
    date: "January 5, 2026",
    time: "8:00 AM - 10:00 AM",
    location: "The Island - Ahangama",
    description: "A 5-day intensive mindfulness meditation program for deep inner transformation.",
    fullDescription: "A 5-day intensive mindfulness meditation program for deep inner transformation. This immersive series is designed for both beginners and experienced practitioners who wish to deepen their meditation practice.\n\nEach day focuses on a different aspect of mindfulness, starting with basic breath awareness and progressing to more advanced techniques including body scanning, loving-kindness meditation, and mindful movement. Our experienced teachers provide personalized guidance and support throughout the program.\n\nThe series includes morning meditation sessions, dharma talks, group discussions, and silent practice periods. Participants also receive a comprehensive workbook with guided meditations and resources to continue their practice at home.\n\nThis program is particularly beneficial for those dealing with stress, anxiety, chronic pain, or anyone seeking to cultivate greater awareness and presence in daily life. By the end of the series, participants often report increased emotional resilience, improved focus, and a deeper sense of peace and well-being.",
    image: "/images/events/event-06.jpg",
    price: "LKR 25,000 (for full series)",
    category: "Retreats",
  },
];

export default function EventDetailPage() {
  const params = useParams();
  const eventId = params.eventId as string;

  // Find the event based on the ID from the URL
  const event = eventsData.find(e => e.id === eventId);

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
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-8">
            <Link 
              href="/events" 
              className="inline-flex items-center text-[#68887d] hover:text-[#5a786d] transition-colors duration-300"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Events
            </Link>
          </div>

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
                <span className="inline-block px-3 py-1 bg-[#68887d] text-xs uppercase tracking-wider rounded-full mb-3">
                  {event.category}
                </span>
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
              <div className="prose max-w-none mb-10">
                {event.fullDescription.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-[#191d18] mb-4 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>

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
                    <h3 className="text-lg font-medium text-[#191d18]">Location</h3>
                  </div>
                  <p className="text-[#525A52]">{event.location}</p>
                </div>
              </div>

              {/* Price and Booking */}
              <div className="bg-[#2b332d] rounded-2xl p-8 text-white">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <div className="mb-6 md:mb-0">
                    <h3 className="text-2xl font-light mb-2">Reserve Your Spot</h3>
                    {event.price && (
                      <p className="text-3xl font-light text-[#CDEDD4]">{event.price}</p>
                    )}
                    <p className="text-[#c4c9c4] mt-1">
                      Secure your place in this transformative experience
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/booking">
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