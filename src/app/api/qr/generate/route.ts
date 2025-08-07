import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';

export interface QRCodeData {
  appointmentId: string;
  patientPhone: string;
  doctorId: string;
  slot: string;
  date: string;
  patientId?: string;
  recordAccess?: {
    bloodPressure: boolean;
    diabetes: boolean;
    prescriptions: boolean;
    labReports: boolean;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { data, size = 300, format = 'png' } = body;

    if (!data) {
      return NextResponse.json({ error: 'QR data is required' }, { status: 400 });
    }

    // Generate secure access token for the QR code
    const accessToken = generateSecureToken();
    
    // Create QR code data with access token
    const qrData = {
      ...data,
      accessToken,
      timestamp: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
    };

    // Generate QR code as data URL
    const qrCodeDataUrl = await QRCode.toDataURL(JSON.stringify(qrData), {
      width: size,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    // Store access token and data in temporary storage (in production, use Redis)
    // For demo purposes, we'll return the QR code directly
    
    return NextResponse.json({
      qrCode: qrCodeDataUrl,
      accessToken,
      expiresAt: qrData.expiresAt,
      data: qrData
    });

  } catch (error) {
    console.error('QR code generation error:', error);
    return NextResponse.json({ error: 'Failed to generate QR code' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json({ error: 'Access token required' }, { status: 400 });
  }

  try {
    // In production, retrieve data from Redis/database using the token
    // For demo, return sample patient data
    const patientData = {
      patientId: 'patient_123',
      name: 'सीता देवी / Sita Devi',
      age: 45,
      phone: '+91XXXXXXXXXX',
      medicalHistory: {
        bloodPressure: [
          { date: '2024-01-15', systolic: 140, diastolic: 90 },
          { date: '2024-01-10', systolic: 135, diastolic: 88 }
        ],
        diabetes: {
          lastHbA1c: 7.2,
          date: '2024-01-12',
          medication: 'Metformin 500mg'
        },
        prescriptions: [
          {
            date: '2024-01-15',
            doctor: 'Dr. Verma',
            medicines: [
              { name: 'Amlodipine 5mg', dosage: '1-0-0', duration: '30 days' },
              { name: 'Metformin 500mg', dosage: '1-0-1', duration: '30 days' }
            ]
          }
        ],
        labReports: [
          {
            date: '2024-01-12',
            type: 'Blood Sugar',
            results: { fasting: 126, postPrandial: 180 }
          }
        ]
      }
    };

    return NextResponse.json({
      success: true,
      patient: patientData,
      accessedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Patient data retrieval error:', error);
    return NextResponse.json({ error: 'Failed to retrieve patient data' }, { status: 500 });
  }
}

// Generate secure access token
function generateSecureToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
