"use client"

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Check, PlusCircle } from 'lucide-react';
import { format } from 'date-fns';

const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00"
];

export default function AvailabilityPage() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [selectedSlots, setSelectedSlots] = useState<Record<string, string[]>>({
      [format(new Date(), 'yyyy-MM-dd')]: ["10:00", "10:30", "14:00"]
    });

    const handleSlotToggle = (slot: string) => {
        if (!date) return;
        const dateKey = format(date, 'yyyy-MM-dd');
        const daySlots = selectedSlots[dateKey] || [];
        const newSlots = daySlots.includes(slot)
            ? daySlots.filter(s => s !== slot)
            : [...daySlots, slot];
        setSelectedSlots({ ...selectedSlots, [dateKey]: newSlots });
    };

    const currentSlots = date ? selectedSlots[format(date, 'yyyy-MM-dd')] || [] : [];
    
    return (
        <div className="animate-fade-in space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Manage Availability</CardTitle>
                    <CardDescription>Set your available time slots for patient appointments.</CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-1 flex justify-center">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            className="rounded-md border"
                            disabled={(d) => d < new Date(new Date().setDate(new Date().getDate() - 1))}
                        />
                    </div>
                    <div className="md:col-span-2">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-xl flex justify-between items-center">
                              <span>
                                Available Slots for {date ? format(date, 'PPP') : '...'}
                              </span>
                              <Button variant="outline" size="sm" className='gap-2'><PlusCircle className='h-4 w-4' /> Add Bulk Slots</Button>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                              {date ? (
                                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
                                  {timeSlots.map(slot => (
                                    <Button
                                      key={slot}
                                      variant={currentSlots.includes(slot) ? 'default' : 'outline'}
                                      onClick={() => handleSlotToggle(slot)}
                                      className="font-mono"
                                    >
                                      {currentSlots.includes(slot) && <Check className="mr-2 h-4 w-4" />}
                                      {slot}
                                    </Button>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-muted-foreground">Select a date to see and manage available slots.</p>
                              )}
                          </CardContent>
                        </Card>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export { default } from "@/app/[locale]/(auth)/doctor/availability/page";


