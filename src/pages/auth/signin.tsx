import React, { useState, useEffect, KeyboardEvent } from 'react';
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
  
  // Handle key press for navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && steps[currentStepIndex].validateFunc && steps[currentStepIndex].validateFunc()) {
        goToNextStep();
      }
    };

    window.addEventListener('keydown', handleKeyDown as unknown as EventListener);
    return () => window.removeEventListener('keydown', handleKeyDown as unknown as EventListener);
  }, [currentStepIndex, email, password]);
  
  // Go to next step
  const goToNextStep = () => {
    const currentStep = steps[currentStepIndex];
    
    // Validate current step if required
    if (currentStep.required && currentStep.validateFunc && !currentStep.validateFunc()) {
      setError(`Please complete this step before continuing`);
      return;
    }
    
    setError('');
    
    if (currentStepIndex < steps.length - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStepIndex(currentStepIndex + 1);
        setIsTransitioning(false);
      }, 300);
    } else {
      // If we're on the last step, handle form submission
      handleSubmit();
    }
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
  
  // Handle form submission
  const handleSubmit = async () => {
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      /* Comment for MVP
      const result = await signIn(email, password);
      if (result.success) {
        router.push('/');
      } else {
        setError(result.error || 'Invalid email or password');
      }
      */
      
      // Simulate successful login for now
      setTimeout(() => {
        router.push('/');
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Go to sign-up page
  const goToSignUp = () => {
    window.location.href = '/auth/signup'; // Using window.location for a full page reload
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
  
  const gradientTextStyle = {
    fontSize: '3rem',
    fontWeight: 'bold',
    background: 'linear-gradient(to right, #ffffff, #e0e0e0)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '1.5rem',
    textAlign: 'center'
  } as React.CSSProperties;
  
  const descriptionStyle: React.CSSProperties = {
    fontSize: '18px',
    color: 'rgba(255, 255, 255, 0.7)'
  };
  
  const subtextStyle: React.CSSProperties = {
    fontSize: '22px',
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: '30px'
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
  
  const backButtonStyle: React.CSSProperties = {
    padding: '12px 24px',
    backgroundColor: 'transparent',
    color: 'white',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '8px',
    fontWeight: '500',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease'
  };
  
  const createAccountButtonStyle: React.CSSProperties = {
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
  
  const errorTextStyle: React.CSSProperties = {
    color: '#f87171',
    fontSize: '14px',
    marginBottom: '20px',
    textAlign: 'center'
  };

  // Define steps - now with separate steps for email and password
  const steps: Step[] = [
    {
      id: 'email',
      title: 'What\'s your Chapman email?',
      description: 'We use your email address to identify your account',
      component: (
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.name@chapman.edu"
            style={inputStyle}
            autoFocus
          />
        </div>
      ),
      required: true,
      validateFunc: () => !!email
    },
    {
      id: 'password',
      title: 'What\'s your password?',
      component: (
        <div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your Password"
            style={inputStyle}
            autoFocus
          />
        </div>
      ),
      required: true,
      validateFunc: () => !!password
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
          
          {/* Navigation buttons */}
          <div style={navigationStyle}>
            {currentStepIndex > 0 && (
              <button 
                onClick={goToPrevStep} 
                style={backButtonStyle}
                disabled={isTransitioning}
              >
                Back
              </button>
            )}

            {currentStepIndex === steps.length - 1 ? (
              <button 
                onClick={handleSubmit} 
                style={nextButtonStyle}
                disabled={isLoading || !currentStep.validateFunc?.()}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            ) : (
              <button 
                onClick={goToNextStep} 
                style={nextButtonStyle}
                disabled={isTransitioning || !currentStep.validateFunc?.()}
              >
                Continue
              </button>
            )}
          </div>
          
          {/* Sign up link */}
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '16px' }}>
              Don't have an account?{' '}
              <a 
                onClick={goToSignUp} 
                style={{ 
                  color: 'white', 
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                Sign up
              </a>
            </span>
          </div>
        </div>
      </div>
    </>
  );
} 