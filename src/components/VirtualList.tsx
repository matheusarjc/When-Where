"use client";

import { useState, useEffect, useRef, useMemo, ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";

interface VirtualListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
  className?: string;
  itemClassName?: string;
}

export function VirtualList<T>({
  items,
  renderItem,
  itemHeight,
  containerHeight,
  overscan = 5,
  className = "",
  itemClassName = "",
}: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calcular quais itens são visíveis
  const visibleRange = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      items.length - 1,
      Math.floor((scrollTop + containerHeight) / itemHeight) + overscan
    );

    return { startIndex, endIndex };
  }, [scrollTop, itemHeight, containerHeight, items.length, overscan]);

  // Itens visíveis
  const visibleItems = useMemo(() => {
    const result = [];
    for (let i = visibleRange.startIndex; i <= visibleRange.endIndex; i++) {
      if (items[i]) {
        result.push({
          item: items[i],
          index: i,
          top: i * itemHeight,
        });
      }
    }
    return result;
  }, [items, visibleRange, itemHeight]);

  // Altura total da lista
  const totalHeight = items.length * itemHeight;

  // Handle scroll
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  // Intersection Observer para otimizar ainda mais
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Item entrou na viewport - pode carregar conteúdo pesado
            const index = parseInt(entry.target.getAttribute("data-index") || "0");
            // Aqui você pode implementar lazy loading adicional se necessário
          }
        });
      },
      {
        root: container,
        rootMargin: "100px",
      }
    );

    // Observar todos os itens visíveis
    const visibleElements = container.querySelectorAll("[data-index]");
    visibleElements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, [visibleItems]);

  return (
    <div
      ref={containerRef}
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}>
      {/* Spacer para manter a altura total */}
      <div style={{ height: totalHeight, position: "relative" }}>
        <AnimatePresence>
          {visibleItems.map(({ item, index, top }) => (
            <motion.div
              key={index}
              data-index={index}
              className={`absolute w-full ${itemClassName}`}
              style={{
                top,
                height: itemHeight,
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}>
              {renderItem(item, index)}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Hook para usar VirtualList com configurações automáticas
export function useVirtualList<T>(items: T[], itemHeight: number, containerHeight: number) {
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    // Habilitar virtualização apenas para listas grandes
    setIsEnabled(items.length > 20);
  }, [items.length]);

  return {
    isEnabled,
    VirtualListComponent: isEnabled ? VirtualList<T> : null,
  };
}
