// Centralized event data for the entire application
// This file contains all event information to avoid duplication across components

export interface BaseEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image: string;
}

export interface DetailedEvent extends BaseEvent {
  fullDescription?: string;
  category?: string;
  price?: string;
  priceRaw?: number;
}

export interface EventCardData {
  id: string;
  date: string;
  month: string;
  title: string;
  description: string;
  location: string;
  time: string;
  image: string;
}

// Complete event data with all details
export const EVENTS_DATA: DetailedEvent[] = [
  // {
  //   id: "panchali-saadhan",
  //   title: "Panchali Sādhanā",
  //   date: "November 29, 2025",
  //   time: "6:00 PM",
  //   location: "The Island - Ahangama",
  //   description:
  //     "A sacred WOMEN'S gathering inspired by the strength and grace of Panchali.",
  //   fullDescription:
  //     "Panchali Sadhana is a sacred WOMEN'S gathering inspired by the strength and grace of Panchali. This evening is crafted to help you release emotional weight, reconnect with your heart, and step into a new cycle with clarity and intention.\n\nThe journey weaves together a trauma-safe release ritual, an intention and manifest circle, sound healing with Oshi, lunar yoga and breathwork, energy clearing, and a symbolic fire offering to let go of what no longer serves you. You'll be guided through gentle New-Moon journaling, followed by a sisterhood sharing circle and a grounding tea ritual to close the night with softness.\n\nPanchali Sadhana is a sacred WOMEN'S gathering inspired by the strength and grace of Panchali. This evening is crafted to help you release emotional weight, reconnect with your heart, and step into a new cycle with clarity and intention. The journey weaves together a trauma-safe release ritual, an intention and manifest circle, sound healing with Oshi, lunar yoga and breathwork, energy clearing, and a symbolic fire offering to let go of what no longer serves you.\n\nYou'll be guided through gentle New-Moon journaling, followed by a sisterhood sharing circle and a grounding tea ritual to close the night with softness. Panchali Sadhana is a space to be held, seen, and supported — a return to your inner flame, your truth, and your feminine wisdom. Come as you are. Leave renewed.",
  //   image: "/images/panchali.png",
  //   category: "Ceremonies",
  //   price: "LKR 4,000",
  //   priceRaw: 4000,
  // },

  {
    id: "yin-yoga-dec-8",
    title: "Yin Yoga",
    date: "December 8, 2025",
    time: "6:00 PM",
    location: "Ojasen Healing Arts",
    description: "Slow, still poses that melt tension and quiet the mind.",
    fullDescription:
      "A grounding Yin Yoga session focused on long-held, gentle poses designed to release deep tension in the body and calm the nervous system. Ideal for restoring balance and cultivating inner quiet.",
    image: "/images/placeholder.png",
    category: "Yoga",
    price: "LKR 3,000",
    priceRaw: 3000,
  },

  {
    id: "reiki-healing-dec-10",
    title: "Reiki Healing 1:1",
    date: "December 10, 2025",
    time: "By Appointment",
    location: "Ojasen Healing Arts",
    description: "Restores balance and clears emotional heaviness.",
    fullDescription:
      "A one-on-one Reiki healing session designed to cleanse energetic blockages, lighten emotional weight, and help you return to a state of inner equilibrium. Gentle, non-invasive, and deeply restorative.",
    image: "/images/placeholder.png",
    category: "Healing",
    price: "LKR 6,000",
    priceRaw: 6000,
  },

  {
    id: "samatva-flow-dec-12",
    title: "Samatva Flow",
    date: "December 12, 2025",
    time: "6:00 PM",
    location: "Ojasen Healing Arts",
    description:
      "A gentle, balanced flow to reset your energy and find centered stillness.",
    fullDescription:
      "A mindful movement practice inspired by the Sanskrit word 'Samatva' — equanimity. This session blends breath and flow to help you return to balance, steadiness, and quiet inner presence.",
    image: "/images/placeholder.png",
    category: "Yoga",
    price: "LKR 3,500",
    priceRaw: 3500,
  },

  {
    id: "anahata-flow-dec-13",
    title: "Anahata Flow",
    date: "December 13, 2025",
    time: "6:00 PM",
    location: "Ojasen Healing Arts",
    description:
      "A soothing sound healing session designed to awaken and expand the heart.",
    fullDescription:
      "A heart-centered healing experience combining gentle movement, breath, and therapeutic sound frequencies. Designed to release emotional tightness, open the heart space, and invite softness and connection.",
    image: "/images/placeholder.png",
    category: "Sound Healing",
    price: "LKR 4,000",
    priceRaw: 4000,
  },
];


// Event data formatted for the events page card display
export const EVENT_CARDS_DATA: EventCardData[] = EVENTS_DATA.map(event => {
  // Extract date and month from the date string
  const dateObj = new Date(event.date);
  const date = dateObj.getDate().toString();
  const month = dateObj.toLocaleString('default', { month: 'short' });
  
  // For events without specific price, we'll use a default
  const defaultPrice = event.price || "Price TBA";
  
  return {
    id: event.id,
    date: date.padStart(2, '0'),
    month: month,
    title: event.title,
    description: event.description,
    location: event.location,
    time: event.time,
    image: event.image,
  };
});

// Helper function to get event by ID
export function getEventById(id: string): DetailedEvent | undefined {
  return EVENTS_DATA.find(event => event.id === id);
}

// Helper function to get event card data by ID
export function getEventCardById(id: string): EventCardData | undefined {
  return EVENT_CARDS_DATA.find(event => event.id === id);
}