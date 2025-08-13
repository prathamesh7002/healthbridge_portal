import { ReactNode } from 'react';
import { AppHeader } from '@/components/layout/header';

export default function LegalLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {children}
      </main>
    </div>
  );
}
