"use client";

import { ReactNode } from "react";
import { ImageWithFallback as Image } from "@/components/shared/image-with-fallback";

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
  return (
    <div
      className={` bg-[#f7faf6] w-full flex flex-col items-center justify-top pt-28 relative overflow-hidden bg-cover bg-center bg-no-repeat ${className}`}
    >
      {/* Replace CSS background with Next.js Image component */}
      {backgroundImage && (
        <div className="absolute inset-0 w-full h-full">
          <div className="hidden md:block">
            <Image
              src={backgroundImage.replace(".JPG", ".jpg")}
              alt="Hero Background"
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          </div>
          <div className="md:hidden">
            <Image
              src={
                backgroundImage.replace(".JPG", "-mobile.jpg") ||
                backgroundImage.replace(".jpg", "-mobile.jpg")
              }
              alt="Hero Background"
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          </div>
        </div>
      )}
      <div className="backdrop-blur-sm w-full h-full flex flex-col items-center justify-center py-16 sm:py-20 px-4 relative z-10">
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
    </div>
  );
}
