"use client";

import { useEffect } from "react";
import { useMemoryOptimization } from "../hooks/useMemoryOptimization";

export function MemoryOptimizer() {
  // Usar o hook de otimização de memória
  const { cleanup, monitorMemory } = useMemoryOptimization();

  useEffect(() => {
    // Só executar no cliente
    if (typeof window === "undefined") return;

    // Executar monitoramento inicial
    monitorMemory();
  }, [monitorMemory]);

  // Este componente não renderiza nada, apenas gerencia memória
  return null;
}
