
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

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

  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
          <CardDescription>Manage your personal information, address, and emergency contact details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
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
    </div>
  );
}
