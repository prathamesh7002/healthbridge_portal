
"use client"
import { StatCard } from '@/components/shared/stat-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Stethoscope, Clock, FileText, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic'
import { type ChartConfig } from "@/components/ui/chart"

const ChartContainer = dynamic(() => import('@/components/ui/chart').then(m => m.ChartContainer), { ssr: false })
const ChartTooltip = dynamic(() => import('@/components/ui/chart').then(m => m.ChartTooltip), { ssr: false })
const ChartTooltipContent = dynamic(() => import('@/components/ui/chart').then(m => m.ChartTooltipContent), { ssr: false })

const RechartsBarChart = dynamic(() => import('recharts').then(m => m.BarChart), { ssr: false })
const CartesianGrid = dynamic(() => import('recharts').then(m => m.CartesianGrid), { ssr: false })
const XAxis = dynamic(() => import('recharts').then(m => m.XAxis), { ssr: false })
const YAxis = dynamic(() => import('recharts').then(m => m.YAxis), { ssr: false })
const Tooltip = dynamic(() => import('recharts').then(m => m.Tooltip), { ssr: false })
const Bar = dynamic(() => import('recharts').then(m => m.Bar), { ssr: false })

const chartData = [
  { month: 'Jan', patients: 0, appointments: 0 },
  { month: 'Feb', patients: 0, appointments: 0 },
  { month: 'Mar', patients: 0, appointments: 0 },
  { month: 'Apr', patients: 0, appointments: 0 },
  { month: 'May', patients: 0, appointments: 0 },
  { month: 'Jun', patients: 1, appointments: 1 },
];

const chartConfig = {
  patients: {
    label: 'New Patients',
    color: 'hsl(var(--chart-1))',
  },
  appointments: {
    label: 'Appointments',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

const upcomingAppointments = [
    { id: 'APT001', name: 'Demo Patient', time: '10:30 AM', avatar: 'DP', reason: 'Follow-up' },
];

export default function DoctorDashboard() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Today's Appointments" value="1" icon={Stethoscope} description="+1 from yesterday" />
        <StatCard title="Total Assigned Patients" value="1" icon={Users} description="+1 this month"/>
        <StatCard title="Avg. Consultation Time" value="25 min" icon={Clock} />
        <StatCard title="Pending Reports" value="0" icon={FileText} description="All caught up" />
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Patient & Appointment Trends</CardTitle>
            <CardDescription>Monthly summary for the last 6 months.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <RechartsBarChart accessibilityLayer data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: 10 }}>
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
                <Bar dataKey="patients" fill="var(--color-patients)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="appointments" fill="var(--color-appointments)" radius={[4, 4, 0, 0]} />
              </RechartsBarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
            <CardDescription>Your upcoming appointments for today.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
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
      </div>
    </div>
  );
}
