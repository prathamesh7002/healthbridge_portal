'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Upload, X, FileText, Pill, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

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
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

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

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    formData.append('title', title);
    formData.append('description', description);

    try {
      setIsUploading(true);
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload file');
      }

      toast({
        title: 'Success',
        description: 'File uploaded successfully',
      });

      // Call the success callback with the uploaded file info
      onUploadSuccess({
        id: `EVT${Date.now()}`,
        title: data.title || title,
        type: data.type || type,
        date: new Date(),
        uploadedBy: 'You',
        description: data.description || description,
        fileUrl: data.url,
      });

      // Reset form and close dialog
      setFile(null);
      setTitle('');
      setDescription('');
      onOpenChange(false);
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to upload file',
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
            <Button type="submit" disabled={!file || !title || isUploading}>
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
