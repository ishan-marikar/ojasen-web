// Centralized event data for the entire application
// This file now supports both hardcoded events (for backwards compatibility)
// and dynamic events from the database

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

// Hardcoded event data (kept for backwards compatibility or fallback)
// These will be merged with database events
export const HARDCODED_EVENTS_DATA: DetailedEvent[] = [
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

// Function to fetch events from database and convert to DetailedEvent format
export async function fetchEventsFromDatabase(): Promise<DetailedEvent[]> {
  try {
    const response = await fetch('/api/events', { cache: 'no-store' });
    const data = await response.json();
    
    if (!data.success || !data.events) {
      console.error('Failed to fetch events from database');
      return [];
    }

    // Convert database events and sessions to DetailedEvent format
    const detailedEvents: DetailedEvent[] = [];
    
    for (const event of data.events) {
      if (event.sessions && event.sessions.length > 0) {
        // Create a DetailedEvent for each session
        for (const session of event.sessions) {
          const sessionDate = new Date(session.date);
          const formattedDate = sessionDate.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          });
          
          detailedEvents.push({
            id: session.id,
            title: session.title || event.title,
            date: formattedDate,
            time: session.time,
            location: session.location,
            description: event.description,
            fullDescription: session.description || event.fullDescription,
            image: event.image || '/images/placeholder.png',
            category: event.category,
            price: `LKR ${session.price.toLocaleString()}`,
            priceRaw: session.price,
          });
        }
      }
    }
    
    return detailedEvents;
  } catch (error) {
    console.error('Error fetching events from database:', error);
    return [];
  }
}

// Main events data - uses hardcoded for now, will be replaced with dynamic data
export const EVENTS_DATA: DetailedEvent[] = HARDCODED_EVENTS_DATA;


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