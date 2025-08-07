
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebarNav } from '@/components/layout/sidebar-nav';
import { AppHeader } from '@/components/layout/header';
import { Loader2 } from 'lucide-react';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const role = localStorage.getItem('userRole');
      if (role && ['patient', 'doctor'].includes(role)) {
        setUserRole(role);
      } else {
        router.push('/');
      }
    } catch (error) {
        router.push('/');
    } finally {
        setIsAuthenticating(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    router.push('/');
  };

  if (isAuthenticating) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!userRole) {
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
                {children}
            </main>
        </SidebarInset>
    </SidebarProvider>
  );
}
