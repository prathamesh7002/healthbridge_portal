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
import { HelpTooltip, PageHelp } from '@/components/help/HelpTooltip';
import { Info } from 'lucide-react';
import whatsappImage from './whatsapp.jpg';

const appointmentSchema = z.object({
  specialization: z.string({ required_error: 'Please select a specialization.' }),
  doctor: z.string({ required_error: 'Please select a doctor.' }),
  date: z.date({ required_error: 'Please select a date.' }),
  time: z.string({ required_error: 'Please select a time slot.' }),
  reason: z.string().min(10, 'Please provide a brief reason (at least 10 characters).').optional(),
});

type AppointmentFormValues = z.infer<typeof appointmentSchema>;

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
      <PageHelp>
        Book appointments easily through our WhatsApp booking system or use the traditional form. Get instant confirmations and reminders for all your appointments.
      </PageHelp>
      
      {/* WhatsApp Booking Section */}
      <Card className="mb-12 bg-card border shadow-lg">
        <div className="flex flex-col md:flex-row items-center gap-8 p-6">
          {/* Details Left */}
          <div className="flex-1 w-full">
            <div className="flex items-center gap-2">
              <CardTitle className="text-2xl font-bold text-foreground">Book via WhatsApp</CardTitle>
              <HelpTooltip 
                id="whatsapp-booking"
                title="WhatsApp Booking"
                content="Book your appointment through WhatsApp for a quick and easy chat-based experience. Our AI assistant will guide you through the process and confirm your appointment instantly."
                showOnFirstVisit={true}
              >
                <Info className="h-4 w-4 text-muted-foreground" />
              </HelpTooltip>
            </div>
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
            <div className="relative w-full max-w-xs h-[340px] rounded-xl overflow-hidden shadow-md border border-muted">
              <Image
                src={whatsappImage}
                alt="Book appointment via WhatsApp"
                className="w-full h-full object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </Card>

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
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle>Book a New Appointment</CardTitle>
            <HelpTooltip 
              id="appointment-form"
              title="Appointment Booking"
              content="Fill out this form to schedule an appointment. All fields are required unless marked as optional."
            >
              <Info className="h-4 w-4 text-muted-foreground" />
            </HelpTooltip>
          </div>
          <CardDescription>Find a doctor and schedule your next visit in a few simple steps.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="specialization"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2">
                          <FormLabel>Specialization</FormLabel>
                          <HelpTooltip 
                            id="specialization-field"
                            title="Select Specialization"
                            content="Choose the medical specialty that best matches your health concern. This helps us connect you with the right doctor."
                          >
                            <Info className="h-3.5 w-3.5 text-muted-foreground" />
                          </HelpTooltip>
                        </div>
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
                            {specializations.map(spec => <SelectItem key={spec.id} value={spec.id}>{spec.name}</SelectItem>)}
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
                        <div className="flex items-center gap-2">
                          <FormLabel>Doctor</FormLabel>
                          <HelpTooltip 
                            id="doctor-field"
                            title="Select Doctor"
                            content="Choose your preferred doctor from the available specialists. You'll see their availability after selection."
                          >
                            <Info className="h-3.5 w-3.5 text-muted-foreground" />
                          </HelpTooltip>
                        </div>
                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!selectedSpec}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a doctor" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {selectedSpec && doctors[selectedSpec].map(doc => <SelectItem key={doc.id} value={doc.name}>{doc.name}</SelectItem>)}
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
                        <div className="flex items-center gap-2">
                        <FormLabel>Reason for Visit (Optional)</FormLabel>
                        <HelpTooltip 
                          id="reason-field"
                          title="Visit Reason"
                          content="Briefly describe the reason for your visit. This helps the doctor prepare for your appointment."
                        >
                          <Info className="h-3.5 w-3.5 text-muted-foreground" />
                        </HelpTooltip>
                      </div>
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
                    <div className="flex items-center gap-2">
                      <FormLabel>Time</FormLabel>
                      <HelpTooltip 
                        id="time-field"
                        title="Available Time Slots"
                        content="Choose your preferred time slot for the selected date."
                      >
                        <Info className="h-3.5 w-3.5 text-muted-foreground" />
                      </HelpTooltip>
                    </div>
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
              <div className="flex justify-end">
                <div className="relative">
                  <Button type="submit" className="w-full">
                    Book Appointment
                  </Button>
                  <HelpTooltip 
                    id="submit-button"
                    title="Confirm Booking"
                    content="Review all details before submitting. You'll receive a confirmation once your appointment is booked."
                    position="top"
                  >
                    <Info className="absolute -right-2 -top-2 h-4 w-4 text-muted-foreground" />
                  </HelpTooltip>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

