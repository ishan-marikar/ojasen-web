import { prisma } from "./prisma";

export interface EventData {
  id?: string;
  slug: string;
  title: string;
  description: string;
  fullDescription?: string;
  category?: string;
  image?: string;
  defaultPrice: number;
  defaultLocation?: string;
  status?: string;
}

export interface SessionData {
  id?: string;
  eventId: string;
  title?: string;
  date: Date;
  time: string;
  location: string;
  price: number;
  capacity?: number;
  // bookedCount removed - now calculated from bookings relationship
  facilitatorId?: string;
  facilitatorName?: string;
  status?: string;
  description?: string;
}

export class EventService {
  // ============= EVENT CRUD OPERATIONS =============

  // Get all events
  static async getAllEvents() {
    try {
      const events = await prisma.event.findMany({
        include: {
          sessions: {
            orderBy: { date: 'asc' }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
      return { success: true, events };
    } catch (error) {
      console.error("Error fetching events:", error);
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  }

  // Get active events (for public display)
  static async getActiveEvents() {
    try {
      const events = await prisma.event.findMany({
        where: { status: 'active' },
        include: {
          sessions: {
            where: {
              status: 'active',
              date: { gte: new Date() }
            },
            orderBy: { date: 'asc' }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
      return { success: true, events };
    } catch (error) {
      console.error("Error fetching active events:", error);
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  }

  // Get event by slug
  static async getEventBySlug(slug: string) {
    try {
      const event = await prisma.event.findUnique({
        where: { slug },
        include: {
          sessions: {
            orderBy: { date: 'asc' }
          }
        }
      });
      
      if (!event) {
        return { success: false, error: "Event not found" };
      }
      
      return { success: true, event };
    } catch (error) {
      console.error("Error fetching event by slug:", error);
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  }

  // Get event by ID
  static async getEventById(id: string) {
    try {
      const event = await prisma.event.findUnique({
        where: { id },
        include: {
          sessions: {
            orderBy: { date: 'asc' }
          }
        }
      });
      
      if (!event) {
        return { success: false, error: "Event not found" };
      }
      
      return { success: true, event };
    } catch (error) {
      console.error("Error fetching event:", error);
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  }

  // Get event by ID or slug (checks both)
  static async getEventByIdOrSlug(idOrSlug: string) {
    try {
      // Try to find by ID first
      let event = await prisma.event.findUnique({
        where: { id: idOrSlug },
        include: {
          sessions: {
            orderBy: { date: 'asc' }
          }
        }
      });
      
      // If not found by ID, try by slug
      if (!event) {
        event = await prisma.event.findUnique({
          where: { slug: idOrSlug },
          include: {
            sessions: {
              orderBy: { date: 'asc' }
            }
          }
        });
      }
      
      if (!event) {
        return { success: false, error: "Event not found" };
      }
      
      return { success: true, event };
    } catch (error) {
      console.error("Error fetching event:", error);
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  }

  // Create new event
  static async createEvent(data: EventData) {
    try {
      const eventId = data.id || `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const event = await prisma.event.create({
        data: {
          id: eventId,
          slug: data.slug,
          title: data.title,
          description: data.description,
          fullDescription: data.fullDescription,
          category: data.category,
          image: data.image,
          defaultPrice: data.defaultPrice,
          defaultLocation: data.defaultLocation,
          status: data.status || 'active'
        }
      });
      
      return { success: true, event };
    } catch (error) {
      console.error("Error creating event:", error);
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  }

  // Update event
  static async updateEvent(id: string, data: Partial<EventData>) {
    try {
      const event = await prisma.event.update({
        where: { id },
        data: {
          ...(data.slug && { slug: data.slug }),
          ...(data.title && { title: data.title }),
          ...(data.description && { description: data.description }),
          ...(data.fullDescription !== undefined && { fullDescription: data.fullDescription }),
          ...(data.category !== undefined && { category: data.category }),
          ...(data.image !== undefined && { image: data.image }),
          ...(data.defaultPrice !== undefined && { defaultPrice: data.defaultPrice }),
          ...(data.defaultLocation !== undefined && { defaultLocation: data.defaultLocation }),
          ...(data.status && { status: data.status })
        }
      });
      
      return { success: true, event };
    } catch (error) {
      console.error("Error updating event:", error);
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  }

  // Delete event
  static async deleteEvent(id: string) {
    try {
      await prisma.event.delete({
        where: { id }
      });
      
      return { success: true };
    } catch (error) {
      console.error("Error deleting event:", error);
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  }

  // ============= SESSION CRUD OPERATIONS =============

  // Get all sessions
  static async getAllSessions() {
    try {
      const sessions = await prisma.eventSession.findMany({
        include: {
          event: true,
          _count: {
            select: { bookings: true }
          }
        },
        orderBy: { date: 'asc' }
      });
      return { success: true, sessions };
    } catch (error) {
      console.error("Error fetching sessions:", error);
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  }

  // Get active/upcoming sessions (for public display)
  static async getUpcomingSessions() {
    try {
      // Get start of today (midnight) to include sessions happening later today
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
      
      const sessions = await prisma.eventSession.findMany({
        where: {
          status: 'active',
          date: { gte: startOfToday }
        },
        include: {
          event: true,
          _count: {
            select: { bookings: true }
          }
        },
        orderBy: { date: 'asc' }
      });
      return { success: true, sessions };
    } catch (error) {
      console.error("Error fetching upcoming sessions:", error);
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  }

  // Get sessions by event ID
  static async getSessionsByEventId(eventId: string) {
    try {
      const sessions = await prisma.eventSession.findMany({
        where: { eventId },
        include: {
          event: true,
          _count: {
            select: { bookings: true }
          }
        },
        orderBy: { date: 'asc' }
      });
      return { success: true, sessions };
    } catch (error) {
      console.error("Error fetching sessions:", error);
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  }

  // Get session by ID
  static async getSessionById(id: string) {
    try {
      const session = await prisma.eventSession.findUnique({
        where: { id },
        include: {
          event: true
        }
      });
      
      if (!session) {
        return { success: false, error: "Session not found" };
      }
      
      return { success: true, session };
    } catch (error) {
      console.error("Error fetching session:", error);
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  }

  // Create new session
  static async createSession(data: SessionData) {
    try {
      const sessionId = data.id || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const session = await prisma.eventSession.create({
        data: {
          id: sessionId,
          eventId: data.eventId,
          title: data.title,
          date: data.date,
          time: data.time,
          location: data.location,
          price: data.price,
          capacity: data.capacity || 20,
          // bookedCount removed - calculated from bookings
          facilitatorId: data.facilitatorId,
          facilitatorName: data.facilitatorName,
          status: data.status || 'active',
          description: data.description
        },
        include: {
          event: true,
          bookings: true,  // Include bookings to get count
          _count: {
            select: { bookings: true }
          }
        }
      });
      
      return { success: true, session };
    } catch (error) {
      console.error("Error creating session:", error);
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  }

  // Update session
  static async updateSession(id: string, data: Partial<SessionData>) {
    try {
      const session = await prisma.eventSession.update({
        where: { id },
        data: {
          ...(data.eventId && { eventId: data.eventId }),
          ...(data.title !== undefined && { title: data.title }),
          ...(data.date && { date: data.date }),
          ...(data.time && { time: data.time }),
          ...(data.location && { location: data.location }),
          ...(data.price !== undefined && { price: data.price }),
          ...(data.capacity !== undefined && { capacity: data.capacity }),
          // bookedCount removed - calculated from bookings
          ...(data.facilitatorId !== undefined && { facilitatorId: data.facilitatorId }),
          ...(data.facilitatorName !== undefined && { facilitatorName: data.facilitatorName }),
          ...(data.status && { status: data.status }),
          ...(data.description !== undefined && { description: data.description })
        },
        include: {
          event: true,
          bookings: true,
          _count: {
            select: { bookings: true }
          }
        }
      });
      
      return { success: true, session };
    } catch (error) {
      console.error("Error updating session:", error);
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  }

  // Delete session
  static async deleteSession(id: string) {
    try {
      // Cascade delete will handle removing associated bookings
      await prisma.eventSession.delete({
        where: { id }
      });
      
      return { success: true };
    } catch (error) {
      console.error("Error deleting session:", error);
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  }

  // Get session with booking count
  static async getSessionWithBookingCount(id: string) {
    try {
      const session = await prisma.eventSession.findUnique({
        where: { id },
        include: {
          event: true,
          bookings: {
            where: { status: { in: ['pending', 'confirmed'] } }
          },
          _count: {
            select: { bookings: true }
          }
        }
      });
      
      if (!session) {
        return { success: false, error: "Session not found" };
      }
      
      // Calculate total attendees and check if full
      const totalAttendees = session.bookings.reduce((sum, booking) => sum + booking.numberOfPeople, 0);
      const isFull = totalAttendees >= session.capacity;
      const availableSpots = session.capacity - totalAttendees;
      
      return { 
        success: true, 
        session,
        bookingCount: session._count.bookings,
        totalAttendees,
        isFull,
        availableSpots
      };
    } catch (error) {
      console.error("Error fetching session with booking count:", error);
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  }
}
