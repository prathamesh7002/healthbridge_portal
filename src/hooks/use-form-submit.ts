import { useState, useCallback } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ZodError } from 'zod';

type FormSubmitOptions<T> = {
  onSuccess?: (data: T) => void | Promise<void>;
  onError?: (error: Error) => void;
  successMessage?: string;
  errorMessage?: string;
};

export function useFormSubmit<T, F extends Record<string, any>>(
  form: UseFormReturn<F>,
  submitFn: (data: F) => Promise<T>,
  options: FormSubmitOptions<T> = {}
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const onSubmit = useCallback(
    async (data: F) => {
      setIsLoading(true);
      setError(null);
      setSuccess(null);

      try {
        const result = await submitFn(data);
        
        if (options.onSuccess) {
          await options.onSuccess(result);
        }
        
        if (options.successMessage) {
          setSuccess(options.successMessage);
        }
        
        return result;
      } catch (err) {
        let errorMessage = options.errorMessage || 'An error occurred';
        
        if (err instanceof ZodError) {
          // Handle Zod validation errors
          errorMessage = err.errors[0]?.message || 'Validation error';
          // Set form errors for each field
          err.errors.forEach(({ path, message }) => {
            form.setError(path[0] as any, { message });
          });
        } else if (err instanceof Error) {
          errorMessage = err.message;
        }
        
        setError(errorMessage);
        
        if (options.onError) {
          options.onError(err instanceof Error ? err : new Error(String(err)));
        }
        
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [form, submitFn, options]
  );

  const resetStatus = useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);

  return {
    handleSubmit: form.handleSubmit(onSubmit),
    isLoading,
    error,
    success,
    resetStatus,
    isSubmitting: form.formState.isSubmitting,
    isSubmitSuccessful: form.formState.isSubmitSuccessful,
    errors: form.formState.errors,
  };
}
