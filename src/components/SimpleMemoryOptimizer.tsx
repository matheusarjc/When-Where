"use client";

import { useEffect } from "react";

export function SimpleMemoryOptimizer() {
  useEffect(() => {
    // Só executar no cliente
    if (typeof window === "undefined") return;

    // Função simples de monitoramento de memória
    const checkMemory = () => {
      try {
        if ("memory" in performance) {
          const memory = (performance as any).memory;
          const usage = memory.usedJSHeapSize / 1024 / 1024;
          const limit = memory.jsHeapSizeLimit / 1024 / 1024;

          // Log apenas se uso > 80%
          if (usage / limit > 0.8) {
            console.warn("High memory usage:", usage.toFixed(2), "MB");
          }
        }
      } catch (error) {
        // Ignorar erros silenciosamente
      }
    };

    // Verificar memória a cada 60 segundos
    const interval = setInterval(checkMemory, 60000);

    // Verificação inicial
    checkMemory();

    return () => clearInterval(interval);
  }, []);

  // Não renderiza nada
  return null;
}
