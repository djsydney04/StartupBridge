import React, { useState, useMemo, Fragment } from 'react';
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
  ArrowTopRightOnSquareIcon,
  CheckIcon,
  XMarkIcon,
  FunnelIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Combobox, Transition } from '@headlessui/react';
import { skillCategories as skillCategoriesData } from '../../utils/skillCategories';
import { mockJobs } from '../../utils/mockData';

// Define skill categories and their associated skills
const skillCategories = {
  technicalSkills: {
    name: 'Technical Skills',
    skills: {
      'frontend': ['React', 'Angular', 'Vue.js', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Tailwind CSS', 'Next.js', 'Gatsby', 'Redux', 'WebGL', 'Three.js', 'Responsive Design', 'Web Performance'],
      'backend': ['Node.js', 'Python', 'Java', 'C#', 'Ruby', 'PHP', 'SQL', 'MongoDB', 'PostgreSQL', 'Redis', 'GraphQL', 'REST APIs', 'Microservices', 'System Design', 'API Design'],
      'mobile': ['React Native', 'Flutter', 'iOS', 'Android', 'Swift', 'Kotlin', 'Mobile UI/UX', 'App Store Optimization', 'Push Notifications', 'Mobile Security'],
      'ai_ml': ['TensorFlow', 'PyTorch', 'Scikit-learn', 'Computer Vision', 'NLP', 'Deep Learning', 'Machine Learning', 'Data Science', 'Neural Networks', 'AI Ethics', 'MLOps', 'Data Mining'],
      'web3': ['Solidity', 'Smart Contracts', 'Ethereum', 'Web3.js', 'Blockchain', 'DeFi', 'NFTs', 'Crypto Wallets', 'Token Economics', 'Zero Knowledge Proofs', 'Layer 2 Solutions'],
      'devops': ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Git', 'Infrastructure as Code', 'Cloud Architecture', 'Monitoring', 'Security', 'DevSecOps', 'Site Reliability Engineering'],
      'nocode': ['Bubble', 'Webflow', 'Zapier', 'Airtable', 'Notion', 'Retool', 'Adalo', 'Glide', 'AppSheet', 'Internal Tools'],
      'data': ['SQL', 'Python', 'R', 'Data Analysis', 'Data Visualization', 'Business Intelligence', 'ETL', 'Data Warehousing', 'Big Data', 'Data Engineering', 'Analytics']
    }
  },
  businessSkills: {
    name: 'Business & Strategy',
    skills: {
      'venture_capital': ['Financial Modeling', 'Due Diligence', 'Market Analysis', 'Pitch Deck Creation', 'Term Sheets', 'Cap Table Management', 'Portfolio Management', 'Investment Thesis'],
      'operations': ['Project Management', 'Process Optimization', 'Team Management', 'Strategic Planning', 'OKRs', 'Resource Allocation', 'Risk Management', 'Change Management'],
      'finance': ['Financial Analysis', 'Budgeting', 'Forecasting', 'Accounting', 'Fundraising', 'Valuation', 'Unit Economics', 'Financial Planning', 'Treasury Management'],
      'sales': ['B2B Sales', 'Sales Strategy', 'Lead Generation', 'Account Management', 'Sales Operations', 'CRM Management', 'Pipeline Development', 'Contract Negotiation'],
      'strategy': ['Business Strategy', 'Go-to-Market', 'Market Research', 'Competitive Analysis', 'Business Development', 'Strategic Partnerships', 'Growth Strategy'],
      'legal': ['Contract Law', 'IP Law', 'Corporate Law', 'Regulatory Compliance', 'Privacy Law', 'Employment Law', 'Legal Operations']
    }
  },
  marketingSkills: {
    name: 'Marketing & Growth',
    skills: {
      'digital_marketing': ['SEO', 'Content Marketing', 'Email Marketing', 'Social Media Marketing', 'Marketing Analytics', 'Marketing Automation', 'Growth Marketing', 'Conversion Optimization'],
      'paid_marketing': ['Google Ads', 'Facebook Ads', 'PPC', 'Performance Marketing', 'Media Buying', 'Programmatic Advertising', 'Attribution Modeling', 'Ad Operations'],
      'content': ['Content Strategy', 'Copywriting', 'Brand Strategy', 'Content Creation', 'Editorial Planning', 'Content Distribution', 'Storytelling', 'Technical Writing'],
      'community': ['Community Management', 'Discord', 'Social Media Management', 'Community Building', 'Moderation', 'Event Planning', 'User Engagement', 'Ambassador Programs'],
      'brand': ['Brand Strategy', 'Brand Identity', 'Brand Guidelines', 'Brand Voice', 'Brand Marketing', 'Brand Partnerships', 'Reputation Management'],
      'analytics': ['Web Analytics', 'Marketing Analytics', 'Data Analysis', 'A/B Testing', 'User Research', 'Attribution Modeling', 'Reporting', 'Dashboard Creation']
    }
  },
  productSkills: {
    name: 'Product & Design',
    skills: {
      'design': ['UI Design', 'UX Design', 'Figma', 'Adobe XD', 'Product Design', 'Design Systems', 'Interaction Design', 'Visual Design', 'Prototyping', 'User Testing'],
      'product': ['Product Management', 'Product Strategy', 'User Research', 'Agile', 'Product Analytics', 'Feature Prioritization', 'Product Marketing', 'Product Operations'],
      'graphic_design': ['Graphic Design', 'Brand Design', 'Visual Design', 'Logo Design', 'Typography', 'Color Theory', 'Print Design', 'Digital Design'],
      'research': ['User Research', 'Market Research', 'Usability Testing', 'Customer Interviews', 'Data Analysis', 'Research Synthesis', 'Journey Mapping'],
      'ux_writing': ['UX Writing', 'Content Design', 'Information Architecture', 'Content Strategy', 'Microcopy', 'Documentation', 'Style Guides']
    }
  },
  hardSkills: {
    name: 'Hard Skills',
    skills: {
      'analytics': ['SQL', 'Python', 'R', 'Excel', 'Tableau', 'Power BI', 'Data Visualization', 'Statistical Analysis'],
      'tools': ['Jira', 'Confluence', 'Notion', 'Asana', 'Monday.com', 'Slack', 'G Suite', 'Microsoft Office'],
      'languages': ['English', 'Spanish', 'Mandarin', 'Hindi', 'Arabic', 'French', 'German', 'Japanese'],
      'certifications': ['PMP', 'Scrum Master', 'AWS Certified', 'CFA', 'Six Sigma', 'CISSP', 'Google Analytics']
    }
  },
  softSkills: {
    name: 'Soft Skills',
    skills: {
      'leadership': ['Team Leadership', 'Mentoring', 'Decision Making', 'Strategic Thinking', 'Conflict Resolution', 'Change Management'],
      'communication': ['Public Speaking', 'Written Communication', 'Presentation Skills', 'Negotiation', 'Cross-cultural Communication'],
      'collaboration': ['Team Collaboration', 'Cross-functional Leadership', 'Stakeholder Management', 'Remote Work', 'Cultural Awareness'],
      'personal': ['Problem Solving', 'Critical Thinking', 'Time Management', 'Adaptability', 'Creativity', 'Emotional Intelligence']
    }
  }
};

// Helper function to get all available skills as a flat array
const getAllSkills = () => {
  const allSkills: string[] = [];
  Object.values(skillCategoriesData).forEach((category) => {
    Object.values(category.skills).forEach((skillArray) => {
      allSkills.push(...skillArray);
    });
  });
  return Array.from(new Set(allSkills)).sort();
};

// Helper function to find skill categories for a given skill
const findSkillCategories = (skill: string): string[] => {
  const categories: string[] = [];
  Object.entries(skillCategoriesData).forEach(([categoryKey, category]) => {
    Object.values(category.skills).forEach(skillSet => {
      if (skillSet.includes(skill)) {
        categories.push(categoryKey);
      }
    });
  });
  return categories;
};

// Type for job data
interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  hoursPerWeek: string;
  description: string;
  detailedDescription: string;
  skills: string[];
  skillCategories: string[];
  postedDate: string;
  applicationFormUrl: string;
  compensation?: string;
  companySize: string;
  companyStage: string;
  timeCommitment: string;
}

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

// Updated filter groups with standardized skills
const filterGroups = [
  {
    name: 'Technical Skills',
    key: 'technicalSkills',
    subgroups: Object.entries(skillCategoriesData.technicalSkills.skills).map(([key, skills]) => ({
      name: key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
      skills: skills
    }))
  },
  {
    name: 'Business & Strategy',
    key: 'businessSkills',
    subgroups: Object.entries(skillCategoriesData.businessSkills.skills).map(([key, skills]) => ({
      name: key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
      skills: skills
    }))
  },
  {
    name: 'Marketing & Growth',
    key: 'marketingSkills',
    subgroups: Object.entries(skillCategoriesData.marketingSkills.skills).map(([key, skills]) => ({
      name: key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
      skills: skills
    }))
  },
  {
    name: 'Product & Design',
    key: 'productSkills',
    subgroups: Object.entries(skillCategoriesData.productSkills.skills).map(([key, skills]) => ({
      name: key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
      skills: skills
    }))
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

// Helper function to get popular skills based on job listings
const getPopularSkills = (jobs: Job[]): { skill: string; count: number }[] => {
  const skillCount = new Map<string, number>();
  jobs.forEach(job => {
    job.skills.forEach(skill => {
      skillCount.set(skill, (skillCount.get(skill) || 0) + 1);
    });
  });
  return Array.from(skillCount.entries())
    .map(([skill, count]) => ({ skill, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
};

// Smart skill matching algorithm
const matchSkill = (query: string, skills: string[]): string[] => {
  const normalizedQuery = query.toLowerCase();
  return skills
    .filter(skill => {
      const normalizedSkill = skill.toLowerCase();
      // Exact match gets highest priority
      if (normalizedSkill === normalizedQuery) return true;
      // Start of word match gets second priority
      if (normalizedSkill.startsWith(normalizedQuery)) return true;
      // Contains match gets third priority
      if (normalizedSkill.includes(normalizedQuery)) return true;
      // Acronym match gets fourth priority
      const acronym = skill
        .split(' ')
        .map(word => word[0])
        .join('')
        .toLowerCase();
      if (acronym.includes(normalizedQuery)) return true;
      return false;
    })
    .sort((a, b) => {
      const aLower = a.toLowerCase();
      const bLower = b.toLowerCase();
      // Sort exact matches first
      if (aLower === normalizedQuery) return -1;
      if (bLower === normalizedQuery) return 1;
      // Then sort by starts with
      if (aLower.startsWith(normalizedQuery) && !bLower.startsWith(normalizedQuery)) return -1;
      if (!aLower.startsWith(normalizedQuery) && bLower.startsWith(normalizedQuery)) return 1;
      // Then sort alphabetically
      return a.localeCompare(b);
    });
};

// Helper function to get page numbers
const getPageNumbers = (totalPages: number, currentPage: number) => {
  const pageNumbers: number[] = [];
  const maxVisiblePages = 5;

  if (totalPages <= maxVisiblePages) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    if (currentPage <= 3) {
      for (let i = 1; i <= maxVisiblePages; i++) {
        pageNumbers.push(i);
      }
    } else if (currentPage >= totalPages - 2) {
      for (let i = totalPages - maxVisiblePages + 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      for (let i = currentPage - 2; i <= currentPage + 2; i++) {
        pageNumbers.push(i);
      }
    }
  }

  return pageNumbers;
};

export default function JobsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<Set<string>>(new Set());
  const [skillQuery, setSkillQuery] = useState('');

  const allSkills = useMemo(() => getAllSkills(), []);
  const filteredSkills = useMemo(() => {
    return skillQuery === '' ? [] : allSkills.filter(skill => 
      skill.toLowerCase().includes(skillQuery.toLowerCase())
    );
  }, [skillQuery, allSkills]);

  const toggleJobExpansion = (jobId: string) => {
    setExpandedJobId(expandedJobId === jobId ? null : jobId);
  };

  const toggleSkill = (skill: string) => {
    const newSelectedSkills = new Set(selectedSkills);
    if (newSelectedSkills.has(skill)) {
      newSelectedSkills.delete(skill);
    } else {
      newSelectedSkills.add(skill);
    }
    setSelectedSkills(newSelectedSkills);
  };

  // Filter jobs based on selected skills and search query
  const filteredJobs = useMemo(() => {
    return mockJobs.filter(job => {
      // Filter by search query
      const searchMatch = searchQuery === '' || 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase());

      // Filter by selected skills - job must match ALL selected skills
      const skillsMatch = selectedSkills.size === 0 ||
        Array.from(selectedSkills).every(selectedSkill => 
          job.skills.includes(selectedSkill)
        );

      return searchMatch && skillsMatch;
    });
  }, [searchQuery, selectedSkills]);

  // Pagination
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentJobs = filteredJobs.slice(startIndex, endIndex);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Jobs</h1>
              <p className="mt-2 text-sm text-gray-600">
            Find exciting opportunities at innovative startups
          </p>
        </div>
            <div className="flex space-x-4">
              <Link
                href="/jobs/manage"
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Manage Jobs
              </Link>
              <Link
                href="/jobs/create"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Create Job
              </Link>
            </div>
          </div>
          
          {/* Search and filters section */}
          <div className="mb-8">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="relative">
                        <input
                    type="text"
                    placeholder="Search jobs by title or company..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <FunnelIcon className="h-5 w-5 mr-2 text-gray-400" />
                Filters
                </button>
              </div>
        </div>

          {/* Job listings */}
          <div className="space-y-6">
            {filteredJobs.map((job) => (
            <div
              key={job.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h2 className="text-xl font-semibold text-gray-900">
                          {job.title}
                        </h2>
                        <time className="text-sm text-gray-500">
                          {new Date(job.postedDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </time>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        {job.company} • {job.location}
                      </p>
                      <div className="mt-4">
                        <p className="text-sm text-gray-600">
                          {expandedJobId === job.id ? job.description : `${job.description.slice(0, 150)}...`}
                        </p>
                        <button
                          onClick={() => setExpandedJobId(expandedJobId === job.id ? null : job.id)}
                          className="mt-2 text-sm font-medium text-indigo-600 hover:text-indigo-500"
                        >
                          {expandedJobId === job.id ? 'Show less' : 'Read more'}
                        </button>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {job.skills.slice(0, 5).map((skill) => (
                          <span
                            key={skill}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                          >
                            {skill}
                          </span>
                        ))}
                        {job.skills.length > 5 && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            +{job.skills.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="inline-flex items-center">
                        <ClockIcon className="h-4 w-4 mr-1.5 text-gray-400" />
                        {job.timeCommitment} • {job.hoursPerWeek}
                      </span>
                      <span className="inline-flex items-center">
                        <BuildingOfficeIcon className="h-4 w-4 mr-1.5 text-gray-400" />
                        {job.companyStage}
                      </span>
                    </div>
                    <Link
                      href={job.applicationFormUrl}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Apply Now
                      <ArrowTopRightOnSquareIcon className="ml-2 h-4 w-4" />
                    </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        
          {/* Pagination */}
          <div className="flex items-center justify-center space-x-2 mt-8 pb-8">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-md ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Previous
            </button>

            {getPageNumbers(totalPages, currentPage).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`px-3 py-1 rounded-md ${
                  currentPage === pageNum
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {pageNum}
              </button>
            ))}

          <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-md ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Next
          </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 