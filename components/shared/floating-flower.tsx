"use client";

import Image from "next/image";
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
    <div className={`absolute ${animationClass} ${delayClass} ${depthLayer}`}>
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
