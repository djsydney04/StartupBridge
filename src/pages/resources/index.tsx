import React, { useState } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { 
  DocumentTextIcon,
  DocumentArrowDownIcon,
  BookmarkIcon as BookmarkOutlineIcon,
  MagnifyingGlassIcon,
  TagIcon,
  DocumentCheckIcon,
  VideoCameraIcon,
  AcademicCapIcon,
  LightBulbIcon,
  FireIcon,
  RectangleGroupIcon
} from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

// Featured resource
const featuredResource = {
  id: 0,
  title: "Ultimate Founder's Guide to Startup Success",
  type: "Playbook",
  description: "A comprehensive guide covering all aspects of launching a successful startup, from ideation to scaling. Includes practical tips, case studies, and expert advice from Chapman alumni who've built successful companies.",
  category: "Starting Up",
  readTime: "45 min read",
  author: "Chapman Entrepreneurship Program",
  isBookmarked: false,
  isFeatured: true
};

// Mock resources data (replace with real data later)
const mockResources = [
  {
    id: 1,
    title: 'How to Raise Seed Funding as a Student Founder',
    type: 'Guide',
    description: 'Learn the essential steps and strategies for raising your first round of funding while still in school.',
    category: 'Funding',
    readTime: '10 min read',
    author: 'Chapman Startup Center',
    isBookmarked: false
  },
  {
    id: 2,
    title: 'Startup Pitch Deck Template',
    type: 'Template',
    description: 'A professional pitch deck template designed specifically for student-led startups.',
    category: 'Pitch Materials',
    downloadFormat: 'PowerPoint, PDF',
    author: 'Chapman Entrepreneurs',
    isBookmarked: true
  },
  {
    id: 3,
    title: 'Co-Founder Agreement Template',
    type: 'Template',
    description: 'Legal template for establishing roles, equity split, and responsibilities between co-founders.',
    category: 'Legal',
    downloadFormat: 'Word, PDF',
    author: 'Chapman Legal Clinic',
    isBookmarked: false
  },
  {
    id: 4,
    title: 'Customer Validation Workshop',
    type: 'Video',
    description: 'A recorded workshop on how to validate your business idea with real customers.',
    category: 'Product',
    duration: '38 min',
    author: 'Prof. Sarah Johnson',
    isBookmarked: false
  },
  {
    id: 5,
    title: 'Startup Financial Model Template',
    type: 'Template',
    description: 'Comprehensive financial model spreadsheet with projections, cash flow, and metrics.',
    category: 'Funding',
    downloadFormat: 'Excel, Google Sheets',
    author: 'Chapman Finance Club',
    isBookmarked: false
  },
  {
    id: 6,
    title: 'How to Find Your First 100 Customers',
    type: 'Guide',
    description: 'Proven strategies for early customer acquisition on a limited budget.',
    category: 'Marketing',
    readTime: '15 min read',
    author: 'Chapman Marketing Society',
    isBookmarked: false
  },
  {
    id: 7,
    title: 'Startup Legal Checklist',
    type: 'Checklist',
    description: 'Essential legal tasks for launching your startup and avoiding common pitfalls.',
    category: 'Legal',
    items: '12 items',
    author: 'Chapman Law Clinics',
    isBookmarked: false
  },
  {
    id: 8,
    title: 'Tech Stack Decision Guide',
    type: 'Guide',
    description: 'How to choose the right technologies for your startup based on your needs and constraints.',
    category: 'Product',
    readTime: '12 min read',
    author: 'Chapman CS Department',
    isBookmarked: false
  },
  {
    id: 9,
    title: 'Finding Co-Founder Chemistry',
    type: 'Masterclass',
    description: 'Learn how to evaluate potential co-founders and build a strong founding team.',
    category: 'Team Building',
    duration: '52 min',
    author: 'Founder in Residence',
    isBookmarked: false
  }
];

const categories = [
  'All Resources',
  'Starting Up',
  'Funding',
  'Legal',
  'Marketing',
  'Product',
  'Pitch Materials',
  'Team Building'
];

const resourceTypes = [
  'All Types',
  'Guide',
  'Template',
  'Checklist',
  'Video',
  'Masterclass',
  'Playbook'
];

export default function Resources() {
  const [selectedCategory, setSelectedCategory] = useState('All Resources');
  const [selectedType, setSelectedType] = useState('All Types');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewBookmarked, setViewBookmarked] = useState(false);

  // Filter resources based on selections
  const filteredResources = mockResources.filter(resource => {
    // Filter by search
    if (searchQuery && !resource.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !resource.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by category
    if (selectedCategory !== 'All Resources' && resource.category !== selectedCategory) {
      return false;
    }
    
    // Filter by type
    if (selectedType !== 'All Types' && resource.type !== selectedType) {
      return false;
    }
    
    // Filter by bookmarks
    if (viewBookmarked && !resource.isBookmarked) {
      return false;
    }
    
    return true;
  });

  return (
    <DashboardLayout>
      <div className="content-container">
        {/* Header */}
        <div className="content-header">
          <h1 className="text-3xl font-bold text-gray-900">Resource Library</h1>
          <p className="mt-2 text-lg text-gray-600">
            Access guides, templates, and resources to help build your startup
          </p>
        </div>

        {/* Featured Resource */}
        <div className="content-section bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <FireIcon className="h-5 w-5 text-orange-500" />
                <span className="text-sm font-semibold text-orange-600">Featured Resource</span>
              </div>
              <h2 className="mt-2 text-2xl font-bold text-gray-900">{featuredResource.title}</h2>
              <p className="mt-3 text-gray-600">{featuredResource.description}</p>
              
              <div className="mt-4 flex items-center space-x-4">
                <span className="inline-flex items-center text-sm text-gray-500">
                  <DocumentTextIcon className="mr-1 h-4 w-4 text-gray-400" />
                  {featuredResource.readTime}
                </span>
                <span className="inline-flex items-center text-sm text-gray-500">
                  <TagIcon className="mr-1 h-4 w-4 text-gray-400" />
                  {featuredResource.category}
                </span>
              </div>
              
              <div className="mt-6">
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                  Read Playbook
                </button>
                <button className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                  <BookmarkOutlineIcon className="mr-2 h-5 w-5 text-gray-400" />
                  Save for Later
                </button>
              </div>
            </div>
            
            <div className="hidden md:block w-64 h-48 bg-purple-200 rounded-lg flex items-center justify-center">
              <AcademicCapIcon className="h-24 w-24 text-purple-500 opacity-50" />
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="content-section">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Bar */}
            <div className="col-span-1 md:col-span-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  placeholder="Search resources by title or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Category Filters */}
            <div>
              <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                id="category-filter"
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Type Filters */}
            <div>
              <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Resource Type
              </label>
              <select
                id="type-filter"
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                {resourceTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Bookmark Filter */}
            <div className="flex items-end">
              <button
                onClick={() => setViewBookmarked(!viewBookmarked)}
                className={`
                  inline-flex items-center px-4 py-2 border rounded-md text-sm font-medium
                  ${viewBookmarked 
                    ? 'bg-purple-100 text-purple-700 border-purple-300' 
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500
                `}
              >
                {viewBookmarked 
                  ? <BookmarkSolidIcon className="mr-2 h-5 w-5 text-purple-600" />
                  : <BookmarkOutlineIcon className="mr-2 h-5 w-5 text-gray-400" />
                }
                {viewBookmarked ? 'Showing Bookmarked' : 'Show Bookmarked'}
              </button>
            </div>
          </div>
        </div>

        {/* Resource Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { name: 'Guides & Playbooks', icon: DocumentTextIcon, color: 'bg-blue-100 text-blue-600' },
            { name: 'Templates & Tools', icon: RectangleGroupIcon, color: 'bg-green-100 text-green-600' },
            { name: 'Videos & Workshops', icon: VideoCameraIcon, color: 'bg-red-100 text-red-600' },
            { name: 'Checklists', icon: DocumentCheckIcon, color: 'bg-amber-100 text-amber-600' }
          ].map((category, idx) => (
            <div key={idx} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${category.color} mr-4`}>
                  <category.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">{category.name}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Results Summary */}
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">
            {filteredResources.length} {filteredResources.length === 1 ? 'Resource' : 'Resources'} Found
          </h2>
          <div className="text-sm text-gray-500">
            Sorted by: Relevance
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          {filteredResources.map((resource) => (
            <div
              key={resource.id}
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      {resource.type === 'Guide' && <DocumentTextIcon className="h-6 w-6 text-purple-600" />}
                      {resource.type === 'Template' && <DocumentArrowDownIcon className="h-6 w-6 text-blue-600" />}
                      {resource.type === 'Checklist' && <DocumentCheckIcon className="h-6 w-6 text-amber-600" />}
                      {resource.type === 'Video' && <VideoCameraIcon className="h-6 w-6 text-red-600" />}
                      {resource.type === 'Masterclass' && <AcademicCapIcon className="h-6 w-6 text-green-600" />}
                      {resource.type === 'Playbook' && <LightBulbIcon className="h-6 w-6 text-orange-600" />}
                      <span className="ml-2 text-xs font-medium text-gray-600 uppercase">
                        {resource.type}
                      </span>
                    </div>
                    <h3 className="mt-2 text-lg font-medium text-gray-900 line-clamp-2">
                      {resource.title}
                    </h3>
                  </div>
                  <button
                    className="ml-4 text-gray-400 hover:text-purple-600 transition-colors duration-150"
                    onClick={() => {
                      // Toggle bookmark functionality
                    }}
                  >
                    {resource.isBookmarked ? (
                      <BookmarkSolidIcon className="h-6 w-6 text-purple-600" />
                    ) : (
                      <BookmarkOutlineIcon className="h-6 w-6" />
                    )}
                  </button>
                </div>

                <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                  {resource.description}
                </p>

                <div className="mt-4 flex items-center text-sm text-gray-500">
                  <TagIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                  {resource.category}
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    {resource.type === 'Guide' || resource.type === 'Playbook' ? (
                      <span>{resource.readTime}</span>
                    ) : resource.type === 'Template' ? (
                      <span>{resource.downloadFormat}</span>
                    ) : resource.type === 'Checklist' ? (
                      <span>{resource.items}</span>
                    ) : (
                      <span>{resource.duration}</span>
                    )}
                  </div>
                  <button
                    type="button"
                    className={`
                      inline-flex items-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium
                      ${['Guide', 'Playbook', 'Masterclass', 'Video'].includes(resource.type)
                        ? 'border-purple-600 text-purple-600 bg-white hover:bg-purple-50'
                        : 'border-transparent text-white bg-purple-600 hover:bg-purple-700'
                      }
                      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500
                    `}
                  >
                    {['Guide', 'Playbook', 'Masterclass', 'Video'].includes(resource.type) ? 'Read Now' : 'Download'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results Message */}
        {filteredResources.length === 0 && (
          <div className="text-center py-12">
            <LightBulbIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No matching resources</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter to find what you're looking for.
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All Resources');
                  setSelectedType('All Types');
                  setViewBookmarked(false);
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
} 