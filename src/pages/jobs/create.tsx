import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Combobox, Transition } from '@headlessui/react';
import { skillCategories } from '@/utils/skillCategories';
import { ChevronUpIcon, ChevronDownIcon, CheckIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Poppins } from 'next/font/google';
import { useRouter } from 'next/router';

interface FormData {
  title: string;
  company: string;
  location: string;
  description: string;
  skills: string[];
  hoursPerWeek: string;
  companyStage: string;
  timeCommitment: string;
  companyWebsite?: string;
  companyLinkedIn?: string;
  companySocial?: string;
}

interface Question {
  id: keyof FormData;
  question: string;
  placeholder?: string;
  type: 'text' | 'textarea' | 'select' | 'skills';
  options?: string[];
  required?: boolean;
}

const initialFormData: FormData = {
  title: '',
  company: '',
  location: '',
  description: '',
  skills: [],
  hoursPerWeek: '',
  companyStage: '',
  timeCommitment: '',
  companyWebsite: '',
  companyLinkedIn: '',
  companySocial: '',
};

const questions: Question[] = [
  {
    id: 'title',
    question: "What's the job title?",
    placeholder: 'e.g. Frontend Developer, Product Manager, etc.',
    type: 'text',
    required: true,
  },
  {
    id: 'company',
    question: "Company name",
    placeholder: 'Enter your company name',
    type: 'text',
    required: true,
  },
  {
    id: 'companyWebsite',
    question: "Company website",
    placeholder: 'https://...',
    type: 'text',
    required: false,
  },
  {
    id: 'companyLinkedIn',
    question: "Company LinkedIn",
    placeholder: 'https://linkedin.com/company/...',
    type: 'text',
    required: false,
  },
  {
    id: 'companySocial',
    question: "Company X/Instagram",
    placeholder: '@username or profile URL',
    type: 'text',
    required: false,
  },
  {
    id: 'location',
    question: 'Where is this job located?',
    placeholder: 'e.g. Remote, San Francisco, New York, etc.',
    type: 'text',
    required: true,
  },
  {
    id: 'description',
    question: 'Describe the role and responsibilities',
    placeholder: 'What will the candidate be doing? What are you looking for?',
    type: 'textarea',
    required: true,
  },
  {
    id: 'skills',
    question: 'What skills are required?',
    type: 'skills',
    required: true,
  },
  {
    id: 'timeCommitment',
    question: 'What type of commitment are you looking for?',
    type: 'select',
    options: [
      'Full-time',
      'Part-time',
      'Contract',
      'Internship',
    ],
    required: true,
  },
  {
    id: 'hoursPerWeek',
    question: 'How many hours per week?',
    type: 'select',
    options: [
      '10-20 hours/week',
      '20-30 hours/week',
      '30-40 hours/week',
      '40+ hours/week',
    ],
    required: true,
  },
  {
    id: 'companyStage',
    question: "What's your company stage?",
    type: 'select',
    options: [
      'Pre-seed',
      'Seed',
      'Series A',
      'Series B',
      'Series C+',
    ],
    required: true,
  },
];

const poppins = Poppins({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
});

export default function CreateJobPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [skillQuery, setSkillQuery] = useState('');
  const [isReviewing, setIsReviewing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);
  const router = useRouter();

  const handleInputChange = (value: string | string[]) => {
    const currentQuestion = questions[currentQuestionIndex];
    setFormData(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setIsReviewing(true);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      goToNextQuestion();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentQuestionIndex]);

  const getAllSkills = () => {
    const allSkills: string[] = [];
    Object.values(skillCategories).forEach(category => {
      Object.values(category.skills).forEach(skillArray => {
        allSkills.push(...skillArray);
      });
    });
    return Array.from(new Set(allSkills)).sort();
  };

  const filteredSkills = skillQuery === '' 
    ? [] 
    : getAllSkills().filter(skill => 
        skill.toLowerCase().includes(skillQuery.toLowerCase())
      );

  const handlePublishJob = async () => {
    setIsSubmitting(true);
    
    // Simulate API call with a delay
    setTimeout(() => {
      // In a real implementation, you would send the form data to your API
      console.log('Publishing job:', formData);
      
      // Mark as success and redirect after a moment
      setIsSubmitSuccess(true);
      
      setTimeout(() => {
        router.push('/jobs/manage');
      }, 2000);
    }, 1000);
  };

  const renderQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const progress = Math.round((currentQuestionIndex + 1) / questions.length * 100);

    return (
      <div className="min-h-screen bg-white">
        <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <Link
                href="/jobs"
                className="text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                ← Back to jobs
              </Link>
              <span className="text-sm font-medium text-gray-500">
                {progress}% complete
              </span>
            </div>
            <div className="mt-4 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-1 bg-black transition-all duration-500"
                style={{
                  width: `${isReviewing ? 100 : ((currentQuestionIndex + 1) / questions.length) * 100}%`
                }}
              />
            </div>
          </div>
        </div>

        <div className="flex max-w-6xl mx-auto">
          {/* Left sidebar with steps */}
          <div className="hidden lg:block w-64 pt-32 pr-8 border-r border-gray-100">
            <div className="sticky top-32">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Job Details
              </h3>
              <ol className="space-y-6">
                {questions.map((q, index) => (
                  <li key={q.id} className="flex items-start">
                    <div className={`flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center text-xs mr-3 ${
                      index < currentQuestionIndex 
                        ? 'bg-black text-white' 
                        : index === currentQuestionIndex
                          ? 'border-2 border-black text-black'
                          : 'border border-gray-300 text-gray-400'
                    }`}>
                      {index < currentQuestionIndex ? '✓' : index + 1}
                    </div>
                    <span className={`text-sm ${
                      index === currentQuestionIndex 
                        ? 'font-medium text-black' 
                        : index < currentQuestionIndex
                          ? 'text-gray-700'
                          : 'text-gray-400'
                    }`}>
                      {q.question}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Main content */}
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 px-4 sm:px-6 lg:px-8 pt-32 pb-16"
          >
            <div className="relative">
              {/* Decorative pattern */}
              <div className="absolute top-4 right-0 w-64 h-64 bg-gradient-to-br from-gray-50 to-transparent rounded-full opacity-60 -z-10" />
              
              <h2 className={`text-4xl font-semibold mb-2 text-gray-900 ${poppins.className}`}>
                {currentQuestion.question}
              </h2>
              {!currentQuestion.required && (
                <p className="text-sm text-gray-500 mb-6">Optional</p>
              )}

              {currentQuestion.type === 'text' && (
                <div className="relative mt-8">
                  <input
                    type="text"
                    value={formData[currentQuestion.id] as string}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && formData[currentQuestion.id]) {
                        e.preventDefault();
                        goToNextQuestion();
                      }
                    }}
                    placeholder={currentQuestion.placeholder}
                    className={`w-full px-0 py-6 text-2xl border-0 border-b-2 border-gray-200 hover:border-gray-300 focus:border-black focus:outline-none focus:ring-0 bg-transparent ${poppins.className}`}
                    autoFocus
                  />
                </div>
              )}

              {currentQuestion.type === 'textarea' && (
                <div className="mt-6 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-50 via-transparent to-gray-50 rounded-lg -z-10 opacity-40" />
                  <textarea
                    value={formData[currentQuestion.id] as string}
                    onChange={(e) => handleInputChange(e.target.value)}
                    placeholder={currentQuestion.placeholder}
                    rows={5}
                    className="w-full px-6 py-5 text-lg border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black bg-white shadow-sm"
                    autoFocus
                  />
                </div>
              )}

              {currentQuestion.type === 'select' && currentQuestion.options && (
                <div className="space-y-3 mt-8">
                  {currentQuestion.options.map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        handleInputChange(option);
                        goToNextQuestion();
                      }}
                      className={`group w-full px-6 py-5 text-left text-lg border-2 rounded-xl transition-all 
                        ${formData[currentQuestion.id] === option
                          ? 'border-black bg-gray-50 text-gray-900 shadow-sm'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                      <div className="flex items-center">
                        <div className={`w-5 h-5 mr-3 rounded-full border-2 flex items-center justify-center
                          ${formData[currentQuestion.id] === option
                            ? 'border-black bg-black'
                            : 'border-gray-300 group-hover:border-gray-400'
                          }`}
                        >
                          {formData[currentQuestion.id] === option && (
                            <div className="w-2 h-2 rounded-full bg-white" />
                          )}
                        </div>
                        {option}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {currentQuestion.type === 'skills' && (
                <div className="space-y-4 mt-8">
                  <Combobox
                    value={null}
                    onChange={(skill: string | null) => {
                      if (skill && !formData.skills.includes(skill)) {
                        handleInputChange([...formData.skills, skill]);
                      }
                    }}
                  >
                    <div className="relative">
                      <Combobox.Input
                        className="w-full px-6 py-5 text-lg border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black bg-white shadow-sm"
                        placeholder="Type to search skills..."
                        onChange={(e) => setSkillQuery(e.target.value)}
                        autoFocus
                      />
                      <Transition
                        enter="transition duration-100 ease-out"
                        enterFrom="transform scale-95 opacity-0"
                        enterTo="transform scale-100 opacity-100"
                        leave="transition duration-75 ease-out"
                        leaveFrom="transform scale-100 opacity-100"
                        leaveTo="transform scale-95 opacity-0"
                      >
                        <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                          {filteredSkills.map((skill) => (
                            <Combobox.Option
                              key={skill}
                              value={skill}
                              className={({ active }) =>
                                `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                  active ? 'bg-black text-white' : 'text-gray-900'
                                }`
                              }
                            >
                              {skill}
                            </Combobox.Option>
                          ))}
                        </Combobox.Options>
                      </Transition>
                    </div>
                  </Combobox>

                  {formData.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {formData.skills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => handleInputChange(formData.skills.filter(s => s !== skill))}
                            className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-gray-200"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="mt-12 flex justify-between items-center">
              <button
                type="button"
                onClick={goToPreviousQuestion}
                className={`px-6 py-2 text-sm font-medium rounded-lg transition-colors ${
                  currentQuestionIndex === 0
                    ? 'invisible'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Back
              </button>

              <button
                type="button"
                onClick={goToNextQuestion}
                className="px-8 py-3 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 shadow-sm transition-all hover:shadow"
                disabled={!formData[currentQuestion.id]}
              >
                Continue
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  };

  const renderReview = () => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto pt-24 pb-12 px-4 sm:px-6"
      >
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-50 text-green-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className={`text-3xl font-semibold mb-2 text-gray-900 ${poppins.className}`}>Review Your Job Posting</h2>
          <p className="text-gray-500">Make sure everything looks good before publishing</p>
        </div>
        
        {isSubmitSuccess ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200 px-6">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600 mb-4">
              <CheckIcon className="h-8 w-8" />
            </div>
            <h3 className={`text-2xl font-semibold mb-2 text-gray-900 ${poppins.className}`}>Job Posted Successfully!</h3>
            <p className="text-gray-500 mb-8">Your job has been published and is now live.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/jobs"
                className="inline-flex justify-center items-center px-5 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                View All Jobs
              </Link>
              <Link
                href="/jobs/manage"
                className="inline-flex justify-center items-center px-5 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800"
              >
                Manage Your Jobs
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-8 space-y-8">
              <div>
                <h3 className={`text-2xl font-semibold text-gray-900 ${poppins.className}`}>{formData.title || 'Untitled Position'}</h3>
                <p className="mt-2 text-gray-500 flex items-center">
                  <span className="font-medium text-gray-900">{formData.company || 'Your Company'}</span>
                  {formData.location && (
                    <>
                      <span className="mx-2">•</span>
                      <span>{formData.location}</span>
                    </>
                  )}
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Description</h4>
                  <p className="text-gray-800 whitespace-pre-line">{formData.description || 'No description provided'}</p>
                </div>

                {formData.skills.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Required Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {formData.skills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Time Commitment</h4>
                    <p className="text-gray-900 font-medium">{formData.timeCommitment || 'Not specified'}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Hours per Week</h4>
                    <p className="text-gray-900 font-medium">{formData.hoursPerWeek || 'Not specified'}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Company Stage</h4>
                    <p className="text-gray-900 font-medium">{formData.companyStage || 'Not specified'}</p>
                  </div>
                </div>
                
                {(formData.companyWebsite || formData.companyLinkedIn || formData.companySocial) && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Company Links</h4>
                    <div className="space-y-2">
                      {formData.companyWebsite && (
                        <p className="text-gray-800 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                          </svg>
                          {formData.companyWebsite}
                        </p>
                      )}
                      {formData.companyLinkedIn && (
                        <p className="text-gray-800 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                          </svg>
                          {formData.companyLinkedIn}
                        </p>
                      )}
                      {formData.companySocial && (
                        <p className="text-gray-800 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6.066 9.645c.183 4.04-2.83 8.544-8.164 8.544-1.622 0-3.131-.476-4.402-1.291 1.524.18 3.045-.244 4.252-1.189-1.256-.023-2.317-.854-2.684-1.995.451.086.895.061 1.298-.049-1.381-.278-2.335-1.522-2.304-2.853.388.215.83.344 1.301.359-1.279-.855-1.641-2.544-.889-3.835 1.416 1.738 3.533 2.881 5.92 3.001-.419-1.796.944-3.527 2.799-3.527.825 0 1.572.349 2.096.907.654-.128 1.27-.368 1.824-.697-.215.671-.67 1.233-1.263 1.589.581-.07 1.135-.224 1.649-.453-.384.578-.87 1.084-1.433 1.489z"/>
                          </svg>
                          {formData.companySocial}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="px-8 py-6 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-between gap-4">
              <button
                type="button"
                onClick={() => setIsReviewing(false)}
                className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Edit Details
              </button>
              
              <button
                type="button"
                onClick={handlePublishJob}
                disabled={isSubmitting}
                className={`px-8 py-3 text-sm font-medium text-white bg-black rounded-lg ${
                  isSubmitting 
                    ? 'opacity-75 cursor-not-allowed' 
                    : 'hover:bg-gray-800 shadow-sm hover:shadow'
                }`}
              >
                {isSubmitting ? 'Publishing...' : 'Publish Job'}
              </button>
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div>
        <AnimatePresence mode="wait">
          {isReviewing ? renderReview() : renderQuestion()}
        </AnimatePresence>
      </div>
    </div>
  );
} 