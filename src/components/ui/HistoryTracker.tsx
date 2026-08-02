'use client';

import { useState, useEffect } from 'react';
import { Button } from './Button';
import { Card } from './Card';
import { Trash2, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HistoryItem {
  id: string;
  timestamp: number;
  values: Record<string, any>;
  result: any;
}

interface HistoryTrackerProps {
  storageKey: string;
  maxItems?: number;
  onSelect?: (item: HistoryItem) => void;
}

export function HistoryTracker({ storageKey, maxItems = 10, onSelect }: HistoryTrackerProps) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setHistory(parsed);
      } catch (e) {
        console.error('Failed to parse history:', e);
      }
    }
  }, [storageKey]);

  const addHistory = (values: Record<string, any>, result: any) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      values,
      result,
    };

    const newHistory = [newItem, ...history].slice(0, maxItems);
    setHistory(newHistory);
    localStorage.setItem(storageKey, JSON.stringify(newHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(storageKey);
  };

  const removeItem = (id: string) => {
    const newHistory = history.filter(item => item.id !== id);
    setHistory(newHistory);
    localStorage.setItem(storageKey, JSON.stringify(newHistory));
  };

  if (history.length === 0) {
    return null;
  }

  return (
    <Card variant="glass" padding="sm" className="mt-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-left"
      >
        <span className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-500">
          <Clock className="h-4 w-4" />
          History ({history.length})
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              clearHistory();
            }}
            className="text-red-500 hover:text-red-700 text-xs font-bold"
          >
            Clear All
          </button>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
          {history.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              onClick={() => onSelect?.(item)}
            >
              <div className="flex-1">
                <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {new Date(item.timestamp).toLocaleString()}
                </div>
                <div className="text-xs text-slate-500">
                  {Object.entries(item.values).map(([key, value]) => (
                    <span key={key} className="mr-2">
                      {key}: {String(value)}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeItem(item.id);
                }}
                className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </button>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
