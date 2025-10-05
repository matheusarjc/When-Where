"use client";

import { useState, useEffect } from "react";
import { PerformanceMonitorOptimized } from "./PerformanceMonitorOptimized";

export function PerformanceToggle() {
  const [showPerf, setShowPerf] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("showPerformanceMonitor");
    setShowPerf(stored === "true");

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "P") {
        e.preventDefault();
        setShowPerf((prev) => {
          const newValue = !prev;
          localStorage.setItem("showPerformanceMonitor", String(newValue));
          return newValue;
        });
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  return showPerf ? <PerformanceMonitorOptimized /> : null;
}
