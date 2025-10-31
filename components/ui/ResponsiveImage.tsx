"use client";

import { useState, useEffect, ImgHTMLAttributes } from "react";

interface ResponsiveImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fallbackSrc?: string;
  lazy?: boolean;
  className?: string;
}

export default function ResponsiveImage({
  src,
  alt,
  width,
  height,
  fallbackSrc = "/placeholder.png",
  lazy = true,
  className = "",
  ...props
}: ResponsiveImageProps) {
  const [imageSrc, setImageSrc] = useState<string>(lazy ? "" : src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!lazy) {
      setImageSrc(src);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setImageSrc(src);
            observer.disconnect();
          }
        });
      },
      { rootMargin: "50px" }
    );

    const element = document.getElementById(`img-${src}`);
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [src, lazy]);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    if (fallbackSrc) {
      setImageSrc(fallbackSrc);
    }
  };

  return (
    <div
      id={`img-${src}`}
      className={`relative overflow-hidden ${className}`}
      style={{ width, height }}
    >
      {isLoading && !hasError && (
        <div
          className="absolute inset-0 bg-gray-800 animate-pulse flex items-center justify-center"
          style={{ width, height }}
        >
          <i className="fas fa-image text-gray-600 text-2xl"></i>
        </div>
      )}
      {imageSrc && (
        <img
          src={imageSrc}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoading ? "opacity-0" : "opacity-100"
          }`}
          {...props}
        />
      )}
      {hasError && !fallbackSrc && (
        <div
          className="absolute inset-0 bg-gray-800 flex items-center justify-center"
          style={{ width, height }}
        >
          <div className="text-center text-gray-500">
            <i className="fas fa-exclamation-triangle text-3xl mb-2"></i>
            <p className="text-sm">Failed to load image</p>
          </div>
        </div>
      )}
    </div>
  );
}
