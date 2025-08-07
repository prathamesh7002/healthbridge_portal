'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { QrCode, Camera, X, CheckCircle, AlertCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface PatientData {
  patientId: string;
  name: string;
  age: number;
  phone: string;
  medicalHistory: {
    bloodPressure: Array<{ date: string; systolic: number; diastolic: number }>;
    diabetes: {
      lastHbA1c: number;
      date: string;
      medication: string;
    };
    prescriptions: Array<{
      date: string;
      doctor: string;
      medicines: Array<{
        name: string;
        dosage: string;
        duration: string;
      }>;
    }>;
    labReports: Array<{
      date: string;
      type: string;
      results: any;
    }>;
  };
}

interface QRScannerProps {
  onPatientDataReceived?: (data: PatientData) => void;
}

export function QRScanner({ onPatientDataReceived }: QRScannerProps) {
  const t = useTranslations('QRScanner');
  const [isScanning, setIsScanning] = useState(false);
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Start camera for QR scanning
  const startScanning = async () => {
    try {
      setError(null);
      setIsScanning(true);
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      setError('Camera access denied. Please allow camera permissions.');
      setIsScanning(false);
    }
  };

  // Stop camera
  const stopScanning = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  // Simulate QR code scanning (in production, use a QR code library like jsQR)
  const simulateQRScan = async () => {
    setIsLoading(true);
    try {
      // Simulate scanning delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate QR code data
      const mockQRData = {
        appointmentId: 'apt_1704621600000',
        patientPhone: '+919876543210',
        doctorId: 'dr_verma',
        slot: '11:00 AM',
        date: '2024-01-07',
        accessToken: 'abc123xyz789'
      };

      // Fetch patient data using the access token
      const response = await fetch(`/api/qr/generate?token=${mockQRData.accessToken}`);
      const result = await response.json();

      if (result.success) {
        setPatientData(result.patient);
        onPatientDataReceived?.(result.patient);
        stopScanning();
      } else {
        setError('Failed to retrieve patient data');
      }
    } catch (err) {
      setError('Error scanning QR code');
    } finally {
      setIsLoading(false);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

  if (patientData) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <CardTitle>Patient Record Retrieved</CardTitle>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPatientData(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Patient Info */}
            <div>
              <h3 className="font-semibold text-lg">{patientData.name}</h3>
              <p className="text-sm text-muted-foreground">
                Age: {patientData.age} | Phone: {patientData.phone}
              </p>
            </div>

            <Separator />

            {/* Blood Pressure History */}
            <div>
              <h4 className="font-medium mb-2">Blood Pressure History</h4>
              <div className="space-y-2">
                {patientData.medicalHistory.bloodPressure.map((bp, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                    <span className="text-sm">{bp.date}</span>
                    <Badge variant={bp.systolic > 140 ? "destructive" : "secondary"}>
                      {bp.systolic}/{bp.diastolic} mmHg
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Diabetes Info */}
            <div>
              <h4 className="font-medium mb-2">Diabetes Management</h4>
              <div className="p-3 bg-muted rounded">
                <p className="text-sm">
                  <strong>Last HbA1c:</strong> {patientData.medicalHistory.diabetes.lastHbA1c}% 
                  <span className="text-muted-foreground ml-2">({patientData.medicalHistory.diabetes.date})</span>
                </p>
                <p className="text-sm mt-1">
                  <strong>Current Medication:</strong> {patientData.medicalHistory.diabetes.medication}
                </p>
              </div>
            </div>

            <Separator />

            {/* Recent Prescriptions */}
            <div>
              <h4 className="font-medium mb-2">Recent Prescriptions</h4>
              {patientData.medicalHistory.prescriptions.map((prescription, index) => (
                <div key={index} className="p-3 bg-muted rounded mb-2">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{prescription.doctor}</span>
                    <span className="text-sm text-muted-foreground">{prescription.date}</span>
                  </div>
                  <div className="space-y-1">
                    {prescription.medicines.map((medicine, medIndex) => (
                      <div key={medIndex} className="text-sm">
                        <strong>{medicine.name}</strong> - {medicine.dosage} for {medicine.duration}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <Separator />

            {/* Lab Reports */}
            <div>
              <h4 className="font-medium mb-2">Recent Lab Reports</h4>
              {patientData.medicalHistory.labReports.map((report, index) => (
                <div key={index} className="p-3 bg-muted rounded mb-2">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{report.type}</span>
                    <span className="text-sm text-muted-foreground">{report.date}</span>
                  </div>
                  <div className="text-sm">
                    Fasting: {report.results.fasting} mg/dL | 
                    Post-meal: {report.results.postPrandial} mg/dL
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <QrCode className="h-5 w-5" />
          <span>Scan Patient QR Code</span>
        </CardTitle>
        <CardDescription>
          Scan the QR code from patient's WhatsApp to access their medical records
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="flex items-center space-x-2 p-3 bg-destructive/10 text-destructive rounded mb-4">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {!isScanning ? (
          <div className="text-center space-y-4">
            <div className="w-48 h-48 mx-auto bg-muted rounded-lg flex items-center justify-center">
              <Camera className="h-16 w-16 text-muted-foreground" />
            </div>
            <Button onClick={startScanning} className="w-full">
              <Camera className="h-4 w-4 mr-2" />
              Start Camera
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <video
                ref={videoRef}
                className="w-full h-64 bg-black rounded-lg object-cover"
                playsInline
                muted
              />
              <canvas ref={canvasRef} className="hidden" />
              
              {/* Scanning overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 border-2 border-white rounded-lg opacity-50"></div>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button 
                onClick={simulateQRScan} 
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? 'Scanning...' : 'Simulate QR Scan'}
              </Button>
              <Button variant="outline" onClick={stopScanning}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
