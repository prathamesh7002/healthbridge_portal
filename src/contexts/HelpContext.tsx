'use client';

import { createContext, useContext, ReactNode, useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface HelpContextType {
  isHelpEnabled: boolean;
  toggleHelp: () => void;
  dismissAllHelp: () => void;
  resetHelp: () => void;
}

const HelpContext = createContext<HelpContextType | undefined>(undefined);

export function HelpProvider({ children }: { children: ReactNode }) {
  const [isHelpEnabled, setIsHelpEnabled] = useLocalStorage('help-enabled', true);
  const [dismissedHelps, setDismissedHelps] = useLocalStorage<Record<string, boolean>>('dismissed-helps', {});

  const toggleHelp = () => {
    setIsHelpEnabled(!isHelpEnabled);
  };

  const dismissAllHelp = () => {
    setIsHelpEnabled(false);
  };

  const resetHelp = () => {
    setIsHelpEnabled(true);
    setDismissedHelps({});
  };

  return (
    <HelpContext.Provider value={{ isHelpEnabled, toggleHelp, dismissAllHelp, resetHelp }}>
      {children}
    </HelpContext.Provider>
  );
}

export function useHelp() {
  const context = useContext(HelpContext);
  if (context === undefined) {
    throw new Error('useHelp must be used within a HelpProvider');
  }
  return context;
}
