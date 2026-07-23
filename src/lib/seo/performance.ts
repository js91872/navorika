// Performance optimization utilities

export function getLCPImage() {
  // Prioritize LCP image loading
  return {
    priority: true,
    loading: "eager" as const,
    sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  };
}

export function generateCriticalCSS() {
  // Critical CSS for above-the-fold content
  return `
    /* Critical CSS for hero section */
    .hero-section {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .hero-title {
      font-size: clamp(2rem, 5vw, 4rem);
      font-weight: 700;
      line-height: 1.2;
    }
  `;
}

export function prefetchLinks() {
  return [
    '/tools',
    '/categories',
    '/guides',
  ];
}

export function getImageOptimization() {
  return {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  };
}
