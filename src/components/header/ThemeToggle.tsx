'use client';

import { useTheme } from '@/components/ThemeProvider';
import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ThemeToggle() {
  const { isDark, toggle } = useTheme();

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={toggle}
      className="p-2 rounded-full hover:bg-slate-200/50 dark:hover:bg-white/10 transition-colors"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun className="h-5 w-5 text-slate-300 hover:text-white transition-colors" />
      ) : (
        <Moon className="h-5 w-5 text-slate-600 hover:text-slate-900 transition-colors" />
      )}
    </motion.button>
  );
}
