
"use client";

import { Bell, CircleUser } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useAuth } from "@/lib/auth-provider";
// removed locale-based pathing

function getPageTitleKey(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length < 3) return "dashboard";
  const page = segments[segments.length - 1];
  
  if (page === 'doctors') return 'doctors';

  if (page === 'patients') return 'patients';

  return page.replace('-', ' ');
}

export function AppHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { userRole, signOut } = useAuth();
  const t = useTranslations("Header");
  const tPage = useTranslations("PageTitles");
  
  const [titleKey, setTitleKey] = useState("dashboard");

  useEffect(() => {
    setTitleKey(getPageTitleKey(pathname));
  }, [pathname]);

  const handleLogout = async () => {
    try {
      console.log('Logging out...');
      await signOut();
      console.log('SignOut completed, redirecting...');
      
      router.push('/');
      console.log('Redirected to:', '/');
    } catch (error) {
      console.error('Error during logout:', error);
      // Force redirect even if there's an error
      router.push('/');
    }
  };

  const settingsPath = userRole ? `/${userRole}/settings` : '#';
  const profilePath = userRole ? `/${userRole}/profile` : '#';

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6 sticky top-0 z-30 md:bg-transparent md:border-none">
      <div className="md:hidden">
        <SidebarTrigger />
      </div>
      <div className="w-full flex-1">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">{tPage(titleKey as any)}</h1>
      </div>
      <Button variant="outline" size="icon" className="h-9 w-9 relative rounded-full">
        <Bell className="h-4 w-4" />
        <span className="sr-only">Toggle notifications</span>
        <span className="absolute top-0 right-0 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
        </span>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full h-9 w-9">
            <CircleUser className="h-5 w-5" />
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>{t("myAccount")}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={profilePath}>{t("profile")}</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={settingsPath}>{t("settings")}</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>{t("support")}</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>{t("logout")}</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
