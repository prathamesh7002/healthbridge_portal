# 🛡️ HealthBridge Pro

**Secure • Intelligent • User-Friendly**

A modern, secure, and intelligent web application designed to revolutionize personal medical record management with cutting-edge AI technology.

[![Next.js](https://img.shields.io/badge/Next.js-15.3.3-000000?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-06B6D4?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-11.9.1-FFCA28?style=for-the-badge&logo=firebase)](https://firebase.google.com/)
[![Genkit](https://img.shields.io/badge/Genkit-1.14.1-00D4AA?style=for-the-badge&logo=genkit)](https://genkit.ai/)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge)](http://makeapullrequest.com)
[![Issues Welcome](https://img.shields.io/badge/Issues-welcome-orange.svg?style=for-the-badge)](https://github.com/your-username/healthbridge/issues)

## 📋 Table of Contents

- [✨ Features](#-features)
- [🚀 Quick Start](#-quick-start)
- [⚙️ Tech Stack](#️-tech-stack)
- [📸 Screenshots](#-screenshots)
- [🔧 Installation](#-installation)
- [⚙️ Configuration](#️-configuration)
- [📁 Project Structure](#-project-structure)
- [🤖 AI Features](#-ai-features)
- [🔒 Security](#-security)
- [📱 Responsive Design](#-responsive-design)
- [🤝 Contributing](#-contributing)

## ✨ Features

### 🏥 **Multi-Role Healthcare Platform**
- **Patient Portal**: Book appointments, view prescriptions, upload reports, track health metrics
- **Doctor Dashboard**: Manage appointments, patient records, availability scheduling
- **Modern Timeline View**: Intuitive vertical timeline for medical records and prescriptions
- **Secure File Uploads**: Easily upload and manage medical documents with preview capabilities


### 📅 **Smart Appointment System**
- Interactive calendar with real-time availability
- Specialization-based doctor filtering
- Automated appointment confirmations
- Reminder notifications

### 📊 **Health Analytics**
- Patient health trend visualization
- Doctor performance metrics
- Clinic activity monitoring
- Interactive charts and reports

### 🌐 **Internationalization**
- Multi-language support (English, Hindi, Marathi)
- Localized content and interfaces
- Cultural adaptation for healthcare

### 🎨 **Modern UI/UX**
- Dark/Light theme support
- Responsive design for all devices
- Accessibility compliant
- Smooth animations and transitions

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/healthbridge.git
cd healthbridge

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Create required directories
mkdir -p public/uploads

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Demo Credentials
- **Patient**: `patient@example.com` / `patient027`
- **Doctor**: `doctor@example.com` / `doctor027`
- **Admin**: `admin@example.com` / `admin027`

## ⚙️ Tech Stack

### Frontend
- **Next.js 15.3.3** - React framework with App Router
- **React 18.3.1** - UI library
- **TypeScript 5.0** - Type safety
- **Tailwind CSS 3.4.1** - Utility-first CSS framework

### Backend & Services
- **Firebase 11.9.1** - Backend as a Service
- **Genkit 1.14.1** - AI development framework

### UI Components
- **shadcn/ui** - Modern component library
- **Radix UI** - Accessible primitives
- **Lucide React** - Beautiful icons
- **Recharts** - Data visualization

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking

## 📸 Screenshots

### 🖥️ Desktop View
![Desktop View](/screenshots/desktop-view.png)
*Modern, clean interface with the new timeline view*

### 📱 Mobile View
![Mobile View](/screenshots/mobile-view.png)
*Fully responsive design that works on all devices*

### 📤 Upload Dialog
![Upload Dialog](/screenshots/upload-dialog.png)
*Easy-to-use document upload interface*

### 📄 Document Preview
![Document Preview](/screenshots/document-preview.png)
*View documents directly in the application*

### Login Screen
![Login Screen](https://github.com/yogendra-08/healthbridge_portal/blob/main/project-screenshots/loginscreen.png)

### Dashboard Overview
![Dashboard](https://github.com/yogendra-08/healthbridge_portal/blob/main/project-screenshots/dashboard.png)

### Appointment Booking
![Appointment Booking](https://github.com/yogendra-08/healthbridge_portal/blob/main/project-screenshots/appoinment-booking.png)

### Doctor Dashboard
![Doctor Dashboard](https://github.com/yogendra-08/healthbridge_portal/blob/main/project-screenshots/doctor-dashboard.png)

### Patient Portal
![Patient Portal](https://github.com/yogendra-08/healthbridge_portal/blob/main/project-screenshots/patient.png)

## 🔧 Installation

### 1. Environment Setup
```bash
# Create environment file
cp .env.example .env.local
```

### 2. Configure Environment Variables
```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id

# AI Configuration
GOOGLE_AI_API_KEY=your_google_ai_key

# Next.js Configuration
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

### 3. Database Setup
```bash
# Initialize Firebase (if using Firebase)
firebase init

# Set up Firestore rules
firebase deploy --only firestore:rules
```

## ⚙️ Configuration

### AI Features Configuration
```typescript
// src/ai/genkit.ts
export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.0-flash',
});
```

### Internationalization Setup
```typescript
// src/i18n.ts
export default getRequestConfig(async ({locale}) => ({
  messages: (await import(`../messages/${locale}.json`)).default
}));
```

## 📁 Project Structure

```
HealthBridge/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Protected routes
│   │   │   ├── admin/         # Admin dashboard
│   │   │   ├── doctor/        # Doctor dashboard
│   │   │   └── patient/       # Patient dashboard
│   │   ├── [locale]/          # Internationalized routes
│   │   └── globals.css        # Global styles
│   ├── components/            # Reusable components
│   │   ├── auth/              # Authentication components
│   │   ├── layout/            # Layout components
│   │   ├── shared/            # Shared components
│   │   └── ui/                # UI primitives
│   ├── ai/                    # AI integration
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utility functions
│   └── messages/              # i18n translations
├── docs/                      # Documentation
├── public/                    # Static assets
└── package.json              # Dependencies
```

## 🤖 AI Features

### Current AI Implementation
- **Genkit Integration**: Basic AI framework setup
- **Google AI**: Gemini 2.0 Flash model integration
- **AI Development Environment**: Local AI development server

### Planned AI Features
- **Medical Report Analysis**: AI-powered health report interpretation
- **Symptom Checker**: Intelligent symptom assessment
- **Appointment Optimization**: AI-driven scheduling recommendations
- **Health Predictions**: Predictive health analytics
- **Medical Assistant**: Conversational AI for patient support

## 🔒 Security

### Authentication & Authorization
- **Role-based Access Control**: Patient, Doctor, Admin roles
- **Secure Login System**: Email/password authentication
- **Session Management**: Secure session handling
- **Route Protection**: Middleware-based route guards

### Data Protection
- **Input Validation**: Zod schema validation
- **XSS Protection**: React's built-in XSS protection
- **CSRF Protection**: Next.js CSRF tokens
- **Environment Variables**: Secure configuration management

### Privacy Compliance
- **HIPAA Ready**: Healthcare data protection standards
- **Data Encryption**: End-to-end encryption
- **Audit Logging**: Comprehensive activity tracking
- **Consent Management**: User consent tracking

## 📱 Responsive Design

### Mobile-First Approach
- **Progressive Enhancement**: Core functionality on all devices
- **Touch-Friendly Interface**: Optimized for mobile interaction
- **Adaptive Layouts**: Responsive grid systems
- **Performance Optimization**: Fast loading on mobile networks

### Cross-Platform Compatibility
- **Desktop**: Full-featured experience
- **Tablet**: Optimized touch interface
- **Mobile**: Streamlined mobile experience
- **Accessibility**: WCAG 2.1 AA compliant

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Getting Started
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write comprehensive tests
- Update documentation
- Follow the existing code style
- Ensure accessibility compliance

### Code of Conduct
- Be respectful and inclusive
- Help others learn and grow
- Focus on constructive feedback
- Maintain professional behavior

## 📊 Project Status

### Implementation Progress: 75% Complete

#### ✅ Completed Features
- [x] Multi-role authentication system
- [x] Complete dashboard implementations
- [x] Appointment booking system
- [x] UI component library
- [x] Internationalization
- [x] Responsive design
- [x] Theme system

#### 🚧 In Progress
- [ ] AI feature implementation
- [ ] Backend API development
- [ ] Real-time notifications
- [ ] File upload system

#### 📋 Planned Features
- [ ] Advanced AI medical assistance
- [ ] Payment integration
- [ ] Email notifications
- [ ] Advanced analytics
- [ ] Mobile app development

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** for the amazing framework
- **shadcn/ui** for the beautiful component library
- **Tailwind CSS** for the utility-first CSS framework
- **Firebase** for the backend services
- **Genkit** for AI development tools

## 📞 Support

- **Documentation**: [docs.healthbridge.com](https://docs.healthbridge.com)
- **Issues**: [GitHub Issues](https://github.com/your-username/healthbridge/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/healthbridge/discussions)
- **Email**: support@healthbridge.com

---


<div align="center">
  <p>Made with ❤️ for better healthcare</p>
  <p>HealthBridge Pro - Revolutionizing Healthcare Management</p>
</div>
