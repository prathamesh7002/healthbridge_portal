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
      router.push(`/${userRole}/dashboard`);
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
      {/* Left side - Signup Form */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="mx-auto w-full max-w-md space-y-8">
          <div className="space-y-2 text-center">
            <div className="flex justify-center">
              <div className="bg-primary/10 p-3 rounded-full">
                <HeartPulse className="h-10 w-10 text-primary" />
              </div>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
            <p className="text-muted-foreground">
              {t('subtitle')}
            </p>
          </div>
          <SignupForm />
        </div>
      </div>
      
      {/* Right side - Image */}
      <div className="hidden bg-muted lg:block relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center bg-[#f8fafc]">
          <div className="relative w-full h-full">
            <img 
              src="/images/login-bg.png" 
              alt="Signup Background"
              className="w-full h-full object-contain"
              style={{
                objectFit: 'contain',
                maxWidth: '100%',
                maxHeight: '100%',
                width: 'auto',
                height: 'auto'
              }}
            />
            {/* Overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            
            {/* Welcome text */}
            <div className="absolute inset-0 flex items-end p-12">
              <div className="space-y-2">
                <HeartPulse className="h-12 w-12 text-primary" />
                <h2 className="text-3xl font-bold tracking-tight text-foreground">
                  {t('title')}
                </h2>
                <p className="text-muted-foreground">
                  {t('subtitle')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
