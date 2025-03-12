import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import { useAuth } from '@/utils/AuthContext';

// Step interface for Typeform-like experience
interface Step {
  id: string;
  title: string;
  description?: string;
  component: React.ReactNode;
  required?: boolean;
  validateFunc?: () => boolean;
}

export default function SignIn() {
  const router = useRouter();
  const { signIn } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form transition state
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isClient, setIsClient] = useState(false);
  
  // Set isClient to true once component mounts (client-side only)
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Update progress bar based on current step
  useEffect(() => {
    setProgress((currentStepIndex / (steps.length - 1)) * 100);
  }, [currentStepIndex]);
  
  // Handle form submission
  const handleSubmit = async () => {
    // Redirect directly to the sign-up page
    window.location.href = '/auth/signup'; // Using window.location for a full page reload
  };
  
  // Go to next step
  const goToNextStep = () => {
    // Redirect directly to the sign-up page
    window.location.href = '/auth/signup'; // Using window.location for a full page reload
  };

  // Go to previous step
  const goToPrevStep = () => {
    if (currentStepIndex > 0) {
      setIsTransitioning(true);
      setError('');
      setTimeout(() => {
        setCurrentStepIndex(currentStepIndex - 1);
        setIsTransitioning(false);
      }, 300);
    }
  };
  
  // Styles
  const gradientTextStyle = {
    fontSize: '1.8rem',
    fontWeight: 'bold' as const,
    background: 'linear-gradient(to right, #ffffff, #e0e0e0)',
    WebkitBackgroundClip: 'text' as const,
    WebkitTextFillColor: 'transparent' as const,
    marginBottom: '1rem',
    textAlign: 'center' as const
  };
  
  const subtextStyle = {
    fontSize: '1rem',
    color: '#d1d5db',
    marginBottom: '1.5rem',
    textAlign: 'center' as const
  };
  
  const containerStyle = {
    minHeight: '100vh',
    backgroundColor: '#090618',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    position: 'relative' as const,
    overflow: 'hidden' as const
  };
  
  const backgroundStyle = {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: 'url(/images/background.png)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    zIndex: 0
  };
  
  const overlayStyle = {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(to bottom, rgba(9,6,24,0.4), rgba(9,6,24,0.8))',
    zIndex: 1
  };
  
  const progressBarContainerStyle = {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '4px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    zIndex: 10
  };
  
  const progressBarStyle = {
    height: '100%',
    backgroundColor: 'white',
    transition: 'width 0.5s ease'
  };
  
  const formContainerStyle = {
    maxWidth: '500px',
    width: '100%',
    padding: '2rem',
    borderRadius: '0.5rem',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'opacity 0.3s ease, transform 0.3s ease',
    position: 'relative' as const,
    zIndex: 2
  };
  
  const headerStyle = {
    marginBottom: '2rem',
    textAlign: 'center' as const
  };
  
  const titleStyle = {
    fontSize: '1.8rem',
    fontWeight: 'bold' as const,
    marginBottom: '0.5rem',
    background: 'linear-gradient(to right, #ffffff, #e0e0e0)',
    WebkitBackgroundClip: 'text' as const,
    WebkitTextFillColor: 'transparent' as const
  };
  
  const descriptionStyle = {
    fontSize: '1rem',
    color: '#d1d5db'
  };
  
  const contentStyle = {
    marginBottom: '2rem'
  };
  
  const navigationStyle = {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '1.5rem'
  };
  
  const buttonStyle = {
    padding: '0.75rem 2rem',
    backgroundColor: 'white',
    color: '#090618',
    border: 'none',
    borderRadius: '0.5rem',
    fontWeight: '600',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  };
  
  const errorTextStyle = {
    color: '#f87171',
    fontSize: '0.875rem',
    marginBottom: '1rem',
    textAlign: 'center' as const
  };
  
  // Define steps - simplified to one step that redirects to sign-up
  const steps: Step[] = [
    {
      id: 'redirect',
      title: 'Join FounderConnect',
      description: 'Connect with Chapman founders, find co-founders, and access startup resources.',
      component: (
        <div style={{ textAlign: 'center' }}>
          <h2 style={gradientTextStyle}>Welcome to FounderConnect</h2>
          <p style={subtextStyle}>Create an account to connect with Chapman University entrepreneurs and innovators.</p>
        </div>
      )
    }
  ];

  // Current step
  const currentStep = steps[currentStepIndex];
  
  if (!isClient) {
    return null; // Don't render anything during SSR
  }

  return (
    <>
      <Head>
        <title>Sign In - FounderConnect</title>
      </Head>
      
      <div style={containerStyle}>
        {/* Background Image */}
        <div style={backgroundStyle} />
        
        {/* Overlay */}
        <div style={overlayStyle} />
        
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
            <h1 style={titleStyle}>{currentStep.title}</h1>
            {currentStep.description && (
              <p style={descriptionStyle}>{currentStep.description}</p>
            )}
          </div>
          
          {/* Display error message */}
          {error && (
            <div style={errorTextStyle}>
              {error}
            </div>
          )}
          
          {/* Step content */}
          <div style={contentStyle}>
            {currentStep.component}
          </div>
          
          {/* Navigation button - directs to sign-up */}
          <div style={navigationStyle}>
            <button 
              onClick={goToNextStep} 
              style={buttonStyle}
            >
              Create an Account
            </button>
          </div>
        </div>
      </div>
    </>
  );
} 