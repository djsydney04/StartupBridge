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
  BuildingOfficeIcon,
  BriefcaseIcon,
  ChevronLeftIcon,
  ChevronRightIcon
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
  isNew: boolean;
}

interface FilterGroup {
  id: string;
  name: string;
  options: string[];
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
const filterGroups: FilterGroup[] = [
  {
    id: 'timeCommitment',
    name: 'Time Commitment',
    options: ['Full-time', 'Part-time', 'Contract', 'Internship']
  },
  {
    id: 'companyStage',
    name: 'Company Stage',
    options: ['Pre-seed', 'Seed', 'Series A', 'Series B', 'Series C+']
  },
  {
    id: 'skills',
    name: 'Skills',
    options: ['Marketing', 'Design', 'Engineering', 'Product', 'Sales', 'Operations']
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

// Format date to "Mar 15" format
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
};

// Generate page numbers for pagination
const getPageNumbers = (currentPage: number, totalPages: number) => {
  const pages: (number | string)[] = [];
  
  if (totalPages <= 7) {
    // Less than 7 pages, show all
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    // Always show first page
    pages.push(1);
    
    // Show dots if not right after first page
    if (currentPage > 3) {
      pages.push("...");
    }
    
    // Show current page and neighbors
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    // Show dots if not right before last page
    if (currentPage < totalPages - 2) {
      pages.push("...");
    }
    
    // Always show last page
    pages.push(totalPages);
  }
  
  return pages;
};

// Pagination settings
const itemsPerPage = 10;

export default function JobsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
    timeCommitment: [],
    companyStage: [],
    skills: []
  });
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

  // Toggle a filter selection
  const toggleFilter = (groupId: string, option: string) => {
    setSelectedFilters(prev => {
      const currentValues = prev[groupId] || [];
      return {
        ...prev,
        [groupId]: currentValues.includes(option)
          ? currentValues.filter(item => item !== option)
          : [...currentValues, option]
      };
    });
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedFilters({
      timeCommitment: [],
      companyStage: [],
      skills: []
    });
  };

  // Filter jobs based on search and filter selections
  const filteredJobs = useMemo(() => {
    return mockJobs.filter(job => {
      // Search filter
      if (searchQuery && !job.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !job.company.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Skills filter
      if (selectedFilters.skills.length > 0 && 
          !selectedFilters.skills.some(skill => job.skills.includes(skill))) {
        return false;
      }
      
      // Time commitment filter
      if (selectedFilters.timeCommitment.length > 0 && 
          !selectedFilters.timeCommitment.includes(job.timeCommitment)) {
        return false;
      }
      
      // Company stage filter
      if (selectedFilters.companyStage.length > 0 && 
          !selectedFilters.companyStage.includes(job.companyStage)) {
        return false;
      }
      
      return true;
    }).map(job => {
      // Add isNew flag for jobs posted in the last 7 days
      const postedDate = new Date(job.postedDate);
      const now = new Date();
      const daysDifference = Math.ceil((now.getTime() - postedDate.getTime()) / (1000 * 60 * 60 * 24));
      return {
        ...job,
        isNew: daysDifference <= 7
      };
    });
  }, [searchQuery, selectedFilters]);

  // Calculate pagination values
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentJobs = filteredJobs.slice(startIndex, endIndex);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Jobs</h1>
            <p className="text-lg text-gray-600">Find exciting opportunities at innovative startups</p>
          </div>
          <div className="flex mt-4 sm:mt-0 space-x-3">
            <Link
              href="/jobs/manage"
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition-colors"
            >
              <span>Manage Jobs</span>
            </Link>
            <Link
              href="/jobs/create"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none transition-colors"
            >
              <PlusIcon className="h-4 w-4 mr-1.5" />
              <span>Create Job</span>
            </Link>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6 mb-6">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-black focus:border-black"
              placeholder="Search jobs by title or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="absolute inset-y-0 right-0 pr-4 flex items-center"
                onClick={() => setSearchQuery("")}
              >
                <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
          <button
            className={`inline-flex items-center px-4 py-3 border ${
              isFiltersOpen ? "border-black bg-gray-50" : "border-gray-300"
            } rounded-lg text-sm font-medium transition-colors`}
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          >
            <FunnelIcon className={`h-5 w-5 ${isFiltersOpen ? "text-black" : "text-gray-500"} mr-2`} />
            <span className={isFiltersOpen ? "text-gray-900" : "text-gray-700"}>Filters</span>
            {Object.values(selectedFilters).some(filters => filters.length > 0) && (
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-black text-white">
                {Object.values(selectedFilters).reduce((acc, filters) => acc + filters.length, 0)}
              </span>
            )}
          </button>
        </div>

        {isFiltersOpen && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8 animate-fadeIn">
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Filter by</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {filterGroups.map((group) => (
                  <div key={group.id} className="space-y-2">
                    <h4 className="font-medium text-gray-900">{group.name}</h4>
                    <div className="space-y-1">
                      {group.options.map((option) => (
                        <div key={option} className="flex items-center">
                          <input
                            id={`${group.id}-${option}`}
                            name={`${group.id}-${option}`}
                            type="checkbox"
                            className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                            checked={selectedFilters[group.id]?.includes(option) || false}
                            onChange={() => toggleFilter(group.id, option)}
                          />
                          <label
                            htmlFor={`${group.id}-${option}`}
                            className="ml-2 text-sm text-gray-700"
                          >
                            {option}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-gray-200">
              <button
                className="text-sm font-medium text-gray-700 hover:text-gray-900"
                onClick={clearFilters}
              >
                Clear all filters
              </button>
              <button
                className="text-sm font-medium text-white bg-black px-4 py-2 rounded-md hover:bg-gray-800"
                onClick={() => setIsFiltersOpen(false)}
              >
                Apply filters
              </button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {filteredJobs.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-lg border border-gray-200">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100">
                <BriefcaseIcon className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No jobs found</h3>
              <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
                No jobs match your current filters. Try adjusting your search or filters to find more opportunities.
              </p>
              {(searchQuery || Object.values(selectedFilters).some(filters => filters.length > 0)) && (
                <button
                  className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition-colors"
                  onClick={() => {
                    setSearchQuery('');
                    clearFilters();
                  }}
                >
                  Reset all filters
                </button>
              )}
            </div>
          ) : (
            currentJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden transition-all duration-150 hover:shadow-md group"
              >
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                    <div className="flex-grow mb-4 sm:mb-0 sm:mr-8">
                      <div className="flex items-center mb-1">
                        <h3 className="text-xl font-semibold text-gray-900 group-hover:text-black">
                          {job.title}
                        </h3>
                        {job.isNew && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            New
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 mb-2">
                        {job.company} • {job.location}
                      </p>
                      
                      {expandedJobId === job.id ? (
                        <div className="mt-4 space-y-3">
                          <p className="text-gray-800 whitespace-pre-line">{job.description}</p>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedJobId(null);
                            }}
                            className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 mt-2"
                          >
                            Show less
                            <ChevronUpIcon className="ml-1 h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <p className="text-gray-700 line-clamp-2">{job.description}</p>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedJobId(job.id);
                            }}
                            className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 mt-2"
                          >
                            Read more
                            <ChevronDownIcon className="ml-1 h-4 w-4" />
                          </button>
                        </>
                      )}
                      
                      <div className="mt-4 flex flex-wrap gap-2">
                        {job.skills.slice(0, 5).map((skill) => (
                          <span
                            key={skill}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                          >
                            {skill}
                          </span>
                        ))}
                        {job.skills.length > 5 && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                            +{job.skills.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-4 mt-4 sm:mt-0">
                      <div className="text-sm text-gray-500 font-medium">
                        {formatDate(job.postedDate)}
                      </div>
                      <div className="flex flex-col items-end space-y-2 mt-2">
                        <div className="inline-flex items-center text-sm font-medium text-gray-700">
                          <ClockIcon className="h-4 w-4 text-gray-400 mr-1.5" />
                          <span>{job.timeCommitment} • {job.hoursPerWeek}</span>
                        </div>
                        <div className="inline-flex items-center text-sm font-medium text-gray-700">
                          <BuildingOfficeIcon className="h-4 w-4 text-gray-400 mr-1.5" />
                          <span>{job.companyStage}</span>
                        </div>
                      </div>
                      <Link
                        href={`/jobs/${job.id}/apply`}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none transition-colors"
                      >
                        Apply Now
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                className={`relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                  currentPage === 1
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                <span className="sr-only">Previous</span>
              </button>
              
              {getPageNumbers(currentPage, totalPages).map((pageNumber, index) => (
                <React.Fragment key={index}>
                  {pageNumber === "..." ? (
                    <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                      ...
                    </span>
                  ) : (
                    <button
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === pageNumber
                          ? "z-10 bg-black border-black text-white"
                          : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                      onClick={() => setCurrentPage(pageNumber as number)}
                    >
                      {pageNumber}
                    </button>
                  )}
                </React.Fragment>
              ))}
              
              <button
                className={`relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                  currentPage === totalPages
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                <span className="sr-only">Next</span>
                <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </nav>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
} 