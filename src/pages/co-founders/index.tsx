import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import Image from 'next/image';
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
  LinkIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

// Define types for our data
interface Founder {
  id: number;
  name: string;
  role: string;
  skills: string[];
  interests: string[];
  location: string;
  oneLiner: string;
  availableFor: string[];
  stage: string;
  matchScore: number;
  endorsements: number;
  mutualConnections: number;
  imageUrl: string;
  isBookmarked: boolean;
  linkedInUrl?: string;
  twitterUrl?: string;
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
    'Food Science & AgTech',
    'Environmental Science & Energy',
    'Psychology & Behavioral Science'
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
    skills: ['Software Development', 'AI & Machine Learning', 'Cloud & DevOps'],
    interests: ['AI & Automation', 'Developer Tools & Infrastructure', 'Education & EdTech'],
    location: 'Orange County, CA',
    oneLiner: 'Building AI tools to make education more accessible and personalized',
    availableFor: ['Full-time', 'Part-time'],
    stage: 'Ideation',
    matchScore: 92,
    endorsements: 18,
    mutualConnections: 3,
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    isBookmarked: false,
    linkedInUrl: 'https://linkedin.com/in/sarahchen',
    twitterUrl: 'https://twitter.com/sarahchentech'
  },
  {
    id: 2,
    name: 'Michael Rodriguez',
    role: 'Business Co-Founder',
    skills: ['Product Management', 'Growth & Marketing', 'Sales & Partnerships'],
    interests: ['Consumer Tech & Apps', 'Finance & FinTech', 'E-commerce & Marketplaces'],
    location: 'Irvine, CA',
    oneLiner: 'Passionate about scaling B2B SaaS businesses with innovative go-to-market strategies',
    availableFor: ['Full-time'],
    stage: 'MVP',
    matchScore: 85,
    endorsements: 12,
    mutualConnections: 2,
    imageUrl: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    isBookmarked: true,
    linkedInUrl: 'https://linkedin.com/in/michaelrodriguez'
  },
  {
    id: 3,
    name: 'Emily Wang',
    role: 'Product Co-Founder',
    skills: ['UX/UI & Product Design', 'Product Management', 'User Research & Testing'],
    interests: ['Healthcare, Biotech & MedTech', 'Consumer Tech & Apps', 'Social Media & Networking'],
    location: 'Newport Beach, CA',
    oneLiner: 'Creating user-centered products that solve real healthcare problems',
    availableFor: ['Part-time', 'Advisor'],
    stage: 'Early Revenue',
    matchScore: 78,
    endorsements: 9,
    mutualConnections: 1,
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    isBookmarked: false,
    twitterUrl: 'https://twitter.com/emilywangdesign'
  },
  {
    id: 4,
    name: 'David Kim',
    role: 'Technical Co-Founder',
    skills: ['Software Development', 'Cloud & DevOps', 'Cybersecurity & Privacy'],
    interests: ['Finance & FinTech', 'Blockchain & Web3', 'Cybersecurity & Privacy'],
    location: 'Los Angeles, CA',
    oneLiner: 'Building the next generation of secure and user-friendly financial applications',
    availableFor: ['Full-time'],
    stage: 'Ideation',
    matchScore: 89,
    endorsements: 15,
    mutualConnections: 0,
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    isBookmarked: false,
    linkedInUrl: 'https://linkedin.com/in/davidkim',
    twitterUrl: 'https://twitter.com/davidkimtech'
  },
  {
    id: 5,
    name: 'Aisha Johnson',
    role: 'Marketing Co-Founder',
    skills: ['Growth & Marketing', 'Business Strategy & Operations', 'User Research & Testing'],
    interests: ['Media, Content & Creator Economy', 'E-commerce & Marketplaces', 'Climate & Sustainability'],
    location: 'Santa Monica, CA',
    oneLiner: 'Crafting authentic brand stories that resonate with eco-conscious consumers',
    availableFor: ['Part-time', 'Advisor'],
    stage: 'MVP',
    matchScore: 73,
    endorsements: 7,
    mutualConnections: 2,
    imageUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    isBookmarked: false,
    linkedInUrl: 'https://linkedin.com/in/aishajohnson'
  },
];

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
      <div className="content-container max-w-6xl mx-auto">
        <div className="content-header mt-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Find Co-Founders
          </h1>
          <p className="mt-2 text-lg text-gray-600 max-w-2xl mx-auto">
            Connect with potential co-founders who share your vision and complement your skills
          </p>
        </div>

        {/* Recommended section - Apple-like horizontal scrolling cards */}
        <div className="mt-8 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recommended for You</h2>
            <p className="text-sm text-gray-500">Based on your profile and interests</p>
          </div>
          
          <div className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide">
            {recommendedFounders.map((founder) => (
              <div 
                key={`rec-${founder.id}`}
                className="flex-shrink-0 w-80 h-[380px] bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md flex flex-col"
              >
                <div className="p-6 flex flex-col flex-grow">
                  {/* Header - Improved layout */}
                  <div className="flex items-start">
                    <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-gray-100 shadow-sm flex-shrink-0">
                      <img
                        src={founder.imageUrl}
                        alt={founder.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="text-base font-semibold text-gray-900 truncate max-w-[120px]">
                          {founder.name}
                        </h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 whitespace-nowrap">
                          {founder.matchScore}% Match
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">{founder.role}</p>
                      <p className="text-xs text-gray-400 flex items-center mt-1">
                        <MapPinIcon className="h-3 w-3 mr-1 flex-shrink-0" />
                        <span className="truncate">{founder.location}</span>
                      </p>
                    </div>
                  </div>
                  
                  {/* Social Media Links */}
                  <div className="mt-4 flex items-center">
                    <div className="flex space-x-3">
                      {founder.linkedInUrl && (
                        <a 
                          href={founder.linkedInUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-gray-700 transition-colors"
                          aria-label="LinkedIn Profile"
                        >
                          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                          </svg>
                        </a>
                      )}
                      {founder.twitterUrl && (
                        <a 
                          href={founder.twitterUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-gray-700 transition-colors"
                          aria-label="X (Twitter) Profile"
                        >
                          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                          </svg>
                        </a>
                      )}
                    </div>
                    <div className="flex-grow"></div>
                    <button
                      onClick={() => toggleBookmark(founder.id)}
                      className="text-gray-400 hover:text-black transition-colors duration-150"
                      aria-label={founder.isBookmarked ? "Remove bookmark" : "Add bookmark"}
                    >
                      <BookmarkIcon className={`h-5 w-5 ${founder.isBookmarked ? 'fill-black text-black' : ''}`} />
                    </button>
                  </div>
                  
                  {/* One liner with fixed height */}
                  <div className="mt-4 min-h-[50px] flex-grow">
                    <p className="text-sm text-gray-600 line-clamp-2">
                      "{founder.oneLiner}"
                    </p>
                  </div>
                  
                  <div className="mt-auto pt-4">
                    <button
                      className="w-full inline-flex items-center justify-center px-3 py-2.5 border border-gray-900 text-sm font-medium rounded-lg text-gray-900 bg-white hover:bg-gray-50 transition-colors duration-200"
                      onClick={() => setExpandedFounder(founder.id)}
                    >
                      View Profile
                      <ChevronRightIcon className="h-4 w-4 ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="sticky top-0 z-10 bg-gradient-to-b from-gray-50 to-transparent pt-4 pb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition-all duration-200 text-sm"
                    placeholder="Search by name, skills, interests, or mission"
                  />
                  {searchQuery && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
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
              
              <div className="flex space-x-2">
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
            
            {/* Expandable Filters - New Design */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-100 animate-fadeIn">
                <div className="space-y-4">
                  {filterGroups.map((group) => (
                    <div key={group.key} className="border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleFilterGroup(group.key)}
                        className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <span className="font-medium text-gray-800">{group.name}</span>
                        <ChevronDownIcon 
                          className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${expandedFilterGroup === group.key ? 'transform rotate-180' : ''}`} 
                        />
                      </button>
                      
                      {expandedFilterGroup === group.key && (
                        <div className="p-3 bg-white">
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2">
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
                                  className="ml-2 text-sm text-gray-600 cursor-pointer"
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
                
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            )}
            
            {/* Active Filters Pills */}
            {activeFilters.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {activeFilters.map((filter) => (
                  <span 
                    key={filter}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-800 border border-gray-300"
                  >
                    {filter}
                    <button
                      type="button"
                      onClick={() => toggleFilter(filter)}
                      className="ml-1 inline-flex text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                      <XMarkIcon className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                <button
                  onClick={clearFilters}
                  className="text-xs text-black hover:text-gray-700 font-medium"
                >
                  Clear All
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Results Summary */}
        <div className="flex justify-between items-center my-4">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {filteredFounders.map((founder) => (
              <div
                key={founder.id}
                className={`bg-white rounded-xl border overflow-hidden transition-all duration-300 hover:shadow-md ${
                  expandedFounder === founder.id 
                    ? 'border-gray-400 shadow-md scale-102 translate-y-0' 
                    : 'border-gray-100 hover:border-gray-200'
                } ${expandedFounder === founder.id ? '' : 'h-[450px]'}`}
              >
                <div className="p-6 h-full flex flex-col">
                  {/* Header with profile pic, name, and match score */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start">
                      <div className="h-14 w-14 rounded-full overflow-hidden border-2 border-gray-100 flex-shrink-0 shadow-sm">
                        <img
                          src={founder.imageUrl}
                          alt={founder.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-base font-semibold text-gray-900 mb-0.5 truncate max-w-[140px]">
                          {founder.name}
                        </h3>
                        <p className="text-sm text-gray-500 truncate max-w-[140px]">{founder.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <span 
                        className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {founder.matchScore}% Match
                      </span>
                      <button
                        onClick={() => toggleBookmark(founder.id)}
                        className="text-gray-400 hover:text-black transition-colors duration-150"
                        aria-label={founder.isBookmarked ? "Remove bookmark" : "Add bookmark"}
                      >
                        <BookmarkIcon className={`h-5 w-5 ${founder.isBookmarked ? 'fill-black text-black' : ''}`} />
                      </button>
                    </div>
                  </div>
                  
                  {/* Location & Social Media */}
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-xs text-gray-500 flex items-center truncate max-w-[180px]">
                      <MapPinIcon className="h-3.5 w-3.5 mr-1 text-gray-400 flex-shrink-0" />
                      <span className="truncate">{founder.location}</span>
                      {founder.mutualConnections > 0 && (
                        <span className="ml-3 inline-flex items-center text-gray-600 whitespace-nowrap">
                          <UserCircleIcon className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                          {founder.mutualConnections} mutual
                        </span>
                      )}
                    </p>
                    
                    {/* Social Media Icons */}
                    {(founder.linkedInUrl || founder.twitterUrl) && (
                      <div className="flex items-center space-x-3">
                        {founder.linkedInUrl && (
                          <a 
                            href={founder.linkedInUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-gray-700 transition-colors"
                            aria-label="LinkedIn Profile"
                          >
                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                            </svg>
                          </a>
                        )}
                        {founder.twitterUrl && (
                          <a 
                            href={founder.twitterUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-gray-700 transition-colors"
                            aria-label="X (Twitter) Profile"
                          >
                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                            </svg>
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Mission/One liner with fixed height */}
                  <div className="mt-4 min-h-[48px]">
                    <p className="text-sm text-gray-700 line-clamp-2">
                      "{founder.oneLiner}"
                    </p>
                  </div>
                  
                  {/* Skills with max height */}
                  <div className="mt-5">
                    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-2 max-h-[70px] overflow-y-auto pr-1">
                      {founder.skills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200 whitespace-nowrap"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Interests with max height */}
                  <div className="mt-4">
                    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Interests</h4>
                    <div className="flex flex-wrap gap-2 max-h-[70px] overflow-y-auto pr-1">
                      {founder.interests.map((interest) => (
                        <span
                          key={interest}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200 whitespace-nowrap"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Additional info when expanded */}
                  {expandedFounder === founder.id && (
                    <div className="mt-5 pt-4 border-t border-gray-100 animate-fadeIn">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Availability</h4>
                          <div className="flex flex-wrap gap-1">
                            {founder.availableFor.map((avail) => (
                              <span
                                key={avail}
                                className="inline-flex items-center px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded whitespace-nowrap"
                              >
                                {avail}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Stage</h4>
                          <span className="inline-flex items-center px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded whitespace-nowrap">
                            {founder.stage}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                        <div className="flex items-center">
                          <CheckBadgeIcon className="h-4 w-4 text-green-500 mr-1 flex-shrink-0" />
                          <span>{founder.endorsements} endorsements</span>
                        </div>
                        <button className="text-black hover:text-gray-700 font-medium">
                          View Full Profile
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {/* Action buttons */}
                  <div className="mt-auto pt-4 grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      className="inline-flex items-center justify-center px-3 py-2.5 border border-gray-900 text-sm font-medium rounded-lg text-gray-900 bg-white hover:bg-gray-50 transition-colors duration-200"
                      onClick={() => setExpandedFounder(expandedFounder === founder.id ? null : founder.id)}
                    >
                      {expandedFounder === founder.id ? 'Show Less' : 'See More'}
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center justify-center px-3 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-black hover:bg-gray-800 shadow-sm transition-colors duration-200"
                    >
                      <UserPlusIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                      Connect
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // No results state
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100 my-8">
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
          <div className="text-center pb-12 text-sm text-gray-500">
            Showing {filteredFounders.length} of {mockFounders.length} potential co-founders
          </div>
        )}
      </div>
      
      {/* Add global styles for animations and scrollbars */}
      <style jsx global>{`
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
        
        .scale-102 {
          transform: scale(1.02);
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        /* Custom scrollbar for skill/interest tags */
        .max-h-\\[70px\\]::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        
        .max-h-\\[70px\\]::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .max-h-\\[70px\\]::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 4px;
        }
        
        .max-h-\\[70px\\]::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </DashboardLayout>
  );
} 