'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QRScanner } from './qr-scanner';
import { MessageCircle, Calendar, QrCode, Users, Clock, Phone } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface WhatsAppAppointment {
  id: string;
  patientName: string;
  patientPhone: string;
  doctorId: string;
  doctorName: string;
  slot: string;
  date: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  language: 'hi' | 'mr' | 'en';
  createdAt: string;
}

interface WhatsAppStats {
  totalAppointments: number;
  pendingAppointments: number;
  completedAppointments: number;
  activeConversations: number;
}

export function WhatsAppDashboard() {
  const t = useTranslations('WhatsAppDashboard');
  const [appointments, setAppointments] = useState<WhatsAppAppointment[]>([]);
  const [stats, setStats] = useState<WhatsAppStats>({
    totalAppointments: 0,
    pendingAppointments: 0,
    completedAppointments: 0,
    activeConversations: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  // Sample data for demonstration
  useEffect(() => {
    // Simulate loading appointments
    setTimeout(() => {
      const sampleAppointments: WhatsAppAppointment[] = [
        {
          id: 'apt_001',
          patientName: 'सीता देवी / Sita Devi',
          patientPhone: '+919876543210',
          doctorId: 'dr_verma',
          doctorName: 'डॉ. वर्मा / Dr. Verma',
          slot: '11:00 AM',
          date: '2024-01-07',
          status: 'confirmed',
          language: 'hi',
          createdAt: '2024-01-07T09:30:00Z'
        },
        {
          id: 'apt_002',
          patientName: 'राम पाटील / Ram Patil',
          patientPhone: '+919876543211',
          doctorId: 'dr_mehta',
          doctorName: 'डॉ. मेहता / Dr. Mehta',
          slot: '2:30 PM',
          date: '2024-01-07',
          status: 'pending',
          language: 'mr',
          createdAt: '2024-01-07T10:15:00Z'
        },
        {
          id: 'apt_003',
          patientName: 'गीता शर्मा / Geeta Sharma',
          patientPhone: '+919876543212',
          doctorId: 'dr_verma',
          doctorName: 'डॉ. वर्मा / Dr. Verma',
          slot: '3:00 PM',
          date: '2024-01-06',
          status: 'completed',
          language: 'hi',
          createdAt: '2024-01-06T11:45:00Z'
        }
      ];

      setAppointments(sampleAppointments);
      setStats({
        totalAppointments: sampleAppointments.length,
        pendingAppointments: sampleAppointments.filter(a => a.status === 'pending').length,
        completedAppointments: sampleAppointments.filter(a => a.status === 'completed').length,
        activeConversations: 5
      });
      setIsLoading(false);
    }, 1000);
  }, []);

  const getStatusBadge = (status: string) => {
    const variants = {
      confirmed: 'default',
      pending: 'secondary',
      completed: 'outline',
      cancelled: 'destructive'
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getLanguageFlag = (language: string) => {
    const flags = {
      hi: '🇮🇳 हिंदी',
      mr: '🇮🇳 मराठी',
      en: '🇬🇧 English'
    };
    return flags[language as keyof typeof flags] || '🇬🇧 English';
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                <div className="h-4 w-4 bg-muted animate-pulse rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-muted animate-pulse rounded mb-2" />
                <div className="h-3 w-24 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAppointments}</div>
            <p className="text-xs text-muted-foreground">Via WhatsApp</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingAppointments}</div>
            <p className="text-xs text-muted-foreground">Awaiting confirmation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedAppointments}</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Chats</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeConversations}</div>
            <p className="text-xs text-muted-foreground">Live conversations</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="appointments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="appointments">
            <Calendar className="h-4 w-4 mr-2" />
            Appointments
          </TabsTrigger>
          <TabsTrigger value="scanner">
            <QrCode className="h-4 w-4 mr-2" />
            QR Scanner
          </TabsTrigger>
        </TabsList>

        <TabsContent value="appointments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>WhatsApp Appointments</CardTitle>
              <CardDescription>
                Appointments booked through WhatsApp conversations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{appointment.patientName}</h4>
                        <span className="text-xs text-muted-foreground">
                          {getLanguageFlag(appointment.language)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span className="flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          {appointment.patientPhone}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {appointment.date} at {appointment.slot}
                        </span>
                        <span>{appointment.doctorName}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(appointment.status)}
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}

                {appointments.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No WhatsApp appointments yet</p>
                    <p className="text-sm">Appointments will appear here when patients book via WhatsApp</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scanner" className="space-y-4">
          <QRScanner 
            onPatientDataReceived={(data) => {
              console.log('Patient data received:', data);
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
