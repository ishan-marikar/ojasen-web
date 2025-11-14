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