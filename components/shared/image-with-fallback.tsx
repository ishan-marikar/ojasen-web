import Image from "next/image";
import { useState } from "react";

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  fallbackSrc?: string;
  className?: string;
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  quality?: number;
  onLoad?: () => void;
  onError?: () => void;
}

export function ImageWithFallback({
  src,
  alt,
  fallbackSrc = "/images/hero-background.jpg",
  className = "",
  width,
  height,
  fill = false,
  sizes,
  priority = false,
  quality,
  onLoad,
  onError,
  ...props
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError && imgSrc !== fallbackSrc) {
      setHasError(true);
      setImgSrc(fallbackSrc);
      onError?.();
    }
  };

  const handleLoad = () => {
    onLoad?.();
  };

  return (
    <Image
      src={imgSrc}
      alt={alt}
      className={className}
      width={width}
      height={height}
      fill={fill}
      sizes={sizes}
      priority={priority}
      quality={quality}
      onError={handleError}
      onLoad={handleLoad}
      {...props}
    />
  );
}
