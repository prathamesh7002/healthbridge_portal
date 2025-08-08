
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Upload, Mail, Phone, Award } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export default function DoctorProfilePage() {
  const { toast } = useToast();

  const handleSaveChanges = () => {
    toast({
      title: "Profile Updated",
      description: "Your professional information has been successfully saved.",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle>My Professional Profile</CardTitle>
          <CardDescription>Manage your public profile, credentials, and contact information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
            <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="flex flex-col items-center gap-4">
                    <Avatar className="h-28 w-28">
                        <AvatarImage src="https://placehold.co/112x112.png" alt="Dr. Ben Carter" data-ai-hint="doctor portrait"/>
                        <AvatarFallback>BC</AvatarFallback>
                    </Avatar>
                     <Button variant="outline" size="sm" className="gap-2">
                        <Upload className="h-4 w-4" />
                        Change Photo
                    </Button>
                </div>
                
                <div className="grid gap-2 flex-1">
                    <h2 className="text-2xl font-bold">Dr. Ben Carter</h2>
                    <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="text-sm gap-1.5"><Award className="h-3 w-3"/>Cardiology</Badge>
                        <Badge variant="success">Status: Active</Badge>
                    </div>
                    <div className="flex items-center gap-4 pt-2 text-muted-foreground">
                        <div className="flex items-center gap-2">
                             <Mail className="h-4 w-4" />
                            <span className="text-sm">ben.carter@health.com</span>
                        </div>
                         <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            <span className="text-sm">555-0101</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <Separator />

            <form onSubmit={(e) => { e.preventDefault(); handleSaveChanges(); }} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <h4 className="font-medium">Professional Information</h4>
                        <div className="space-y-2">
                            <Label htmlFor="full-name">Full Name</Label>
                            <Input id="full-name" defaultValue="Dr. Ben Carter" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="specialization">Specialization</Label>
                            <Input id="specialization" defaultValue="Cardiology" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="credentials">Credentials</Label>
                            <Input id="credentials" defaultValue="M.D., F.A.C.C." />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-medium">Biography</h4>
                        <div className="space-y-2">
                             <Label htmlFor="biography">Public Biography</Label>
                             <Textarea 
                                id="biography"
                                rows={6}
                                defaultValue="Dr. Ben Carter is a board-certified cardiologist with over 15 years of experience in treating a wide range of cardiovascular diseases. He is a fellow of the American College of Cardiology."
                                placeholder="Tell patients a little about yourself..."
                             />
                        </div>
                    </div>
                </div>
                 <div className="flex justify-end">
                    <Button type="submit">Save Changes</Button>
                </div>
            </form>
        </CardContent>
      </Card>
    </div>
  );
}
