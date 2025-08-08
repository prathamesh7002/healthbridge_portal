"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebarNav } from '@/components/layout/sidebar-nav';
import { AppHeader } from '@/components/layout/header';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth-provider';
import { ProfileCompletionGuard } from '@/lib/profile-completion-guard';

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
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
    return null;
  }

  return (
    <SidebarProvider defaultOpen>
      <Sidebar variant="floating" collapsible="icon">
        <AppSidebarNav userRole={userRole} />
      </Sidebar>
      <SidebarInset>
        <AppHeader />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <ProfileCompletionGuard>{children}</ProfileCompletionGuard>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}


