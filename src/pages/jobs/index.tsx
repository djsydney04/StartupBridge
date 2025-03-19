import React, { useState } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { 
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  PlusIcon,
  MapPinIcon,
  ClockIcon,
  CalendarIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

// Mock job data (replace with real data later)
const mockJobs = [
  {
    id: 1,
    title: 'Frontend Developer',
    company: 'TechStartup Inc.',
    location: 'Irvine, CA',
    hoursPerWeek: '40 hours/week',
    description: 'Looking for a passionate frontend developer to join our growing team. Experience with React and TypeScript required.',
    detailedDescription: `We are seeking a talented Frontend Developer to join our growing team. The ideal candidate will have a strong foundation in modern web technologies and a passion for creating exceptional user experiences.

Key Responsibilities:
- Develop and maintain responsive web applications using React and TypeScript
- Collaborate with designers to implement pixel-perfect UI components
- Write clean, maintainable, and well-documented code
- Participate in code reviews and contribute to technical discussions
- Optimize applications for maximum speed and scalability

Requirements:
- 2+ years of experience with React and TypeScript
- Strong understanding of HTML, CSS, and JavaScript
- Experience with modern frontend tools and build systems
- Knowledge of responsive design and cross-browser compatibility
- Excellent problem-solving and communication skills`,
    skills: ['React', 'TypeScript', 'Tailwind CSS'],
    postedDate: '2 days ago',
    applicationFormUrl: 'https://forms.example.com/apply',
    compensation: '$30-40/hour'
  },
  // Add more mock jobs as needed
];

const filters = {
  // Technical Skills categories
  technicalSkills: [
    'Software Engineering (Frontend, Backend, Full-Stack, Mobile, etc.)',
    'AI/ML (Machine Learning, Data Science, AI Ops, etc.)',
    'Web3 & Crypto (Smart Contracts, Blockchain Development, DAOs, etc.)',
    'Cybersecurity (Penetration Testing, Risk Management, etc.)',
    'Cloud Computing & DevOps (AWS, Kubernetes, etc.)',
    'Hardware & Robotics (Embedded Systems, IoT, Robotics, etc.)',
    'No-Code Development (Bubble, Webflow, Zapier, etc.)'
  ],
  // Business & Strategy
  businessSkills: [
    'Venture Capital & Investing (Financial modeling, Pitch Decks, Startup Due Diligence, etc.)',
    'Startup Operations (Go-To-Market, Fundraising, Hiring, etc.)',
    'Finance & Accounting (Cash Flow Management, Forecasting, etc.)',
    'Consulting & Strategy (Market Research, Growth Strategies, etc.)',
    'Business Development & Sales (B2B Sales, Partnerships, etc.)'
  ],
  // Marketing & Growth
  marketingSkills: [
    'SEO & Content Marketing',
    'Performance Marketing (Google Ads, Facebook Ads, etc.)',
    'Social Media Growth & Management',
    'Brand Strategy & Storytelling',
    'Community Building (Discord, Reddit, Twitter, etc.)',
    'Affiliate & Influencer Marketing'
  ],
  // Product & Design
  productSkills: [
    'UI/UX Design (Figma, Adobe XD, Prototyping, etc.)',
    'Graphic Design & Branding',
    'Product Management (Roadmaps, User Research, Agile, etc.)',
    'No-Code Product Development'
  ],
  // Industry categories
  industry: [
    'Tech & Software',
    'AI/ML',
    'SaaS & Enterprise Tech',
    'Cybersecurity',
    'Cloud & Infrastructure',
    'Web3 & Blockchain',
    'Finance & Investing',
    'Venture Capital',
    'Fintech & Payments',
    'Crypto & DeFi',
    'Personal Finance',
    'Consumer & Media',
    'Creator Economy',
    'Social Networks & Marketplaces',
    'Content & Streaming',
    'Gaming & Metaverse',
    'E-commerce & Direct-to-Consumer',
    'Healthcare & Biotech',
    'Digital Health & Telemedicine',
    'Medical Devices',
    'Biotech Startups',
    'Climate Tech & Energy',
    'Renewable Energy',
    'Sustainable Materials',
    'Carbon Capture',
    'EdTech',
    'Real Estate & PropTech',
    'Aerospace & Robotics'
  ],
  // Hourly Commitment
  commitment: [
    'Micro-Internships (5-10 hours/week)',
    'Part-Time (10-20 hours/week)',
    'Full-Time (40+ hours/week)',
    'Freelance / Project-Based'
  ],
  // Company Stage
  companyStage: [
    'Idea Stage (Pre-Seed)',
    'Early-Stage Startup (Seed - Series A)',
    'Growth-Stage Startup (Series B & Beyond)'
  ],
  // Original filters
  hoursPerWeek: ['10-20 hours/week', '20-30 hours/week', '30-40 hours/week', '40+ hours/week'],
  compensation: ['Paid', 'Equity', 'Unpaid'],
};

// Group filter categories for the UI
const filterGroups = [
  {
    name: 'Technical Skills',
    key: 'technicalSkills',
    options: filters.technicalSkills
  },
  {
    name: 'Business & Strategy',
    key: 'businessSkills',
    options: filters.businessSkills
  },
  {
    name: 'Marketing & Growth',
    key: 'marketingSkills',
    options: filters.marketingSkills
  },
  {
    name: 'Product & Design',
    key: 'productSkills',
    options: filters.productSkills
  },
  {
    name: 'Industry',
    key: 'industry',
    options: filters.industry
  },
  {
    name: 'Commitment',
    key: 'commitment',
    options: filters.commitment
  },
  {
    name: 'Company Stage',
    key: 'companyStage',
    options: filters.companyStage
  },
  {
    name: 'Hours per Week',
    key: 'hoursPerWeek',
    options: filters.hoursPerWeek
  },
  {
    name: 'Compensation',
    key: 'compensation',
    options: filters.compensation
  }
];

export default function JobsPage() {
  return (
    <ProtectedRoute>
      <Jobs />
    </ProtectedRoute>
  );
}

function Jobs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [expandedJobId, setExpandedJobId] = useState<number | null>(null);

  const toggleJobExpansion = (jobId: number) => {
    setExpandedJobId(expandedJobId === jobId ? null : jobId);
  };

  return (
    <DashboardLayout>
      <div className="content-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Jobs Board
            </h1>
            <p className="mt-2.5 text-lg text-gray-600">
              Find exciting opportunities at innovative startups
            </p>
          </div>
          <Link
            href="/jobs/manage"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-800"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Create/Manage Jobs
          </Link>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="flex flex-col sm:flex-row gap-5">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-12 pr-5 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition-all duration-200 text-sm"
                placeholder="Search jobs by title, company, or skills"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-3 border rounded-lg text-sm font-medium transition-all duration-200 bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
          >
            <AdjustmentsHorizontalIcon className="h-5 w-5 text-gray-400 mr-2.5" />
            Filters
          </button>
        </div>
        
        {/* Expandable Filters */}
        {showFilters && (
          <div className="mt-5 pt-5 border-t border-gray-100 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterGroups.map((group) => (
                <div key={group.name} className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">{group.name}</h3>
                  <div className="max-h-40 overflow-y-auto pr-2 space-y-2">
                    {group.options.map((option) => (
                      <div key={option} className="flex items-center">
                        <input
                          id={`${group.key}-${option}`}
                          name={group.key}
                          type="checkbox"
                          className="h-4 w-4 text-black focus:ring-gray-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`${group.key}-${option}`} className="ml-2 text-sm text-gray-600 truncate" title={option}>
                          {option}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-5 flex justify-end">
              <button type="button" className="px-4 py-2 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-800 mr-3">
                Apply Filters
              </button>
              <button type="button" className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50">
                Clear All Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Jobs List */}
      <div className="mt-8 space-y-6">
        {mockJobs.map((job) => (
          <div
            key={job.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md"
          >
            <div className="p-8">
              <div className="flex items-start">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {job.title}
                      </h3>
                      <div className="mt-1">
                        <span className="text-sm font-medium text-gray-900">
                          {job.company}
                        </span>
                        <span className="mx-2 text-gray-500">•</span>
                        <span className="text-sm flex items-center text-gray-500">
                          <MapPinIcon className="h-3.5 w-3.5 mr-1" />
                          {job.location}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-500">
                        {job.postedDate}
                      </span>
                      <button
                        onClick={() => toggleJobExpansion(job.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        {expandedJobId === job.id ? (
                          <ChevronUpIcon className="h-5 w-5" />
                        ) : (
                          <ChevronDownIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="flex items-center space-x-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                        <ClockIcon className="h-3.5 w-3.5 mr-1" />
                        {job.hoursPerWeek}
                      </span>
                      {job.compensation && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                          {job.compensation}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    {expandedJobId === job.id ? job.detailedDescription : job.description}
                  </p>
                  <div className="mt-4">
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4">
                    <a
                      href={job.applicationFormUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-800"
                    >
                      Apply Now
                      <ArrowTopRightOnSquareIcon className="ml-2 h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
} 