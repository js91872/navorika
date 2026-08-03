// Performance monitoring and optimization utilities

export const performance = {
  // Measure component render time
  measure: (name: string, fn: () => void) => {
    if (typeof window === 'undefined') return;
    const start = window.performance.now();
    fn();
    const end = window.performance.now();
    console.debug(`[Performance] ${name}: ${(end - start).toFixed(2)}ms`);
  },

  // Lazy load images
  lazyLoadImage: (src: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.onload = () => resolve(src);
      img.onerror = reject;
    });
  },

  // Debounce function for scroll/resize events
  debounce: <T extends (...args: any[]) => any>(
    fn: T,
    delay: number
  ): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout | null = null;
    return (...args: Parameters<T>) => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => fn(...args), delay);
    };
  },

  // Throttle function for scroll/resize events
  throttle: <T extends (...args: any[]) => any>(
    fn: T,
    limit: number
  ): ((...args: Parameters<T>) => void) => {
    let inThrottle = false;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        fn(...args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },
};

// Check if browser supports WebP
export const supportsWebP = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      resolve(false);
      return;
    }
    const data = ctx.getImageData(0, 0, 1, 1);
    const blob = canvas.toBlob((b) => {
      resolve(b?.type === 'image/webp');
    }, 'image/webp');
  });
};

// Check if browser supports AVIF
export const supportsAVIF = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      resolve(false);
      return;
    }
    const blob = canvas.toBlob((b) => {
      resolve(b?.type === 'image/avif');
    }, 'image/avif');
  });
};

// Prefetch pages on hover
export const prefetchLink = (href: string) => {
  if (typeof window === 'undefined') return;
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = href;
  document.head.appendChild(link);
};
