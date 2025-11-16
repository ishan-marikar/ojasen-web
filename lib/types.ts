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

// Booking interface
export interface Booking {
  id: string;
  eventId: string;
  eventName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  numberOfPeople: number;
  specialRequests?: string;
  bookingDate: Date;
  eventDate: Date;
  status: 'pending' | 'confirmed' | 'cancelled';
  totalPrice: number;
  ojasenFee: number;
  facilitatorFee: number;
  facilitatorId?: string;
  facilitatorName?: string;
  userId?: string;
}

// Facilitator interface
export interface Facilitator {
  id: string;
  name: string;
  role: string;
  email: string;
  phone?: string;
  baseFee: number;
  commission: number;
}