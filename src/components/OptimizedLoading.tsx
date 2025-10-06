"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Loader2 } from "lucide-react";

interface OptimizedLoadingProps {
  size?: "sm" | "md" | "lg";
  variant?: "spinner" | "dots" | "pulse" | "skeleton";
  message?: string;
  fullScreen?: boolean;
}

export function OptimizedLoading({
  size = "md",
  variant = "spinner",
  message,
  fullScreen = false,
}: OptimizedLoadingProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  const containerClasses = fullScreen
    ? "fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm"
    : "flex items-center justify-center p-4";

  if (variant === "skeleton") {
    return (
      <div className={containerClasses}>
        <div className="animate-pulse space-y-4 w-full">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (variant === "pulse") {
    return (
      <div className={containerClasses}>
        <motion.div
          className={`${sizeClasses[size]} bg-blue-600 rounded-full`}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
        {message && (
          <motion.p
            className="ml-2 text-gray-600 dark:text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}>
            {message}
          </motion.p>
        )}
      </div>
    );
  }

  if (variant === "dots") {
    return (
      <div className={containerClasses}>
        <div className="flex space-x-1">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className={`${sizeClasses[size]} bg-blue-600 rounded-full`}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: index * 0.2,
              }}
            />
          ))}
        </div>
        {message && (
          <motion.p
            className="ml-2 text-gray-600 dark:text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}>
            {message}
          </motion.p>
        )}
      </div>
    );
  }

  // Default spinner variant
  return (
    <div className={containerClasses}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
        <Loader2 className={`${sizeClasses[size]} text-blue-600`} />
      </motion.div>
      {message && (
        <motion.p
          className="ml-2 text-gray-600 dark:text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}>
          {message}
        </motion.p>
      )}
    </div>
  );
}

// Componente para lazy loading de imagens
export function LazyImage({
  src,
  alt,
  placeholder = "/placeholder.jpg",
  className = "",
  ...props
}: {
  src: string;
  alt: string;
  placeholder?: string;
  className?: string;
  [key: string]: any;
}) {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const img = new Image();

    img.onload = () => {
      setImageSrc(src);
      setIsLoading(false);
    };

    img.onerror = () => {
      setHasError(true);
      setIsLoading(false);
    };

    img.src = src;
  }, [src]);

  return (
    <div className={`relative ${className}`}>
      <motion.img
        src={imageSrc}
        alt={alt}
        className={`transition-opacity duration-300 ${isLoading ? "opacity-0" : "opacity-100"}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        {...props}
      />

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <OptimizedLoading size="sm" variant="spinner" />
        </div>
      )}

      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <div className="text-gray-400 text-sm">Erro ao carregar imagem</div>
        </div>
      )}
    </div>
  );
}

// Hook para otimizar componentes pesados
export function useOptimizedComponent<T>(importFunc: () => Promise<T>, deps: any[] = []) {
  const [Component, setComponent] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setHasError(false);

    importFunc()
      .then((module) => {
        setComponent(module);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error loading component:", error);
        setHasError(true);
        setIsLoading(false);
      });
  }, deps);

  return { Component, isLoading, hasError };
}
