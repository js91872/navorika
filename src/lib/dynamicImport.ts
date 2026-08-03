import dynamic from 'next/dynamic';
import { ComponentType, ReactNode } from 'react';

interface DynamicImportOptions {
  ssr?: boolean;
  loading?: ComponentType; // Accept any component
}

export const dynamicImport = <T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: DynamicImportOptions = { ssr: true }
) => {
  return dynamic(importFn, {
    ssr: options.ssr,
    loading: options.loading as any, // Type assertion to bypass strict typing
  });
};

// Pre-defined dynamic imports for common components
export const DynamicHero = dynamicImport(
  () => import('@/components/home/EnhancedHero')
);

export const DynamicCategoryGrid = dynamicImport(
  () => import('@/components/home/EnhancedCategoryGrid')
);

export const DynamicToolGrid = dynamicImport(
  () => import('@/components/home/EnhancedToolGrid')
);
