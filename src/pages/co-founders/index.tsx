import React, { useState } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { 
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  UserPlusIcon
} from '@heroicons/react/24/outline';

// Mock data for founders (replace with real data later)
const mockFounders = [
  {
    id: 1,
    name: 'Sarah Chen',
    major: 'Computer Science',
    year: 'Junior',
    skills: ['Full-Stack Development', 'UI/UX Design', 'Product Management'],
    interests: ['EdTech', 'AI/ML', 'Mobile Apps'],
    lookingFor: 'Business Co-Founder',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
  },
  {
    id: 2,
    name: 'Michael Rodriguez',
    major: 'Business Administration',
    year: 'Senior',
    skills: ['Marketing', 'Business Strategy', 'Sales'],
    interests: ['E-commerce', 'FinTech', 'SaaS'],
    lookingFor: 'Technical Co-Founder',
    imageUrl: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5',
  },
  // Add more mock founders...
];

const filters = {
  skills: ['Technical', 'Business', 'Design', 'Marketing'],
  experience: ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate'],
  interests: ['AI/ML', 'FinTech', 'EdTech', 'E-commerce', 'Healthcare'],
};

export default function CoFounders() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    skills: [],
    experience: [],
    interests: [],
  });
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Find Co-Founders</h1>
          <p className="mt-1 text-sm text-gray-500">
            Connect with potential startup partners based on skills and interests
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  placeholder="Search by name, skills, or interests..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Filter Button */}
            <div className="flex-shrink-0">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                <AdjustmentsHorizontalIcon className="h-5 w-5 mr-2 text-gray-400" />
                Filters
              </button>
            </div>
          </div>
        </div>

        {/* Founders Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mockFounders.map((founder) => (
            <div
              key={founder.id}
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-6">
                <div className="flex items-center">
                  <img
                    className="h-12 w-12 rounded-full"
                    src={founder.imageUrl}
                    alt={founder.name}
                  />
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {founder.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {founder.major} • {founder.year}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-sm font-medium text-purple-600">
                    Looking for: {founder.lookingFor}
                  </p>
                  
                  <div className="mt-2">
                    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Skills
                    </h4>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {founder.skills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-2">
                    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Interests
                    </h4>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {founder.interests.map((interest) => (
                        <span
                          key={interest}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    <UserPlusIcon className="h-5 w-5 mr-2" />
                    Connect
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