"use client";

import { useState, useTransition, useEffect, startTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { format } from 'date-fns';
import { z } from 'zod';
import Image from 'next/image';
import { 
  Calendar, 
  Download, 
  Eye, 
  FileSpreadsheet, 
  FileText as FileTextIcon, 
  Filter, 
  FileText,
  HelpCircle,
  Loader2, 
  Pill,
  Plus, 
  Search, 
  Upload, 
  User, 
  X 
} from 'lucide-react';
import { toast, useToast } from '@/components/ui/use-toast';

// UI Components
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from "@/lib/utils";

// Custom components
import { ReportsLoading } from './components/loading';
import { PageHelp } from './components/page-help';
import { UploadDialog } from './components/upload-dialog';

// Type definitions
type TimelineEventType = 'report' | 'prescription';

interface TimelineEvent {
  id: string;
  title: string;
  type: TimelineEventType;
  date: Date;
  uploadedBy: string;
  description: string;
  doctorNotes?: string;
  fileUrl?: string;
}

// Form validation schema and type definitions
const filterSchema = z.object({
  type: z.enum(['all', 'report', 'prescription']).default('all'),
  search: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional()
});

type FilterValues = z.infer<typeof filterSchema>;

interface TimelineEventCardProps {
  event: TimelineEvent;
  onView: (event: TimelineEvent) => void;
  isEven?: boolean;
}

const TimelineEventCard = ({ event, onView, isEven = false }: TimelineEventCardProps) => {
  // State for dialog and loading
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Safely access event properties with fallbacks
  const fileUrl = event?.fileUrl || '';
  const isImage = !!fileUrl && /\.(jpeg|jpg|gif|png)$/i.test(fileUrl);
  const isPDF = !!fileUrl && fileUrl.toLowerCase().endsWith('.pdf');

  const handleViewDocument = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!fileUrl) return;
    
    if (isPDF || !isImage) {
      window.open(fileUrl, '_blank');
    } else if (isImage) {
      setIsViewerOpen(true);
    }
  };

  const handleDownload = () => {
    if (!fileUrl) return;
    
    setIsLoading(true);
    fetch(fileUrl)
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${event?.title?.replace(/\s+/g, '_') || 'document'}_${format(new Date(), 'yyyy-MM-dd')}${isPDF ? '.pdf' : isImage ? '.jpg' : ''}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      })
      .catch(error => {
        toast({ 
          title: 'Error', 
          description: 'Failed to download the file. Please try again.', 
          variant: 'destructive' 
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="relative pl-8 sm:pl-0 group">
      {/* Timeline line */}
      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-border -ml-px" />
      {/* Date on the timeline */}
      <div className={`
        absolute left-0 -translate-x-1/2 text-xs font-medium text-muted-foreground whitespace-nowrap
        ${isEven ? 'sm:left-1/2 sm:translate-x-0 sm:right-0 sm:left-auto' : ''}
      `}>
        {format(event.date, 'MMM d, yyyy')}
      </div>
      {/* Dot */}
      <div className={`
        absolute left-0 top-6 -ml-2 h-4 w-4 rounded-full border-4 border-background z-10
        ${event.type === 'report' ? 'bg-blue-500' : 'bg-green-500'}
        group-hover:scale-125 transition-transform duration-200
      `} />
      <div className={`
        relative mb-12 flex flex-col sm:flex-row items-start gap-4
        ${isEven ? 'sm:flex-row-reverse' : ''}
      `}>
        <div className={`
          w-full sm:w-[calc(50%-2rem)] mt-6
          ${isEven ? 'sm:mr-8' : 'sm:ml-8'}
        `}>
          <Card 
            className="overflow-hidden transition-all hover:shadow-md hover:border-primary/20 cursor-pointer"
            onClick={() => setIsDialogOpen(true)}
          >
            <CardHeader className="p-4 pb-2">
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <CardTitle className="text-base font-medium line-clamp-1">
                    {event.title}
                  </CardTitle>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <User className="mr-1.5 h-3.5 w-3.5" />
                    {event.uploadedBy}
                  </div>
                </div>
                <div className={`flex h-6 w-6 items-center justify-center rounded-full ${
                  event.type === 'report' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                }`}>
                  {event.type === 'report' ? (
                    <FileSpreadsheet className="h-3.5 w-3.5" />
                  ) : (
                    <FileTextIcon className="h-3.5 w-3.5" />
                  )}
                </div>
              </div>
              <CardDescription className="line-clamp-2 text-sm mt-2">
                {event.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="mr-1.5 h-3.5 w-3.5" />
                  {format(event.date, 'h:mm a')}
                </div>
                <div className="flex gap-2">
                  {event.fileUrl && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 px-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDocument(e);
                      }}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 px-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload();
                    }}
                    disabled={isLoading || !event.fileUrl}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4 mr-1" />
                    )}
                    Download
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      {/* Document Viewer Dialog */}
      <Dialog open={isViewerOpen} onOpenChange={setIsViewerOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{event.title}</DialogTitle>
            <DialogDescription>
              {format(event.date, 'PPP')} • {event.type}
            </DialogDescription>
          </DialogHeader>
          <div className="relative h-[70vh] w-full">
            {isImage && event.fileUrl && (
              <Image
                src={event.fileUrl}
                alt={event.title}
                fill
                className="object-contain"
              />
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewerOpen(false)}>
              Close
            </Button>
            <Button onClick={handleDownload} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Event Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${
                event.type === 'report' ? 'bg-blue-500' : 'bg-green-500'
              }`} />
              <DialogTitle className="capitalize">
                {event.type}: {event.title}
              </DialogTitle>
            </div>
            <DialogDescription>
              Added on {format(event.date, 'PPPp')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Description</h4>
              <p className="text-sm">{event.description}</p>
            </div>
            {event.doctorNotes && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Doctor's Notes</h4>
                <p className="text-sm">{event.doctorNotes}</p>
              </div>
            )}
            {event.fileUrl && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Document</h4>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewDocument(e);
                    }}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Document
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload();
                    }}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4 mr-2" />
                    )}
                    Download
                  </Button>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Sample image URLs for testing
const sampleImageUrl = 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80';
const samplePdfUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';

// Sample data for demo
const demoEvents: TimelineEvent[] = [
  {
    id: 'EVT001',
    title: 'X-Ray - Chest PA View',
    type: 'report' as const,
    date: new Date('2024-07-15T10:30:00'),
    uploadedBy: 'Dr. Sharma',
    description: 'Chest X-ray PA view showing clear lung fields and normal cardiac silhouette.',
    doctorNotes: 'No active disease detected. Lungs are clear. Heart size is normal.',
    fileUrl: sampleImageUrl
  },
  {
    id: 'EVT002',
    title: 'Prescription - Diabetes Management',
    type: 'prescription' as const,
    date: new Date('2024-07-10T14:15:00'),
    uploadedBy: 'Dr. Patel',
    description: 'Metformin 500mg twice daily. Monitor blood sugar levels regularly.',
    doctorNotes: 'Patient to monitor fasting and post-prandial blood sugar levels. Follow up in 2 weeks.',
    fileUrl: samplePdfUrl
  },
  {
    id: 'EVT003',
    title: 'Blood Test - Complete Blood Count',
    type: 'report' as const,
    date: new Date('2024-06-28T09:45:00'),
    uploadedBy: 'Dr. Gupta',
    description: 'Complete blood count with differential and platelet count.',
    doctorNotes: 'Mild anemia detected. Advised to increase iron-rich foods in diet.',
    fileUrl: samplePdfUrl
  },
  {
    id: 'EVT004',
    title: 'MRI Scan - Lumbar Spine',
    type: 'report' as const,
    date: new Date('2024-06-15T11:20:00'),
    uploadedBy: 'Dr. Sharma',
    description: 'MRI of lumbar spine showing mild disc bulge at L4-L5.',
    doctorNotes: 'Mild disc bulge at L4-L5 without neural compression. Recommended physical therapy.',
    fileUrl: sampleImageUrl
  },
  {
    id: 'EVT005',
    title: 'Prescription - Hypertension',
    type: 'prescription' as const,
    date: new Date('2024-06-01T16:30:00'),
    uploadedBy: 'Dr. Reddy',
    description: 'Amlodipine 5mg once daily. Monitor blood pressure twice weekly.',
    doctorNotes: 'Blood pressure slightly elevated. Start on low dose calcium channel blocker.',
    fileUrl: samplePdfUrl
  }
];

export default function ReportsPage() {
  // State management
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'report' | 'prescription'>('all');
  const [events, setEvents] = useState<TimelineEvent[]>(demoEvents);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  
  // Derived state
  const isImage = selectedEvent?.fileUrl?.match(/\.(jpeg|jpg|gif|png)$/i) !== null;
  const isPDF = selectedEvent?.fileUrl?.toLowerCase().endsWith('.pdf');
  
  // Event handlers
  const handleViewEvent = (event: TimelineEvent) => {
    setSelectedEvent(event);
    setIsDialogOpen(true);
  };
  
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedEvent(null);
  };
  
  const handleUploadSuccess = () => {
    // TODO: Implement actual data fetching
    setEvents(demoEvents);
    setIsUploadDialogOpen(false);
  };
  
  // Form setup
  const form = useForm<FilterValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      type: 'all',
      search: '',
      dateFrom: '',
      dateTo: ''
    }
  });
  
  // Filter events based on tab selection and form values
  const filteredEvents = events.filter(event => {
    // Filter by active tab
    if (activeTab !== 'all' && event.type !== activeTab) {
      return false;
    }
    
    const values = form.getValues();
    
    // Filter by search term
    if (values.search && !event.title.toLowerCase().includes(values.search.toLowerCase())) {
      return false;
    }
    
    // Filter by date range
    if (values.dateFrom && new Date(event.date) < new Date(values.dateFrom)) {
      return false;
    }
    
    if (values.dateTo && new Date(event.date) > new Date(values.dateTo)) {
      return false;
    }
    
    return true;
  });

  // Simulate API call with loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      startTransition(() => {
        setEvents(demoEvents);
        setIsLoading(false);
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Handle form submission
  const onSubmit = (data: FilterValues) => {
    // In a real app, this would trigger an API call
    console.log('Filtering with:', data);
    setIsFilterOpen(false);
    
    toast({
      title: 'Filters applied',
      description: 'Your filters have been applied successfully.',
    });
  };
  
  // Reset filters
  const resetFilters = () => {
    form.reset();
    toast({
      title: 'Filters cleared',
      description: 'All filters have been reset.',
    });
  };

  return (
    <div className="animate-fade-in">
      <div className="container mx-auto py-8 px-4">
        {/* If PageHelp is not a valid component, replace with a div */}
        {/* <PageHelp>
          View and manage your medical reports and prescriptions in one place. You can filter, search, and download your documents.
        </PageHelp> */}
        <div className="mb-4 text-muted-foreground">
          View and manage your medical reports and prescriptions in one place. You can filter, search, and download your documents.
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-3xl font-bold tracking-tight">Medical Records</h1>
            <p className="text-muted-foreground">View and manage your health documents</p>
          </motion.div>
          
          <motion.div 
            className="flex gap-2 w-full md:w-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="gap-2 transition-all duration-200 hover:bg-accent/80"
            >
              <Filter className="h-4 w-4" />
              Filters
              {Object.values(form.watch()).some(Boolean) && (
                <span className="h-2 w-2 rounded-full bg-primary"></span>
              )}
            </Button>
            <UploadDialog onSuccess={handleUploadSuccess}>
              <Button 
                className="gap-2 transition-all duration-200 hover:bg-primary/90"
              >
                <Upload className="h-4 w-4" />
                Upload
              </Button>
            </UploadDialog>
          </motion.div>
        </div>

        <AnimatePresence>
          {isFilterOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-6"
            >
              <Card className="p-4">
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label htmlFor="type" className="text-sm font-medium mb-2 block">Document Type</label>
                      <select 
                        id="type"
                        className="w-full p-2 border rounded-md"
                        {...form.register('type')}
                      >
                        <option value="all">All Documents</option>
                        <option value="report">Reports</option>
                        <option value="prescription">Prescriptions</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="search" className="text-sm font-medium mb-2 block">Search</label>
                      <input 
                        id="search"
                        type="text" 
                        placeholder="Search documents..." 
                        className="w-full p-2 border rounded-md"
                        {...form.register('search')}
                      />
                    </div>
                    <div>
                      <label htmlFor="dateFrom" className="text-sm font-medium mb-2 block">From Date</label>
                      <input 
                        id="dateFrom"
                        type="date" 
                        className="w-full p-2 border rounded-md"
                        {...form.register('dateFrom')}
                      />
                    </div>
                    <div>
                      <label htmlFor="dateTo" className="text-sm font-medium mb-2 block">To Date</label>
                      <input 
                        id="dateTo"
                        type="date" 
                        className="w-full p-2 border rounded-md"
                        {...form.register('dateTo')}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={resetFilters}
                      disabled={!Object.values(form.watch()).some(Boolean)}
                    >
                      Reset
                    </Button>
                    <Button type="submit" size="sm">
                      Apply Filters
                    </Button>
                  </div>
                </form>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <Tabs
          value={activeTab}
          // Cast value to correct type for Tabs
          onValueChange={v => setActiveTab(v as 'all' | 'report' | 'prescription')}
          className="mb-6"
        >
          <TabsList>
            <TabsTrigger 
              value="all"
              className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-colors"
            >
              All Documents
              {activeTab === 'all' && filteredEvents.length > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary">
                  {filteredEvents.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger 
              value="report"
              className="data-[state=active]:bg-blue-500/10 data-[state=active]:text-blue-600 transition-colors"
            >
              Reports
              {activeTab === 'report' && filteredEvents.filter(e => e.type === 'report').length > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-blue-500/10 text-blue-600">
                  {filteredEvents.filter(e => e.type === 'report').length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger 
              value="prescription"
              className="data-[state=active]:bg-green-500/10 data-[state=active]:text-green-600 transition-colors"
            >
              Prescriptions
              {activeTab === 'prescription' && filteredEvents.filter(e => e.type === 'prescription').length > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-green-500/10 text-green-600">
                  {filteredEvents.filter(e => e.type === 'prescription').length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-220px)] w-full">
              {isLoading || isPending ? (
                <ReportsLoading />
              ) : (
                <AnimatePresence mode="wait">
                  {filteredEvents.length === 0 ? (
                    <motion.div 
                      className="text-center py-12"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">No documents found</h3>
                      <p className="text-muted-foreground mt-1">
                        {activeTab === 'all' 
                          ? 'You don\'t have any medical records yet. Upload your first document to get started.' 
                          : `You don't have any ${activeTab === 'report' ? 'reports' : 'prescriptions'} yet.`}
                      </p>
                      <Button 
                        onClick={() => setIsUploadDialogOpen(true)}
                        className="mt-4 gap-2"
                        variant="outline"
                      >
                        <Upload className="h-4 w-4" />
                        Upload Your First Document
                      </Button>
                    </motion.div>
                  ) : (
                    <div className="space-y-8">
                      {filteredEvents
                        .filter(event => activeTab === 'all' || event.type === activeTab)
                        .map((event, index) => (
                          <motion.div
                            key={event.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            whileHover={{ scale: 1.01 }}
                          >
                            <TimelineEventCard 
                              event={event} 
                              isEven={index % 2 === 0} 
                              onView={handleViewEvent}
                            />
                          </motion.div>
                        ))}
                    </div>
                  )}
                </AnimatePresence>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
