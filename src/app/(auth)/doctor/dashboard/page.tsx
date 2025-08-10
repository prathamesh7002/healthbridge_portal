"use client"
import { StatCard } from '@/components/shared/stat-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Users, Stethoscope, Clock, FileText, ArrowUpRight, MessageCircle, Calendar, Phone, MapPin, CheckCircle, Clock as ClockIcon, AlertCircle } from 'lucide-react';
import Link from 'next/link';

// Mock WhatsApp appointments data (replace with actual data from your WhatsApp integration)
const whatsappAppointments = [
  {
    id: 'WA001',
    patientName: 'राजेश कुमार / Rajesh Kumar',
    phoneNumber: '+91 98765 43210',
    time: '10:30 AM',
    date: '2024-01-15',
    status: 'confirmed',
    reason: 'Follow-up consultation',
    doctor: 'Dr. Verma',
    clinic: 'Shanti Clinic',
    address: 'Civil Lines, Nagpur',
    language: 'hi'
  },
  {
    id: 'WA002',
    patientName: 'प्रिया शर्मा / Priya Sharma',
    phoneNumber: '+91 87654 32109',
    time: '11:00 AM',
    date: '2024-01-15',
    status: 'pending',
    reason: 'General checkup',
    doctor: 'Dr. Verma',
    clinic: 'Shanti Clinic',
    address: 'Civil Lines, Nagpur',
    language: 'hi'
  },
  {
    id: 'WA003',
    patientName: 'अमित पाटिल / Amit Patil',
    phoneNumber: '+91 76543 21098',
    time: '2:30 PM',
    date: '2024-01-15',
    status: 'confirmed',
    reason: 'Chest pain consultation',
    doctor: 'Dr. Verma',
    clinic: 'Shanti Clinic',
    address: 'Civil Lines, Nagpur',
    language: 'mr'
  },
  {
    id: 'WA004',
    patientName: 'सुनीता देशमुख / Sunita Deshmukh',
    phoneNumber: '+91 65432 10987',
    time: '3:00 PM',
    date: '2024-01-15',
    status: 'pending',
    reason: 'Diabetes management',
    doctor: 'Dr. Verma',
    clinic: 'Shanti Clinic',
    address: 'Civil Lines, Nagpur',
    language: 'mr'
  }
];

const upcomingAppointments = [
    { id: 'APT001', name: 'Demo Patient', time: '10:30 AM', avatar: 'DP', reason: 'Follow-up' },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'confirmed':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100"><CheckCircle className="w-3 h-3 mr-1" />Confirmed</Badge>;
    case 'pending':
      return <Badge variant="secondary"><ClockIcon className="w-3 h-3 mr-1" />Pending</Badge>;
    case 'cancelled':
      return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" />Cancelled</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const getLanguageLabel = (language: string) => {
  switch (language) {
    case 'hi':
      return 'हिंदी';
    case 'mr':
      return 'मराठी';
    case 'en':
      return 'English';
    default:
      return language;
  }
};

export default function DoctorDashboard() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Today's Appointments" value="4" icon={Stethoscope} description="+2 from yesterday" />
        <StatCard title="WhatsApp Bookings" value="4" icon={MessageCircle} description="All confirmed" />
        <StatCard title="Total Assigned Patients" value="12" icon={Users} description="+3 this month"/>
        <StatCard title="Avg. Consultation Time" value="25 min" icon={Clock} />
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>WhatsApp Appointments</CardTitle>
                <CardDescription>Today's appointments booked via WhatsApp</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <MessageCircle className="w-4 h-4 mr-2" />
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {whatsappAppointments.map((apt) => (
              <div key={apt.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={`https://placehold.co/48x48.png?text=${apt.patientName.split(' ')[0][0]}`} alt={apt.patientName} />
                  <AvatarFallback>{apt.patientName.split(' ')[0][0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium leading-none truncate">{apt.patientName}</p>
                    {getStatusBadge(apt.status)}
                    <Badge variant="outline" className="text-xs">{getLanguageLabel(apt.language)}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {apt.time}
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {apt.phoneNumber}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {apt.clinic}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{apt.reason}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <Button size="sm" variant="outline">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Confirm
                  </Button>
                  <Button size="sm" variant="ghost">
                    <MessageCircle className="w-3 h-3 mr-1" />
                    Message
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/doctor/appointments">View All Appointments <ArrowUpRight className="ml-2 h-4 w-4"/></Link>
            </Button>
          </CardFooter>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Today's Schedule</CardTitle>
              <CardDescription>Your upcoming appointments for today.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              {upcomingAppointments.map((apt) => (
                  <div key={apt.id} className="flex items-center gap-4">
                      <Avatar className="h-11 w-11">
                          <AvatarImage src={`https://placehold.co/44x44.png?text=${apt.avatar}`} alt={apt.name} data-ai-hint="person portrait" />
                          <AvatarFallback>{apt.avatar}</AvatarFallback>
                      </Avatar>
                      <div className="grid gap-1">
                          <p className="text-sm font-medium leading-none">{apt.name}</p>
                          <p className="text-sm text-muted-foreground">{apt.time} - {apt.reason}</p>
                      </div>
                      <Button asChild variant="ghost" size="sm" className="ml-auto">
                          <Link href="#">View</Link>
                      </Button>
                  </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/doctor/appointments">View All Appointments <ArrowUpRight className="ml-2 h-4 w-4"/></Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks for today</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/doctor/availability">
                  <Calendar className="w-4 h-4 mr-2" />
                  Update Availability
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/doctor/patients">
                  <Users className="w-4 h-4 mr-2" />
                  View Patients
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/doctor/whatsapp">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp Dashboard
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}