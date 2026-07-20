export const brandConfig = {
  name: "Navorika",
  tagline: "Your Smart Toolkit for the Digital Age",
  description: "Free online tools, calculators, and utilities for productivity, finance, and creativity.",
  
  colors: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
      950: '#172554',
    },
    secondary: {
      50: '#f5f3ff',
      100: '#ede9fe',
      500: '#8b5cf6',
      600: '#7c3aed',
      700: '#6d28d9',
    },
    accent: {
      50: '#ecfdf5',
      500: '#10b981',
      600: '#059669',
      700: '#047857',
    },
  },
  
  typography: {
    heading: {
      font: 'Inter',
      weights: [700, 800, 900],
      sizes: ['text-4xl', 'text-5xl', 'text-6xl'],
    },
    body: {
      font: 'Inter',
      weights: [400, 500, 600],
      sizes: ['text-sm', 'text-base', 'text-lg'],
    },
    mono: {
      font: 'Roboto Mono',
      weights: [400, 500],
    },
  },
  
  spacing: {
    section: 'py-16 lg:py-24',
    container: 'max-w-7xl',
    gutters: 'px-4 sm:px-6 lg:px-8',
  },
  
  borderRadius: {
    sm: 'rounded-lg',
    md: 'rounded-xl',
    lg: 'rounded-2xl',
    xl: 'rounded-3xl',
    full: 'rounded-full',
  },
  
  shadows: {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    glow: 'shadow-[0_0_30px_rgba(59,130,246,0.15)]',
    subtle: 'shadow-[0_4px_20px_rgba(0,0,0,0.04)]',
  },
  
  animations: {
    fast: 'duration-150',
    medium: 'duration-300',
    slow: 'duration-500',
    ease: 'ease-in-out',
  },
};
