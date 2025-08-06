import React from 'react';
import { notFound } from 'next/navigation';

// Simulated patient data source (replace with real API call later)
const mockPatients = [
  {
    patientId: 'PAT005',
    fullName: 'John Doe',
    age: 39,
    gender: 'Male',
    bloodGroup: 'O+',
    contactNumber: '123-456-7890',
    email: 'john.doe@example.com',
    address: '123 Main St, Springfield, USA',
  },
  // Add more mock patients as needed
];

async function getPatientData(patientId) {
  // Simulate async fetch (replace with real fetch in production)
  return mockPatients.find((p) => p.patientId === patientId) || null;
}

export default async function PatientSummaryPage({ params }) {
  const { patientId } = params;
  const patient = await getPatientData(patientId);

  if (!patient) return notFound();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-4 text-primary">Patient Summary</h1>
        <div className="space-y-2">
          <div><span className="font-semibold">Full Name:</span> {patient.fullName}</div>
          <div><span className="font-semibold">Age:</span> {patient.age}</div>
          <div><span className="font-semibold">Gender:</span> {patient.gender}</div>
          <div><span className="font-semibold">Blood Group:</span> {patient.bloodGroup}</div>
          <div><span className="font-semibold">Contact Number:</span> {patient.contactNumber}</div>
          <div><span className="font-semibold">Email:</span> {patient.email}</div>
          <div><span className="font-semibold">Address:</span> {patient.address}</div>
          <div><span className="font-semibold">Patient ID:</span> {patient.patientId}</div>
        </div>
      </div>
    </div>
  );
}