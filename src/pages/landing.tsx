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
  const [progress, setProgress] = useState(0);

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

  // Update progress bar based on current step
  useEffect(() => {
    setProgress((currentStep / (steps.length - 1)) * 100);
  }, [currentStep]);

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
    window.location.href = '/auth/signin'; // Changed from signup to signin
  };

  // Helper function to check if a field has a value
  const hasValue = (field: string | undefined): boolean => {
    if (!field) return false;
    return Boolean(answers[field as keyof typeof answers]);
  };

  // Styling
  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: '#090618',
    color: 'white',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    padding: '20px',
    justifyContent: 'center',
    position: 'relative'
  };
  
  const progressBarContainerStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '4px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    zIndex: 10
  };
  
  const progressBarStyle: React.CSSProperties = {
    height: '100%',
    backgroundColor: '#8B5CF6',
    transition: 'width 0.3s ease-out'
  };
  
  const formContainerStyle: React.CSSProperties = {
    maxWidth: '700px',
    width: '100%',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    transition: 'opacity 0.3s ease, transform 0.3s ease',
    zIndex: 5
  };
  
  const headerStyle: React.CSSProperties = {
    marginBottom: '40px',
    textAlign: 'center'
  };
  
  const titleStyle: React.CSSProperties = {
    fontSize: '42px',
    fontWeight: '700',
    marginBottom: '15px'
  };
  
  const introTitleStyle: React.CSSProperties = {
    fontSize: '48px',
    fontWeight: '800',
    marginBottom: '20px',
    background: 'linear-gradient(to right, #ffffff, #e0e0e0)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  };
  
  const descriptionStyle: React.CSSProperties = {
    fontSize: '18px',
    color: 'rgba(255, 255, 255, 0.7)',
    maxWidth: '600px',
    margin: '0 auto'
  };
  
  const contentStyle: React.CSSProperties = {
    marginBottom: '40px',
    flex: 1
  };
  
  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '16px 20px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: 'none',
    borderBottom: '3px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '8px 8px 0 0',
    color: 'white',
    fontSize: '18px',
    outline: 'none',
    transition: 'border-bottom-color 0.2s ease',
    marginBottom: '20px'
  };
  
  const navigationStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '20px'
  };
  
  const nextButtonStyle: React.CSSProperties = {
    padding: '12px 24px',
    backgroundColor: 'white',
    color: '#090618',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '16px',
    cursor: 'pointer',
    marginLeft: 'auto',
    transition: 'transform 0.2s ease, opacity 0.2s ease'
  };
  
  const primaryButtonStyle: React.CSSProperties = {
    padding: '14px 28px',
    backgroundColor: 'white',
    color: '#090618',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'transform 0.2s ease'
  };
  
  const secondaryButtonStyle: React.CSSProperties = {
    padding: '14px 28px',
    backgroundColor: 'transparent',
    color: 'white',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '8px',
    fontWeight: '500',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease'
  };
  
  const optionsContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  };
  
  const optionStyle: React.CSSProperties = {
    padding: '16px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease'
  };

  return (
    <>
      <Head>
        <title>FounderConnect - Chapman University</title>
        <meta name="description" content="Connect with Chapman University founders, find co-founders, and build your startup." />
      </Head>
      
      <div style={containerStyle}>
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
        
        {/* Progress bar */}
        <div style={progressBarContainerStyle}>
          <div style={{...progressBarStyle, width: `${progress}%`}}></div>
        </div>
        
        <div style={{
          ...formContainerStyle,
          opacity: isTransitioning ? 0 : 1,
          transform: isTransitioning ? 'translateY(20px)' : 'translateY(0)'
        }}>
          {/* Step title and description */}
          <div style={headerStyle}>
            <h1 style={steps[currentStep].type === 'intro' ? introTitleStyle : titleStyle}>
              {steps[currentStep].question}
            </h1>
            <p style={descriptionStyle}>
              {steps[currentStep].subtext}
            </p>
          </div>
          
          {/* Step content */}
          <div style={contentStyle}>
            {steps[currentStep].type === 'text' && steps[currentStep].field && (
              <input
                type="text"
                value={answers[steps[currentStep].field as keyof typeof answers] || ''}
                onChange={handleInputChange}
                placeholder="Type your answer here..."
                style={inputStyle}
                autoFocus
              />
            )}
            
            {steps[currentStep].type === 'options' && steps[currentStep].options && (
              <div style={optionsContainerStyle}>
                {steps[currentStep].options.map((option, index) => (
                  <div 
                    key={index}
                    onClick={() => handleOptionSelect(option)}
                    style={{
                      ...optionStyle,
                      backgroundColor: steps[currentStep].field && 
                        answers[steps[currentStep].field as keyof typeof answers] === option 
                        ? 'rgba(255, 255, 255, 0.1)' 
                        : 'transparent'
                    }}
                  >
                    <span>{option}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Navigation buttons */}
          {steps[currentStep].type === 'intro' && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: '16px', 
              marginBottom: '20px' 
            }}>
              <button
                onClick={handleGetStarted}
                style={{
                  padding: '12px 24px',
                  backgroundColor: 'white',
                  color: '#090618',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  fontSize: '16px',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease, opacity 0.2s ease'
                }}
              >
                Get Started →
              </button>
              
              <button
                onClick={handleSignIn}
                style={{
                  padding: '12px 24px',
                  backgroundColor: 'transparent',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '8px',
                  fontWeight: '500',
                  fontSize: '16px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease'
                }}
              >
                Sign In
              </button>
            </div>
          )}
          
          {steps[currentStep].type === 'text' && (
            <div style={navigationStyle}>
              <button
                onClick={goToNextStep}
                disabled={!hasValue(steps[currentStep].field)}
                style={{
                  ...nextButtonStyle,
                  opacity: hasValue(steps[currentStep].field) ? 1 : 0.5,
                  cursor: hasValue(steps[currentStep].field) ? 'pointer' : 'not-allowed'
                }}
              >
                Continue
              </button>
            </div>
          )}
          
          {/* Final step buttons */}
          {steps[currentStep].type === 'final' && (
            <div style={navigationStyle}>
              <button
                onClick={handleSignIn}
                style={secondaryButtonStyle}
              >
                Sign In
              </button>
              
              <button
                onClick={handleGetStarted}
                style={primaryButtonStyle}
              >
                Create Account
              </button>
            </div>
          )}
          
          {/* Sign in link for non-final, non-intro steps */}
          {steps[currentStep].type !== 'final' && steps[currentStep].type !== 'intro' && (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '16px' }}>
                Already have an account?{' '}
                <a 
                  onClick={handleSignIn} 
                  style={{ 
                    color: 'white', 
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  Sign in
                </a>
              </span>
            </div>
          )}
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