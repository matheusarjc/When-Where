"use client";

import { useState, useEffect } from "react";
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

export function PerformanceMonitor() {
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

  useEffect(() => {
    // Medir tempo de carregamento inicial
    const measureLoadTime = () => {
      const loadTime = performance.now();
      setMetrics((prev) => ({ ...prev, loadTime }));
    };

    // Medir uso de memória
    const measureMemory = () => {
      if ("memory" in performance) {
        const memory = (performance as any).memory;
        const memoryUsage = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
        setMetrics((prev) => ({ ...prev, memoryUsage }));
      }
    };

    // Medir FPS
    let lastTime = performance.now();
    let frameCount = 0;

    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();

      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        setMetrics((prev) => ({ ...prev, fps, timestamp: currentTime }));
        frameCount = 0;
        lastTime = currentTime;
      }

      requestAnimationFrame(measureFPS);
    };

    // Medir Web Vitals
    const measureWebVitals = () => {
      // Largest Contentful Paint
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        setWebVitals((prev) => ({ ...prev, lcp: lastEntry.startTime }));
      }).observe({ entryTypes: ["largest-contentful-paint"] });

      // First Input Delay
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          setWebVitals((prev) => ({ ...prev, fid: entry.processingStart - entry.startTime }));
        });
      }).observe({ entryTypes: ["first-input"] });

      // Cumulative Layout Shift
      new PerformanceObserver((list) => {
        let clsValue = 0;
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        setWebVitals((prev) => ({ ...prev, cls: clsValue }));
      }).observe({ entryTypes: ["layout-shift"] });

      // First Contentful Paint
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.name === "first-contentful-paint") {
            setWebVitals((prev) => ({ ...prev, fcp: entry.startTime }));
          }
        });
      }).observe({ entryTypes: ["paint"] });

      // Time to First Byte
      const navigationEntry = performance.getEntriesByType(
        "navigation"
      )[0] as PerformanceNavigationTiming;
      if (navigationEntry) {
        setWebVitals((prev) => ({
          ...prev,
          ttfb: navigationEntry.responseStart - navigationEntry.requestStart,
        }));
      }
    };

    // Contar requisições de rede
    const countNetworkRequests = () => {
      const requests = performance.getEntriesByType("resource").length;
      setMetrics((prev) => ({ ...prev, networkRequests: requests }));
    };

    // Medir tempo de renderização
    const measureRenderTime = () => {
      const renderTime = performance.now() - (performance.timing?.navigationStart || 0);
      setMetrics((prev) => ({ ...prev, renderTime }));
    };

    // Inicializar medições
    measureLoadTime();
    measureMemory();
    measureFPS();
    measureWebVitals();
    countNetworkRequests();
    measureRenderTime();

    // Atualizar métricas periodicamente
    const interval = setInterval(() => {
      measureMemory();
      countNetworkRequests();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

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
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            Performance Monitor
          </h3>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            ×
          </button>
        </div>

        <div className="space-y-3">
          {/* Métricas em Tempo Real */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Load Time
                </span>
              </div>
              <div
                className={`text-lg font-bold ${getPerformanceColor(metrics.loadTime, {
                  good: 1000,
                  poor: 3000,
                })}`}>
                {metrics.loadTime.toFixed(0)}ms
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">FPS</span>
              </div>
              <div
                className={`text-lg font-bold ${getPerformanceColor(60 - metrics.fps, {
                  good: 10,
                  poor: 20,
                })}`}>
                {metrics.fps}
              </div>
            </div>
          </div>

          {/* Web Vitals */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Web Vitals
            </h4>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded">
                <div className="text-gray-600 dark:text-gray-400">LCP</div>
                <div
                  className={getPerformanceColor(webVitals.lcp || 0, { good: 2500, poor: 4000 })}>
                  {webVitals.lcp ? `${webVitals.lcp.toFixed(0)}ms` : "N/A"}
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded">
                <div className="text-gray-600 dark:text-gray-400">FID</div>
                <div className={getPerformanceColor(webVitals.fid || 0, { good: 100, poor: 300 })}>
                  {webVitals.fid ? `${webVitals.fid.toFixed(0)}ms` : "N/A"}
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded">
                <div className="text-gray-600 dark:text-gray-400">CLS</div>
                <div
                  className={getPerformanceColor((webVitals.cls || 0) * 1000, {
                    good: 100,
                    poor: 250,
                  })}>
                  {webVitals.cls ? webVitals.cls.toFixed(3) : "N/A"}
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded">
                <div className="text-gray-600 dark:text-gray-400">FCP</div>
                <div
                  className={getPerformanceColor(webVitals.fcp || 0, { good: 1800, poor: 3000 })}>
                  {webVitals.fcp ? `${webVitals.fcp.toFixed(0)}ms` : "N/A"}
                </div>
              </div>
            </div>
          </div>

          {/* Outras Métricas */}
          <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
            <div>Memory: {metrics.memoryUsage.toFixed(1)}%</div>
            <div>Network Requests: {metrics.networkRequests}</div>
            <div>Render Time: {metrics.renderTime.toFixed(0)}ms</div>
          </div>

          {/* Status Geral */}
          <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Status:{" "}
              {metrics.fps >= 55 && metrics.loadTime <= 2000 ? (
                <span className="text-green-600 font-medium">Ótimo</span>
              ) : (
                <span className="text-yellow-600 font-medium">Atenção</span>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
