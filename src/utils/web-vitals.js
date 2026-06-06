/**
 * Web Vitals Performance Monitoring
 *
 * Tracks Core Web Vitals and sends data to analytics
 * - LCP (Largest Contentful Paint)
 * - FCP (First Contentful Paint)
 * - CLS (Cumulative Layout Shift)
 * - INP (Interaction to Next Paint)
 * - TBT (Total Blocking Time)
 * - Speed Index
 *
 * These metrics are crucial for:
 * - Google Search Rankings
 * - User Experience
 * - Performance Budgets
 * - Real User Monitoring (RUM)
 */

import { onCLS, onFCP, onINP, onLCP, onTTFB } from 'web-vitals';

/**
 * Performance budgets (targets for Lighthouse > 95)
 */
const PERFORMANCE_BUDGETS = {
  LCP: 2500, // Largest Contentful Paint - must be < 2.5s
  FCP: 1800, // First Contentful Paint - must be < 1.8s
  CLS: 0.1, // Cumulative Layout Shift - must be < 0.1
  INP: 200, // Interaction to Next Paint - must be < 200ms
  TTFB: 800, // Time to First Byte - must be < 800ms
};

/**
 * Send metric to analytics (Google Analytics, custom endpoint, etc.)
 * @param {Object} metric - Web Vitals metric object
 */
const sendToAnalytics = (metric) => {
  const { name, value, rating, delta, id } = metric;

  // Log to console in development
  if (import.meta.env.DEV) {
    console.log(`[Web Vitals] ${name}:`, {
      value: `${Math.round(value)}${name === 'CLS' ? '' : 'ms'}`,
      rating,
      delta: Math.round(delta),
      id,
    });
  }

  // Check against performance budget
  const budget = PERFORMANCE_BUDGETS[name];
  if (budget && value > budget) {
    console.warn(
      `⚠️ Performance Budget Exceeded: ${name} = ${Math.round(value)}${
        name === 'CLS' ? '' : 'ms'
      } (budget: ${budget}${name === 'CLS' ? '' : 'ms'})`
    );
  }

  // Send to Google Analytics 4 (if available)
  if (typeof gtag !== 'undefined') {
    gtag('event', name, {
      event_category: 'Web Vitals',
      event_label: id,
      value: Math.round(name === 'CLS' ? value * 1000 : value),
      metric_id: id,
      metric_value: value,
      metric_delta: delta,
      metric_rating: rating,
      non_interaction: true,
    });
  }

  // Send to custom analytics endpoint
  sendToCustomEndpoint(metric);
};

/**
 * Send metric to custom analytics endpoint
 * @param {Object} metric - Web Vitals metric object
 */
const sendToCustomEndpoint = (metric) => {
  const endpoint = import.meta.env.VITE_ANALYTICS_ENDPOINT;

  if (!endpoint) return;

  const body = JSON.stringify({
    metric: metric.name,
    value: metric.value,
    rating: metric.rating,
    delta: metric.delta,
    id: metric.id,
    timestamp: Date.now(),
    url: window.location.href,
    userAgent: navigator.userAgent,
  });

  // Use sendBeacon if available (non-blocking)
  if (navigator.sendBeacon) {
    navigator.sendBeacon(endpoint, body);
  } else {
    // Fallback to fetch
    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    }).catch((error) => {
      if (import.meta.env.DEV) {
        console.error('Failed to send analytics:', error);
      }
    });
  }
};

/**
 * Report all Core Web Vitals
 */
export const reportWebVitals = () => {
  // Largest Contentful Paint (LCP)
  onLCP(sendToAnalytics);

  // First Contentful Paint (FCP)
  onFCP(sendToAnalytics);

  // Cumulative Layout Shift (CLS)
  onCLS(sendToAnalytics);

  // Interaction to Next Paint (INP)
  onINP(sendToAnalytics);

  // Time to First Byte (TTFB)
  onTTFB(sendToAnalytics);
};

/**
 * Monitor long tasks that block the main thread
 * Long tasks (>50ms) negatively impact INP and TBT
 */
export const monitorLongTasks = () => {
  if (!('PerformanceObserver' in window)) return;

  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 50) {
          console.warn(`⚠️ Long Task Detected: ${Math.round(entry.duration)}ms`, {
            startTime: Math.round(entry.startTime),
            duration: Math.round(entry.duration),
            name: entry.name,
          });

          // Send to analytics
          if (typeof gtag !== 'undefined') {
            gtag('event', 'long_task', {
              event_category: 'Performance',
              event_label: entry.name,
              value: Math.round(entry.duration),
              non_interaction: true,
            });
          }
        }
      }
    });

    observer.observe({ entryTypes: ['longtask'] });
  } catch (error) {
    // Long tasks API not supported
    if (import.meta.env.DEV) {
      console.log('Long Tasks API not supported');
    }
  }
};

/**
 * Monitor resource loading performance
 * Identifies slow-loading resources (images, scripts, etc.)
 */
export const monitorResourceTiming = () => {
  if (!('PerformanceObserver' in window)) return;

  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        // Flag resources that take > 1s to load
        if (entry.duration > 1000) {
          console.warn(`⚠️ Slow Resource: ${entry.name}`, {
            duration: `${Math.round(entry.duration)}ms`,
            size: entry.transferSize ? `${Math.round(entry.transferSize / 1024)}KB` : 'cached',
            type: entry.initiatorType,
          });
        }
      }
    });

    observer.observe({ entryTypes: ['resource'] });
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Resource Timing API error:', error);
    }
  }
};

/**
 * Get current performance metrics summary
 * @returns {Object} Performance metrics object
 */
export const getPerformanceMetrics = () => {
  if (!('performance' in window)) return null;

  const navigation = performance.getEntriesByType('navigation')[0];
  const paint = performance.getEntriesByType('paint');

  return {
    // Navigation Timing
    dns: navigation ? Math.round(navigation.domainLookupEnd - navigation.domainLookupStart) : 0,
    tcp: navigation ? Math.round(navigation.connectEnd - navigation.connectStart) : 0,
    ttfb: navigation ? Math.round(navigation.responseStart - navigation.requestStart) : 0,
    download: navigation ? Math.round(navigation.responseEnd - navigation.responseStart) : 0,
    domInteractive: navigation ? Math.round(navigation.domInteractive) : 0,
    domComplete: navigation ? Math.round(navigation.domComplete) : 0,
    loadComplete: navigation ? Math.round(navigation.loadEventEnd) : 0,

    // Paint Timing
    fcp: paint.find((entry) => entry.name === 'first-contentful-paint')?.startTime || 0,
    lcp: 0, // Updated by onLCP callback

    // Memory (if available)
    memory: performance.memory
      ? {
          usedJSHeapSize: Math.round(performance.memory.usedJSHeapSize / 1048576), // MB
          totalJSHeapSize: Math.round(performance.memory.totalJSHeapSize / 1048576), // MB
          jsHeapSizeLimit: Math.round(performance.memory.jsHeapSizeLimit / 1048576), // MB
        }
      : null,
  };
};

/**
 * Log performance summary to console
 */
export const logPerformanceSummary = () => {
  const metrics = getPerformanceMetrics();

  if (!metrics) {
    console.log('Performance API not available');
    return;
  }

  console.group('📊 Performance Summary');
  console.table({
    'DNS Lookup': `${metrics.dns}ms`,
    'TCP Connection': `${metrics.tcp}ms`,
    'Time to First Byte': `${metrics.ttfb}ms`,
    Download: `${metrics.download}ms`,
    'DOM Interactive': `${metrics.domInteractive}ms`,
    'DOM Complete': `${metrics.domComplete}ms`,
    'Load Complete': `${metrics.loadComplete}ms`,
    'First Contentful Paint': `${Math.round(metrics.fcp)}ms`,
  });

  if (metrics.memory) {
    console.log('Memory Usage:', metrics.memory);
  }

  console.groupEnd();
};

/**
 * Initialize all performance monitoring
 */
export const initPerformanceMonitoring = () => {
  // Report Web Vitals
  reportWebVitals();

  // Monitor long tasks
  monitorLongTasks();

  // Monitor resource timing
  monitorResourceTiming();

  // Log summary after page load
  if (document.readyState === 'complete') {
    setTimeout(logPerformanceSummary, 0);
  } else {
    window.addEventListener('load', () => {
      setTimeout(logPerformanceSummary, 0);
    });
  }
};

export default {
  reportWebVitals,
  monitorLongTasks,
  monitorResourceTiming,
  getPerformanceMetrics,
  logPerformanceSummary,
  initPerformanceMonitoring,
};
