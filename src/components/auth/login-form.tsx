
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
  role: z.enum(['patient', 'doctor'], { required_error: 'You need to select a role.' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const demoUsers = {
    'patient@example.com': 'patient027',
    'doctor@example.com': 'doctor027',
};

export function LoginForm() {
  const router = useRouter();
  const locale = useLocale();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations('LoginForm');
  const tPage = useTranslations('LoginPage');
  const tToast = useTranslations('Toasts');

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    setIsLoading(true);

    setTimeout(() => {
      let isValid = false;
      const demoPassword = demoUsers[data.email as keyof typeof demoUsers];

      if (demoPassword && demoPassword === data.password) {
          isValid = true;
      } else if (!demoUsers.hasOwnProperty(data.email)) {
          isValid = true;
      }
      
      setIsLoading(false);

      if (isValid) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('userRole', data.role);
          localStorage.setItem('userEmail', data.email);
        }
        
        toast({
          title: tToast("loginSuccessTitle"),
          description: tToast("loginSuccessDescription"),
        });
        router.push(`/${locale}/${data.role}/dashboard`);
        router.refresh();
      } else {
         toast({
            variant: "destructive",
            title: tToast("invalidCredentialsTitle"),
            description: tToast("invalidCredentialsDescription"),
        });
      }
    }, 1500);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("emailLabel")}</FormLabel>
              <FormControl>
                <Input placeholder={t("emailPlaceholder")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
                <div className="flex items-center">
                    <FormLabel>{t("passwordLabel")}</FormLabel>
                    <Link href="#" className="ml-auto inline-block text-sm text-primary hover:underline">
                        {tPage("forgotPassword")}
                    </Link>
                </div>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("roleLabel")}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t("rolePlaceholder")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="patient">{t("patient")}</SelectItem>
                  <SelectItem value="doctor">{t("doctor")}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {tPage("login")}
        </Button>
        <div className="mt-4 text-center text-sm">
          {tPage("noAccount")}{' '}
          <Link href="/signup" className="underline text-primary">
            {tPage("signUp")}
          </Link>
        </div>
      </form>
    </Form>
  );
}
