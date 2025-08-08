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

  return (
    <div className="animate-fade-in">
        <Card>
            <CardHeader>
                <CardTitle>Book a New Appointment</CardTitle>
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
                                    <FormLabel>Doctor</FormLabel>
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
                    <div className="flex justify-end">
                        <Button type="submit" size="lg">Book Appointment</Button>
                    </div>
                </form>
                </Form>
            </CardContent>
        </Card>
    </div>
  );
}

