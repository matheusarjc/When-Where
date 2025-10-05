import { useEffect, useCallback } from "react";

export function useMemoryOptimization() {
  // Cleanup function para limpar recursos
  const cleanup = useCallback(() => {
    // Só executar no cliente
    if (typeof window === "undefined") return;

    // Limpar timers
    const highestTimeoutId = setTimeout(() => {}, 0);
    for (let i = 0; i < highestTimeoutId; i++) {
      clearTimeout(i);
    }

    // Limpar intervals
    const highestIntervalId = setInterval(() => {}, 0);
    for (let i = 0; i < highestIntervalId; i++) {
      clearInterval(i);
    }

    // Forçar garbage collection se disponível
    if ("gc" in window && typeof (window as any).gc === "function") {
      (window as any).gc();
    }
  }, []);

  // Monitor de memória
  const monitorMemory = useCallback(() => {
    // Só executar no cliente
    if (typeof window === "undefined" || typeof performance === "undefined") return;

    if ("memory" in performance) {
      const memory = (performance as any).memory;
      const usage = memory.usedJSHeapSize / 1024 / 1024;
      const limit = memory.jsHeapSizeLimit / 1024 / 1024;

      // Se uso de memória > 80% do limite, fazer cleanup
      if (usage / limit > 0.8) {
        console.warn("High memory usage detected:", usage.toFixed(2), "MB");
        cleanup();
      }
    }
  }, [cleanup]);

  useEffect(() => {
    // Só executar no cliente
    if (typeof window === "undefined") return;

    // Monitorar memória a cada 30 segundos
    const interval = setInterval(monitorMemory, 30000);

    // Cleanup na desmontagem
    return () => {
      clearInterval(interval);
      cleanup();
    };
  }, [monitorMemory, cleanup]);

  return { cleanup, monitorMemory };
}
