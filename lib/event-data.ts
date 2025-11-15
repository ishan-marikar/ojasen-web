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
  // Events from events/[eventId]/page.tsx
  {
    id: "anahata-flow",
    title: "Anahata Flow",
    date: "November 22, 2025",
    time: "6:00 PM",
    location: "The Island - Ahangama",
    description:
      "A heart-centered sound healing journey crafted to soften your emotional body and bring you back into harmony with yourself.",
    fullDescription:
      "A heart-centered sound healing journey crafted to soften your emotional body and bring you back into harmony with yourself. Guided by Oshi's intuitive blend of crystal bowls, vocal toning, and frequency work, this session awakens the energy of the heart — the space where compassion, release, and renewal unfold.\n\nYou'll be invited to slow down, breathe deeply, and allow vibrational medicine to move through your system. As sound ripples through your body, it helps dissolve heaviness, calm the nervous system, and create gentle openings where clarity and lightness can return.\n\nThis is not just a sound bath — it is a space to feel, to let go, and to reconnect with the softness you often forget you carry. Anahata Flow is ideal for anyone seeking emotional balance, energetic reset, or a moment of pure presence within the stillness of Ojasen's natural surroundings.",
    image: "/images/hero-night.JPG",
    category: "Sound Healing",
    price: "LKR 3,500",
    priceRaw: 3500,
  },
  {
    id: "panchali-saadhan",
    title: "Panchali Sādhanā",
    date: "November 29, 2025",
    time: "6:00 PM",
    location: "The Island - Ahangama",
    description:
      "A sacred WOMEN'S gathering inspired by the strength and grace of Panchali.",
    fullDescription:
      "Panchali Sadhana is a sacred WOMEN'S gathering inspired by the strength and grace of Panchali. This evening is crafted to help you release emotional weight, reconnect with your heart, and step into a new cycle with clarity and intention.\n\nThe journey weaves together a trauma-safe release ritual, an intention and manifest circle, sound healing with Oshi, lunar yoga and breathwork, energy clearing, and a symbolic fire offering to let go of what no longer serves you. You'll be guided through gentle New-Moon journaling, followed by a sisterhood sharing circle and a grounding tea ritual to close the night with softness.\n\nPanchali Sadhana is a sacred WOMEN'S gathering inspired by the strength and grace of Panchali. This evening is crafted to help you release emotional weight, reconnect with your heart, and step into a new cycle with clarity and intention. The journey weaves together a trauma-safe release ritual, an intention and manifest circle, sound healing with Oshi, lunar yoga and breathwork, energy clearing, and a symbolic fire offering to let go of what no longer serves you.\n\nYou'll be guided through gentle New-Moon journaling, followed by a sisterhood sharing circle and a grounding tea ritual to close the night with softness. Panchali Sadhana is a space to be held, seen, and supported — a return to your inner flame, your truth, and your feminine wisdom. Come as you are. Leave renewed.",
    image: "/images/hero-fantasy.png",
    category: "Ceremonies",
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