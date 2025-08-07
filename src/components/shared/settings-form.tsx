
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card"
import { Switch } from "../ui/switch"
import { useTheme } from "next-themes"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Moon, Sun } from "lucide-react"
import { useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { useTranslations } from "next-intl"
import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';

const profileFormSchema = z.object({
  fullName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email(),
  phone: z.string().optional(),
})

const notificationsFormSchema = z.object({
    communicationEmails: z.boolean().default(false).optional(),
    marketingEmails: z.boolean().default(false).optional(),
    securityEmails: z.boolean().default(true).optional(),
})

const appearanceFormSchema = z.object({
  theme: z.enum(["light", "dark", "system"], {
    required_error: "Please select a theme.",
  }),
  language: z.enum(["en", "hi", "mr"], {
      required_error: "Please select a language.",
  })
})

type ProfileFormValues = z.infer<typeof profileFormSchema>
type NotificationsFormValues = z.infer<typeof notificationsFormSchema>
type AppearanceFormValues = z.infer<typeof appearanceFormSchema>

const defaultProfileValues: Partial<ProfileFormValues> = {}

const defaultNotificationsValues: Partial<NotificationsFormValues> = {
    communicationEmails: true,
    marketingEmails: false,
    securityEmails: true,
}

interface SettingsFormProps {
    userRole: "doctor" | "patient";
}

export function SettingsForm({ userRole }: SettingsFormProps) {
  const t = useTranslations("SettingsForm");
  const { theme, setTheme } = useTheme()
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: defaultProfileValues,
    mode: "onChange",
  })

  const notificationsForm = useForm<NotificationsFormValues>({
      resolver: zodResolver(notificationsFormSchema),
      defaultValues: defaultNotificationsValues,
      mode: "onChange"
  });

  const appearanceForm = useForm<AppearanceFormValues>({
    resolver: zodResolver(appearanceFormSchema),
    defaultValues: { theme: "dark", language: locale as "en" | "hi" | "mr" },
    mode: "onChange",
  })

  useEffect(() => {
    if (theme) {
      appearanceForm.setValue("theme", theme as "light" | "dark" | "system");
    }
    if(locale) {
        appearanceForm.setValue("language", locale as "en" | "hi" | "mr");
    }
  }, [theme, locale, appearanceForm]);


  function onProfileSubmit(data: ProfileFormValues) {
    toast({
      title: t("profileUpdated"),
      description: t("profileUpdatedDesc"),
    })
  }

  function onNotificationsSubmit(data: NotificationsFormValues) {
    toast({
      title: t("notificationsUpdated"),
      description: t("notificationsUpdatedDesc"),
    })
  }

  function onAppearanceSubmit(data: AppearanceFormValues) {
    setTheme(data.theme);
    toast({
        title: t("themeUpdated"),
        description: t("themeUpdatedDesc", { theme: data.theme }),
    });

    if (data.language !== locale) {
        const newPath = pathname.replace(`/${locale}`, `/${data.language}`);
        router.replace(newPath);
        toast({
            title: t("languageUpdated"),
            description: t("languageUpdatedDesc", { language: data.language }),
        });
    }
  }

  return (
    <div className="space-y-8">
        <Card>
            <CardHeader>
                <CardTitle>{t("appearanceTitle")}</CardTitle>
                <CardDescription>{t("appearanceDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...appearanceForm}>
                    <form onChange={appearanceForm.handleSubmit(onAppearanceSubmit)} className="space-y-8">
                         <FormField
                            control={appearanceForm.control}
                            name="theme"
                            render={({ field }) => (
                                <FormItem className="space-y-1">
                                <FormLabel>{t("themeLabel")}</FormLabel>
                                <FormDescription>{t("themeDescription")}</FormDescription>
                                <FormMessage />
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    className="grid max-w-md grid-cols-1 pt-2 md:grid-cols-3 gap-8"
                                >
                                    <FormItem>
                                    <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                                        <FormControl>
                                        <RadioGroupItem value="light" className="sr-only" />
                                        </FormControl>
                                        <div className="items-center rounded-md border-2 border-muted p-1 hover:border-accent">
                                        <div className="space-y-2 rounded-sm bg-[#ecedef] p-2">
                                            <div className="space-y-2 rounded-md bg-white p-2 shadow-sm">
                                            <div className="h-2 w-[80px] rounded-lg bg-[#ecedef]" />
                                            <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                                            </div>
                                            <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                                            <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                                            <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                                            </div>
                                            <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                                            <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                                            <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                                            </div>
                                        </div>
                                        </div>
                                        <span className="block w-full p-2 text-center font-normal">
                                        {t("light")}
                                        </span>
                                    </FormLabel>
                                    </FormItem>
                                    <FormItem>
                                    <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                                        <FormControl>
                                        <RadioGroupItem value="dark" className="sr-only" />
                                        </FormControl>
                                        <div className="items-center rounded-md border-2 border-muted bg-popover p-1 hover:border-accent">
                                        <div className="space-y-2 rounded-sm bg-slate-950 p-2">
                                            <div className="space-y-2 rounded-md bg-slate-800 p-2 shadow-sm">
                                            <div className="h-2 w-[80px] rounded-lg bg-slate-400" />
                                            <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                                            </div>
                                            <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                                            <div className="h-4 w-4 rounded-full bg-slate-400" />
                                            <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                                            </div>
                                            <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                                            <div className="h-4 w-4 rounded-full bg-slate-400" />
                                            <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                                            </div>
                                        </div>
                                        </div>
                                        <span className="block w-full p-2 text-center font-normal">
                                        {t("dark")}
                                        </span>
                                    </FormLabel>
                                    </FormItem>
                                     <FormItem>
                                    <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                                        <FormControl>
                                        <RadioGroupItem value="system" className="sr-only" />
                                        </FormControl>
                                        <div className="items-center rounded-md border-2 border-muted p-1 hover:border-accent">
                                        <div className="flex justify-center items-center h-[116px] rounded-sm bg-background p-2">
                                            <div className="flex items-center gap-2">
                                                <Sun className="h-8 w-8 text-foreground" />
                                                <Moon className="h-8 w-8 text-foreground" />
                                            </div>
                                        </div>
                                        </div>
                                        <span className="block w-full p-2 text-center font-normal">
                                        {t("system")}
                                        </span>
                                    </FormLabel>
                                    </FormItem>
                                </RadioGroup>
                                </FormItem>
                            )}
                            />

                        <FormField
                            control={appearanceForm.control}
                            name="language"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>{t("languageLabel")}</FormLabel>
                                 <FormDescription>{t("languageDescription")}</FormDescription>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="w-[280px]">
                                            <SelectValue placeholder={t("languageLabel")} />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="en">{t("english")}</SelectItem>
                                        <SelectItem value="hi">{t("hindi")}</SelectItem>
                                        <SelectItem value="mr">{t("marathi")}</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>{t("profileTitle")}</CardTitle>
                <CardDescription>{t("profileDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...profileForm}>
                    <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-8">
                        <FormField
                        control={profileForm.control}
                        name="fullName"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>{t("fullNameLabel")}</FormLabel>
                            <FormControl>
                                <Input placeholder={t("fullNamePlaceholder")} {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={profileForm.control}
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
                        control={profileForm.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>{t("phoneLabel")}</FormLabel>
                            <FormControl>
                                <Input placeholder={t("phonePlaceholder")} {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <Button type="submit">{t("updateProfile")}</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
      
        <Card>
            <CardHeader>
                <CardTitle>{t("notificationsTitle")}</CardTitle>
                <CardDescription>{t("notificationsDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
                 <Form {...notificationsForm}>
                    <form onSubmit={notificationsForm.handleSubmit(onNotificationsSubmit)} className="space-y-8">
                        <FormField
                        control={notificationsForm.control}
                        name="communicationEmails"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">{t("communicationEmailsLabel")}</FormLabel>
                                <FormDescription>{t("communicationEmailsDescription")}</FormDescription>
                            </div>
                            <FormControl>
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            </FormItem>
                        )}
                        />
                         <FormField
                        control={notificationsForm.control}
                        name="marketingEmails"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">{t("marketingEmailsLabel")}</FormLabel>
                                <FormDescription>{t("marketingEmailsDescription")}</FormDescription>
                            </div>
                            <FormControl>
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            </FormItem>
                        )}
                        />
                         <FormField
                        control={notificationsForm.control}
                        name="securityEmails"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">{t("securityEmailsLabel")}</FormLabel>
                                <FormDescription>{t("securityEmailsDescription")}</FormDescription>
                            </div>
                            <FormControl>
                                <Switch checked={field.value} onCheckedChange={field.onChange} disabled aria-readonly/>
                            </FormControl>
                            </FormItem>
                        )}
                        />
                        <Button type="submit">{t("updateNotifications")}</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    </div>
  )
}
