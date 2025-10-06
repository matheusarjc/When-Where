"use client";
import { useEffect, useState } from "react";

interface CountdownProps {
  to: string;
  className?: string;
}

export function Countdown({ to, className = "" }: CountdownProps) {
  const [ms, setMs] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const targetTime = new Date(to).getTime();
    const updateCountdown = () => {
      setMs(targetTime - Date.now());
    };

    // Atualizar imediatamente
    updateCountdown();

    const id = setInterval(updateCountdown, 1000);
    return () => clearInterval(id);
  }, [to]);

  // Evitar problemas de hidratação mostrando um valor neutro no servidor
  if (!mounted) {
    return <span className={className}>...</span>;
  }

  if (ms <= 0) {
    return (
      <span aria-live="polite" className={className}>
        Agora
      </span>
    );
  }

  const s = Math.floor(ms / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);

  return (
    <span role="timer" aria-live="polite" className={`tabular-nums ${className}`}>
      {d}d {h}h {m}m
    </span>
  );
}
