'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Joyride, { CallBackProps, Step } from 'react-joyride';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { DoctorIllustration } from './DoctorIllustration';
import { CheckCircle2, X } from 'lucide-react';
import './onboarding-tour.css';

const TOUR_STORAGE_KEY = 'healthbridge-tour-completed';

type TourStep = Step & {
  content: React.ReactNode;
};

export function OnboardingTour() {
  const [run, setRun] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [tourCompleted, setTourCompleted] = useLocalStorage(TOUR_STORAGE_KEY, false);
  const [isClient, setIsClient] = useState(false);
  
  const steps: TourStep[] = [
    {
      target: 'body',
      content: (
        <div className="p-6 max-w-md mx-auto text-center">
          <div className="bg-blue-50 p-6 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-6">
            <img 
              src="/doctor-character.png" 
              alt="Doctor" 
              className="w-20 h-20 object-contain"
            />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Welcome to HealthBridge!</h3>
          <p className="text-gray-600 mb-6">Let's get you started with your health journey</p>
          <button 
            onClick={() => setRun(true)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Start Tour
          </button>
        </div>
      ),
      placement: 'center',
      disableOverlayClose: true,
      hideCloseButton: true,
      hideFooter: true,
      disableBeacon: true,
    },
    {
      target: '.settings-sidebar',
      content: (
        <div className="max-w-xs">
          <h3 className="font-semibold text-lg mb-2">Settings Menu</h3>
          <p className="text-sm text-gray-600 mb-2">Access all your account and application settings from here.</p>
          <p className="text-sm text-gray-600">We'll help you customize your experience.</p>
        </div>
      ),
      placement: 'right',
      disableBeacon: true,
      disableOverlayClose: true,
    },
    {
      target: '.profile-settings',
      content: (
        <div className="max-w-xs">
          <h3 className="font-semibold text-lg mb-2">Profile Settings</h3>
          <p className="text-sm text-gray-600 mb-2">Update your personal information, contact details, and profile picture.</p>
          <p className="text-sm text-gray-600">Keep your information current for better service.</p>
        </div>
      ),
      placement: 'right',
      disableBeacon: true,
      disableOverlayClose: true,
    },
    {
      target: '.notification-settings',
      content: (
        <div className="max-w-xs">
          <h3 className="font-semibold text-lg mb-2">Notification Preferences</h3>
          <p className="text-sm text-gray-600 mb-2">Customize how and when you receive notifications about your appointments and health updates.</p>
        </div>
      ),
      placement: 'right',
      disableBeacon: true,
      disableOverlayClose: true,
    },
    {
      target: '.security-settings',
      content: (
        <div className="max-w-xs">
          <h3 className="font-semibold text-lg mb-2">Security Settings</h3>
          <p className="text-sm text-gray-600 mb-2">Manage your password, two-factor authentication, and account security settings.</p>
          <p className="text-sm text-gray-600">Keep your health information secure.</p>
        </div>
      ),
      placement: 'right',
      disableBeacon: true,
      disableOverlayClose: true,
    },
  ];

  // Initialize client-side state
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Start tour on initial load if not completed
  useEffect(() => {
    if (isClient && !tourCompleted) {
      const timer = setTimeout(() => {
        setRun(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isClient, tourCompleted]);

  // Check if a target element exists in the DOM
  const targetExists = (target: string) => {
    if (target === 'body') return true;
    try {
      const element = document.querySelector(target);
      return !!element;
    } catch (e) {
      return false;
    }
  };

  // Filter steps to only include those with existing targets
  const getFilteredSteps = useCallback(() => {
    return steps.filter(step => targetExists(step.target as string));
  }, [steps]);

  // Handle tour callbacks
  const handleJoyrideCallback = useCallback((data: CallBackProps) => {
    const { action, index, status, type, step } = data;
    
    // Update step index when steps change
    if (type === 'step:after' || type === 'tooltip') {
      setStepIndex(index);
    }

    // Handle navigation between steps
    if (action === 'next' || action === 'prev') {
      const nextIndex = action === 'next' ? index + 1 : index - 1;
      // Only proceed if the next target exists
      if (nextIndex >= 0 && nextIndex < steps.length) {
        const nextStep = steps[nextIndex];
        if (targetExists(nextStep.target as string)) {
          setStepIndex(nextIndex);
        } else {
          // Skip to the next available step if target doesn't exist
          const nextValidIndex = steps.findIndex((s, i) => i > index && targetExists(s.target as string));
          if (nextValidIndex !== -1) {
            setStepIndex(nextValidIndex);
          } else {
            // If no more valid steps, end the tour
            setRun(false);
            setTourCompleted(true);
          }
        }
      }
    }

    // Handle tour completion or skip
    if (['finished', 'skipped'].includes(status)) {
      setRun(false);
      if (status === 'finished') {
        setTourCompleted(true);
      }
    }
  }, [setTourCompleted, steps]);

  // Handle restart tour event
  useEffect(() => {
    if (!isClient) return;

    const handleRestartTour = () => {
      setTourCompleted(false);
      setStepIndex(0);
      // Small delay to ensure state updates before starting tour
      setTimeout(() => {
        setRun(true);
      }, 100);
    };

    window.addEventListener('restart-tour', handleRestartTour);
    
    return () => {
      window.removeEventListener('restart-tour', handleRestartTour);
    };
  }, [isClient, setTourCompleted]);

  // Don't render on server-side
  if (!isClient) {
    return null;
  }

  // Get filtered steps with existing targets
  const filteredSteps = getFilteredSteps();
  
  // If no valid steps, don't render the tour
  if (filteredSteps.length === 0) {
    return null;
  }

  // Adjust step index if it's out of bounds
  const safeStepIndex = Math.min(stepIndex, filteredSteps.length - 1);

  return (
    <Joyride
      steps={filteredSteps}
      run={run}
      stepIndex={safeStepIndex}
      callback={handleJoyrideCallback}
      continuous
      showProgress
      showSkipButton
      hideCloseButton={false}
      disableOverlayClose={true}
      debug={process.env.NODE_ENV === 'development'}
      disableScrolling={false}
      disableScrollParentFix={false}
      styles={{
        options: {
          zIndex: 10000,
          primaryColor: '#2563eb',
          textColor: '#1f2937',
          backgroundColor: '#ffffff',
          arrowColor: '#ffffff',
        },
        tooltip: {
          padding: 24,
          borderRadius: 16,
          maxWidth: 380,
          boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
          border: '1px solid #e5e7eb',
        },
        tooltipTitle: {
          fontSize: '1.25rem',
          fontWeight: 600,
          marginBottom: '0.5rem',
          color: '#111827',
        },
        tooltipContent: {
          fontSize: '0.9375rem',
          lineHeight: '1.5',
          color: '#4b5563',
          marginBottom: '1.5rem',
        },
        tooltipContainer: {
          textAlign: 'left',
        },
        buttonNext: {
          backgroundColor: '#2563eb',
          color: '#ffffff',
          borderRadius: '0.5rem',
          padding: '0.625rem 1.25rem',
          fontSize: '0.9375rem',
          fontWeight: 500,
          transition: 'all 0.2s',
        },
        buttonBack: {
          color: '#6b7280',
          marginRight: '0.75rem',
          fontSize: '0.9375rem',
          fontWeight: 500,
        },
        buttonSkip: {
          color: '#6b7280',
          fontSize: '0.9375rem',
          fontWeight: 500,
          lineHeight: '1.5',
        },
        beacon: {
          zIndex: 10001,
        },
        buttonClose: {
          display: 'none',
        },
      }}
      locale={{
        back: 'Back',
        close: 'Close',
        last: 'Finish',
        next: 'Next',
        skip: 'Skip Tour',
      }}
      tooltipComponent={({ step, isLastStep, tooltipProps, primaryProps, skipProps, index, size }) => {
        // Create an array of step indicators
        const stepIndicators = Array.from({ length: size }, (_, i) => (
          <div 
            key={i} 
            className={`h-1.5 rounded-full ${i <= index ? 'bg-indigo-600' : 'bg-gray-200'}`}
            style={{ width: `${100 / size}%` }}
          />
        ));
        
        // Create a ref to store the primary button props
        const primaryButtonRef = useRef<HTMLButtonElement>(null);
        
        // Focus the primary button when the tooltip is shown
        useEffect(() => {
          if (primaryButtonRef.current) {
            primaryButtonRef.current.focus();
          }
        }, [index]);

        // Handle primary button click
        const handlePrimaryClick = (e: React.MouseEvent<HTMLButtonElement>) => {
          if (primaryProps.onClick) {
            // Type assertion to handle the event type mismatch
            primaryProps.onClick(e as unknown as React.MouseEvent<HTMLElement>);
            // Update the step index
            setStepIndex(prev => Math.min(prev + 1, size - 1));
          }
        };

        // Handle skip button click
        const handleSkipClick = (e: React.MouseEvent<HTMLButtonElement>) => {
          if (skipProps.onClick) {
            // Type assertion to handle the event type mismatch
            skipProps.onClick(e as unknown as React.MouseEvent<HTMLElement>);
            setRun(false);
            setTourCompleted(true);
          }
        };
        
        return (
          <div 
            {...tooltipProps} 
            className="bg-white overflow-hidden rounded-xl shadow-xl max-w-sm"
          >
            {/* Progress bar */}
            <div className="flex gap-1 p-4">
              {stepIndicators}
            </div>
            
            {/* Content */}
            <div className="px-6 pb-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center">
                    <DoctorIllustration />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-700 leading-relaxed">
                    {step.content}
                  </div>
                </div>
                <button
                  onClick={handleSkipClick}
                  className="text-gray-400 hover:text-gray-500 ml-2"
                  aria-label="Close tour"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              {/* Buttons */}
              <div className="flex justify-between items-center mt-6">
                <div className="text-xs text-gray-500 font-medium">
                  Step {index + 1} of {size}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleSkipClick}
                    className="text-sm text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-md font-medium transition-colors"
                  >
                    Skip
                  </button>
                  <button
                    ref={primaryButtonRef}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
                    onClick={handlePrimaryClick}
                  >
                    {isLastStep ? (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        Got it, thanks!
                      </>
                    ) : 'Next'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
} 