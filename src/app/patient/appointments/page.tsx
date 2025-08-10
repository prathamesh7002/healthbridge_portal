"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Clock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

const appointmentSchema = z.object({
  specialization: z.string({ required_error: 'Please select a specialization.' }),
  doctor: z.string({ required_error: 'Please select a doctor.' }),
  date: z.date({ required_error: 'Please select a date.' }),
  time: z.string({ required_error: 'Please select a time slot.' }),
  reason: z.string().min(10, 'Please provide a brief reason (at least 10 characters).').optional(),
});

type AppointmentFormValues = z.infer<typeof appointmentSchema>;

import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { HeartPulse, Stethoscope, Bone, Baby, Info } from 'lucide-react';

const specializationIcons: Record<string, React.ReactNode> = {
  cardiology: <HeartPulse className="h-4 w-4 text-red-500" />,
  dermatology: <Stethoscope className="h-4 w-4 text-green-500" />,
  orthopedics: <Bone className="h-4 w-4 text-blue-500" />,
  pediatrics: <Baby className="h-4 w-4 text-yellow-500" />,
};

const specializations = [
  { id: 'cardiology', name: 'Cardiology' },
  { id: 'dermatology', name: 'Dermatology' },
  { id: 'orthopedics', name: 'Orthopedics' },
  { id: 'pediatrics', name: 'Pediatrics' },
];

const doctors = {
  cardiology: [{ id: 'DOC001', name: 'Dr. Ben Carter' }],
  dermatology: [{ id: 'DOC002', name: 'Dr. Evelyn Reed' }],
  orthopedics: [{ id: 'DOC003', name: 'Dr. Marcus Thorne' }],
  pediatrics: [{ id: 'DOC004', name: 'Dr. Liam Chen' }],
};

const availableTimes = ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'];

export default function BookAppointmentPage() {
  const { toast } = useToast();
  const [selectedSpec, setSelectedSpec] = useState<keyof typeof doctors | null>(null);
  const [waConsent, setWaConsent] = useState(false);
  const [waModalOpen, setWaModalOpen] = useState(false);

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
  });

  const onSubmit = (data: AppointmentFormValues) => {
    toast({
      title: 'Appointment Booked!',
      description: `Your appointment with ${data.doctor} on ${data.date.toLocaleDateString()} at ${data.time} has been successfully scheduled.`,
    });
    form.reset();
    setSelectedSpec(null);
  };

  const handleWaStart = () => {
    window.open('https://wa.me/', '_blank', 'noopener,noreferrer');
    setWaModalOpen(false);
    setWaConsent(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in">
      {/* WhatsApp Booking Section */}
      <Card className="mb-12 border bg-card shadow-md">
        <div className="flex flex-col md:flex-row items-center gap-8 p-6">
          {/* Details Left */}
          <div className="flex-1 w-full">
            <CardTitle className="text-2xl font-bold mb-2 text-foreground flex items-center gap-2">
              <Image src="/whatsapp.jpg" alt="WhatsApp" width={32} height={32} className="rounded-full border border-muted" />
              Book via WhatsApp
            </CardTitle>
            <CardDescription className="mb-4 text-base text-muted-foreground">
              Prefer chatting? Book your appointment directly through WhatsApp for a seamless, conversational experience. Our assistant will guide you step-by-step and confirm your slot instantly.
            </CardDescription>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground text-sm mb-4">
              <li>24/7 WhatsApp support for appointment booking</li>
              <li>Receive reminders and updates directly in WhatsApp</li>
              <li>Easy, secure, and private</li>
            </ul>
            <Button
              size="lg"
              className="mt-2 w-full md:w-auto"
              onClick={() => setWaModalOpen(true)}
            >
              Book via WhatsApp
            </Button>
          </div>
          {/* Image Right */}
          <div className="flex-1 w-full flex justify-center">
            <Image
              src="/whatsapp.jpg"
              alt="Book appointment via WhatsApp"
              width={220}
              height={220}
              className="rounded-xl shadow object-cover max-w-xs w-full h-auto border border-muted"
              style={{ maxWidth: '220px', height: 'auto' }}
              priority
              quality={90}
            />
          </div>
        </div>
      </Card>
      <Separator className="my-10" />

      {/* WhatsApp Consent Modal */}
      <Dialog open={waModalOpen} onOpenChange={setWaModalOpen}>
        <DialogContent className="max-w-md w-full bg-card text-foreground border border-muted shadow-2xl flex flex-col items-center">
          <DialogTitle className="text-lg font-semibold mb-2">WhatsApp Appointment Consent</DialogTitle>
          <p className="text-muted-foreground text-sm mb-4 text-center">
            To book appointments via WhatsApp, you must agree to our <Link href="/terms" className="underline text-primary hover:text-primary/80" target="_blank">Terms & Conditions</Link> and consent to receive messages and notifications on WhatsApp.
          </p>
          <div className="flex items-center gap-2 mb-4">
            <input
              id="wa-modal-consent"
              type="checkbox"
              checked={waConsent}
              onChange={e => setWaConsent(e.target.checked)}
              className="accent-primary w-4 h-4 rounded border-muted focus:ring-2 focus:ring-primary"
            />
            <label htmlFor="wa-modal-consent" className="text-sm text-muted-foreground select-none">
              I agree to the Terms & Conditions for WhatsApp appointment booking.
            </label>
          </div>
          <Button
            size="lg"
            className="w-full"
            disabled={!waConsent}
            onClick={handleWaStart}
          >
            Get Started
          </Button>
        </DialogContent>
      </Dialog>

      {/* Regular Appointment Form */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-blue-50/80 to-white rounded-t-lg border-b border-muted p-8 flex flex-col gap-2">
          <CardTitle className="text-2xl font-bold text-blue-900 flex items-center gap-2">
            <Stethoscope className="h-6 w-6 text-blue-400" />
            Appointment Details
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground font-medium">
            Find a doctor and schedule your next visit in a few simple steps.
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="py-8 px-2 md:px-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
              <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <FormField
                    control={form.control}
                    name="specialization"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Specialization</FormLabel>
                        <Select onValueChange={(value: keyof typeof doctors) => {
                          field.onChange(value);
                          setSelectedSpec(value);
                          form.setValue('doctor', '');
                        }} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a medical specialization" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {specializations.map(spec => (
                              <SelectItem key={spec.id} value={spec.id}>
                                <span className="flex items-center gap-2">
                                  {specializationIcons[spec.id]}
                                  {spec.name}
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="doctor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Doctor</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!selectedSpec}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a doctor" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {selectedSpec && doctors[selectedSpec].map(doc => (
                              <SelectItem key={doc.id} value={doc.name}>
                                <span className="flex items-center gap-3">
                                  <Avatar className="h-7 w-7">
                                    <AvatarFallback>{doc.name.split(' ').map(n => n[0]).join('').slice(0,2)}</AvatarFallback>
                                  </Avatar>
                                  <span>{doc.name}</span>
                                  <Badge variant="secondary" className="ml-2">{specializations.find(s => s.id === selectedSpec)?.name}</Badge>
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="reason"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reason for Visit (Optional)</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Briefly describe the reason for your appointment..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Appointment Date</FormLabel>
                        <FormControl>
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))}
                            initialFocus
                            className="rounded-md border self-center"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Available Time Slots</FormLabel>
                    <FormControl>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {availableTimes.map(time => (
                          <Button key={time} type="button" variant={field.value === time ? "default" : "outline"} onClick={() => field.onChange(time)}>
                            <Clock className="mr-2 h-4 w-4" />
                            {time}
                          </Button>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage className="pt-2" />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CardContent>
        <Separator />
        <div className="sticky bottom-0 left-0 w-full bg-card rounded-b-lg z-10 p-4 flex flex-col md:flex-row md:justify-end gap-3 border-t border-muted shadow-inner">
          <span className="text-xs text-muted-foreground md:mr-auto md:mt-2">Ready to book? Click below to confirm your appointment details.</span>
          <Button type="submit" size="lg" className="w-full md:w-auto font-semibold text-base py-3 px-8">Book Appointment</Button>
        </div>
      </Card>
    </div>
  );
}

