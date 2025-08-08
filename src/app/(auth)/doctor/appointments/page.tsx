
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';

type AppointmentStatus = "Confirmed" | "Completed" | "Cancelled";

type Appointment = {
    id: string;
    patientName: string;
    patientAvatar: string;
    date: string;
    time: string;
    status: AppointmentStatus;
    reason: string;
};

const demoAppointments: Appointment[] = [
    { id: 'APT001', patientName: 'Demo Patient', patientAvatar: 'DP', date: '2024-08-15', time: '10:30 AM', status: 'Confirmed' as AppointmentStatus, reason: 'Follow-up consultation' },
];

const StatusBadge = ({ status }: { status: AppointmentStatus }) => {
    switch (status) {
        case 'Confirmed':
            return <Badge variant="success" className="gap-1.5 pl-2"><AlertCircle className="h-3 w-3" />{status}</Badge>;
        case 'Completed':
            return <Badge variant="default" className="gap-1.5 pl-2"><CheckCircle2 className="h-3 w-3" />{status}</Badge>;
        case 'Cancelled':
            return <Badge variant="destructive" className="gap-1.5 pl-2"><XCircle className="h-3 w-3" />{status}</Badge>;
        default:
            return <Badge variant="secondary">{status}</Badge>;
    }
}

export default function AppointmentsPage() {
    const [allAppointments, setAllAppointments] = useState<Appointment[]>([]);
    const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (isClient) {
            const userEmail = localStorage.getItem('userEmail');
            if (userEmail === 'doctor@example.com') {
                setAllAppointments(demoAppointments);
                setFilteredAppointments(demoAppointments);
            }
        }
    }, [isClient]);

    const filterAppointments = (status: string) => {
        if (status === 'all') {
            setFilteredAppointments(allAppointments);
        } else {
            setFilteredAppointments(allAppointments.filter(apt => apt.status.toLowerCase() === status));
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <Card>
                <CardHeader>
                    <CardTitle>Manage Appointments</CardTitle>
                    <CardDescription>View your schedule, patient details, and manage upcoming appointments.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="all" onValueChange={filterAppointments} className="space-y-4">
                        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
                            <TabsTrigger value="all">All Appointments</TabsTrigger>
                            <TabsTrigger value="confirmed">Upcoming</TabsTrigger>
                            <TabsTrigger value="completed">Completed</TabsTrigger>
                            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                        </TabsList>
                        <AppointmentTable appointments={filteredAppointments} />
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}

const AppointmentTable = ({ appointments }: { appointments: Appointment[] }) => (
    <ScrollArea className="w-full whitespace-nowrap rounded-md border">
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Reason for Visit</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {appointments.length > 0 ? (
                    appointments.map((apt) => (
                        <TableRow key={apt.id}>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-9 w-9">
                                        <AvatarImage src={`https://placehold.co/40x40.png?text=${apt.patientAvatar}`} alt={apt.patientName} data-ai-hint="person portrait" />
                                        <AvatarFallback>{apt.patientAvatar}</AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium">{apt.patientName}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="font-medium">{apt.date}</div>
                                <div className="text-sm text-muted-foreground">{apt.time}</div>
                            </TableCell>
                            <TableCell>{apt.reason}</TableCell>
                            <TableCell>
                                <StatusBadge status={apt.status} />
                            </TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <MoreVertical className="h-4 w-4" />
                                            <span className="sr-only">Actions</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem>View Patient Details</DropdownMenuItem>
                                        <DropdownMenuItem>Reschedule Appointment</DropdownMenuItem>
                                        <DropdownMenuItem className="text-destructive focus:text-destructive">Cancel Appointment</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                            No appointments found.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    </ScrollArea>
);
