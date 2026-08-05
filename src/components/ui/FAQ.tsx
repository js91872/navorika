'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  items: FAQItem[];
  title?: string;
}

export default function FAQ({ items, title = 'Frequently Asked Questions' }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <section className="mt-12 p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
      <h3 className="text-2xl font-bold mb-6">{title}</h3>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="border border-[var(--border)] rounded-xl overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full px-5 py-4 text-left flex items-center justify-between hover:bg-[var(--muted)] transition-colors"
            >
              <span className="font-semibold text-sm">{item.question}</span>
              {openIndex === index ? (
                <ChevronUp className="h-5 w-5 text-[var(--muted-foreground)] shrink-0" />
              ) : (
                <ChevronDown className="h-5 w-5 text-[var(--muted-foreground)] shrink-0" />
              )}
            </button>
            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="px-5 pb-4 text-sm text-[var(--muted-foreground)] leading-relaxed"
                >
                  {item.answer}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}
