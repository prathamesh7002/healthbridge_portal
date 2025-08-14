"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QrCode, CalendarPlus, FileText, Share2, X, Heart, Shield, Clock } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { QRCodeCanvas } from 'qrcode.react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

const patientId = "PAT005"; // Replace with real patient id if available
const qrString = `${process.env.NEXT_PUBLIC_BASE_URL || ''}/patient/summary/${patientId}`;

export default function PatientDashboard() {
  const router = useRouter();
  const [qrOpen, setQrOpen] = useState(false);
  const [qrKey, setQrKey] = useState(0); // To force QR re-generation

  const handleGenerateQR = () => {
    setQrKey(prev => prev + 1); // Change key to force new QR
    setQrOpen(true);
  };

  const handleCloseQR = () => {
    setQrOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section with Enhanced Welcome */}
      <div className="dashboard-header relative overflow-hidden bg-background border-b border-muted">
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-6">
            <Heart className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
            Welcome to Health Bridge
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Your comprehensive health companion. Seamlessly manage appointments, medical records, and health information sharing—all secured in one intelligent platform.
          </p>
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Shield className="h-5 w-5" />
              <span className="text-sm font-medium">HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-5 w-5" />
              <span className="text-sm font-medium">24/7 Access</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        {/* Feature Cards Grid */}
        <div className="quick-actions grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Book Appointment Card */}
          <Card className="group hover:shadow-xl transition-all duration-300 border shadow-lg bg-card">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <CalendarPlus className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-foreground">Book Appointment</CardTitle>
                  <div className="h-1 w-12 bg-primary rounded-full mt-1 opacity-30"></div>
                </div>
              </div>
              <CardDescription className="text-muted-foreground leading-relaxed">
                Schedule appointments with ease. Choose your preferred doctor, time slot, and receive instant confirmations with smart reminders.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="w-2 h-2 bg-primary rounded-full opacity-40"></div>
                  <span>Real-time availability checking</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="w-2 h-2 bg-primary rounded-full opacity-40"></div>
                  <span>Automated reminders and confirmations</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="w-2 h-2 bg-primary rounded-full opacity-40"></div>
                  <span>Centralized appointment management</span>
                </div>
              </div>
              <Button size="lg" className="w-full" onClick={() => router.push('/patient/appointments')}>
                Book Appointment
              </Button>
            </CardContent>
          </Card>

          {/* Update Report Card */}
          <Card className="group hover:shadow-xl transition-all duration-300 border shadow-lg bg-card">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-foreground">Update Medical Records</CardTitle>
                  <div className="h-1 w-12 bg-primary rounded-full mt-1 opacity-30"></div>
                </div>
              </div>
              <CardDescription className="text-muted-foreground leading-relaxed">
                Keep your medical information current for optimal care. Upload reports, prescriptions, and notes seamlessly.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="w-2 h-2 bg-primary rounded-full opacity-40"></div>
                  <span>Secure document upload and storage</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="w-2 h-2 bg-primary rounded-full opacity-40"></div>
                  <span>Complete medical history access</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="w-2 h-2 bg-primary rounded-full opacity-40"></div>
                  <span>Real-time care team synchronization</span>
                </div>
              </div>
              <Button size="lg" className="w-full" onClick={() => router.push('/patient/reports')}>
                Update Records
              </Button>
            </CardContent>
          </Card>

          {/* Share Report Card */}
          <Card className="group hover:shadow-xl transition-all duration-300 border shadow-lg bg-card">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Share2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-foreground">Share Health Reports</CardTitle>
                  <div className="h-1 w-12 bg-primary rounded-full mt-1 opacity-30"></div>
                </div>
              </div>
              <CardDescription className="text-muted-foreground leading-relaxed">
                Securely share your complete medical history with healthcare providers and family members with full control.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="w-2 h-2 bg-primary rounded-full opacity-40"></div>
                  <span>End-to-end encrypted sharing links</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="w-2 h-2 bg-primary rounded-full opacity-40"></div>
                  <span>Granular access control permissions</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="w-2 h-2 bg-primary rounded-full opacity-40"></div>
                  <span>Multi-format export capabilities</span>
                </div>
              </div>
              <Button size="lg" className="w-full" onClick={() => router.push('/patient/reports')}>
                Share Reports
              </Button>
            </CardContent>
          </Card>

          {/* Health Bridge QR Card */}
          <Card className="group hover:shadow-xl transition-all duration-300 border shadow-lg bg-card">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <QrCode className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-foreground">Health Bridge QR</CardTitle>
                  <div className="h-1 w-12 bg-primary rounded-full mt-1 opacity-30"></div>
                </div>
              </div>
              <CardDescription className="text-muted-foreground leading-relaxed">
                Generate secure, session-limited QR codes for instant health summary sharing with healthcare providers.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="w-2 h-2 bg-primary rounded-full opacity-40"></div>
                  <span>Instant clinic check-in and record access</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="w-2 h-2 bg-primary rounded-full opacity-40"></div>
                  <span>Privacy-first design—no paper trails</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="w-2 h-2 bg-primary rounded-full opacity-40"></div>
                  <span>Universal Health Bridge compatibility</span>
                </div>
              </div>
              <Button size="lg" className="w-full" onClick={handleGenerateQR}>
                Generate QR Code
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* QR Modal with Theme-Aware Styling */}
        <Dialog open={qrOpen} onOpenChange={open => { if (!open) handleCloseQR(); }}>
          <DialogContent className="flex flex-col items-center justify-center max-w-sm w-full relative bg-card text-foreground border border-muted shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold text-foreground mb-2 text-center">
                Your Health Bridge QR
              </DialogTitle>
            </DialogHeader>
            <div className="absolute top-4 right-4">
              <button
                onClick={handleCloseQR}
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Close"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="flex flex-col items-center pt-4 px-6 pb-6 text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl shadow-lg mb-4">
                <QrCode className="h-8 w-8 text-primary" />
              </div>
              <div className="p-4 bg-background rounded-2xl shadow my-4">
                <QRCodeCanvas key={qrKey} value={qrString} size={200} />
              </div>
              <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
                Present this QR code at your appointment for instant check-in and secure access to your health records.
                <span className="block text-xs text-muted-foreground mt-2 italic">
                  *Code expires when this window is closed for your security
                </span>
              </p>
            </div>
          </DialogContent>
        </Dialog>

        {/* Enhanced Footer */}
        <div className="mt-12">
          <Card className="appointments-card">
            <div className="rounded-2xl p-8 text-center border border-muted bg-card shadow-lg">
              <div className="flex justify-center items-center gap-2 mb-4">
                <Heart className="h-5 w-5 text-primary" />
                <span className="font-semibold text-foreground">Health Bridge</span>
              </div>
              <p className="text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                By using Health Bridge, you acknowledge our commitment to your privacy and security. 
                Your health data is encrypted end-to-end and shared only with your explicit consent. 
                Review our{' '}
                <Link 
                  href="/legal/terms"
                  className="text-primary underline hover:no-underline focus:outline-none"
                >
                  Terms & Conditions
                </Link>{' '}
                and{' '}
                <Link 
                  href="/legal/privacy"
                  className="text-primary underline hover:no-underline focus:outline-none"
                >
                  Privacy Policy
                </Link>{' '}
                for complete details.
              </p>
              <div className="flex justify-center items-center gap-6 mt-4 text-xs text-muted-foreground">
                <span>256-bit Encryption</span>
                <span>HIPAA Compliant</span>
                <span>SOC 2 Certified</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}