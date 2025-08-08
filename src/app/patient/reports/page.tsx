"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Upload, Download, Eye, FileText, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ScrollArea } from '@/components/ui/scroll-area';

type Report = {
    id: string;
    name: string;
    type: string;
    date: string;
    uploadedBy: string;
};

const demoReports: Report[] = [
  { id: 'REP001', name: 'Blood Test Results', type: 'Lab Report', date: '2024-07-15', uploadedBy: 'Dr. Demo' },
];

export default function ReportsPage() {
    const [reports, setReports] = useState<Report[]>([]);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => { setIsClient(true); }, []);
    useEffect(() => {
        if(isClient) {
            const userEmail = localStorage.getItem('userEmail');
            if (userEmail === 'patient@example.com') {
                setReports(demoReports);
            }
        }
    }, [isClient]);

  return (
    <div className="animate-fade-in">
        <Card>
            <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <CardTitle>My Lab Reports</CardTitle>
                    <CardDescription>Access and manage your medical reports and documents.</CardDescription>
                </div>
                <Button className="w-full md:w-auto">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload New Report
                </Button>
            </CardHeader>
            <CardContent>
                <ScrollArea className="w-full whitespace-nowrap rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Report Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Uploaded By</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {reports.length > 0 ? (
                                reports.map((report) => (
                                    <TableRow key={report.id}>
                                        <TableCell className="font-medium flex items-center gap-2">
                                            <FileText className="h-5 w-5 text-primary" />
                                            {report.name}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{report.type}</Badge>
                                        </TableCell>
                                        <TableCell>{report.date}</TableCell>
                                        <TableCell>{report.uploadedBy}</TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem>
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        View
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Download className="mr-2 h-4 w-4" />
                                                        Download
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        No reports found.
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




