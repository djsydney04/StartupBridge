import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import Image from 'next/image';
import PageContainer from '@/components/Layout/PageContainer';
import { 
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  XMarkIcon,
  ChevronDownIcon,
  FunnelIcon,
  MapPinIcon,
  BookmarkIcon,
  UserPlusIcon,
  ChevronRightIcon,
  StarIcon,
  CheckBadgeIcon,
  ArrowsRightLeftIcon,
  BriefcaseIcon,
  ChatBubbleLeftRightIcon,
  UserCircleIcon,
  LinkIcon,
  EnvelopeIcon,
  ClipboardDocumentIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import EnvelopeIconSvg from '/public/images/NewEnvelopeFolder.svg';

// Add LinkedIn and X logo imports
import LinkedInLogo from '/public/images/LinkedIn.png';
import XLogo from '/public/images/XLogo.png';

// Define types for our data
interface Founder {
  id: number;
  name: string;
  role: string;
  major: string;
  skills: string[];
  interests: string[];
  location: string;
  oneLiner: string;
  availableFor: string[];
  stage: string;
  matchScore: number;
  endorsements: number;
  imageUrl: string;
  isBookmarked: boolean;
  linkedInUrl?: string;
  twitterUrl?: string;
  email?: string;
  about?: string;
  experience?: {
    title: string;
    company: string;
    duration: string;
    description: string;
  }[];
  education?: {
    school: string;
    degree: string;
    year: string;
  }[];
}

// Enhanced filter categories with detailed skills and interests
const filterCategories = {
  technicalSkills: [
    'Software Development',
    'AI & Machine Learning',
    'Cloud & DevOps',
    'Cybersecurity & Privacy',
    'Blockchain & Web3',
    'Game Development',
    'Hardware & Embedded Systems',
    'UX/UI & Product Design'
  ],
  businessSkills: [
    'Product Management',
    'User Research & Testing',
    'Growth & Marketing',
    'Sales & Partnerships',
    'Business Strategy & Operations',
    'Finance & Fundraising',
    'Legal & Compliance'
  ],
  scienceSkills: [
    'Physics & Engineering',
    'Biotech & Healthcare',
    'Chemistry & Materials Science',
    'Analytical Chemistry',
    'Organic Chemistry',
    'Food Science & AgTech',
    'Food Product Development',
    'Nutritional Science',
    'Environmental Science & Energy',
    'Renewable Energy',
    'Psychology & Behavioral Science',
    'Microbiology',
    'Genomics & Genetics',
    'Pharmaceutical Research',
    'Data Science & Statistics'
  ],
  industries: [
    'AI & Automation',
    'Blockchain & Web3',
    'Climate & Sustainability',
    'Consumer Tech & Apps',
    'Cybersecurity & Privacy',
    'Developer Tools & Infrastructure',
    'E-commerce & Marketplaces',
    'Education & EdTech',
    'Finance & FinTech',
    'Gaming & Esports',
    'Hardware & IoT',
    'Healthcare, Biotech & MedTech',
    'Manufacturing & Robotics',
    'Media, Content & Creator Economy',
    'Real Estate & PropTech',
    'Social Media & Networking',
    'Sports, Health & Fitness',
    'Transportation & Mobility'
  ],
  availability: ['Full-time', 'Part-time', 'Advisor'],
  stages: ['Ideation', 'MVP', 'Early Revenue', 'Growth', 'Any Stage'],
  locations: ['Orange County', 'Los Angeles', 'Remote', 'Any Location']
};

// Group filter categories for UI
const filterGroups = [
  {
    name: 'Technical Skills',
    key: 'technicalSkills',
    options: filterCategories.technicalSkills
  },
  {
    name: 'Product & Business Skills',
    key: 'businessSkills',
    options: filterCategories.businessSkills
  },
  {
    name: 'Science & Research Skills',
    key: 'scienceSkills',
    options: filterCategories.scienceSkills
  },
  {
    name: 'Industry Interests',
    key: 'industries',
    options: filterCategories.industries
  },
  {
    name: 'Availability',
    key: 'availability',
    options: filterCategories.availability
  },
  {
    name: 'Startup Stage',
    key: 'stages',
    options: filterCategories.stages
  },
  {
    name: 'Location',
    key: 'locations',
    options: filterCategories.locations
  }
];

// Enhanced mock data with additional fields including social media
const mockFounders: Founder[] = [
  {
    id: 1,
    name: 'Sarah Chen',
    role: 'Technical Co-Founder',
    major: 'Computer Science',
    skills: ['Software Development', 'AI & Machine Learning', 'Cloud & DevOps'],
    interests: ['AI & Automation', 'Developer Tools & Infrastructure', 'Education & EdTech'],
    location: 'Orange County, CA',
    oneLiner: 'Building AI tools to make education more accessible and personalized',
    availableFor: ['Full-time', 'Part-time'],
    stage: 'Ideation',
    matchScore: 92,
    endorsements: 18,
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    isBookmarked: false,
    linkedInUrl: 'https://linkedin.com/in/sarahchen',
    twitterUrl: 'https://twitter.com/sarahchentech',
    email: 'sarah.chen@example.com'
  },
  {
    id: 2,
    name: 'Michael Rodriguez',
    role: 'Business Co-Founder',
    major: 'Business Administration',
    skills: ['Product Management', 'Growth & Marketing', 'Sales & Partnerships'],
    interests: ['Consumer Tech & Apps', 'Finance & FinTech', 'E-commerce & Marketplaces'],
    location: 'Irvine, CA',
    oneLiner: 'Passionate about scaling B2B SaaS businesses with innovative go-to-market strategies',
    availableFor: ['Full-time'],
    stage: 'MVP',
    matchScore: 85,
    endorsements: 12,
    imageUrl: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    isBookmarked: true,
    linkedInUrl: 'https://linkedin.com/in/michaelrodriguez',
    email: 'michael.rodriguez@example.com'
  },
  {
    id: 3,
    name: 'Emily Wang',
    role: 'Product Co-Founder',
    major: 'Design',
    skills: ['UX/UI & Product Design', 'Product Management', 'User Research & Testing'],
    interests: ['Healthcare, Biotech & MedTech', 'Consumer Tech & Apps', 'Social Media & Networking'],
    location: 'Newport Beach, CA',
    oneLiner: 'Creating user-centered products that solve real healthcare problems',
    availableFor: ['Part-time', 'Advisor'],
    stage: 'Early Revenue',
    matchScore: 78,
    endorsements: 9,
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    isBookmarked: false,
    twitterUrl: 'https://twitter.com/emilywangdesign',
    email: 'emily.wang@example.com'
  },
  {
    id: 4,
    name: 'David Kim',
    role: 'Technical Co-Founder',
    major: 'Computer Science',
    skills: ['Software Development', 'Cloud & DevOps', 'Cybersecurity & Privacy'],
    interests: ['Finance & FinTech', 'Blockchain & Web3', 'Cybersecurity & Privacy'],
    location: 'Los Angeles, CA',
    oneLiner: 'Building the next generation of secure and user-friendly financial applications',
    availableFor: ['Full-time'],
    stage: 'Ideation',
    matchScore: 89,
    endorsements: 15,
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    isBookmarked: false,
    linkedInUrl: 'https://linkedin.com/in/davidkim',
    twitterUrl: 'https://twitter.com/davidkimtech',
    email: 'david.kim@example.com'
  },
  {
    id: 5,
    name: 'Aisha Johnson',
    role: 'Marketing Co-Founder',
    major: 'Marketing',
    skills: ['Growth & Marketing', 'Business Strategy & Operations', 'User Research & Testing'],
    interests: ['Media, Content & Creator Economy', 'E-commerce & Marketplaces', 'Climate & Sustainability'],
    location: 'Santa Monica, CA',
    oneLiner: 'Crafting authentic brand stories that resonate with eco-conscious consumers',
    availableFor: ['Part-time', 'Advisor'],
    stage: 'MVP',
    matchScore: 73,
    endorsements: 7,
    imageUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    isBookmarked: false,
    linkedInUrl: 'https://linkedin.com/in/aishajohnson',
    email: 'aisha.johnson@example.com'
  },
];

interface ProfileModalProps {
  founder: Founder;
  isOpen: boolean;
  onClose: () => void;
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).catch(err => {
    console.error('Could not copy text: ', err);
  });
}

function ProfileModal({ founder, isOpen, onClose }: ProfileModalProps) {
  const [copiedEmail, setCopiedEmail] = useState(false);
  
  if (!isOpen) return null;

  const handleCopyEmail = () => {
    if (founder.email) {
      copyToClipboard(founder.email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden relative z-10 mx-4">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 focus:outline-none transition-colors"
          aria-label="Close"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        {/* Header with profile photo and basic info */}
        <div className="p-8 pb-6 border-b border-gray-100">
          <div className="flex items-center">
            <div className="h-20 w-20 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-50 shadow-sm">
              <img
                src={founder.imageUrl}
                alt={founder.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="ml-6">
              <h3 className="text-2xl font-bold text-gray-900">{founder.name}</h3>
              <p className="text-gray-600 text-lg">{founder.role}</p>
              <p className="text-gray-600 text-sm">{founder.major}</p>
              <p className="text-gray-500 flex items-center mt-1">
                <MapPinIcon className="h-4 w-4 mr-1.5 text-gray-400" />
                {founder.location}
              </p>
            </div>
          </div>
          
          {/* Contact options */}
          <div className="flex mt-6 space-x-3">
            {founder.email && (
              <button
                onClick={handleCopyEmail}
                className="flex items-center px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors group"
              >
                <Image 
                  src={EnvelopeIconSvg} 
                  alt="Email" 
                  width={16} 
                  height={16} 
                  className="mr-2"
                />
                <span className="text-sm">
                  {copiedEmail ? 'Email Copied!' : 'Copy Email'}
                </span>
              </button>
            )}
            {founder.linkedInUrl && (
              <a
                href={founder.linkedInUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <Image
                  src={LinkedInLogo}
                  alt="LinkedIn"
                  width={18}
                  height={18}
                  className="mr-2"
                />
                <span className="text-sm">LinkedIn</span>
              </a>
            )}
            {founder.twitterUrl && (
              <a
                href={founder.twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <Image
                  src={XLogo}
                  alt="X"
                  width={18}
                  height={18}
                  className="mr-2"
                />
                <span className="text-sm">Twitter</span>
              </a>
            )}
          </div>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto p-8 max-h-[calc(90vh-200px)]">
          <div className="mb-8">
            <h4 className="text-sm font-medium uppercase tracking-wider text-gray-500 mb-3">About</h4>
            <p className="text-gray-800 whitespace-pre-line">{founder.about || founder.oneLiner}</p>
          </div>

          <div className="mb-8">
            <h4 className="text-sm font-medium uppercase tracking-wider text-gray-500 mb-3">Skills</h4>
            <div className="flex flex-wrap gap-2">
              {founder.skills.map((skill, idx) => (
                <span key={idx} className="px-3 py-1.5 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          
          <div className="mb-8">
            <h4 className="text-sm font-medium uppercase tracking-wider text-gray-500 mb-3">Interests</h4>
            <div className="flex flex-wrap gap-2">
              {founder.interests.map((interest, idx) => (
                <span key={idx} className="px-3 py-1.5 bg-gray-50 text-gray-800 rounded-full text-sm font-medium border border-gray-200">
                  {interest}
                </span>
              ))}
            </div>
          </div>

          {founder.experience && (
            <div className="mb-8">
              <h4 className="text-sm font-medium uppercase tracking-wider text-gray-500 mb-3">Experience</h4>
              <div className="space-y-5">
                {founder.experience.map((exp, idx) => (
                  <div key={idx} className="pl-4 border-l-2 border-gray-100">
                    <h5 className="font-medium text-gray-900">{exp.title}</h5>
                    <p className="text-gray-700">{exp.company}</p>
                    <p className="text-gray-500 text-sm">{exp.duration}</p>
                    <p className="text-gray-600 mt-2 text-sm">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {founder.education && (
            <div className="mb-8">
              <h4 className="text-sm font-medium uppercase tracking-wider text-gray-500 mb-3">Education</h4>
              <div className="space-y-4">
                {founder.education.map((edu, idx) => (
                  <div key={idx}>
                    <h5 className="font-medium text-gray-900">{edu.school}</h5>
                    <p className="text-gray-700">{edu.degree}</p>
                    <p className="text-gray-500 text-sm">{edu.year}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium uppercase tracking-wider text-gray-500 mb-3">Availability</h4>
              <div className="flex flex-wrap gap-2">
                {founder.availableFor.map((type, idx) => (
                  <span key={idx} className="px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                    {type}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium uppercase tracking-wider text-gray-500 mb-3">Startup Stage</h4>
              <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                {founder.stage}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex justify-end">
          <button
            type="button"
            className="px-6 py-2.5 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CoFoundersPage() {
  return (
    <ProtectedRoute>
      <CoFounders />
    </ProtectedRoute>
  );
}

function CoFounders() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [expandedFounder, setExpandedFounder] = useState<number | null>(null);
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false);
  const [founders, setFounders] = useState<Founder[]>(mockFounders);
  const [expandedFilterGroup, setExpandedFilterGroup] = useState<string | null>(null);
  const [selectedFounder, setSelectedFounder] = useState<Founder | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [copiedEmails, setCopiedEmails] = useState<{[key: number]: boolean}>({});

  // Sort by match score initially
  useEffect(() => {
    setFounders([...mockFounders].sort((a, b) => b.matchScore - a.matchScore));
  }, []);

  // Filter handlers
  const toggleFilter = (filter: string) => {
    if (activeFilters.includes(filter)) {
      setActiveFilters(activeFilters.filter(f => f !== filter));
    } else {
      setActiveFilters([...activeFilters, filter]);
    }
  };

  const clearFilters = () => {
    setActiveFilters([]);
    setSearchQuery('');
    setBookmarkedOnly(false);
  };

  // Bookmark handler
  const toggleBookmark = (id: number) => {
    setFounders(founders.map(founder => 
      founder.id === id ? {...founder, isBookmarked: !founder.isBookmarked} : founder
    ));
  };

  const handleCopyEmail = (founderId: number, email: string) => {
    copyToClipboard(email);
    setCopiedEmails({...copiedEmails, [founderId]: true});
    setTimeout(() => {
      setCopiedEmails({...copiedEmails, [founderId]: false});
    }, 2000);
  };

  // Filter founders based on search, bookmarks, and active filters
  const filteredFounders = founders.filter(founder => {
    // Filter by bookmarks if active
    if (bookmarkedOnly && !founder.isBookmarked) return false;
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesName = founder.name.toLowerCase().includes(query);
      const matchesRole = founder.role.toLowerCase().includes(query);
      const matchesSkills = founder.skills.some(skill => skill.toLowerCase().includes(query));
      const matchesInterests = founder.interests.some(interest => interest.toLowerCase().includes(query));
      const matchesOneLiner = founder.oneLiner.toLowerCase().includes(query);
      
      if (!(matchesName || matchesRole || matchesSkills || matchesInterests || matchesOneLiner)) {
        return false;
      }
    }
    
    // Filter by active filters
    if (activeFilters.length > 0) {
      // Check for technical skills match
      const hasTechnicalSkillMatch = filterCategories.technicalSkills.some(skill => 
        activeFilters.includes(skill) && founder.skills.includes(skill)
      );
      
      // Check for business skills match
      const hasBusinessSkillMatch = filterCategories.businessSkills.some(skill => 
        activeFilters.includes(skill) && founder.skills.includes(skill)
      );
      
      // Check for science skills match
      const hasScienceSkillMatch = filterCategories.scienceSkills.some(skill => 
        activeFilters.includes(skill) && founder.skills.includes(skill)
      );
      
      // Check for industry interests match
      const hasIndustryMatch = filterCategories.industries.some(industry => 
        activeFilters.includes(industry) && founder.interests.includes(industry)
      );
      
      // Check for availability match
      const hasAvailabilityMatch = filterCategories.availability.some(avail => 
        activeFilters.includes(avail) && founder.availableFor.includes(avail)
      );
      
      // Check for stage match
      const hasStageMatch = filterCategories.stages.some(stage => 
        activeFilters.includes(stage) && founder.stage === stage
      );
      
      // Check for location match
      const hasLocationMatch = filterCategories.locations.some(location => 
        activeFilters.includes(location) && (
          location === 'Any Location' || 
          founder.location.includes(location.replace('Any ', ''))
        )
      );
      
      // Determine if this founder matches any of the active filters
      const hasAnySkillMatch = hasTechnicalSkillMatch || hasBusinessSkillMatch || hasScienceSkillMatch;
      const hasAnyNonSkillMatch = hasIndustryMatch || hasAvailabilityMatch || hasStageMatch || hasLocationMatch;
      
      // Logic: founder must match at least one filter from each active category
      if (activeFilters.some(f => filterCategories.technicalSkills.includes(f)) && !hasTechnicalSkillMatch &&
          activeFilters.some(f => filterCategories.businessSkills.includes(f)) && !hasBusinessSkillMatch &&
          activeFilters.some(f => filterCategories.scienceSkills.includes(f)) && !hasScienceSkillMatch &&
          activeFilters.some(f => filterCategories.industries.includes(f)) && !hasIndustryMatch &&
          activeFilters.some(f => filterCategories.availability.includes(f)) && !hasAvailabilityMatch &&
          activeFilters.some(f => filterCategories.stages.includes(f)) && !hasStageMatch &&
          activeFilters.some(f => filterCategories.locations.includes(f)) && !hasLocationMatch) {
        return false;
      }
      
      if (!(hasAnySkillMatch || hasAnyNonSkillMatch)) {
        return false;
      }
    }
    
    return true;
  });

  // Top recommended matches (high match score)
  const recommendedFounders = [...founders]
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 3);

  const toggleFilterGroup = (groupKey: string) => {
    if (expandedFilterGroup === groupKey) {
      setExpandedFilterGroup(null);
    } else {
      setExpandedFilterGroup(groupKey);
    }
  };

  return (
    <DashboardLayout>
      <div className="content-header">
          <h1 className="text-3xl font-bold text-gray-900">
            Find Co-Founders
          </h1>
        <p className="mt-2.5 text-lg text-gray-600">
          Connect with potential co-founders who share your vision
          </p>
        </div>

      {/* Recommended section */}
      <div className="mt-9 mb-7">
        <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-semibold text-gray-900">Recommended for You</h2>
            <p className="text-sm text-gray-500">Based on your profile and interests</p>
          </div>
          
        <div className="flex space-x-7 overflow-x-auto pb-5 scrollbar-hide">
            {recommendedFounders.map((founder) => (
              <div 
                key={`rec-${founder.id}`}
                className="flex-shrink-0 w-80 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md flex flex-col h-[420px]"
              >
                <div className="p-5 flex flex-col h-full">
                  {/* Header - Improved layout */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start">
                      <div className="h-14 w-14 rounded-full overflow-hidden border-2 border-gray-100 shadow-sm flex-shrink-0">
                        <img
                          src={founder.imageUrl}
                          alt={founder.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-base font-semibold text-gray-900">
                          {founder.name}
                        </h3>
                        <p className="text-sm text-gray-500">{founder.role}</p>
                        <p className="text-xs text-gray-500">{founder.major}</p>
                        <p className="text-xs text-gray-400 flex items-center mt-1">
                          <MapPinIcon className="h-3 w-3 mr-1 flex-shrink-0" />
                          <span className="truncate">{founder.location}</span>
                        </p>
                      </div>
                    </div>
                    <div className="ml-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                        {founder.matchScore}% Match
                      </span>
                    </div>
                  </div>
                  
                  {/* One liner */}
                  <div className="mt-2 mb-3 h-[40px]">
                    <p className="text-sm text-gray-600 line-clamp-2 italic">
                      "{founder.oneLiner}"
                    </p>
                  </div>
                  
                  {/* Skills and interests with scrolling */}
                  <div className="flex-grow overflow-y-auto pr-1 space-y-4">
                    <div>
                      <h4 className="text-xs font-medium text-gray-500 uppercase mb-2">Skills</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {founder.skills.map((skill, idx) => (
                          <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-800 rounded-md text-xs truncate max-w-[160px]">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-xs font-medium text-gray-500 uppercase mb-2">Interests</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {founder.interests.slice(0, 3).map((interest, idx) => (
                          <span key={idx} className="px-2 py-1 bg-gray-50 border border-gray-200 text-gray-700 rounded-md text-xs truncate max-w-[160px]">
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Footer with contact links and profile button */}
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                      {founder.email && (
                        <button
                          onClick={() => handleCopyEmail(founder.id, founder.email!)}
                          className="flex items-center justify-center text-gray-600 hover:text-gray-800 relative border border-gray-200 rounded-md p-1 w-7 h-7"
                          title="Copy Email"
                        >
                          <Image 
                            src={EnvelopeIconSvg} 
                            alt="Email" 
                            width={14} 
                            height={14} 
                            className="w-3.5 h-3.5"
                          />
                          {copiedEmails[founder.id] && (
                            <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded">
                              Copied!
                            </span>
                          )}
                        </button>
                      )}
                      {founder.linkedInUrl && (
                        <a 
                          href={founder.linkedInUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-center text-gray-500 hover:text-gray-700 border border-gray-200 rounded-md p-1 w-7 h-7"
                          title="LinkedIn"
                        >
                          <Image
                            src={LinkedInLogo}
                            alt="LinkedIn"
                            width={14}
                            height={14}
                          />
                        </a>
                      )}
                      {founder.twitterUrl && (
                        <a 
                          href={founder.twitterUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-center text-gray-500 hover:text-gray-700 border border-gray-200 rounded-md p-1 w-7 h-7"
                          title="X (Twitter)"
                        >
                          <Image
                            src={XLogo}
                            alt="X"
                            width={14}
                            height={14}
                          />
                        </a>
                      )}
                      <button
                        onClick={() => toggleBookmark(founder.id)}
                        className="flex items-center justify-center text-gray-500 hover:text-black transition-colors duration-150 border border-gray-200 rounded-md p-1 w-7 h-7"
                        aria-label={founder.isBookmarked ? "Remove bookmark" : "Add bookmark"}
                      >
                        <BookmarkIcon className={`h-4 w-4 ${founder.isBookmarked ? 'fill-black text-black' : ''}`} />
                      </button>
                    </div>
                    <button
                      className="inline-flex items-center px-3 py-1.5 border border-gray-900 text-xs font-medium rounded-lg text-gray-900 bg-white hover:bg-gray-50 transition-colors duration-200"
                      onClick={() => {
                        setSelectedFounder(founder);
                        setIsProfileModalOpen(true);
                      }}
                    >
                      View Profile
                      <ChevronRightIcon className="h-3 w-3 ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Search and Filter Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-7 mt-7">
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
                    className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition-all duration-200 text-sm"
                    placeholder="Search by name, skills, interests, or mission"
                  />
                  {searchQuery && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                      <button
                        onClick={() => setSearchQuery('')}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
          <div className="flex space-x-2.5">
                <button
                  type="button"
                  onClick={() => setBookmarkedOnly(!bookmarkedOnly)}
                  className={`inline-flex items-center px-3 py-2.5 border rounded-lg text-sm font-medium transition-all duration-200 ${
                    bookmarkedOnly 
                      ? 'bg-gray-900 text-white border-gray-900' 
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <BookmarkIcon className={`h-5 w-5 mr-1.5 ${bookmarkedOnly ? 'text-white' : 'text-gray-400'}`} />
                  Saved
                </button>
                
                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className={`inline-flex items-center px-3 py-2.5 border rounded-lg text-sm font-medium transition-all duration-200 ${
                    showFilters || activeFilters.length > 0
                      ? 'bg-gray-900 text-white border-gray-900' 
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <FunnelIcon className={`h-5 w-5 mr-1.5 ${showFilters || activeFilters.length > 0 ? 'text-white' : 'text-gray-400'}`} />
                  Filters
                  {activeFilters.length > 0 && (
                    <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 text-xs font-medium rounded-full bg-white text-gray-900">
                      {activeFilters.length}
                    </span>
                  )}
                </button>
              </div>
            </div>
            
        {/* Expandable Filters */}
            {showFilters && (
          <div className="mt-5 pt-5 border-t border-gray-100 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filterGroups.map((group) => (
                    <div key={group.key} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
                      <button
                        onClick={() => toggleFilterGroup(group.key)}
                        className={`w-full flex items-center justify-between p-4 transition-colors ${
                          expandedFilterGroup === group.key 
                            ? 'bg-gray-900 text-white'
                            : 'bg-gray-50 hover:bg-gray-100 text-gray-800'
                        }`}
                      >
                        <span className="font-medium flex items-center">
                          {group.name === 'Technical Skills' && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                            </svg>
                          )}
                          {group.name === 'Product & Business Skills' && (
                            <BriefcaseIcon className="h-4 w-4 mr-2" />
                          )}
                          {group.name === 'Science & Research Skills' && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                            </svg>
                          )}
                          {group.name === 'Industry Interests' && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                          )}
                          {group.name === 'Availability' && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          )}
                          {group.name === 'Startup Stage' && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                          )}
                          {group.name === 'Location' && (
                            <MapPinIcon className="h-4 w-4 mr-2" />
                          )}
                          {group.name}
                        </span>
                        <div className="flex items-center">
                          {activeFilters.some(f => group.options.includes(f)) && (
                            <span className="mr-2 text-xs font-medium bg-white text-gray-800 px-1.5 py-0.5 rounded-full">
                              {activeFilters.filter(f => group.options.includes(f)).length}
                            </span>
                          )}
                          <ChevronDownIcon 
                            className={`h-5 w-5 transition-transform duration-200 ${expandedFilterGroup === group.key ? 'transform rotate-180' : ''}`} 
                          />
                        </div>
                      </button>
                      
                      {expandedFilterGroup === group.key && (
                        <div className="p-4 bg-white max-h-60 overflow-y-auto">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                            {group.options.map((option) => (
                              <div key={option} className="flex items-center">
                                <input
                                  id={`filter-${option.replace(/\s+/g, '-').toLowerCase()}`}
                                  name={`filter-${option}`}
                                  type="checkbox"
                                  checked={activeFilters.includes(option)}
                                  onChange={() => toggleFilter(option)}
                                  className="h-4 w-4 text-black focus:ring-gray-500 border-gray-300 rounded transition-colors"
                                />
                                <label 
                                  htmlFor={`filter-${option.replace(/\s+/g, '-').toLowerCase()}`} 
                                  className="ml-2 text-sm text-gray-600 cursor-pointer hover:text-gray-900"
                                >
                                  {option}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="px-5 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm flex items-center"
                  >
                    <XMarkIcon className="h-4 w-4 mr-1.5" />
                    Clear All Filters
                  </button>
                </div>
              </div>
            )}
            
            {/* Active Filters Pills */}
            {activeFilters.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2 bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center text-sm text-gray-700 mr-2 font-medium bg-white px-3 py-1.5 rounded-md border border-gray-200">
                  <FunnelIcon className="h-4 w-4 mr-1.5" />
                  <span>Active Filters: {activeFilters.length}</span>
                </div>
                {activeFilters.map((filter) => (
                  <span 
                    key={filter}
                    className="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium bg-white text-gray-800 border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    {filter}
                    <button
                      type="button"
                      onClick={() => toggleFilter(filter)}
                      className="ml-1.5 inline-flex text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                      <XMarkIcon className="h-3.5 w-3.5" />
                    </button>
                  </span>
                ))}
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-700 hover:text-black font-medium ml-auto flex items-center bg-white px-3 py-1.5 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  Clear All
                  <XMarkIcon className="h-4 w-4 ml-1.5" />
                </button>
              </div>
            )}
        </div>
        
        {/* Results Summary */}
      <div className="flex justify-between items-center my-5">
          <h2 className="text-lg font-medium text-gray-900">
            {filteredFounders.length} Potential Co-Founders
          </h2>
          <div className="flex items-center text-sm text-gray-500">
            <span className="mr-2">Sort by:</span>
            <select 
              className="text-sm border-0 focus:ring-0 text-gray-700 font-medium py-0 pl-1 pr-7 bg-transparent"
              defaultValue="match"
            >
              <option value="match">Match Score</option>
              <option value="endorsements">Endorsements</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>

        {/* Co-founders Grid */}
        {filteredFounders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 mb-11">
            {filteredFounders.map((founder) => (
              <div
                key={founder.id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col h-[480px]"
              >
                <div className="p-6 flex flex-col h-full">
                  {/* Header with profile image, info, and match score */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex space-x-3">
                      <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-gray-50 shadow-sm">
                        <img
                          src={founder.imageUrl}
                          alt={founder.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{founder.name}</h3>
                        <p className="text-gray-600 text-sm">{founder.role}</p>
                        <p className="text-gray-600 text-sm">{founder.major}</p>
                        <p className="text-gray-500 text-xs flex items-center mt-1">
                          <MapPinIcon className="h-3.5 w-3.5 mr-1 text-gray-400" />
                          {founder.location}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className={`px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-800`}>
                          {founder.matchScore}% Match
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleBookmark(founder.id);
                        }}
                        className="mt-2 text-gray-400 hover:text-gray-700"
                        aria-label={founder.isBookmarked ? "Remove bookmark" : "Add bookmark"}
                      >
                        <BookmarkIcon className={`h-5 w-5 ${founder.isBookmarked ? 'fill-current text-black' : ''}`} />
                      </button>
                    </div>
                  </div>
                  
                  {/* One liner with fixed height */}
                  <div className="mt-2 mb-4 h-[44px]">
                    <blockquote className="text-gray-700 italic text-sm border-l-4 border-gray-100 pl-3 line-clamp-2">
                      "{founder.oneLiner}"
                    </blockquote>
                  </div>
                  
                  {/* Skills and interests with dynamic heights */}
                  <div className="flex flex-col space-y-5 flex-grow overflow-y-auto pr-1">
                    <div>
                      <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {founder.skills.map((skill, idx) => (
                          <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-800 rounded-md text-xs font-medium truncate max-w-[180px]">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Interests</h4>
                      <div className="flex flex-wrap gap-2">
                        {founder.interests.map((interest, idx) => (
                          <span key={idx} className="px-2 py-1 bg-gray-50 border border-gray-200 text-gray-700 rounded-md text-xs font-medium truncate max-w-[180px]">
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Footer with contact links and profile button - Fixed position */}
                  <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-3">
                      {founder.email && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyEmail(founder.id, founder.email!);
                          }}
                          className="flex items-center justify-center text-gray-600 hover:text-gray-800 relative border border-gray-200 rounded-md p-1.5 w-8 h-8"
                          title="Copy Email"
                        >
                          <Image 
                            src={EnvelopeIconSvg} 
                            alt="Email" 
                            width={16} 
                            height={16} 
                            className="w-4 h-4"
                          />
                          {copiedEmails[founder.id] && (
                            <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded">
                              Copied!
                            </span>
                          )}
                        </button>
                      )}
                      {founder.linkedInUrl && (
                        <a
                          href={founder.linkedInUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center text-gray-500 hover:text-gray-700 border border-gray-200 rounded-md p-1.5 w-8 h-8"
                          onClick={(e) => e.stopPropagation()}
                          title="LinkedIn"
                        >
                          <Image
                            src={LinkedInLogo}
                            alt="LinkedIn"
                            width={16}
                            height={16}
                          />
                        </a>
                      )}
                      {founder.twitterUrl && (
                        <a
                          href={founder.twitterUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center text-gray-500 hover:text-gray-700 border border-gray-200 rounded-md p-1.5 w-8 h-8"
                          onClick={(e) => e.stopPropagation()}
                          title="X (Twitter)"
                        >
                          <Image
                            src={XLogo}
                            alt="X"
                            width={16}
                            height={16}
                          />
                        </a>
                      )}
                      {/* Add placeholder if no social icons to maintain spacing */}
                      {!founder.email && !founder.linkedInUrl && !founder.twitterUrl && (
                        <div className="w-8 h-8"></div>
                      )}
                    </div>
                    <button
                      className="inline-flex items-center px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                      onClick={() => {
                        setSelectedFounder(founder);
                        setIsProfileModalOpen(true);
                      }}
                    >
                      See Profile
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // No results state
        <div className="text-center py-14 bg-white rounded-xl border border-gray-100 my-9">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <MagnifyingGlassIcon className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No matching co-founders found</h3>
            <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto">
              Try adjusting your search criteria or clearing some filters to see more results.
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        )}
        
        {/* More results info */}
        {filteredFounders.length > 0 && (
        <div className="text-center pb-14 text-sm text-gray-500">
            Showing {filteredFounders.length} of {mockFounders.length} potential co-founders
          </div>
        )}

      {/* Profile Modal */}
      {selectedFounder && (
        <ProfileModal
          founder={selectedFounder}
          isOpen={isProfileModalOpen}
          onClose={() => {
            setIsProfileModalOpen(false);
            setSelectedFounder(null);
          }}
        />
      )}
    </DashboardLayout>
  );
} 