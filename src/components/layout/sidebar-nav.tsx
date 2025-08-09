
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Calendar,
  FileText,
  User,
  Stethoscope,
  HeartPulse,
  CalendarPlus,
  ClipboardPlus,
  Users,
  LogOut,
  Settings,
  MessageCircle,
} from "lucide-react";
import { useTranslations } from "next-intl";

export function AppSidebarNav({ userRole }: { userRole: string }) {
  const t = useTranslations('Sidebar');
  const pathname = usePathname();
  const router = useRouter();

  const getNavItems = () => {
    switch (userRole) {
      case 'patient':
        return [
          { name: t('patientNav.dashboard'), href: "/patient/dashboard", icon: LayoutDashboard },
          { name: t('patientNav.bookAppointment'), href: "/patient/appointments", icon: CalendarPlus },
          { name: t('patientNav.myReports'), href: "/patient/reports", icon: ClipboardPlus },
          { name: t('patientNav.prescriptions'), href: "/patient/prescriptions", icon: FileText },
          { name: t('patientNav.profile'), href: "/patient/profile", icon: User },
          { name: t('patientNav.settings'), href: "/patient/settings", icon: Settings },
        ];
      case 'doctor':
        return [
          { name: t('doctorNav.dashboard'), href: "/doctor/dashboard", icon: LayoutDashboard },
          { name: t('doctorNav.appointments'), href: "/doctor/appointments", icon: Calendar },
          { name: t('doctorNav.myPatients'), href: "/doctor/patients", icon: Users },
          { name: t('doctorNav.availability'), href: "/doctor/availability", icon: CalendarPlus },
          { name: t('doctorNav.whatsapp'), href: "/doctor/whatsapp", icon: MessageCircle },
          { name: t('doctorNav.profile'), href: "/doctor/profile", icon: User },
          { name: t('doctorNav.settings'), href: "/doctor/settings", icon: Settings },
        ];

      default:
        return [];
    }
  };

  const navItems = getNavItems();
  
  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    router.push("/");
  };
  
  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-3 p-2">
          <div className="p-2 bg-primary rounded-lg">
              <HeartPulse className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold font-headline text-foreground group-data-[collapsible=icon]:hidden">{t('appName')}</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.name}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.endsWith(item.href)}
                  tooltip={{children: item.name, side:"right"}}
                >
                  <Link href={item.href}>
                    <item.icon className="h-4 w-4" />
                    <span className="group-data-[collapsible=icon]:hidden max-w-[12rem] truncate">{item.name}</span>
                  </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2">
         <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout} tooltip={{children: t('logout'), side:"right"}}>
                    <LogOut className="h-4 w-4" />
                    <span className="group-data-[collapsible=icon]:hidden">{t('logout')}</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
         </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
