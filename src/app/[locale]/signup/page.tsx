import { SignupForm } from '@/components/auth/signup-form';
import Image from 'next/image';
import { HeartPulse } from 'lucide-react';
import {useTranslations} from 'next-intl';

export default function SignupPage() {
  const t = useTranslations('SignupPage');
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
