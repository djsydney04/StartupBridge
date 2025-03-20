import React, { useState, useEffect, KeyboardEvent } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import { signUp, createProfile } from '@/utils/supabase';

// Define interfaces for the form data
interface BasicInfo {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  major: string;
  year: string;
  interests: string;
  skills: string;
  linkedinUrl: string;
  xUrl: string;
}

interface RoleLookingFor {
  cofounder: boolean;
  talent: boolean;
  job: boolean;
  resources: boolean;
}

interface FounderInfo {
  lookingFor: string;
  startupName: string;
  startupIdea: string;
  rolesNeeded: string;
  skills: string;
  stage: string;
}

interface JobInfo {
  roles: string[];
  experience: string;
  resumeUrl: string;
}

interface AdditionalInfo {
  industries: string;
  commitment: string;
}

interface FormData {
  basicInfo: BasicInfo;
  roleLookingFor: RoleLookingFor;
  founderInfo: FounderInfo;
  jobInfo: JobInfo;
  additionalInfo: AdditionalInfo;
}

// Step interface for Typeform-like experience
interface Step {
  id: string;
  title: string;
  description?: string;
  component: React.ReactNode;
  required?: boolean;
  validateFunc?: () => boolean;
}

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

const primaryButtonStyle: React.CSSProperties = {
  padding: '14px 28px',
  backgroundColor: 'white',
  color: '#090618',
  border: 'none',
  borderRadius: '8px',
  fontWeight: '600',
  fontSize: '16px',
  cursor: 'pointer',
  transition: 'transform 0.2s ease',
  marginTop: '20px'
};

const signInLinkContainerStyle: React.CSSProperties = {
  textAlign: 'center',
  marginTop: '20px',
  fontSize: '14px',
  color: 'rgba(255, 255, 255, 0.7)'
};

const linkStyle: React.CSSProperties = {
  color: 'white',
  textDecoration: 'underline'
};

const errorTextStyle: React.CSSProperties = {
  color: '#f87171',
  fontSize: '14px',
  marginTop: '8px'
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

export default function SignUp() {
  const router = useRouter();
  
  // Current step in the form
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [registrationCompleted, setRegistrationCompleted] = useState(false);
  
  // Set isClient to true once component mounts (client-side only)
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Form data
  const [formData, setFormData] = useState<FormData>({
    basicInfo: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      major: '',
      year: '',
      interests: '',
      skills: '',
      linkedinUrl: '',
      xUrl: ''
    },
    roleLookingFor: {
      cofounder: false,
      talent: false,
      job: false,
      resources: false
    },
    founderInfo: {
      lookingFor: '',
      startupName: '',
      startupIdea: '',
      rolesNeeded: '',
      skills: '',
      stage: 'Idea'
    },
    jobInfo: {
      roles: [],
      experience: '',
      resumeUrl: ''
    },
    additionalInfo: {
      industries: '',
      commitment: ''
    }
  });

  // Update basic info fields
  const updateBasicInfo = (field: keyof BasicInfo, value: string) => {
    setFormData({
      ...formData,
      basicInfo: {
        ...formData.basicInfo,
        [field]: value
      }
    });
  };

  // Update role selection
  const updateRoleLookingFor = (field: keyof RoleLookingFor, value: boolean) => {
    setFormData({
      ...formData,
      roleLookingFor: {
        ...formData.roleLookingFor,
        [field]: value
      }
    });
  };

  // Update founder info
  const updateFounderInfo = (field: keyof FounderInfo, value: string) => {
    setFormData({
      ...formData,
      founderInfo: {
        ...formData.founderInfo,
        [field]: value
      }
    });
  };

  // Update job info
  const updateJobInfo = (field: keyof JobInfo, value: any) => {
    setFormData({
      ...formData,
      jobInfo: {
        ...formData.jobInfo,
        [field]: value
      }
    });
  };

  // Update additional info
  const updateAdditionalInfo = (field: keyof AdditionalInfo, value: string) => {
    setFormData({
      ...formData,
      additionalInfo: {
        ...formData.additionalInfo,
        [field]: value
      }
    });
  };

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

  // Submit form
  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // Collect all profile information from form
      const completeProfileData = {
        full_name: formData.basicInfo.fullName,
        university: 'Chapman University',
        major: formData.basicInfo.major,
        year: formData.basicInfo.year,
        skills: formData.basicInfo.skills.split(',').map(i => i.trim()).filter(Boolean),
        interests: formData.basicInfo.interests.split(',').map(i => i.trim()).filter(Boolean),
        linkedin_url: formData.basicInfo.linkedinUrl,
        twitter_url: formData.basicInfo.xUrl
      };
      
      // Sign up with email, password, and complete profile data
      const result = await signUp(
        formData.basicInfo.email, 
        formData.basicInfo.password,
        completeProfileData
      );
      
      if (result.success) {
        // Save questionnaire data to localStorage for profile completion
        const questionnaireData = {
          name: formData.basicInfo.fullName,
          skills: formData.basicInfo.skills,
          major: formData.basicInfo.major,
          year: formData.basicInfo.year,
          interests: formData.basicInfo.interests,
          linkedin_url: formData.basicInfo.linkedinUrl,
          twitter_url: formData.basicInfo.xUrl
        };
        
        try {
          localStorage.setItem('founderConnectQuestionnaire', JSON.stringify(questionnaireData));
        } catch (e) {
          console.error('Error saving questionnaire data:', e);
        }
        
        // Show registration completed screen for 2 seconds
        setRegistrationCompleted(true);
        
        // Redirect to sign in page after 2 seconds
        setTimeout(() => {
          router.push('/auth/signin?registered=true');
        }, 2000);
      } else {
        setError(result.error || 'Failed to create account');
        setIsLoading(false);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setIsLoading(false);
    }
  };

  // Define all steps for the form
  const steps: Step[] = [
    // Basic Information section - removed welcome step
    {
      id: 'name',
      title: 'What\'s your name?',
      component: (
        <div>
          <input
            type="text"
            value={formData.basicInfo.fullName}
            onChange={(e) => updateBasicInfo('fullName', e.target.value)}
            placeholder="Full Name"
            style={inputStyle}
            autoFocus
          />
        </div>
      ),
      required: true,
      validateFunc: () => !!formData.basicInfo.fullName
    },
    {
      id: 'email',
      title: 'What\'s your Chapman email?',
      description: 'We\'ll verify your Chapman affiliation with this email.',
      component: (
        <div>
          <input
            type="email"
            value={formData.basicInfo.email}
            onChange={(e) => updateBasicInfo('email', e.target.value)}
            placeholder="your.name@chapman.edu"
            style={inputStyle}
          />
          {formData.basicInfo.email && !formData.basicInfo.email.endsWith('@chapman.edu') && (
            <p style={errorTextStyle}>Please use your Chapman University email</p>
          )}
        </div>
      ),
      required: true,
      validateFunc: () => !!formData.basicInfo.email && formData.basicInfo.email.endsWith('@chapman.edu')
    },
    {
      id: 'password',
      title: 'Create a password',
      component: (
        <div>
          <input
            type="password"
            value={formData.basicInfo.password}
            onChange={(e) => updateBasicInfo('password', e.target.value)}
            placeholder="Password (min 8 characters)"
            style={inputStyle}
          />
          <input
            type="password"
            value={formData.basicInfo.confirmPassword}
            onChange={(e) => updateBasicInfo('confirmPassword', e.target.value)}
            placeholder="Confirm Password"
            style={{...inputStyle, marginTop: '10px'}}
          />
          {formData.basicInfo.password && formData.basicInfo.password.length < 8 && (
            <p style={errorTextStyle}>Password must be at least 8 characters</p>
          )}
          {formData.basicInfo.confirmPassword && formData.basicInfo.password !== formData.basicInfo.confirmPassword && (
            <p style={errorTextStyle}>Passwords don't match</p>
          )}
        </div>
      ),
      required: true,
      validateFunc: () => 
        !!formData.basicInfo.password && 
        formData.basicInfo.password.length >= 8 && 
        formData.basicInfo.password === formData.basicInfo.confirmPassword
    },
    {
      id: 'major-year',
      title: 'What are you studying?',
      component: (
        <div>
          <input
            type="text"
            value={formData.basicInfo.major}
            onChange={(e) => updateBasicInfo('major', e.target.value)}
            placeholder="Your Major"
            style={inputStyle}
          />
          <select
            value={formData.basicInfo.year}
            onChange={(e) => updateBasicInfo('year', e.target.value)}
            style={{...inputStyle, marginTop: '10px'}}
          >
            <option value="">Select Year</option>
            <option value="Freshman">Freshman</option>
            <option value="Sophomore">Sophomore</option>
            <option value="Junior">Junior</option>
            <option value="Senior">Senior</option>
            <option value="Graduate">Graduate</option>
            <option value="Alumni">Alumni</option>
          </select>
        </div>
      ),
      required: true,
      validateFunc: () => !!formData.basicInfo.major && !!formData.basicInfo.year
    },
    {
      id: 'interests-skills',
      title: 'What are your interests and skills?',
      component: (
        <div>
          <input
            type="text"
            value={formData.basicInfo.interests}
            onChange={(e) => updateBasicInfo('interests', e.target.value)}
            placeholder="Interests (comma separated)"
            style={inputStyle}
          />
          <input
            type="text"
            value={formData.basicInfo.skills}
            onChange={(e) => updateBasicInfo('skills', e.target.value)}
            placeholder="Skills (comma separated)"
            style={{...inputStyle, marginTop: '10px'}}
          />
        </div>
      ),
      required: true,
      validateFunc: () => !!formData.basicInfo.interests && !!formData.basicInfo.skills
    },
    {
      id: 'social-links',
      title: 'Share your professional profiles',
      description: 'Add your LinkedIn and X (Twitter) profiles',
      component: (
        <div>
          <input
            type="url"
            value={formData.basicInfo.linkedinUrl}
            onChange={(e) => updateBasicInfo('linkedinUrl', e.target.value)}
            placeholder="LinkedIn URL"
            style={inputStyle}
          />
          <input
            type="url"
            value={formData.basicInfo.xUrl}
            onChange={(e) => updateBasicInfo('xUrl', e.target.value)}
            placeholder="X (Twitter) URL"
            style={{...inputStyle, marginTop: '10px'}}
          />
        </div>
      )
    },
    {
      id: 'looking-for',
      title: 'What are you looking for?',
      description: 'Select all that apply',
      component: (
        <div style={optionsContainerStyle}>
          <div 
            style={{
              ...optionStyle,
              backgroundColor: formData.roleLookingFor.cofounder ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
            }}
            onClick={() => updateRoleLookingFor('cofounder', !formData.roleLookingFor.cofounder)}
          >
            <span>I'm a Founder Looking for a Co-Founder</span>
          </div>
          <div 
            style={{
              ...optionStyle,
              backgroundColor: formData.roleLookingFor.talent ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
            }}
            onClick={() => updateRoleLookingFor('talent', !formData.roleLookingFor.talent)}
          >
            <span>I'm a Founder Looking for Talent (but not a Co-Founder)</span>
          </div>
          <div 
            style={{
              ...optionStyle,
              backgroundColor: formData.roleLookingFor.job ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
            }}
            onClick={() => updateRoleLookingFor('job', !formData.roleLookingFor.job)}
          >
            <span>I'm Looking for a Startup Job/Internship</span>
          </div>
          <div 
            style={{
              ...optionStyle,
              backgroundColor: formData.roleLookingFor.resources ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
            }}
            onClick={() => updateRoleLookingFor('resources', !formData.roleLookingFor.resources)}
          >
            <span>I'm Looking for Startup Resources & Networking</span>
          </div>
        </div>
      ),
      required: true,
      validateFunc: () => 
        formData.roleLookingFor.cofounder || 
        formData.roleLookingFor.talent || 
        formData.roleLookingFor.job || 
        formData.roleLookingFor.resources
    },
    {
      id: 'complete',
      title: 'You\'re all set!',
      description: 'Click below to create your account and join FounderConnect.',
      component: (
        <div style={{ textAlign: 'center' }}>
          <button 
            onClick={handleSubmit} 
            style={primaryButtonStyle}
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Complete Registration'}
          </button>
          {error && <p style={errorTextStyle}>{error}</p>}
        </div>
      )
    }
  ];

  // Calculate progress percentage
  useEffect(() => {
    const progressPercentage = (currentStepIndex / (steps.length - 1)) * 100;
    setProgress(progressPercentage);
  }, [currentStepIndex, steps.length]);

  // Handle key press for navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && currentStepIndex < steps.length - 1) {
        goToNextStep();
      } else if (e.key === 'Escape' && currentStepIndex > 0) {
        goToPrevStep();
      }
    };

    window.addEventListener('keydown', handleKeyDown as unknown as EventListener);
    return () => window.removeEventListener('keydown', handleKeyDown as unknown as EventListener);
  }, [currentStepIndex]);

  // If showing the registration completed screen
  if (registrationCompleted) {
    return (
      <>
        <Head>
          <title>Registration Complete - FounderConnect</title>
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
          
          <div style={{
            maxWidth: '700px',
            width: '100%',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 5,
            textAlign: 'center'
          }}>
            <h1 style={{
              fontSize: '2.5rem',
              marginBottom: '1.5rem',
              color: 'white'
            }}>
              Registration Complete!
            </h1>
            <p style={{
              fontSize: '1.25rem',
              marginBottom: '2rem',
              color: 'rgba(255, 255, 255, 0.8)'
            }}>
              Welcome to FounderConnect
            </p>
            <div style={{ 
              width: '60px',
              height: '60px',
              border: '5px solid rgba(255,255,255,0.1)',
              borderTopColor: '#8B5CF6',
              borderRadius: '50%',
              display: 'inline-block',
              animation: 'spin 1s ease-in-out infinite'
            }}>
            </div>
            <style jsx>{`
              @keyframes spin {
                to { transform: rotate(360deg) }
              }
            `}</style>
          </div>
        </div>
      </>
    );
  }

  // If not client-side, return a simple loading indicator
  if (!isClient) {
    return (
      <>
        <Head>
          <title>Sign Up - FounderConnect</title>
        </Head>
        <div style={containerStyle}>
          <div style={{ textAlign: 'center', marginTop: '100px' }}>
            <h1>Loading signup form...</h1>
            <div style={{ 
              marginTop: '1rem',
              width: '50px',
              height: '50px',
              border: '5px solid rgba(255,255,255,0.1)',
              borderTopColor: '#805ad5',
              borderRadius: '50%',
              display: 'inline-block',
              animation: 'spin 1s ease-in-out infinite'
            }}>
            </div>
            <style jsx>{`
              @keyframes spin {
                to { transform: rotate(360deg) }
              }
            `}</style>
          </div>
        </div>
      </>
    );
  }

  const currentStep = steps[currentStepIndex];

  return (
    <>
      <Head>
        <title>Sign Up - FounderConnect</title>
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
            
            {currentStepIndex < steps.length - 1 && (
              <button 
                onClick={goToNextStep} 
                style={nextButtonStyle}
                disabled={isTransitioning}
              >
                Continue
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}