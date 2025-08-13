"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebarNav } from '@/components/layout/sidebar-nav';
import { AppHeader } from '@/components/layout/header';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth-provider';
import { ProfileCompletionGuard } from '@/lib/profile-completion-guard';
import { HelpProvider } from '@/contexts/HelpContext';

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  const { user, userRole, loading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !userRole) {
    return null; // or redirect to login
  }

  return (
    <HelpProvider>
      <ProfileCompletionGuard>
        <SidebarProvider defaultOpen>
        <div className="relative flex min-h-screen flex-col">
          <AppHeader className="dashboard-header" />
          <div className="flex flex-1">
            <Sidebar variant="floating" collapsible="icon" className="sidebar-menu">
              <AppSidebarNav userRole={userRole} className="profile-menu" />
            </Sidebar>
            <SidebarInset className="bg-background w-full">
              <main className="flex-1 overflow-y-auto p-4 md:p-6">
                {children}
              </main>
            </SidebarInset>
            </div>
          </div>
        </SidebarProvider>
      </ProfileCompletionGuard>
    </HelpProvider>
  );
}
