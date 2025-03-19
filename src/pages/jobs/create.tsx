import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Combobox, Transition } from '@headlessui/react';
import { skillCategories } from '@/utils/skillCategories';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Poppins } from 'next/font/google';

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

  const renderQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const progress = Math.round((currentQuestionIndex + 1) / questions.length * 100);

    return (
      <div className="min-h-screen bg-white">
        <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-10">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
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
                className="h-1 bg-indigo-600 transition-all duration-500"
                style={{
                  width: `${isReviewing ? 100 : ((currentQuestionIndex + 1) / questions.length) * 100}%`
                }}
              />
            </div>
          </div>
        </div>

        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16"
        >
          <div className="max-w-none">
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
              <textarea
                value={formData[currentQuestion.id] as string}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder={currentQuestion.placeholder}
                rows={5}
                className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50"
                autoFocus
              />
            )}

            {currentQuestion.type === 'select' && currentQuestion.options && (
              <div className="space-y-3 mt-4">
                {currentQuestion.options.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      handleInputChange(option);
                      goToNextQuestion();
                    }}
                    className={`w-full px-6 py-4 text-left text-lg border-2 rounded-xl transition-all ${
                      formData[currentQuestion.id] === option
                        ? 'border-black bg-gray-50 text-gray-900 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}

            {currentQuestion.type === 'skills' && (
              <div className="space-y-4 mt-4">
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
                      className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black bg-gray-50"
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

          <div className="mt-8 flex justify-between items-center">
            <button
              type="button"
              onClick={goToPreviousQuestion}
              className={`px-6 py-2 text-sm font-medium rounded-lg ${
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
              className="px-6 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800"
            >
              Continue
            </button>
          </div>
        </motion.div>
      </div>
    );
  };

  const renderReview = () => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <h2 className="text-2xl font-semibold mb-6 text-gray-900">Review Job Posting</h2>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{formData.title}</h3>
              <p className="mt-1 text-sm text-gray-500">{formData.company} • {formData.location}</p>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Description</h4>
                <p className="mt-1 text-gray-900">{formData.description}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500">Required Skills</h4>
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Time Commitment</h4>
                  <p className="mt-1 text-gray-900">{formData.timeCommitment}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Hours per Week</h4>
                  <p className="mt-1 text-gray-900">{formData.hoursPerWeek}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Company Stage</h4>
                  <p className="mt-1 text-gray-900">{formData.companyStage}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          {isReviewing ? renderReview() : renderQuestion()}
        </AnimatePresence>
      </div>
    </div>
  );
} 