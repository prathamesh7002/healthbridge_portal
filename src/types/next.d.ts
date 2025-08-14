import 'next';

declare module 'next' {
  export interface PageProps {
    params: {
      patientId: string;
    };
    searchParams: { [key: string]: string | string[] | undefined };
  }
}
