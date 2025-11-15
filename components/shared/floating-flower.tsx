"use client";

import { ImageWithFallback as Image } from "@/components/shared/image-with-fallback";
import { FloatingFlowerProps } from "@/lib/types";

export function FloatingFlower({
  src,
  alt,
  width,
  height,
  className = "",
  animationClass,
  depthLayer,
  delayClass,
}: FloatingFlowerProps) {
  return (
    <div
      className={`absolute ${animationClass} ${delayClass} ${depthLayer} hidden sm:block`}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
      />
    </div>
  );
}
