// Shared types and interfaces for the application

export interface Service {
  title: string;
  description: string;
  icon: string;
  link: string;
}

export interface Healer {
  name: string;
  role: string;
  image: string;
  link: string;
}

export interface Session {
  title: string;
  duration: string;
  description: string;
}

export interface FloatingFlowerProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  animationClass: string;
  depthLayer: 'depth-layer-1' | 'depth-layer-2' | 'depth-layer-3';
  delayClass: string;
}

export interface BenefitItem {
  title: string;
  description: string;
}

// Booking interface (refactored to use sessionId)
export interface Booking {
  id: string;
  sessionId: string;        // Now references EventSession, not Event
  eventName: string;        // Denormalized for historical record
  eventDate: Date;          // Denormalized snapshot at booking time
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  numberOfPeople: number;
  specialRequests?: string | null;
  bookingDate: Date;
  status: string;
  totalPrice: number;
  ojasenFee: number;
  facilitatorFee: number;
  facilitatorId?: string | null;
  facilitatorName?: string | null;
  userId?: string | null;
  nationality?: string | null;
  nic?: string | null;
  passport?: string | null;
}

// Facilitator interface
export interface Facilitator {
  id: string;
  name: string;
  role: string;
  email: string;
  phone?: string | null;
  baseFee: number;
  commission: number;
}