import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';

interface Step {
  question: string;
  subtext: string;
  type: 'intro' | 'text' | 'options' | 'final';
  field?: string;
  options?: string[];
}

export default function LandingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({
    name: '',
    interest: '',
    role: ''
  });
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Define the steps for the Typeform-style flow
  const steps: Step[] = [
    {
      question: "Connect. Build. Launch Your Startup.",
      subtext: "Join an exclusive network of Chapman student founders, developers, and visionaries building the next generation of startups.",
      type: "intro"
    },
    {
      question: "What's your name?",
      subtext: "We'd love to get to know you better.",
      type: "text",
      field: "name"
    },
    {
      question: "What brings you to FounderConnect?",
      subtext: "Select the option that best describes your interest.",
      type: "options",
      field: "interest",
      options: [
        "I have a startup idea and need a team",
        "I want to join a startup",
        "I'm looking for resources",
        "Just exploring"
      ]
    },
    {
      question: "What role best describes you?",
      subtext: "Select your primary skill set or interest.",
      type: "options",
      field: "role",
      options: [
        "Founder / Entrepreneur",
        "Developer / Engineer",
        "Designer / Creative",
        "Business / Marketing",
        "Other"
      ]
    },
    {
      question: "You're all set!",
      subtext: "Ready to connect with Chapman's startup community?",
      type: "final"
    }
  ];

  // Handle next step transition
  const goToNextStep = () => {
    if (currentStep < steps.length - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setIsTransitioning(false);
      }, 400);
    }
  };

  // Handle text input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const field = steps[currentStep].field;
    if (field) {
      setAnswers({
        ...answers,
        [field]: e.target.value
      });
    }
  };

  // Handle option selection
  const handleOptionSelect = (option: string) => {
    const field = steps[currentStep].field;
    if (field) {
      setAnswers({
        ...answers,
        [field]: option
      });
      
      // Automatically go to next step after selecting an option
      setTimeout(goToNextStep, 300);
    }
  };

  // Handle key press for navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && steps[currentStep].type !== 'options') {
        if (currentStep === 1 && !answers.name) return; // Don't proceed if name is empty
        goToNextStep();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, answers]);

  // Handle final step actions
  const handleGetStarted = () => {
    window.location.href = '/auth/signup'; // Using window.location for a full page reload
  };

  const handleSignIn = () => {
    window.location.href = '/auth/signup'; // Using window.location for a full page reload
  };

  // Helper function to check if a field has a value
  const hasValue = (field: string | undefined): boolean => {
    if (!field) return false;
    return Boolean(answers[field as keyof typeof answers]);
  };

  return (
    <>
      <Head>
        <title>FounderConnect - Chapman University</title>
        <meta name="description" content="Connect with Chapman University founders, find co-founders, and build your startup." />
      </Head>
      
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#090618',
        color: 'white',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Image */}
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'url(/images/background.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 0
        }} />
        
        {/* Overlay */}
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(to bottom, rgba(9,6,24,0.4), rgba(9,6,24,0.8))',
          zIndex: 1
        }} />
        
        {/* Progress Bar */}
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: `${(currentStep / (steps.length - 1)) * 100}%`,
          height: '4px',
          backgroundColor: 'white',
          transition: 'width 0.5s ease',
          zIndex: 10
        }} />
        
        {/* Content */}
        <div style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '2rem',
          zIndex: 2
        }}>
          <div 
            style={{
              maxWidth: '800px',
              width: '100%',
              opacity: isTransitioning ? 0 : 1,
              transform: `translateY(${isTransitioning ? '20px' : '0'})`,
              transition: 'opacity 0.4s ease, transform 0.4s ease',
            }}
          >
            {/* Question */}
            <h1 style={{ 
              fontSize: steps[currentStep].type === 'intro' ? '3.5rem' : '2.5rem', 
              fontWeight: 'bold',
              marginBottom: '1rem',
              background: 'linear-gradient(to right, #ffffff, #e0e0e0)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block',
              textAlign: 'center',
              width: '100%'
            }}>
              {steps[currentStep].question}
            </h1>
            
            {/* Subtext */}
            <p style={{
              fontSize: '1.25rem',
              color: '#d1d5db',
              marginBottom: '2.5rem',
              textAlign: 'center',
              maxWidth: '600px',
              margin: '0 auto 2.5rem auto'
            }}>
              {steps[currentStep].subtext}
            </p>
            
            {/* Input based on step type */}
            {steps[currentStep].type === 'text' && steps[currentStep].field && (
              <input
                type="text"
                value={answers[steps[currentStep].field as keyof typeof answers] || ''}
                onChange={handleInputChange}
                placeholder="Type your answer here..."
                style={{
                  width: '100%',
                  padding: '1rem',
                  fontSize: '1.25rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '0.5rem',
                  color: 'white',
                  marginBottom: '1.5rem',
                  outline: 'none',
                  transition: 'border-color 0.3s ease',
                  fontFamily: 'inherit'
                }}
                autoFocus
              />
            )}
            
            {/* Options */}
            {steps[currentStep].type === 'options' && steps[currentStep].options && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                width: '100%',
                marginBottom: '1.5rem',
                alignItems: 'center',
                maxWidth: '600px',
                margin: '0 auto 1.5rem auto'
              }}>
                {steps[currentStep].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleOptionSelect(option)}
                    style={{
                      padding: '1rem',
                      backgroundColor: steps[currentStep].field && 
                        answers[steps[currentStep].field as keyof typeof answers] === option 
                        ? 'rgba(255, 255, 255, 0.2)' 
                        : 'rgba(255, 255, 255, 0.1)',
                      border: '2px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '0.5rem',
                      color: 'white',
                      textAlign: 'center',
                      fontSize: '1rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      fontFamily: 'inherit',
                      width: '100%'
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
            
            {/* Navigation buttons */}
            {steps[currentStep].type === 'intro' && (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem', gap: '1rem' }}>
                <button
                  onClick={goToNextStep}
                  style={{
                    padding: '0.75rem 2rem',
                    backgroundColor: 'white',
                    color: '#090618',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontWeight: '600',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    fontFamily: 'inherit'
                  }}
                >
                  Get Started →
                </button>
                
                <button
                  onClick={handleSignIn}
                  style={{
                    padding: '0.75rem 2rem',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    borderRadius: '0.5rem',
                    fontWeight: '600',
                    border: '1px solid rgba(255,255,255,0.2)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    backdropFilter: 'blur(8px)',
                    fontSize: '1rem',
                    fontFamily: 'inherit'
                  }}
                >
                  Sign In
                </button>
              </div>
            )}
            
            {steps[currentStep].type === 'text' && (
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button
                  onClick={goToNextStep}
                  disabled={!hasValue(steps[currentStep].field)}
                  style={{
                    padding: '0.75rem 2rem',
                    backgroundColor: hasValue(steps[currentStep].field) ? 'white' : 'rgba(255, 255, 255, 0.3)',
                    color: hasValue(steps[currentStep].field) ? '#090618' : 'rgba(255, 255, 255, 0.5)',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontWeight: '600',
                    fontSize: '1rem',
                    cursor: hasValue(steps[currentStep].field) ? 'pointer' : 'not-allowed',
                    transition: 'all 0.2s ease',
                    fontFamily: 'inherit'
                  }}
                >
                  Continue →
                </button>
              </div>
            )}
            
            {/* Final step buttons */}
            {steps[currentStep].type === 'final' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                <button
                  onClick={handleGetStarted}
                  style={{
                    display: 'inline-block',
                    padding: '0.75rem 2rem',
                    backgroundColor: 'white',
                    color: '#090618',
                    borderRadius: '0.5rem',
                    fontWeight: '600',
                    minWidth: '200px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    fontSize: '1rem',
                    fontFamily: 'inherit'
                  }}
                >
                  Create Account
                </button>
                
                <button
                  onClick={handleSignIn}
                  style={{
                    display: 'inline-block',
                    padding: '0.75rem 2rem',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    borderRadius: '0.5rem',
                    fontWeight: '600',
                    border: '1px solid rgba(255,255,255,0.2)',
                    minWidth: '200px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    backdropFilter: 'blur(8px)',
                    fontSize: '1rem',
                    fontFamily: 'inherit'
                  }}
                >
                  Sign In
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Footer */}
        <div style={{
          position: 'fixed',
          bottom: '1rem',
          width: '100%',
          textAlign: 'center',
          color: 'rgba(255,255,255,0.5)',
          fontSize: '0.875rem',
          zIndex: 2
        }}>
          &copy; {new Date().getFullYear()} FounderConnect - Chapman University
        </div>
      </div>
    </>
  );
} 