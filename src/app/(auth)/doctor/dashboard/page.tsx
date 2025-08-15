"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  Stethoscope, 
  Clock, 
  FileText, 
  MessageCircle, 
  Calendar, 
  Bell, 
  Settings, 
  LogOut,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface Appointment {
  id: string;
  patientName: string;
  time: string;
  date: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  type: 'checkup' | 'followup' | 'consultation';
  avatar: string;
}

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
}

const DoctorDashboard = () => {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Mock data
  const stats = [
    { title: 'Today\'s Appointments', value: '8', icon: Stethoscope, change: '+2 from yesterday' },
    { title: 'Total Patients', value: '142', icon: Users, change: '+12 this month' },
    { title: 'Pending Tasks', value: '5', icon: FileText, change: '2 high priority' },
    { title: 'Avg. Wait Time', value: '15 min', icon: Clock, change: '2 min faster' }
  ];

  const upcomingAppointments: Appointment[] = [
    { id: '1', patientName: 'Rahul Sharma', time: '10:30 AM', date: '2024-01-15', status: 'scheduled', type: 'consultation', avatar: 'RS' },
    { id: '2', patientName: 'Priya Patel', time: '11:15 AM', date: '2024-01-15', status: 'scheduled', type: 'followup', avatar: 'PP' },
    { id: '3', patientName: 'Amit Kumar', time: '02:00 PM', date: '2024-01-15', status: 'scheduled', type: 'checkup', avatar: 'AK' }
  ];

  const notifications: Notification[] = [
    { id: '1', title: 'New Appointment', description: 'Rahul Sharma booked a consultation', time: '10 min ago', read: false },
    { id: '2', title: 'Lab Results', description: 'Blood test results are ready', time: '1 hour ago', read: true },
    { id: '3', title: 'Patient Message', description: 'Priya Patel sent you a message', time: '2 hours ago', read: true }
  ];

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { variant: string; label: string }> = {
      scheduled: { variant: 'bg-blue-100 text-blue-800', label: 'Scheduled' },
      completed: { variant: 'bg-green-100 text-green-800', label: 'Completed' },
      cancelled: { variant: 'bg-red-100 text-red-800', label: 'Cancelled' }
    };
    const { variant, label } = statusMap[status] || { variant: 'bg-gray-100', label: status };
    return <Badge className={variant}>{label}</Badge>;
  };

  const getTypeBadge = (type: string) => {
    const typeMap: Record<string, string> = {
      checkup: 'bg-purple-100 text-purple-800',
      followup: 'bg-amber-100 text-amber-800',
      consultation: 'bg-cyan-100 text-cyan-800'
    };
    return typeMap[type] || 'bg-gray-100';
  };

  return (
    <div className="flex h-screen bg-gray-50">

      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white border-b">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
                </Button>
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder-avatar.jpg" alt="Doctor" />
                  <AvatarFallback>DR</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
            {stats.map((stat, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.change}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Content Area */}
          <div className="grid gap-6 md:grid-cols-3">
            {/* Upcoming Appointments */}
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Upcoming Appointments</CardTitle>
                      <CardDescription>Your schedule for today</CardDescription>
                    </div>
                    <Button variant="outline" size="sm">View All</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingAppointments.map((appointment) => (
                      <div 
                        key={appointment.id} 
                        className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>{appointment.avatar}</AvatarFallback>
                        </Avatar>
                        <div className="ml-4 flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{appointment.patientName}</h4>
                            <span className="text-sm text-muted-foreground">{appointment.time}</span>
                          </div>
                          <div className="flex items-center mt-1 space-x-2">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${getTypeBadge(appointment.type)}`}>
                              {appointment.type}
                            </span>
                            {getStatusBadge(appointment.status)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Patients */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Patients</CardTitle>
                  <CardDescription>Recently added to your practice</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center p-3 rounded-lg hover:bg-gray-50">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback>P{i}</AvatarFallback>
                        </Avatar>
                        <div className="ml-4">
                          <p className="text-sm font-medium">Patient {i}</p>
                          <p className="text-xs text-muted-foreground">Last visit: {i} day{i > 1 ? 's' : ''} ago</p>
                        </div>
                        <Button variant="outline" size="sm" className="ml-auto">View</Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Notifications */}
              <Card>
                <CardHeader>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>Recent updates and alerts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {notifications.map((notification) => (
                      <div 
                        key={notification.id} 
                        className={cn(
                          "p-3 rounded-lg",
                          !notification.read && "bg-blue-50"
                        )}
                      >
                        <div className="flex items-start">
                          <div className="flex-shrink-0 pt-0.5">
                            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                          </div>
                          <div className="ml-3 flex-1">
                            <p className="text-sm font-medium">{notification.title}</p>
                            <p className="text-sm text-muted-foreground">{notification.description}</p>
                            <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <Calendar className="mr-2 h-4 w-4" />
                      New Appointment
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="mr-2 h-4 w-4" />
                      Write Prescription
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Message Patient
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DoctorDashboard;