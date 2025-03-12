import React, { useState } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { 
  DocumentTextIcon,
  DocumentArrowDownIcon,
  BookmarkIcon as BookmarkOutlineIcon,
  MagnifyingGlassIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';

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
  }
];

const categories = [
  'All Resources',
  'Funding',
  'Legal',
  'Marketing',
  'Product',
  'Pitch Materials',
  'Team Building'
];

export default function Resources() {
  const [selectedCategory, setSelectedCategory] = useState('All Resources');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Resource Library</h1>
          <p className="mt-1 text-sm text-gray-500">
            Access guides, templates, and resources to help build your startup
          </p>
        </div>

        {/* Search and Categories */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="max-w-md">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium
                  ${selectedCategory === category
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }
                  transition-colors duration-150
                `}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mockResources.map((resource) => (
            <div
              key={resource.id}
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      {resource.type === 'Guide' ? (
                        <DocumentTextIcon className="h-6 w-6 text-purple-600" />
                      ) : (
                        <DocumentArrowDownIcon className="h-6 w-6 text-purple-600" />
                      )}
                      <span className="ml-2 text-xs font-medium text-purple-600 uppercase">
                        {resource.type}
                      </span>
                    </div>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">
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
                    {resource.type === 'Guide' ? (
                      <span>{resource.readTime}</span>
                    ) : (
                      <span>{resource.downloadFormat}</span>
                    )}
                  </div>
                  <button
                    type="button"
                    className={`
                      inline-flex items-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium
                      ${resource.type === 'Guide'
                        ? 'border-purple-600 text-purple-600 bg-white hover:bg-purple-50'
                        : 'border-transparent text-white bg-purple-600 hover:bg-purple-700'
                      }
                      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500
                    `}
                  >
                    {resource.type === 'Guide' ? 'Read Now' : 'Download'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
} 