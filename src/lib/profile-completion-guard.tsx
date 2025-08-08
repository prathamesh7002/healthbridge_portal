"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAuth } from './auth-provider';
import { getPatientProfile } from './patient-profile';

export function ProfileCompletionGuard({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();
  const [showDialog, setShowDialog] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    async function checkProfile() {
      if (!user) return setChecked(true);
      if (user.user_metadata?.role !== 'patient') return setChecked(true);
      try {
        const profile = await getPatientProfile(user.id);
        // Check for required fields
        if (!profile || !profile.full_name || !profile.age || !profile.contact_number) {
          setShowDialog(true);
        }
      } catch {
        setShowDialog(true);
      }
      setChecked(true);
    }
    checkProfile();
  }, [user]);

  const handleGoToProfile = () => {
    setShowDialog(false);
    router.push('/patient/profile');
  };

  if (!checked) return null;

  return <>
    {children}
    <Dialog open={showDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Profile Not Set Up</DialogTitle>
        </DialogHeader>
        <div className="py-2">To ensure proper working of the Health Bridge app, please set up your profile.</div>
        <DialogFooter>
          <Button onClick={handleGoToProfile}>Go to Profile</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </>;
}