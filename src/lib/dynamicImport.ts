import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

interface DynamicImportOptions {
  ssr?: boolean;
  loading?: ComponentType;
}

export const dynamicImport = <T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: DynamicImportOptions = { ssr: true }
) => {
  return dynamic(importFn, {
    ssr: options.ssr,
    loading: options.loading as any,
  });
};

// Pre-defined dynamic imports for common components
// Note: These components must exist in the codebase
export const DynamicHero = dynamicImport(
  () => import('@/components/home/EnhancedHero')
);

export const DynamicCategoryGrid = dynamicImport(
  () => import('@/components/home/EnhancedCategoryGrid')
);

export const DynamicToolGrid = dynamicImport(
  () => import('@/components/home/EnhancedToolGrid')
);
