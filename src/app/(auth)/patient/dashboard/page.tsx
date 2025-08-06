
"use client";

import { useState, useEffect, useRef } from 'react';
import { StatCard } from '@/components/shared/stat-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, CalendarClock, Pill, FilePlus, PlusCircle, QrCode, Download, Copy as CopyIcon, Eye } from 'lucide-react';
import Link from 'next/link';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { QRCodeCanvas } from "qrcode.react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

const demoAppointments = [
    { id: 1, doctor: 'Dr. Demo', specialization: 'Cardiologist', date: '2024-08-15', time: '10:30 AM', status: 'Confirmed' },
];

const demoPrescriptions = [
    { id: 1, doctor: 'Dr. Demo', date: '2024-07-20', details: 'Atorvastatin 20mg' },
];

const patientData = {
  fullName: "John Doe",
  age: 39,
  gender: "Male",
  bloodGroup: "O+",
  contactNumber: "123-456-7890",
  email: "john.doe@example.com",
  address: "123 Main St, Springfield, USA",
  patientId: "PAT005",
};
const qrString = `Full Name: ${patientData.fullName}\nAge: ${patientData.age}\nGender: ${patientData.gender}\nBlood Group: ${patientData.bloodGroup}\nContact Number: ${patientData.contactNumber}\nEmail ID: ${patientData.email}\nAddress: ${patientData.address}\nPatient ID: ${patientData.patientId}`;
const [qrOpen, setQrOpen] = useState(false);
const [copied, setCopied] = useState(false);
const qrRef = useRef<HTMLDivElement>(null);
const handleDownloadQR = () => {
  const canvas = (qrRef.current?.querySelector('canvas')) as HTMLCanvasElement | null;
  if (canvas) {
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `patient-profile-qr.png`;
    a.click();
  }
};
const handleCopyData = async () => {
  await navigator.clipboard.writeText(qrString);
  setCopied(true);
  setTimeout(() => setCopied(false), 1500);
};

export default function PatientDashboard() {
    const [upcomingAppointments, setUpcomingAppointments] = useState<typeof demoAppointments>([]);
    const [recentPrescriptions, setRecentPrescriptions] = useState<typeof demoPrescriptions>([]);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);
    
    useEffect(() => {
        if (isClient) {
            const userEmail = localStorage.getItem('userEmail');
            if (userEmail === 'patient@example.com') {
                setUpcomingAppointments(demoAppointments);
                setRecentPrescriptions(demoPrescriptions);
            }
        }
    }, [isClient]);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Upcoming Appointments" value={upcomingAppointments.length.toString()} icon={CalendarClock} description={upcomingAppointments.length > 0 ? "Next one in 3 days" : ""} />
        <StatCard title="Total Prescriptions" value={recentPrescriptions.length.toString()} icon={Pill} />
        <StatCard title="Lab Reports" value="1" icon={FilePlus} />
        <Card className="flex flex-col justify-center items-center p-6 bg-primary/10 border-primary/20 border-dashed hover:border-primary/50 transition-colors">
            <CardTitle className="text-primary/90 text-center mb-4 text-base font-semibold">Ready for your next check-up?</CardTitle>
            <Button asChild className="shadow-lg hover:shadow-primary/30 transition-shadow">
                <Link href="/patient/appointments"><PlusCircle className="mr-2 h-4 w-4" />Book Appointment</Link>
            </Button>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-5">
        <Card className="md:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Upcoming Appointments</CardTitle>
            <Button asChild size="sm" variant="ghost">
                <Link href="/patient/appointments">View All <ArrowUpRight className="h-4 w-4" /></Link>
            </Button>
          </CardHeader>
          <CardContent>
            <ScrollArea className="w-full whitespace-nowrap rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingAppointments.length > 0 ? (
                      upcomingAppointments.map((apt) => (
                      <TableRow key={apt.id}>
                          <TableCell>
                          <div className="font-medium">{apt.doctor}</div>
                          <div className="text-sm text-muted-foreground">{apt.specialization}</div>
                          </TableCell>
                          <TableCell>{apt.date} at {apt.time}</TableCell>
                          <TableCell className="text-right">
                              <Badge variant="success">{apt.status}</Badge>
                          </TableCell>
                      </TableRow>
                      ))
                  ) : (
                      <TableRow>
                          <TableCell colSpan={3} className="h-24 text-center">
                              No upcoming appointments.
                          </TableCell>
                      </TableRow>
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Prescriptions</CardTitle>
             <Button asChild size="sm" variant="ghost">
                <Link href="/patient/prescriptions">View All <ArrowUpRight className="h-4 w-4" /></Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
                {recentPrescriptions.length > 0 ? (
                    recentPrescriptions.map((p) => (
                        <div key={p.id} className="flex items-start gap-4">
                            <div className="bg-primary/10 p-3 rounded-full">
                                <Pill className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium">{p.details}</p>
                                <p className="text-sm text-muted-foreground">Prescribed by {p.doctor} on {p.date}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-muted-foreground py-10">
                        No recent prescriptions.
                    </div>
                )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
