'use client';

import { SignupForm } from '@/components/auth/signup-form';
import Image from 'next/image';
import { HeartPulse, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/lib/auth-provider';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useEffect } from 'react';

export default function SignupPage() {
  const t = useTranslations('SignupPage');
  const { user, userRole, loading } = useAuth();
  const router = useRouter();
  const locale = useLocale();
  
  // Redirect authenticated users to their dashboard
  useEffect(() => {
    if (!loading && user && userRole) {
      router.push(`/${locale}/${userRole}/dashboard`);
    }
  }, [user, userRole, loading, router, locale]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Don't show signup form if user is already authenticated
  if (user && userRole) {
    return null;
  }

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2 bg-background">
      <div className="hidden bg-muted lg:block relative">
        <Image
          src="https://placehold.co/1080x1920.png"
          alt="A modern hospital hallway"
          data-ai-hint="hospital hallway"
          fill
          className="h-full w-full object-cover"
        />
         <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      </div>
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="mx-auto grid w-full max-w-md gap-8">
          <div className="grid gap-4 text-center">
            <div className="flex justify-center">
              <div className="bg-primary/10 p-3 rounded-full">
                <HeartPulse className="h-10 w-10 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl font-bold font-headline text-primary">{t('title')}</h1>
            <p className="text-balance text-muted-foreground">
             {t('subtitle')}
            </p>
          </div>
          <SignupForm />
        </div>
      </div>
    </div>
  );
}
