"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Download, Eye, FileText, FileSpreadsheet, Pill, Filter, Plus, Calendar, User } from "lucide-react";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { format } from 'date-fns';
import { UploadDialog } from "@/components/patient/upload-dialog";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type TimelineEvent = {
  id: string;
  title: string;
  type: 'report' | 'prescription';
  date: Date;
  uploadedBy: string;
  description: string;
  doctorNotes?: string;
  fileUrl?: string;
};

const demoEvents: TimelineEvent[] = [
  {
    id: 'EVT001',
    title: 'Blood Test - Complete Blood Count',
    type: 'report',
    date: new Date('2024-07-15'),
    uploadedBy: 'Dr. Sharma',
    description: 'Routine blood work including CBC, lipid profile, and glucose levels.',
    doctorNotes: 'Results within normal range. Monitor cholesterol levels in next checkup.',
    fileUrl: '/sample-report.pdf'
  },
  {
    id: 'EVT002',
    title: 'Prescription - Diabetes Management',
    type: 'prescription',
    date: new Date('2024-06-28'),
    uploadedBy: 'Dr. Patel',
    description: 'Metformin 500mg twice daily. Monitor blood sugar levels regularly.',
    doctorNotes: 'Follow up in 2 weeks. Maintain diet and exercise routine.',
    fileUrl: '/sample-prescription.pdf'
  },
  {
    id: 'EVT003',
    title: 'X-Ray - Chest PA View',
    type: 'report',
    date: new Date('2024-06-10'),
    uploadedBy: 'Dr. Kumar',
    description: 'Chest X-ray to check for any pulmonary abnormalities.',
    doctorNotes: 'No significant findings. Lungs clear.',
    fileUrl: '/sample-xray.pdf'
  },
];

function TimelineEventCard({ event, isEven }: { event: TimelineEvent, isEven: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="relative pl-8 sm:pl-0">
      {/* Timeline line */}
      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-border -ml-px" />
      
      {/* Dot */}
      <div className={cn(
        "absolute left-0 top-4 -ml-2.5 h-4 w-4 rounded-full border-4 border-background",
        event.type === 'report' ? 'bg-blue-500' : 'bg-green-500'
      )} />
      
      <div className={cn(
        "relative mb-8 flex flex-col sm:flex-row items-start gap-4",
        isEven ? 'sm:flex-row-reverse' : ''
      )}>
        <div className="w-full sm:w-1/2">
          <Card className="overflow-hidden transition-all hover:shadow-md">
            <CardHeader className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <CardTitle className="text-base font-medium line-clamp-1">
                    {event.title}
                  </CardTitle>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="mr-1 h-3.5 w-3.5" />
                    {format(event.date, 'MMM d, yyyy')}
                  </div>
                </div>
                <div className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
                  event.type === 'report' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400' : 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400'
                )}>
                  {event.type === 'report' ? (
                    <FileSpreadsheet className="h-3.5 w-3.5" />
                  ) : (
                    <Pill className="h-3.5 w-3.5" />
                  )}
                </div>
              </div>
              <CardDescription className="line-clamp-2 text-sm">
                {event.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-muted-foreground">
                  <User className="mr-1 h-3.5 w-3.5" />
                  {event.uploadedBy}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-1.5"
                  onClick={() => setIsOpen(true)}
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>View Details</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {event.type === 'report' ? (
                <FileSpreadsheet className="h-5 w-5 text-blue-500" />
              ) : (
                <Pill className="h-5 w-5 text-green-500" />
              )}
              {event.title}
            </DialogTitle>
            <DialogDescription className="flex items-center gap-4 pt-2">
              <div className="flex items-center text-sm">
                <Calendar className="mr-1 h-3.5 w-3.5" />
                {format(event.date, 'MMMM d, yyyy')}
              </div>
              <div className="flex items-center text-sm">
                <User className="mr-1 h-3.5 w-3.5" />
                {event.uploadedBy}
              </div>
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            <div className="space-y-2">
              <h4 className="font-medium">Doctor's Notes</h4>
              <div className="rounded-md bg-muted/50 p-4 text-sm">
                {event.doctorNotes || 'No additional notes provided.'}
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Document</h4>
              <div className="flex h-[400px] items-center justify-center rounded-md border border-dashed bg-muted/50">
                <div className="text-center">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    {event.fileUrl ? 'Document preview would be shown here' : 'No document attached'}
                  </p>
                  {event.fileUrl && (
                    <Button variant="outline" className="mt-4 gap-1.5">
                      <Download className="h-4 w-4" />
                      Download {event.type === 'report' ? 'Report' : 'Prescription'}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function ReportsPage() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [filter, setFilter] = useState<'all' | 'report' | 'prescription'>('all');
  const [isClient, setIsClient] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsClient(true);
      const userEmail = localStorage.getItem('userEmail');
      if (userEmail === 'patient@example.com') {
        setEvents(demoEvents);
      }
      setIsLoading(false);
    }, 800); // Simulate network delay

    return () => clearTimeout(timer);
  }, []);

  const filteredEvents = events.filter(event => 
    filter === 'all' || event.type === filter
  );

  const handleUploadSuccess = (newEvent: TimelineEvent) => {
    setEvents(prev => [newEvent, ...prev]);
    toast({
      title: 'Success',
      description: 'Your document has been uploaded successfully.',
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto p-4 md:p-6 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        <div className="space-y-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4">
              <div className="flex-1 space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
              </div>
              <Skeleton className="h-8 w-24" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="container mx-auto p-4 md:p-6 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Medical History</h1>
            <p className="text-muted-foreground">
              Your complete medical records and prescriptions in one place.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <Tabs 
              value={filter} 
              onValueChange={(value) => setFilter(value as 'all' | 'report' | 'prescription')}
              className="w-full sm:w-auto"
            >
              <TabsList className="h-auto p-1">
                <TabsTrigger value="all" className="px-3 py-1.5 text-xs sm:text-sm">
                  <Filter className="mr-1.5 h-3.5 w-3.5" />
                  All
                </TabsTrigger>
                <TabsTrigger value="report" className="px-3 py-1.5 text-xs sm:text-sm">
                  <FileSpreadsheet className="mr-1.5 h-3.5 w-3.5" />
                  <span className="hidden xs:inline">Reports</span>
                  <span className="xs:hidden">Rpts</span>
                </TabsTrigger>
                <TabsTrigger value="prescription" className="px-3 py-1.5 text-xs sm:text-sm">
                  <Pill className="mr-1.5 h-3.5 w-3.5" />
                  <span className="hidden xs:inline">Prescriptions</span>
                  <span className="xs:hidden">Rx</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <Button 
              onClick={() => setIsUploadDialogOpen(true)}
              className="gap-1.5 w-full sm:w-auto"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Upload New</span>
              <span className="sm:hidden">New</span>
            </Button>
          </div>
        </div>

        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-220px)] w-full">
              <div className="relative max-w-4xl mx-auto p-4 sm:p-6">
                {filteredEvents.length > 0 ? (
                  <div className="space-y-8">
                    {filteredEvents.map((event, index) => (
                      <TimelineEventCard 
                        key={event.id} 
                        event={event} 
                        isEven={index % 2 === 0} 
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <FileText className="h-16 w-16 text-muted-foreground/30 mb-4" />
                    <h3 className="text-lg font-medium text-muted-foreground">
                      No {filter === 'all' ? 'medical records' : filter === 'report' ? 'reports' : 'prescriptions'} found
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2 max-w-md">
                      {filter === 'all' 
                        ? 'You don\'t have any medical records yet. Upload your first document to get started.' 
                        : `You don't have any ${filter === 'report' ? 'reports' : 'prescriptions'} yet.`}
                    </p>
                    <Button 
                      onClick={() => setIsUploadDialogOpen(true)}
                      className="mt-6 gap-1.5"
                    >
                      <Upload className="h-4 w-4" />
                      Upload Your First Document
                    </Button>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Upload Dialog */}
        <UploadDialog 
          open={isUploadDialogOpen}
          onOpenChange={setIsUploadDialogOpen}
          onUploadSuccess={handleUploadSuccess}
        />
      </div>
    </div>
  );
}




