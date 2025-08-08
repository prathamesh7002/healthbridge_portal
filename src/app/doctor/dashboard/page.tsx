"use client";

import { useState, useEffect } from 'react';
import { StatCard } from '@/components/shared/stat-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Stethoscope, 
  Clock, 
  FileText, 
  ArrowUpRight, 
  Calendar,
  AlertTriangle,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Bar, BarChart as RechartsBarChart, CartesianGrid, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts";

// Chart data for patient trends
const patientTrendData = [
  { month: 'Jan', newPatients: 12, consultations: 45, followUps: 23 },
  { month: 'Feb', newPatients: 15, consultations: 52, followUps: 28 },
  { month: 'Mar', newPatients: 18, consultations: 48, followUps: 25 },
  { month: 'Apr', newPatients: 22, consultations: 61, followUps: 32 },
  { month: 'May', newPatients: 19, consultations: 55, followUps: 29 },
  { month: 'Jun', newPatients: 25, consultations: 68, followUps: 35 },
];

const chartConfig = {
  newPatients: {
    label: 'New Patients',
    color: 'hsl(var(--chart-1))',
  },
  consultations: {
    label: 'Consultations',
    color: 'hsl(var(--chart-2))',
  },
  followUps: {
    label: 'Follow-ups',
    color: 'hsl(var(--chart-3))',
  },
} satisfies ChartConfig;

// Patient distribution by age
const ageDistributionData = [
  { name: '18-30', value: 25, color: '#8884d8' },
  { name: '31-45', value: 35, color: '#82ca9d' },
  { name: '46-60', value: 28, color: '#ffc658' },
  { name: '60+', value: 12, color: '#ff7300' },
];

// Today's appointments
const todayAppointments = [
  { id: 'APT001', name: 'Sarah Johnson', time: '09:00 AM', type: 'Follow-up', status: 'confirmed', avatar: 'SJ', age: 34, lastVisit: '2 weeks ago' },
  { id: 'APT002', name: 'Michael Chen', time: '10:30 AM', type: 'New Patient', status: 'confirmed', avatar: 'MC', age: 28, lastVisit: 'First visit' },
  { id: 'APT003', name: 'Emma Davis', time: '02:00 PM', type: 'Consultation', status: 'pending', avatar: 'ED', age: 45, lastVisit: '1 month ago' },
  { id: 'APT004', name: 'Robert Wilson', time: '03:30 PM', type: 'Emergency', status: 'urgent', avatar: 'RW', age: 52, lastVisit: '3 days ago' },
];

// Medical alerts
const medicalAlerts = [
  { id: 1, type: 'critical', message: 'Patient Sarah Johnson - Blood pressure readings elevated', patient: 'Sarah Johnson' },
  { id: 2, type: 'warning', message: 'Patient Michael Chen - Medication due for review', patient: 'Michael Chen' },
  { id: 3, type: 'info', message: 'New lab results available for 3 patients', patient: 'Multiple' },
];

export default function DoctorDashboard() {
  const [isClient, setIsClient] = useState(false);
  const [stats, setStats] = useState({
    todayAppointments: 4,
    totalPatients: 156,
    avgConsultationTime: 25,
    pendingReports: 3,
    criticalAlerts: 1,
    monthlyGrowth: 12
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const userEmail = localStorage.getItem('userEmail');
      if (userEmail === 'doctor@example.com') {
        setStats({
          todayAppointments: 4,
          totalPatients: 156,
          avgConsultationTime: 25,
          pendingReports: 3,
          criticalAlerts: 1,
          monthlyGrowth: 12
        });
      }
    }
  }, [isClient]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge variant="success" className="text-xs">Confirmed</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="text-xs">Pending</Badge>;
      case 'urgent':
        return <Badge variant="destructive" className="text-xs">Urgent</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">{status}</Badge>;
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-warning" />;
      case 'info':
        return <FileText className="h-4 w-4 text-blue-500" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Today's Appointments" 
          value={stats.todayAppointments.toString()} 
          icon={Calendar} 
          description={`${stats.monthlyGrowth}% from last month`} 
        />
        <StatCard 
          title="Total Patients" 
          value={stats.totalPatients.toString()} 
          icon={Users} 
          description="Active patients" 
        />
        <StatCard 
          title="Avg. Consultation" 
          value={`${stats.avgConsultationTime} min`} 
          icon={Clock} 
          description="This month" 
        />
        <StatCard 
          title="Pending Reports" 
          value={stats.pendingReports.toString()} 
          icon={FileText} 
          description={`${stats.criticalAlerts} critical`} 
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Patient Trends Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Patient & Consultation Trends</CardTitle>
            <CardDescription>Monthly statistics for the last 6 months</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <RechartsBarChart data={patientTrendData} margin={{ top: 10, right: 10, bottom: 0, left: 10 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" fontSize={12} allowDecimals={false}/>
                <Tooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      indicator="dot"
                      labelClassName="font-medium"
                      className="rounded-lg border bg-card p-2 shadow-sm"
                    />
                  }
                />
                <Bar dataKey="newPatients" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="consultations" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="followUps" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
              </RechartsBarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Today's Schedule */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
            <CardDescription>Your upcoming appointments</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {todayAppointments.map((apt) => (
              <div key={apt.id} className="flex items-center gap-3 p-3 rounded-lg border">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={`https://placehold.co/40x40.png?text=${apt.avatar}`} alt={apt.name} />
                  <AvatarFallback>{apt.avatar}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{apt.name}</p>
                  <p className="text-xs text-muted-foreground">{apt.time} • {apt.type}</p>
                  <p className="text-xs text-muted-foreground">Age: {apt.age} • Last: {apt.lastVisit}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  {getStatusBadge(apt.status)}
                </div>
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/doctor/appointments">
                View All Appointments <ArrowUpRight className="ml-2 h-4 w-4"/>
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Patient Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Patient Age Distribution</CardTitle>
            <CardDescription>Current patient demographics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] w-full">
              <PieChart width={200} height={200}>
                <Pie
                  data={ageDistributionData}
                  cx={100}
                  cy={100}
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {ageDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {ageDistributionData.map((item) => (
                <div key={item.name} className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span>{item.name}: {item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Medical Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Medical Alerts</CardTitle>
          <CardDescription>Critical notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {medicalAlerts.map((alert) => (
            <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg border">
              {getAlertIcon(alert.type)}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{alert.patient}</p>
                <p className="text-xs text-muted-foreground">{alert.message}</p>
              </div>
            </div>
          ))}
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            View All Alerts
          </Button>
        </CardFooter>
      </Card>

    </div>
  );
}



