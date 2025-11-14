"use client";

import { ReactNode } from "react";
import { FloatingFlower } from "@/components/shared/floating-flower";

interface HeroProps {
  title?: string;
  subtitle?: string;
  children?: ReactNode;
  backgroundImage?: string;
  className?: string;
}

export function Hero({
  title,
  subtitle,
  children,
  backgroundImage,
  className = "",
}: HeroProps) {
  const heroStyle = backgroundImage
    ? { backgroundImage: `url('${backgroundImage}')` }
    : {};

  return (
    <div
      className={`w-full flex flex-col items-center justify-top min-h-screen py-2 pt-28 relative overflow-hidden bg-cover bg-center bg-no-repeat ${className}`}
      style={heroStyle}
    >
      <div className="bg-black/30 backdrop-blur-sm w-full h-full flex flex-col items-center justify-center py-20 px-4">
        {subtitle && (
          <div className="text-sm uppercase text-[#191d18] font-medium tracking-wider">
            {subtitle}
          </div>
        )}
        {title && (
          <h1 className="mx-3 text-4xl sm:text-5xl text-[#191d18] pt-4 text-center">
            {title}
          </h1>
        )}
        {children}
      </div>

      {/* Floating flowers */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Background layer - subtle, more blurred */}
        <FloatingFlower
          src="/images/hero/flower02.png"
          alt="Floating Flower"
          width={48}
          height={48}
          className="opacity-30 blur-[1px]"
          animationClass="animate-float-slow"
          depthLayer="depth-layer-1"
          delayClass="animation-delay-0"
        />
        <FloatingFlower
          src="/images/hero/flower03.png"
          alt="Floating Flower"
          width={36}
          height={36}
          className="opacity-25 blur-[1.5px]"
          animationClass="animate-float-reverse"
          depthLayer="depth-layer-1"
          delayClass="animation-delay-2000"
        />

        {/* Middle layer - medium visibility, medium blur */}
        <FloatingFlower
          src="/images/hero/flower03.png"
          alt="Floating Flower"
          width={52}
          height={52}
          className="opacity-50 blur-[0.5px]"
          animationClass="animate-float"
          depthLayer="depth-layer-2"
          delayClass="animation-delay-1000"
        />

        {/* Foreground layer - clearer, less blurred */}
        <FloatingFlower
          src="/images/hero/flower02.png"
          alt="Floating Flower"
          width={60}
          height={60}
          className="opacity-70"
          animationClass="animate-float-diagonal"
          depthLayer="depth-layer-3"
          delayClass="animation-delay-3000"
        />
        <FloatingFlower
          src="/images/hero/flower03.png"
          alt="Floating Flower"
          width={44}
          height={44}
          className="opacity-60 blur-[0.25px]"
          animationClass="animate-float-scale"
          depthLayer="depth-layer-3"
          delayClass="animation-delay-4000"
        />
      </div>
    </div>
  );
}
