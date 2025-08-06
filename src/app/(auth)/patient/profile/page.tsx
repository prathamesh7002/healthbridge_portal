
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { QrCode, Download, Copy as CopyIcon, Eye } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

export default function PatientProfilePage() {
  const { toast } = useToast();

  const handleSaveChanges = () => {
    toast({
      title: "Profile Updated",
      description: "Your personal information has been saved.",
    });
  };

  const handleUpdatePassword = () => {
    toast({
      title: "Password Updated",
      description: "Your password has been changed successfully.",
    });
  };

  // Mock patient data for QR code
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

  // State for QR modal
  const [qrOpen, setQrOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  // Prepare QR data as string
  const qrString = `Full Name: ${patientData.fullName}\nAge: ${patientData.age}\nGender: ${patientData.gender}\nBlood Group: ${patientData.bloodGroup}\nContact Number: ${patientData.contactNumber}\nEmail ID: ${patientData.email}\nAddress: ${patientData.address}\nPatient ID: ${patientData.patientId}`;

  // Download QR as PNG
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

  // Copy patient data as plain text
  const handleCopyData = async () => {
    await navigator.clipboard.writeText(qrString);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
          <CardDescription>Manage your personal information, address, and emergency contact details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* QR Code Card at the top */}
          <Card className="mb-6 border-primary/40 bg-primary/5 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center gap-4 p-4">
              <div className="bg-primary/10 rounded-full p-3">
                <QrCode className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-lg">Your Digital Health QR</CardTitle>
                <CardDescription className="text-xs">Share your profile securely with doctors or clinics.</CardDescription>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={() => setQrOpen(true)} aria-label="Show QR Code">
                    <Eye className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Show QR Code</TooltipContent>
              </Tooltip>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-2 p-4 pt-0">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="cursor-pointer rounded-lg border bg-background p-2 hover:shadow-md transition" onClick={() => setQrOpen(true)}>
                    <QRCodeCanvas value={qrString} size={80} includeMargin={false} style={{ filter: 'blur(2px)', opacity: 0.7 }} />
                  </div>
                </TooltipTrigger>
                <TooltipContent>Click to enlarge & download</TooltipContent>
              </Tooltip>
            </CardContent>
          </Card>
            <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                    <AvatarImage src="https://placehold.co/80x80.png" alt="Patient" data-ai-hint="person portrait"/>
                    <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="grid gap-1.5">
                    <h3 className="text-lg font-semibold">John Doe</h3>
                    <p className="text-sm text-muted-foreground">john.doe@example.com</p>
                    <div className="flex gap-2">
                        <Badge variant="secondary">Patient ID: PAT005</Badge>
                        <Badge variant="success">Status: Active</Badge>
                    </div>
                </div>
                <Button variant="outline" size="sm" className="ml-auto">Change Photo</Button>
            </div>
            
            <Separator />

            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <h4 className="font-medium">Personal Information</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="first-name">First Name</Label>
                            <Input id="first-name" defaultValue="John" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="last-name">Last Name</Label>
                            <Input id="last-name" defaultValue="Doe" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" defaultValue="john.doe@example.com" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" type="tel" defaultValue="123-456-7890" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="dob">Date of Birth</Label>
                        <Input id="dob" type="date" defaultValue="1985-05-20" />
                    </div>
                    <Button onClick={handleSaveChanges}>Save Changes</Button>
                </div>

                <div className="space-y-4">
                    <h4 className="font-medium">Emergency Contact</h4>
                    <div className="space-y-2">
                        <Label htmlFor="emergency-name">Contact Name</Label>
                        <Input id="emergency-name" defaultValue="Jane Doe" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="emergency-relationship">Relationship</Label>
                        <Input id="emergency-relationship" defaultValue="Spouse" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="emergency-phone">Contact Phone</Label>
                        <Input id="emergency-phone" type="tel" defaultValue="098-765-4321" />
                    </div>
                     <h4 className="font-medium pt-4">Change Password</h4>
                     <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input id="new-password" type="password" />
                    </div>
                    <Button onClick={handleUpdatePassword}>Update Password</Button>
                </div>
            </div>
        </CardContent>
      </Card>
      {/* QR Code Modal */}
      <Dialog open={qrOpen} onOpenChange={setQrOpen}>
        <DialogContent className="max-w-xs mx-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><QrCode className="h-5 w-5 text-primary" /> Patient Profile QR</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4" ref={qrRef}>
            <QRCodeCanvas value={qrString} size={200} includeMargin={true} />
            <div className="w-full bg-muted rounded p-2 text-xs break-words">
              <pre className="whitespace-pre-wrap">{qrString}</pre>
            </div>
          </div>
          <DialogFooter className="flex gap-2 justify-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={handleCopyData} aria-label="Copy Data">
                  <CopyIcon className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{copied ? "Copied!" : "Copy Data"}</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={handleDownloadQR} aria-label="Download QR">
                  <Download className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Download QR</TooltipContent>
            </Tooltip>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
