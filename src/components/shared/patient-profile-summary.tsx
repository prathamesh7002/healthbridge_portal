"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/lib/auth-provider";
import { PatientProfile } from "@/lib/patient-profile";

interface PatientProfileSummaryProps {
  profile?: PatientProfile | null;
  showDetails?: boolean;
}

export function PatientProfileSummary({ profile, showDetails = false }: PatientProfileSummaryProps) {
  const { patientProfile } = useAuth();
  
  // Use provided profile or fall back to AuthProvider profile
  const displayProfile = profile || patientProfile;

  if (!displayProfile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Patient Profile</CardTitle>
          <CardDescription>Loading profile information...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarFallback>P</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <p className="text-sm font-medium">Loading...</p>
              <p className="text-xs text-muted-foreground">Please wait</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient Profile</CardTitle>
        <CardDescription>Your personal health information</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-start space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${displayProfile.full_name}`} />
            <AvatarFallback>{displayProfile.full_name?.charAt(0) || 'P'}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-3">
            <div>
              <h3 className="text-lg font-semibold">{displayProfile.full_name}</h3>
              <p className="text-sm text-muted-foreground">{displayProfile.email}</p>
              <div className="flex gap-2 mt-2">
                <Badge variant="secondary">ID: {displayProfile.patient_id}</Badge>
                <Badge variant="outline">Active</Badge>
              </div>
            </div>
            
            {showDetails && (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Age:</span> {displayProfile.age || 'Not specified'}
                </div>
                <div>
                  <span className="font-medium">Gender:</span> {displayProfile.gender || 'Not specified'}
                </div>
                <div>
                  <span className="font-medium">Blood Group:</span> {displayProfile.blood_group || 'Not specified'}
                </div>
                <div>
                  <span className="font-medium">Phone:</span> {displayProfile.contact_number || 'Not specified'}
                </div>
                {displayProfile.address && (
                  <div className="col-span-2">
                    <span className="font-medium">Address:</span> {displayProfile.address}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
