"use client";

import Image from "next/image";
import { useState } from "react";
import { OptimizedLoading } from "./OptimizedLoading";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
  fill?: boolean;
  style?: React.CSSProperties;
  onClick?: () => void;
  [key: string]: any;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = "",
  priority = false,
  quality = 80,
  sizes,
  placeholder = "empty",
  blurDataURL,
  fill = false,
  style,
  onClick,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  if (hasError) {
    return (
      <div
        className={`bg-gray-200 dark:bg-gray-700 flex items-center justify-center ${className}`}
        style={style}>
        <span className="text-gray-400 text-sm">Erro ao carregar</span>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={style}>
      {isLoading && !priority && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 z-10">
          <OptimizedLoading size="sm" variant="spinner" />
        </div>
      )}

      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        priority={priority}
        quality={quality}
        sizes={sizes}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        className={`transition-opacity duration-300 ${
          isLoading && !priority ? "opacity-0" : "opacity-100"
        } ${fill ? "h-full w-full" : ""}`}
        style={fill ? { objectFit: "cover" } : undefined}
        onLoad={handleLoad}
        onError={handleError}
        onClick={onClick}
        {...props}
      />
    </div>
  );
}
