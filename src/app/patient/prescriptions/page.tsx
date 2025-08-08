"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Pill, Download, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from '@/components/ui/scroll-area';

type Prescription = {
    id: string;
    date: string;
    doctor: string;
    medication: string;
    dosage: string;
    status: string;
};

const demoPrescriptions: Prescription[] = [
    { id: 'PRES001', date: '2024-07-20', doctor: 'Dr. Demo', medication: 'Atorvastatin 20mg', dosage: '1 tablet daily', status: 'Active' },
    { id: 'PRES002', date: '2024-06-12', doctor: 'Dr. Demo', medication: 'Metformin 500mg', dosage: '2 tablets daily', status: 'Active' },
    { id: 'PRES003', date: '2024-05-21', doctor: 'Dr. Demo', medication: 'Lisinopril 10mg', dosage: '1 tablet daily', status: 'Expired' },
];

export default function PrescriptionsPage() {
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if(isClient) {
            const userEmail = localStorage.getItem('userEmail');
            if (userEmail === 'patient@example.com') {
                setPrescriptions(demoPrescriptions);
            }
        }
    }, [isClient]);

    return (
        <div className="animate-fade-in">
            <Card>
                <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <CardTitle>My Prescriptions</CardTitle>
                        <CardDescription>View your complete prescription history and details.</CardDescription>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                         <Button variant="outline" size="sm" className='flex-1 md:flex-none'>
                            <Filter className="mr-2 h-4 w-4" />
                            Filter
                        </Button>
                        <Button variant="outline" size="sm" className='flex-1 md:flex-none'>
                            <Download className="mr-2 h-4 w-4" />
                            Download All
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="w-full whitespace-nowrap rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Medication</TableHead>
                                    <TableHead>Dosage</TableHead>
                                    <TableHead>Prescribing Doctor</TableHead>
                                    <TableHead className="text-right">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {prescriptions.length > 0 ? (
                                    prescriptions.map((p) => (
                                        <TableRow key={p.id}>
                                            <TableCell>{p.date}</TableCell>
                                            <TableCell className="font-medium">{p.medication}</TableCell>
                                            <TableCell>{p.dosage}</TableCell>
                                            <TableCell>{p.doctor}</TableCell>
                                            <TableCell className="text-right">
                                                <Badge variant={p.status === 'Active' ? 'success' : 'secondary'}>
                                                    <Pill className="mr-1.5 h-3 w-3" />
                                                    {p.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center">
                                            No prescriptions found.
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

