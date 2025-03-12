import React, { useState } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
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
    role: 'Technical Co-Founder',
    skills: ['Full Stack Development', 'AI/ML', 'System Architecture'],
    interests: ['EdTech', 'AI Applications', 'Developer Tools'],
    location: 'Orange County, CA',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: 2,
    name: 'Michael Rodriguez',
    role: 'Business Co-Founder',
    skills: ['Business Strategy', 'Marketing', 'Sales'],
    interests: ['SaaS', 'B2B Software', 'MarketPlace'],
    location: 'Irvine, CA',
    imageUrl: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: 3,
    name: 'Emily Wang',
    role: 'Product Co-Founder',
    skills: ['Product Management', 'UX Design', 'Data Analytics'],
    interests: ['HealthTech', 'Consumer Apps', 'IoT'],
    location: 'Newport Beach, CA',
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
];

const filters = {
  skills: ['Technical', 'Business', 'Design', 'Marketing'],
  experience: ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate'],
  interests: ['AI/ML', 'FinTech', 'EdTech', 'E-commerce', 'Healthcare'],
};

export default function CoFoundersPage() {
  return (
    <ProtectedRoute>
      <CoFounders />
    </ProtectedRoute>
  );
}

function CoFounders() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    skills: [],
    experience: [],
    interests: [],
  });
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  return (
    <DashboardLayout>
      <div className="content-container">
        <div className="content-header">
          <h1 className="text-3xl font-bold text-gray-900">
            Find Co-Founders
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Connect with potential co-founders who share your vision
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="content-section">
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
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  placeholder="Search by name, skills, or interests"
                />
              </div>
            </div>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              <AdjustmentsHorizontalIcon className="h-5 w-5 text-gray-400 mr-2" />
              Filters
            </button>
          </div>
        </div>

        {/* Co-founders Grid */}
        <div className="content-section">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {mockFounders.map((founder) => (
              <div
                key={founder.id}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="h-16 w-16 rounded-full overflow-hidden">
                      <img
                        src={founder.imageUrl}
                        alt={founder.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        {founder.name}
                      </h3>
                      <p className="text-sm text-gray-500">{founder.role}</p>
                      <p className="text-sm text-gray-500">{founder.location}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900">Skills</h4>
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
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900">Interests</h4>
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
                  <div className="mt-6">
                    <button
                      type="button"
                      className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                      Connect
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 