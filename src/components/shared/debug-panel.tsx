"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth-provider";
import { useState } from "react";

export function DebugPanel() {
  const { user, session, userRole, patientProfile, loading, refreshPatientProfile } = useAuth();
  const [showDetails, setShowDetails] = useState(false);

  if (!user) {
    return (
      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader>
          <CardTitle className="text-yellow-800">Debug: Not Authenticated</CardTitle>
          <CardDescription>No user is currently logged in</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="text-blue-800">Debug Panel</CardTitle>
        <CardDescription>Authentication and profile status</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">User ID:</span> {user.id}
          </div>
          <div>
            <span className="font-medium">Email:</span> {user.email}
          </div>
          <div>
            <span className="font-medium">Role:</span> 
            <Badge variant={userRole ? "default" : "secondary"} className="ml-2">
              {userRole || "Not set"}
            </Badge>
          </div>
          <div>
            <span className="font-medium">Loading:</span> 
            <Badge variant={loading ? "destructive" : "default"} className="ml-2">
              {loading ? "Yes" : "No"}
            </Badge>
          </div>
        </div>

        <div className="space-y-2">
          <span className="font-medium">Patient Profile:</span>
          {patientProfile ? (
            <div className="text-sm text-green-700">
              ✓ Profile loaded (ID: {patientProfile.patient_id})
            </div>
          ) : (
            <div className="text-sm text-red-700">
              ✗ No profile found
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? "Hide" : "Show"} Details
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={refreshPatientProfile}
          >
            Refresh Profile
          </Button>
        </div>

        {showDetails && (
          <div className="mt-4 p-3 bg-gray-100 rounded text-xs">
            <pre className="whitespace-pre-wrap">
              {JSON.stringify({ user, session, userRole, patientProfile }, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
