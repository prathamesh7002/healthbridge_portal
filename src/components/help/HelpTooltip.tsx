'use client';

import { useState, useEffect, ReactNode } from 'react';
import { Info, X } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface HelpTooltipProps {
  id: string;
  title: string;
  content: string;
  children: ReactNode;
  position?: 'top' | 'right' | 'bottom' | 'left';
  showOnFirstVisit?: boolean;
}

export function HelpTooltip({
  id,
  title,
  content,
  children,
  position = 'right',
  showOnFirstVisit = false,
}: HelpTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dismissed, setDismissed] = useLocalStorage(`help-${id}-dismissed`, false);
  const [firstVisit, setFirstVisit] = useLocalStorage(`help-${id}-first-visit`, true);

  useEffect(() => {
    if (showOnFirstVisit && firstVisit) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        setFirstVisit(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [showOnFirstVisit, firstVisit, setFirstVisit]);

  if (dismissed) return <>{children}</>;

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
  };

  return (
    <div className="relative inline-block">
      <div className="relative inline-flex items-center group">
        {children}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="ml-1 text-gray-400 hover:text-blue-500 transition-colors"
          aria-label="Help"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>

      {isOpen && (
        <div
          className={`absolute z-50 w-64 p-4 bg-white rounded-lg shadow-lg border border-gray-200 ${positionClasses[position]}`}
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium text-gray-900">{title}</h3>
            <button
              onClick={() => {
                setIsOpen(false);
                setDismissed(true);
              }}
              className="text-gray-400 hover:text-gray-500"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm text-gray-600">{content}</p>
          <div className="mt-3 flex justify-end">
            <button
              onClick={() => {
                setIsOpen(false);
                setDismissed(true);
              }}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Help wrapper for page-level help
export function PageHelp({ children }: { children: ReactNode }) {
  const [showHelp, setShowHelp] = useState(true);
  const [dismissed, setDismissed] = useLocalStorage('page-help-dismissed', false);

  if (dismissed) return null;

  return (
    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg mb-6">
      <div className="flex">
        <div className="flex-shrink-0">
          <Info className="h-5 w-5 text-blue-400" />
        </div>
        <div className="ml-3 flex-1">
          <div className="text-sm text-blue-700">{children}</div>
        </div>
        <div className="ml-4">
          <button
            onClick={() => setDismissed(true)}
            className="text-blue-500 hover:text-blue-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
