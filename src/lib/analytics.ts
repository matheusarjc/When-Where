// Analytics e monitoramento de performance

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

interface WebVitalMetric {
  name: "CLS" | "FID" | "FCP" | "LCP" | "TTFB";
  value: number;
  delta: number;
  id: string;
  navigationType: string;
}

class Analytics {
  private metrics: PerformanceMetric[] = [];
  private isEnabled: boolean = false;

  constructor() {
    this.isEnabled = typeof window !== "undefined" && process.env.NODE_ENV === "production";
    this.setupWebVitals();
    this.setupPerformanceObserver();
  }

  // Configurar Web Vitals
  private setupWebVitals() {
    if (!this.isEnabled) return;

    // Core Web Vitals
    this.observeWebVital("CLS", "layout-shift");
    this.observeWebVital("FID", "first-input");
    this.observeWebVital("FCP", "first-contentful-paint");
    this.observeWebVital("LCP", "largest-contentful-paint");
    this.observeWebVital("TTFB", "navigation");
  }

  // Observar métricas específicas
  private observeWebVital(name: string, type: string) {
    if (!("PerformanceObserver" in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.reportWebVital({
            name: name as WebVitalMetric["name"],
            value: entry.startTime,
            delta: entry.startTime,
            id: entry.name,
            navigationType: "navigate",
          });
        }
      });

      observer.observe({ type, buffered: true });
    } catch (error) {
      console.warn(`Failed to observe ${name}:`, error);
    }
  }

  // Configurar Performance Observer geral
  private setupPerformanceObserver() {
    if (!this.isEnabled || !("PerformanceObserver" in window)) return;

    // Observer para métricas de performance
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === "measure") {
          this.reportMetric({
            name: entry.name,
            value: entry.duration,
            timestamp: entry.startTime,
          });
        }
      }
    });

    observer.observe({ entryTypes: ["measure"] });
  }

  // Reportar Web Vitals
  private reportWebVital(metric: WebVitalMetric) {
    this.reportMetric({
      name: metric.name,
      value: metric.value,
      timestamp: Date.now(),
      metadata: {
        delta: metric.delta,
        id: metric.id,
        navigationType: metric.navigationType,
      },
    });
  }

  // Reportar métrica customizada
  reportMetric(metric: PerformanceMetric) {
    if (!this.isEnabled) return;

    this.metrics.push(metric);

    // Enviar para analytics (Google Analytics, etc.)
    this.sendToAnalytics(metric);

    // Log para desenvolvimento
    if (process.env.NODE_ENV === "development") {
      console.log("Performance Metric:", metric);
    }
  }

  // Enviar para serviços de analytics
  private sendToAnalytics(metric: PerformanceMetric) {
    // Google Analytics 4
    if (typeof gtag !== "undefined") {
      gtag("event", "performance_metric", {
        metric_name: metric.name,
        metric_value: Math.round(metric.value),
        timestamp: metric.timestamp,
        ...metric.metadata,
      });
    }

    // Custom analytics endpoint
    this.sendToCustomEndpoint(metric);
  }

  // Enviar para endpoint customizado
  private async sendToCustomEndpoint(metric: PerformanceMetric) {
    try {
      await fetch("/api/analytics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...metric,
          userAgent: navigator.userAgent,
          url: window.location.href,
          timestamp: Date.now(),
        }),
      });
    } catch (error) {
      console.warn("Failed to send analytics:", error);
    }
  }

  // Medir tempo de carregamento de componente
  measureComponentLoad(componentName: string, startTime: number) {
    const endTime = performance.now();
    const duration = endTime - startTime;

    this.reportMetric({
      name: "component_load",
      value: duration,
      timestamp: Date.now(),
      metadata: {
        component: componentName,
      },
    });
  }

  // Medir tempo de API
  measureApiCall(endpoint: string, duration: number, success: boolean) {
    this.reportMetric({
      name: "api_call",
      value: duration,
      timestamp: Date.now(),
      metadata: {
        endpoint,
        success,
      },
    });
  }

  // Medir interação do usuário
  measureUserInteraction(action: string, element: string, duration?: number) {
    this.reportMetric({
      name: "user_interaction",
      value: duration || 0,
      timestamp: Date.now(),
      metadata: {
        action,
        element,
      },
    });
  }

  // Medir erro
  measureError(error: string, context?: string) {
    this.reportMetric({
      name: "error",
      value: 1,
      timestamp: Date.now(),
      metadata: {
        error,
        context,
      },
    });
  }

  // Obter métricas coletadas
  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  // Limpar métricas
  clearMetrics() {
    this.metrics = [];
  }

  // Exportar métricas
  exportMetrics() {
    const data = {
      metrics: this.metrics,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `performance-metrics-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
}

// Instância singleton
export const analytics = new Analytics();

// Helper para medir performance de função
export function measurePerformance<T>(fn: () => T, name: string): T {
  const start = performance.now();
  const result = fn();
  const end = performance.now();

  analytics.reportMetric({
    name: `function_${name}`,
    value: end - start,
    timestamp: Date.now(),
  });

  return result;
}

// Helper para medir performance assíncrona
export async function measureAsyncPerformance<T>(fn: () => Promise<T>, name: string): Promise<T> {
  const start = performance.now();
  const result = await fn();
  const end = performance.now();

  analytics.reportMetric({
    name: `async_function_${name}`,
    value: end - start,
    timestamp: Date.now(),
  });

  return result;
}

// Declaração global para gtag (Google Analytics)
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}
