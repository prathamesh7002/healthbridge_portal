"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, FileText, MessageCircle, UserPlus, Search } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

type Patient = {
    id: string;
    name: string;
    avatar: string;
    lastVisit: string;
    status: string;
    nextAppointment: string;
};

const demoPatient: Patient = { id: 'PAT001', name: 'Demo Patient', avatar: 'DP', lastVisit: '2024-07-28', status: 'Stable', nextAppointment: '2024-08-20' };

const StatusBadge = ({ status }: { status: string }) => {
    let variant: "default" | "secondary" | "destructive" | "outline" | "success" = 'secondary';
    if (status === 'Stable') variant = 'success';
    if (status === 'At Risk') variant = 'destructive';
    if (status === 'Follow-up') variant = 'default';
    return <Badge variant={variant}>{status}</Badge>;
}

export default function PatientsPage() {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if(isClient) {
            const userEmail = localStorage.getItem('userEmail');
            if (userEmail === 'doctor@example.com') {
                setPatients([demoPatient]);
            }
        }
    }, [isClient]);

    return (
        <div className="animate-fade-in space-y-6">
            <Card>
                <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <CardTitle>My Patients</CardTitle>
                        <CardDescription>Access patient records, history, and manage their care plan.</CardDescription>
                    </div>
                     <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search patients..." className="pl-8 w-full" />
                        </div>
                        <Button className="gap-2">
                            <UserPlus className="h-4 w-4" /> Add Patient
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="w-full whitespace-nowrap rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Patient</TableHead>
                                    <TableHead>Last Visit</TableHead>
                                    <TableHead>Next Appointment</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {patients.length > 0 ? (
                                    patients.map((patient) => (
                                        <TableRow key={patient.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar>
                                                        <AvatarImage src={`https://placehold.co/40x40.png?text=${patient.avatar}`}  data-ai-hint="person portrait"/>
                                                        <AvatarFallback>{patient.avatar}</AvatarFallback>
                                                    </Avatar>
                                                    <span className="font-medium">{patient.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>{patient.lastVisit}</TableCell>
                                            <TableCell>{patient.nextAppointment}</TableCell>
                                            <TableCell>
                                                <StatusBadge status={patient.status} />
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button aria-haspopup="true" size="icon" variant="ghost">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                            <span className="sr-only">Toggle menu</span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem>
                                                            <FileText className="mr-2 h-4 w-4" />
                                                            View Full Record
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            <MessageCircle className="mr-2 h-4 w-4" />
                                                            Send Message
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="text-destructive focus:text-destructive">
                                                            Discharge Patient
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center">
                                            No patients found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    );
}

export { default } from "@/app/[locale]/(auth)/doctor/patients/page";


