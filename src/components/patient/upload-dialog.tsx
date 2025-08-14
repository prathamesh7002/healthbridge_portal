'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Upload, X, FileText, Pill, Loader2, Calendar } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabaseClient";

type UploadType = 'report' | 'prescription';

interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadSuccess: (file: any) => void;
}

export function UploadDialog({ open, onOpenChange, onUploadSuccess }: UploadDialogProps) {
  const [type, setType] = useState<UploadType>('report');
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [prescriptionDate, setPrescriptionDate] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  // Supabase configuration (from index.html)
  const BUCKET_NAME = "health-bridge";

  // Check if bucket exists (adapted from index.html, but without creation due to RLS)
  const checkBucketExists = async () => {
    try {
      const { data: buckets, error } = await supabase.storage.listBuckets();
      if (error) {
        console.error("Error listing buckets:", error);
        // If we can't list buckets, assume it exists and try upload anyway
        return true;
      }
      
      const exists = buckets?.some(b => b.name === BUCKET_NAME);
      if (exists) {
        console.log(`Bucket "${BUCKET_NAME}" exists.`);
        return true;
      } else {
        console.warn(`Bucket "${BUCKET_NAME}" does not exist. Please create it manually in Supabase dashboard.`);
        // Still return true to attempt upload - the upload will fail with a clearer error
        return true;
      }
    } catch (error) {
      console.error("Error checking bucket exists:", error);
      // Assume bucket exists and let upload handle the error
      return true;
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      // Set default title if not already set
      if (!title) {
        setTitle(e.target.files[0].name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast({
        title: 'Error',
        description: 'Please select a file to upload',
        variant: 'destructive',
      });
      return;
    }

    if (!title.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a title for this file',
        variant: 'destructive',
      });
      return;
    }

    if (type === 'prescription' && !prescriptionDate) {
      toast({
        title: 'Error',
        description: 'Please enter the prescription date',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsUploading(true);
      
      // Check if bucket exists (from index.html logic)
      await checkBucketExists();

      // Upload file using the same logic as index.html
      const filePath = `${type}s/${Date.now()}-${file.name}`;
      
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file);

      if (error) {
        // Provide more specific error handling for bucket-related issues
        if (error.message.includes('bucket') || error.message.includes('Bucket')) {
          throw new Error(`Storage bucket "${BUCKET_NAME}" not found. Please create it in your Supabase dashboard with the following settings:\n- Name: ${BUCKET_NAME}\n- Public: Yes\n- Allowed file types: Images and PDFs\n- File size limit: 6MB`);
        }
        throw new Error(`Upload error: ${error.message}`);
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(filePath);

      toast({
        title: 'Success',
        description: `Uploaded: ${data.path}`,
      });

      // Call the success callback with the uploaded file info
      onUploadSuccess({
        id: `EVT${Date.now()}`,
        title: title,
        type: type,
        date: type === 'prescription' && prescriptionDate ? new Date(prescriptionDate) : new Date(),
        uploadedBy: 'You',
        description: description,
        fileUrl: publicUrlData.publicUrl,
        prescriptionDate: type === 'prescription' ? prescriptionDate : undefined,
      });

      // Reset form and close dialog
      setFile(null);
      setTitle('');
      setDescription('');
      setPrescriptionDate('');
      onOpenChange(false);
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to upload file to Supabase',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload Medical Document</DialogTitle>
          <DialogDescription>
            Upload your medical reports or prescriptions for easy access and sharing with healthcare providers.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Document Type</Label>
            <Tabs 
              value={type} 
              onValueChange={(value) => setType(value as UploadType)}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="report" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>Report</span>
                </TabsTrigger>
                <TabsTrigger value="prescription" className="flex items-center gap-2">
                  <Pill className="h-4 w-4" />
                  <span>Prescription</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">
              {file ? 'Change File' : 'Select File'}
              <span className="text-destructive ml-1">*</span>
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="file"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="file"
                className="flex-1 flex items-center justify-between px-4 py-2 border rounded-md cursor-pointer hover:bg-accent/50 transition-colors"
              >
                <span className="truncate max-w-[300px]">
                  {file ? file.name : 'No file selected'}
                </span>
                <Upload className="h-4 w-4 text-muted-foreground" />
              </label>
              {file && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setFile(null)}
                  className="shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Supported formats: PDF, JPG, PNG (max 5MB)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">
              Title<span className="text-destructive ml-1">*</span>
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="E.g., Blood Test Results - July 2024"
              required
            />
          </div>

          {type === 'prescription' && (
            <div className="space-y-2">
              <Label htmlFor="prescriptionDate">
                Prescription Date<span className="text-destructive ml-1">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="prescriptionDate"
                  type="date"
                  value={prescriptionDate}
                  onChange={(e) => setPrescriptionDate(e.target.value)}
                  required={type === 'prescription'}
                  className="pl-10"
                />
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground">
                Enter the date when this prescription was issued
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add any notes or details about this document..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!file || !title || (type === 'prescription' && !prescriptionDate) || isUploading}>
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Document
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
