"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useEffect, useState, useRef, useMemo } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { QrCode, Download, Copy as CopyIcon, Eye } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { useAuth } from '@/lib/auth-provider';
import { updatePatientProfile } from '@/lib/patient-profile';

export default function PatientProfilePage() {
  const { toast } = useToast();
  const { user, patientProfile, refreshPatientProfile } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  const isIncomplete = useMemo(() => {
    if (!profile) return true;
    const nameMissing = !profile.full_name || profile.full_name === 'Unknown';
    const ageMissing = !profile.age || Number.isNaN(Number(profile.age));
    const phoneMissing = !profile.contact_number;
    return nameMissing || ageMissing || phoneMissing;
  }, [profile]);

  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (patientProfile) {
      setProfile(patientProfile);
      const nameMissing = !patientProfile.full_name || patientProfile.full_name === 'Unknown';
      const ageMissing = !patientProfile.age || Number.isNaN(Number(patientProfile.age));
      const phoneMissing = !patientProfile.contact_number;
      setShowForm(!(nameMissing || ageMissing || phoneMissing) ? true : false);
    }
  }, [patientProfile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setProfile((prev: any) => ({ ...prev, [id]: value }));
  };

  const handleSaveChanges = async () => {
    if (!user || !profile) {
      toast({ variant: 'destructive', title: 'Error', description: 'Missing user or profile data' });
      return;
    }
    setSaving(true);
    try {
      const cleanProfile = Object.fromEntries(
        Object.entries(profile).filter(([_, value]) => value !== undefined && value !== null)
      );
      await updatePatientProfile(user.id, cleanProfile);
      await refreshPatientProfile();
      toast({ title: 'Profile Updated', description: 'Your personal information has been saved successfully.' });
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error updating profile', description: err.message || 'Unexpected error' });
    } finally {
      setSaving(false);
    }
  };

  if (!profile) {
    return (
      <div className="space-y-6">
        <div className="flex h-screen w-full items-center justify-center bg-background">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  const qrString = `Full Name: ${profile.full_name}\nAge: ${profile.age}\nGender: ${profile.gender}\nBlood Group: ${profile.blood_group}\nContact Number: ${profile.contact_number}\nEmail ID: ${profile.email}\nAddress: ${profile.address}\nPatient ID: ${profile.patient_id}`;

  return (
    <div className="space-y-6 animate-fade-in">
      {!showForm && isIncomplete && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle>Setup your HealthBridge profile</CardTitle>
            <CardDescription>Complete your basic details to continue using the app smoothly.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              Missing fields: {(!profile.full_name || profile.full_name === 'Unknown') ? 'Full name, ' : ''}
              {(!profile.age || Number.isNaN(Number(profile.age))) ? 'Age, ' : ''}
              {!profile.contact_number ? 'Phone' : ''}
            </div>
            <Button onClick={() => setShowForm(true)} size="sm">Setup your profile</Button>
          </CardContent>
        </Card>
      )}

      <Card className={showForm ? '' : 'opacity-50 pointer-events-none select-none'}>
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
          <CardDescription>Manage your personal information, address, and emergency contact details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
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
          </Card>

          <Dialog open={qrOpen} onOpenChange={setQrOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Your Health QR Code</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col items-center gap-4 p-4">
                <div ref={qrRef} className="bg-white p-4 rounded-lg">
                  <QRCodeCanvas value={qrString} size={200} level="M" includeMargin={true} />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const canvas = (qrRef.current?.querySelector('canvas')) as HTMLCanvasElement | null;
                      if (canvas) {
                        const url = canvas.toDataURL("image/png");
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = `patient-profile-qr.png`;
                        a.click();
                      }
                    }}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      await navigator.clipboard.writeText(qrString);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 1500);
                    }}
                  >
                    {copied ? (
                      <>
                        <CopyIcon className="h-4 w-4 mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <CopyIcon className="h-4 w-4 mr-2" />
                        Copy Data
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="font-medium">Personal Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input id="full_name" value={profile.full_name || ''} onChange={handleChange} placeholder="Enter your full name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input id="age" type="number" value={profile.age || ''} onChange={handleChange} placeholder="Enter your age" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Input id="gender" value={profile.gender || ''} onChange={handleChange} placeholder="Enter your gender" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="blood_group">Blood Group</Label>
                <Input id="blood_group" value={profile.blood_group || ''} onChange={handleChange} placeholder="e.g., O+, A-, B+" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_number">Phone Number</Label>
                <Input id="contact_number" value={profile.contact_number || ''} onChange={handleChange} placeholder="Enter your phone number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" value={profile.email || ''} onChange={handleChange} placeholder="Enter your email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" value={profile.address || ''} onChange={handleChange} placeholder="Enter your address" />
              </div>
              <Button onClick={handleSaveChanges} disabled={saving} className="w-full">
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}



