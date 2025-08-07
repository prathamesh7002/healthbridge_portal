
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebarNav } from '@/components/layout/sidebar-nav';
import { AppHeader } from '@/components/layout/header';
import { Loader2 } from 'lucide-react';
import { useLocale } from 'next-intl';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  useEffect(() => {
    // This code now runs only on the client
    try {
      const role = localStorage.getItem('userRole');
      if (role && ['patient', 'doctor'].includes(role)) {
        setUserRole(role);
      } else {
        router.push(`/${locale}/`);
      }
    } catch (error) {
        router.push(`/${locale}/`);
    } finally {
        setIsAuthenticating(false);
    }
  }, [router, locale]);

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    router.push(`/${locale}/`);
  };

  if (isAuthenticating) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!userRole) {
      // This will be brief, as the useEffect will redirect.
      // Helps prevent rendering children that might depend on the role.
      return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
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
