'use client';

import { LoginForm } from '@/components/auth/login-form';
import { HeartPulse } from 'lucide-react';
import {useTranslations} from 'next-intl';

export default function LoginPage() {
  const t = useTranslations('LoginPage');
  
  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2 bg-background">
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="mx-auto grid w-full max-w-md gap-8">
          <div className="grid gap-4 text-center">
            <div className="flex justify-center">
              <div className="bg-primary/10 p-3 rounded-full">
                <HeartPulse className="h-10 w-10 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-primary">{t('title')}</h1>
            <p className="text-balance text-muted-foreground">
              {t('subtitle')}
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
      <div 
        className="hidden bg-muted lg:block relative"
        style={{
          backgroundImage: 'url(/main-img.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      </div>
    </div>
  );
}
