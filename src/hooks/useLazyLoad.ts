import { useState, useEffect, useRef } from "react";

interface UseLazyLoadOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function useLazyLoad(options: UseLazyLoadOptions = {}) {
  const { threshold = 0.1, rootMargin = "50px", triggerOnce = true } = options;

  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isIntersecting = entry.isIntersecting;

        if (isIntersecting && !hasLoaded) {
          setIsVisible(true);
          if (triggerOnce) {
            setHasLoaded(true);
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsVisible(isIntersecting);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, triggerOnce, hasLoaded]);

  return { elementRef, isVisible, hasLoaded };
}

// Hook para lazy loading de imagens
export function useLazyImage(src: string, placeholder?: string) {
  const [imageSrc, setImageSrc] = useState(placeholder || "");
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const { elementRef, isVisible } = useLazyLoad();

  useEffect(() => {
    if (isVisible && src) {
      const img = new Image();

      img.onload = () => {
        setImageSrc(src);
        setIsLoading(false);
        setHasError(false);
      };

      img.onerror = () => {
        setHasError(true);
        setIsLoading(false);
      };

      img.src = src;
    }
  }, [isVisible, src]);

  return {
    elementRef,
    imageSrc,
    isLoading,
    hasError,
  };
}

// Hook para lazy loading de componentes
export function useLazyComponent<T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>
) {
  const [Component, setComponent] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const { elementRef, isVisible } = useLazyLoad();

  useEffect(() => {
    if (isVisible && !Component && !isLoading) {
      setIsLoading(true);

      importFunc()
        .then((module) => {
          setComponent(() => module.default);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error loading component:", error);
          setHasError(true);
          setIsLoading(false);
        });
    }
  }, [isVisible, Component, isLoading, importFunc]);

  return {
    elementRef,
    Component,
    isLoading,
    hasError,
  };
}
