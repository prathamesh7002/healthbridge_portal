import { WhatsAppDashboard } from '@/components/whatsapp/whatsapp-dashboard';
import { useTranslations } from 'next-intl';

export default function WhatsAppPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">WhatsApp Integration</h1>
        <p className="text-muted-foreground">
          Manage appointments and patient interactions through WhatsApp
        </p>
      </div>
      
      <WhatsAppDashboard />
    </div>
  );
}
