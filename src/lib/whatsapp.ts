import { NextRequest } from 'next/server';

export interface WhatsAppMessage {
  from: string;
  id: string;
  timestamp: string;
  text: {
    body: string;
  };
  type: 'text' | 'interactive';
}

export interface WhatsAppWebhookBody {
  object: string;
  entry: Array<{
    id: string;
    changes: Array<{
      value: {
        messaging_product: string;
        metadata: {
          display_phone_number: string;
          phone_number_id: string;
        };
        messages?: WhatsAppMessage[];
        statuses?: any[];
      };
      field: string;
    }>;
  }>;
}

export class WhatsAppService {
  private accessToken: string;
  private phoneNumberId: string;
  private verifyToken: string;

  constructor() {
    this.accessToken = process.env.WHATSAPP_ACCESS_TOKEN || '';
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID || '';
    this.verifyToken = process.env.WHATSAPP_VERIFY_TOKEN || '';
  }

  // Verify webhook
  verifyWebhook(req: NextRequest): Response | null {
    const mode = req.nextUrl.searchParams.get('hub.mode');
    const token = req.nextUrl.searchParams.get('hub.verify_token');
    const challenge = req.nextUrl.searchParams.get('hub.challenge');

    if (mode === 'subscribe' && token === this.verifyToken) {
      return new Response(challenge, { status: 200 });
    }
    return null;
  }

  // Send text message
  async sendMessage(to: string, message: string): Promise<boolean> {
    try {
      const response = await fetch(
        `https://graph.facebook.com/v18.0/${this.phoneNumberId}/messages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            to,
            type: 'text',
            text: { body: message },
          }),
        }
      );

      return response.ok;
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      return false;
    }
  }

  // Send interactive button message
  async sendButtonMessage(
    to: string, 
    bodyText: string, 
    buttons: Array<{ id: string; title: string }>
  ): Promise<boolean> {
    try {
      const response = await fetch(
        `https://graph.facebook.com/v18.0/${this.phoneNumberId}/messages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            to,
            type: 'interactive',
            interactive: {
              type: 'button',
              body: { text: bodyText },
              action: {
                buttons: buttons.map((btn, index) => ({
                  type: 'reply',
                  reply: {
                    id: btn.id,
                    title: btn.title,
                  },
                })),
              },
            },
          }),
        }
      );

      return response.ok;
    } catch (error) {
      console.error('Error sending WhatsApp button message:', error);
      return false;
    }
  }

  // Send list message
  async sendListMessage(
    to: string,
    bodyText: string,
    buttonText: string,
    sections: Array<{
      title: string;
      rows: Array<{ id: string; title: string; description?: string }>;
    }>
  ): Promise<boolean> {
    try {
      const response = await fetch(
        `https://graph.facebook.com/v18.0/${this.phoneNumberId}/messages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            to,
            type: 'interactive',
            interactive: {
              type: 'list',
              body: { text: bodyText },
              action: {
                button: buttonText,
                sections,
              },
            },
          }),
        }
      );

      return response.ok;
    } catch (error) {
      console.error('Error sending WhatsApp list message:', error);
      return false;
    }
  }

  // Generate QR code message
  async sendQRCode(to: string, qrData: string, caption: string): Promise<boolean> {
    try {
      // Generate QR code URL (you can use a QR code service or generate locally)
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrData)}`;
      
      const response = await fetch(
        `https://graph.facebook.com/v18.0/${this.phoneNumberId}/messages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            to,
            type: 'image',
            image: {
              link: qrCodeUrl,
              caption,
            },
          }),
        }
      );

      return response.ok;
    } catch (error) {
      console.error('Error sending WhatsApp QR code:', error);
      return false;
    }
  }
}

export const whatsappService = new WhatsAppService();
