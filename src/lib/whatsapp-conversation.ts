import { whatsappService } from './whatsapp';

export interface ConversationState {
  phoneNumber: string;
  step: 'greeting' | 'doctor_selection' | 'slot_selection' | 'confirmation' | 'completed';
  language: 'hi' | 'mr' | 'en';
  selectedDoctor?: string;
  selectedSlot?: string;
  patientName?: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  clinic: string;
  address: string;
}

export interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

// In-memory conversation state (in production, use Redis or database)
const conversationStates = new Map<string, ConversationState>();

// Sample doctors data (integrate with your existing data)
const doctors: Doctor[] = [
  {
    id: 'dr_verma',
    name: 'डॉ. वर्मा / Dr. Verma',
    specialty: 'जनरल फिजिशियन / General Physician',
    clinic: 'शांति क्लिनिक / Shanti Clinic',
    address: 'सिविल लाइन्स, नागपुर / Civil Lines, Nagpur'
  },
  {
    id: 'dr_mehta',
    name: 'डॉ. मेहता / Dr. Mehta',
    specialty: 'हृदय रोग विशेषज्ञ / Cardiologist',
    clinic: 'हार्ट केयर सेंटर / Heart Care Center',
    address: 'सदर, नागपुर / Sadar, Nagpur'
  },
  {
    id: 'dr_sharma',
    name: 'डॉ. शर्मा / Dr. Sharma',
    specialty: 'बाल रोग विशेषज्ञ / Pediatrician',
    clinic: 'चाइल्ड केयर क्लिनिक / Child Care Clinic',
    address: 'धंतोली, नागपुर / Dhantoli, Nagpur'
  }
];

// Sample time slots
const timeSlots: TimeSlot[] = [
  { id: 'slot_1030', time: '10:30 AM', available: true },
  { id: 'slot_1100', time: '11:00 AM', available: true },
  { id: 'slot_1130', time: '11:30 AM', available: true },
  { id: 'slot_1200', time: '12:00 PM', available: true },
  { id: 'slot_1430', time: '2:30 PM', available: true },
  { id: 'slot_1500', time: '3:00 PM', available: true }
];

// Multilingual messages
const messages = {
  hi: {
    greeting: 'नमस्ते! HealthBridge में आपका स्वागत है। 🏥\n\nमैं आपकी अपॉइंटमेंट बुक करने में मदद कर सकता हूँ।\n\nकृपया डॉक्टर चुनें:',
    doctorSelection: 'कृपया डॉक्टर चुनें:',
    slotSelection: 'उपलब्ध समय स्लॉट्स:\n\nकृपया एक समय चुनें:',
    confirmation: '✅ बुकिंग कन्फर्म!\n\n📅 अपॉइंटमेंट डिटेल्स:\n👨‍⚕️ डॉक्टर: {doctor}\n🕐 समय: {time}\n🏥 पता: {address}\n\n📱 QR कोड स्कैन करके डॉक्टर को अपना पुराना रिकॉर्ड दिखाएँ।',
    qrMessage: '🔗 यह आपका मेडिकल रिकॉर्ड QR कोड है। क्लिनिक में डॉक्टर को दिखाएं।',
    error: 'कुछ गलत हुआ। कृपया फिर से कोशिश करें।',
    invalidSelection: 'गलत विकल्प। कृपया दिए गए विकल्पों में से चुनें।'
  },
  mr: {
    greeting: 'नमस्कार! HealthBridge मध्ये तुमचे स्वागत आहे। 🏥\n\nमी तुमची अपॉइंटमेंट बुक करण्यात मदत करू शकतो।\n\nकृपया डॉक्टर निवडा:',
    doctorSelection: 'कृपया डॉक्टर निवडा:',
    slotSelection: 'उपलब्ध वेळ स्लॉट्स:\n\nकृपया एक वेळ निवडा:',
    confirmation: '✅ बुकिंग कन्फर्म!\n\n📅 अपॉइंटमेंट तपशील:\n👨‍⚕️ डॉक्टर: {doctor}\n🕐 वेळ: {time}\n🏥 पत्ता: {address}\n\n📱 QR कोड स्कॅन करून डॉक्टरांना तुमचा जुना रेकॉर्ड दाखवा।',
    qrMessage: '🔗 हा तुमचा मेडिकल रेकॉर्ड QR कोड आहे। क्लिनिकमध्ये डॉक्टरांना दाखवा।',
    error: 'काहीतरी चूक झाली। कृपया पुन्हा प्रयत्न करा।',
    invalidSelection: 'चुकीचा पर्याय। कृपया दिलेल्या पर्यायांमधून निवडा।'
  },
  en: {
    greeting: 'Hello! Welcome to HealthBridge. 🏥\n\nI can help you book an appointment.\n\nPlease select a doctor:',
    doctorSelection: 'Please select a doctor:',
    slotSelection: 'Available time slots:\n\nPlease choose a time:',
    confirmation: '✅ Booking Confirmed!\n\n📅 Appointment Details:\n👨‍⚕️ Doctor: {doctor}\n🕐 Time: {time}\n🏥 Address: {address}\n\n📱 Scan QR code to show your medical records to the doctor.',
    qrMessage: '🔗 This is your medical record QR code. Show it to the doctor at the clinic.',
    error: 'Something went wrong. Please try again.',
    invalidSelection: 'Invalid selection. Please choose from the given options.'
  }
};

export class WhatsAppConversationHandler {
  
  // Detect language from message
  private detectLanguage(message: string): 'hi' | 'mr' | 'en' {
    const hindiKeywords = ['नमस्ते', 'अपॉइंटमेंट', 'डॉक्टर', 'समय'];
    const marathiKeywords = ['नमस्कार', 'अपॉइंटमेंट', 'डॉक्टर', 'वेळ'];
    
    const hasHindi = hindiKeywords.some(keyword => message.includes(keyword));
    const hasMarathi = marathiKeywords.some(keyword => message.includes(keyword));
    
    if (hasHindi) return 'hi';
    if (hasMarathi) return 'mr';
    return 'en';
  }

  // Get or create conversation state
  private getConversationState(phoneNumber: string): ConversationState {
    if (!conversationStates.has(phoneNumber)) {
      conversationStates.set(phoneNumber, {
        phoneNumber,
        step: 'greeting',
        language: 'hi' // Default to Hindi
      });
    }
    return conversationStates.get(phoneNumber)!;
  }

  // Update conversation state
  private updateConversationState(phoneNumber: string, updates: Partial<ConversationState>) {
    const state = this.getConversationState(phoneNumber);
    conversationStates.set(phoneNumber, { ...state, ...updates });
  }

  // Handle incoming message
  async handleMessage(phoneNumber: string, message: string): Promise<void> {
    const state = this.getConversationState(phoneNumber);
    
    // Detect language if it's the first message
    if (state.step === 'greeting') {
      const detectedLanguage = this.detectLanguage(message);
      this.updateConversationState(phoneNumber, { language: detectedLanguage });
      state.language = detectedLanguage;
    }

    const msgs = messages[state.language];

    try {
      switch (state.step) {
        case 'greeting':
          await this.handleGreeting(phoneNumber, message, state);
          break;
        case 'doctor_selection':
          await this.handleDoctorSelection(phoneNumber, message, state);
          break;
        case 'slot_selection':
          await this.handleSlotSelection(phoneNumber, message, state);
          break;
        case 'confirmation':
          await this.handleConfirmation(phoneNumber, message, state);
          break;
        default:
          await whatsappService.sendMessage(phoneNumber, msgs.error);
      }
    } catch (error) {
      console.error('Error handling WhatsApp message:', error);
      await whatsappService.sendMessage(phoneNumber, msgs.error);
    }
  }

  // Handle greeting and show doctor list
  private async handleGreeting(phoneNumber: string, message: string, state: ConversationState): Promise<void> {
    const msgs = messages[state.language];
    
    // Create doctor list sections
    const doctorRows = doctors.map((doctor, index) => ({
      id: doctor.id,
      title: `${index + 1}. ${doctor.name}`,
      description: doctor.specialty
    }));

    await whatsappService.sendListMessage(
      phoneNumber,
      msgs.greeting,
      'डॉक्टर चुनें / Select Doctor',
      [{
        title: 'Available Doctors',
        rows: doctorRows
      }]
    );

    this.updateConversationState(phoneNumber, { step: 'doctor_selection' });
  }

  // Handle doctor selection
  private async handleDoctorSelection(phoneNumber: string, message: string, state: ConversationState): Promise<void> {
    const msgs = messages[state.language];
    
    // Handle both number selection (1, 2, 3) and doctor ID
    let selectedDoctor: Doctor | undefined;
    
    if (/^[1-3]$/.test(message.trim())) {
      const index = parseInt(message.trim()) - 1;
      selectedDoctor = doctors[index];
    } else {
      selectedDoctor = doctors.find(d => d.id === message.trim());
    }

    if (!selectedDoctor) {
      await whatsappService.sendMessage(phoneNumber, msgs.invalidSelection);
      return;
    }

    // Show available time slots
    const slotButtons = timeSlots
      .filter(slot => slot.available)
      .slice(0, 3) // Show first 3 available slots
      .map(slot => ({
        id: slot.id,
        title: slot.time
      }));

    await whatsappService.sendButtonMessage(
      phoneNumber,
      `${msgs.slotSelection}\n\n👨‍⚕️ ${selectedDoctor.name}`,
      slotButtons
    );

    this.updateConversationState(phoneNumber, { 
      step: 'slot_selection',
      selectedDoctor: selectedDoctor.id
    });
  }

  // Handle time slot selection
  private async handleSlotSelection(phoneNumber: string, message: string, state: ConversationState): Promise<void> {
    const msgs = messages[state.language];
    
    const selectedSlot = timeSlots.find(slot => 
      slot.id === message.trim() || slot.time === message.trim()
    );

    if (!selectedSlot) {
      await whatsappService.sendMessage(phoneNumber, msgs.invalidSelection);
      return;
    }

    const doctor = doctors.find(d => d.id === state.selectedDoctor);
    if (!doctor) {
      await whatsappService.sendMessage(phoneNumber, msgs.error);
      return;
    }

    // Send confirmation message
    const confirmationMessage = msgs.confirmation
      .replace('{doctor}', doctor.name)
      .replace('{time}', selectedSlot.time)
      .replace('{address}', doctor.address);

    await whatsappService.sendMessage(phoneNumber, confirmationMessage);

    // Generate and send QR code
    const qrData = JSON.stringify({
      appointmentId: `apt_${Date.now()}`,
      patientPhone: phoneNumber,
      doctorId: doctor.id,
      slot: selectedSlot.time,
      date: new Date().toISOString().split('T')[0]
    });

    await whatsappService.sendQRCode(phoneNumber, qrData, msgs.qrMessage);

    this.updateConversationState(phoneNumber, { 
      step: 'completed',
      selectedSlot: selectedSlot.id
    });

    // Clear conversation state after 1 hour
    setTimeout(() => {
      conversationStates.delete(phoneNumber);
    }, 60 * 60 * 1000);
  }

  // Handle confirmation step
  private async handleConfirmation(phoneNumber: string, message: string, state: ConversationState): Promise<void> {
    const msgs = messages[state.language];
    await whatsappService.sendMessage(
      phoneNumber, 
      'आपकी अपॉइंटमेंट पहले से ही कन्फर्म है। नई अपॉइंटमेंट के लिए "अपॉइंटमेंट" लिखें।'
    );
  }
}

export const conversationHandler = new WhatsAppConversationHandler();
