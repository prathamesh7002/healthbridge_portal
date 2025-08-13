import { z } from 'zod';

export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Must contain at least one number');

export const phoneSchema = z
  .string()
  .min(10, 'Phone number must be at least 10 digits')
  .max(15, 'Phone number too long')
  .regex(/^[0-9+\-\s()]+$/, 'Invalid phone number format');

export const nameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name is too long');

export const dateOfBirthSchema = z
  .date()
  .refine((date) => new Date().getFullYear() - date.getFullYear() >= 13, {
    message: 'You must be at least 13 years old',
  });

export const appointmentSchema = z.object({
  date: z.date({
    required_error: 'Please select a date',
    invalid_type_error: "That's not a valid date",
  }),
  time: z.string().min(1, 'Please select a time'),
  doctorId: z.string().min(1, 'Please select a doctor'),
  reason: z
    .string()
    .min(10, 'Reason must be at least 10 characters')
    .max(500, 'Reason is too long'),
});

export const medicalRecordSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  type: z.enum(['report', 'prescription', 'image', 'other']),
  date: z.date(),
  file: z.instanceof(File).optional(),
  notes: z.string().optional(),
});

export type AppointmentFormData = z.infer<typeof appointmentSchema>;
export type MedicalRecordFormData = z.infer<typeof medicalRecordSchema>;
