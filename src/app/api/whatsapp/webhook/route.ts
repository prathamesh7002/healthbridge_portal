import { NextRequest, NextResponse } from 'next/server';
import { whatsappService, WhatsAppWebhookBody } from '@/lib/whatsapp';
import { conversationHandler } from '@/lib/whatsapp-conversation';

// Verify webhook (GET request)
export async function GET(request: NextRequest) {
  try {
    const verifyResponse = whatsappService.verifyWebhook(request);
    if (verifyResponse) {
      return verifyResponse;
    }
    
    return NextResponse.json({ error: 'Verification failed' }, { status: 403 });
  } catch (error) {
    console.error('Webhook verification error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Handle incoming messages (POST request)
export async function POST(request: NextRequest) {
  try {
    const body: WhatsAppWebhookBody = await request.json();
    
    // Validate webhook body
    if (body.object !== 'whatsapp_business_account') {
      return NextResponse.json({ error: 'Invalid webhook object' }, { status: 400 });
    }

    // Process each entry
    for (const entry of body.entry) {
      for (const change of entry.changes) {
        if (change.field === 'messages' && change.value.messages) {
          // Process each message
          for (const message of change.value.messages) {
            if (message.type === 'text') {
              const phoneNumber = message.from;
              const messageText = message.text.body;
              
              console.log(`Received message from ${phoneNumber}: ${messageText}`);
              
              // Handle the conversation
              await conversationHandler.handleMessage(phoneNumber, messageText);
            } else if (message.type === 'interactive') {
              // Handle button/list interactions
              const phoneNumber = message.from;
              let responseText = '';
              
              // Extract response from interactive message
              if ('button_reply' in message) {
                responseText = (message as any).interactive.button_reply.id;
              } else if ('list_reply' in message) {
                responseText = (message as any).interactive.list_reply.id;
              }
              
              console.log(`Received interactive response from ${phoneNumber}: ${responseText}`);
              
              // Handle the conversation
              await conversationHandler.handleMessage(phoneNumber, responseText);
            }
          }
        }
      }
    }

    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Handle other HTTP methods
export async function PUT() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

export async function PATCH() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
