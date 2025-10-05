"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Activity, Clock, Zap, TrendingUp } from "lucide-react";

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage: number;
  networkRequests: number;
  fps: number;
  timestamp: number;
}

interface WebVitals {
  lcp: number | null; // Largest Contentful Paint
  fid: number | null; // First Input Delay
  cls: number | null; // Cumulative Layout Shift
  fcp: number | null; // First Contentful Paint
  ttfb: number | null; // Time to First Byte
}

export function PerformanceMonitorOptimized() {
  const [isVisible, setIsVisible] = useState(false);
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    renderTime: 0,
    memoryUsage: 0,
    networkRequests: 0,
    fps: 0,
    timestamp: Date.now(),
  });
  const [webVitals, setWebVitals] = useState<WebVitals>({
    lcp: null,
    fid: null,
    cls: null,
    fcp: null,
    ttfb: null,
  });

  // Throttled update function
  const throttledUpdate = useCallback(() => {
    try {
      // Medir tempo de carregamento real (não performance.now())
      const navigation = performance.getEntriesByType(
        "navigation"
      )[0] as PerformanceNavigationTiming;
      const loadTime = navigation ? navigation.loadEventEnd - navigation.navigationStart : 0;

      // Medir uso de memória
      let memoryUsage = 0;
      if ("memory" in performance) {
        const memory = (performance as any).memory;
        memoryUsage = memory.usedJSHeapSize / 1024 / 1024;
      }

      // Contar requests
      const resources = performance.getEntriesByType("resource");

      setMetrics((prev) => ({
        ...prev,
        loadTime,
        memoryUsage,
        networkRequests: resources.length,
        timestamp: Date.now(),
      }));
    } catch (error) {
      console.warn("Error updating metrics:", error);
    }
  }, []);

  // FPS measurement with throttling
  const measureFPS = useCallback(() => {
    let lastTime = performance.now();
    let frameCount = 0;

    const countFrames = () => {
      frameCount++;
      const currentTime = performance.now();

      if (currentTime - lastTime >= 2000) {
        // Measure every 2 seconds
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        setMetrics((prev) => ({ ...prev, fps }));
        frameCount = 0;
        lastTime = currentTime;
      }

      if (isVisible) {
        requestAnimationFrame(countFrames);
      }
    };

    countFrames();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    // Initial measurement
    throttledUpdate();

    // Measure FPS
    measureFPS();

    // Web Vitals (only once)
    const measureWebVitals = () => {
      try {
        // LCP
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          if (lastEntry) {
            setWebVitals((prev) => ({ ...prev, lcp: lastEntry.startTime }));
          }
        });
        lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });

        // FID
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (entry.processingStart && entry.startTime) {
              setWebVitals((prev) => ({ ...prev, fid: entry.processingStart - entry.startTime }));
            }
          });
        });
        fidObserver.observe({ entryTypes: ["first-input"] });

        // CLS
        const clsObserver = new PerformanceObserver((list) => {
          let clsValue = 0;
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput && entry.value) {
              clsValue += entry.value;
            }
          });
          if (clsValue > 0) {
            setWebVitals((prev) => ({ ...prev, cls: clsValue }));
          }
        });
        clsObserver.observe({ entryTypes: ["layout-shift"] });

        // FCP
        const fcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const fcp = entries.find((entry: any) => entry.name === "first-contentful-paint");
          if (fcp) {
            setWebVitals((prev) => ({ ...prev, fcp: fcp.startTime }));
          }
        });
        fcpObserver.observe({ entryTypes: ["paint"] });

        // TTFB
        const ttfbObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (entry.responseStart && entry.requestStart) {
              setWebVitals((prev) => ({ ...prev, ttfb: entry.responseStart - entry.requestStart }));
            }
          });
        });
        ttfbObserver.observe({ entryTypes: ["navigation"] });

        return () => {
          lcpObserver.disconnect();
          fidObserver.disconnect();
          clsObserver.disconnect();
          fcpObserver.disconnect();
          ttfbObserver.disconnect();
        };
      } catch (error) {
        console.warn("Error observing web vitals:", error);
        return () => {};
      }
    };

    const cleanupWebVitals = measureWebVitals();

    // Update metrics less frequently
    const interval = setInterval(throttledUpdate, 15000); // Every 15 seconds

    return () => {
      clearInterval(interval);
      cleanupWebVitals();
    };
  }, [isVisible, throttledUpdate, measureFPS]);

  const getPerformanceColor = (value: number, thresholds: { good: number; poor: number }) => {
    if (value <= thresholds.good) return "text-green-500";
    if (value <= thresholds.poor) return "text-yellow-500";
    return "text-red-500";
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 z-50 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        title="Mostrar Monitor de Performance">
        <Activity className="w-5 h-5" />
      </button>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed bottom-4 right-4 z-50 w-80 bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            Performance
          </h3>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            ✕
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="space-y-3">
          {/* Load Time */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-300">Load Time</span>
            </div>
            <span
              className={`text-sm font-mono ${getPerformanceColor(metrics.loadTime, {
                good: 1000,
                poor: 3000,
              })}`}>
              {metrics.loadTime.toFixed(0)}ms
            </span>
          </div>

          {/* FPS */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-300">FPS</span>
            </div>
            <span
              className={`text-sm font-mono ${getPerformanceColor(60 - metrics.fps, {
                good: 0,
                poor: 15,
              })}`}>
              {metrics.fps}
            </span>
          </div>

          {/* Memory Usage */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-300">Memory</span>
            </div>
            <span
              className={`text-sm font-mono ${getPerformanceColor(metrics.memoryUsage, {
                good: 50,
                poor: 100,
              })}`}>
              {formatBytes(metrics.memoryUsage * 1024 * 1024)}
            </span>
          </div>

          {/* Network Requests */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-300">Requests</span>
            </div>
            <span className="text-sm font-mono text-gray-900 dark:text-white">
              {metrics.networkRequests}
            </span>
          </div>

          {/* Web Vitals */}
          <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Web Vitals
            </h4>

            {webVitals.lcp && (
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500">LCP</span>
                <span
                  className={`text-xs font-mono ${getPerformanceColor(webVitals.lcp, {
                    good: 2500,
                    poor: 4000,
                  })}`}>
                  {(webVitals.lcp / 1000).toFixed(1)}s
                </span>
              </div>
            )}

            {webVitals.fid && (
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500">FID</span>
                <span
                  className={`text-xs font-mono ${getPerformanceColor(webVitals.fid, {
                    good: 100,
                    poor: 300,
                  })}`}>
                  {webVitals.fid.toFixed(0)}ms
                </span>
              </div>
            )}

            {webVitals.cls !== null && (
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500">CLS</span>
                <span
                  className={`text-xs font-mono ${getPerformanceColor(webVitals.cls * 1000, {
                    good: 100,
                    poor: 250,
                  })}`}>
                  {webVitals.cls.toFixed(3)}
                </span>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
