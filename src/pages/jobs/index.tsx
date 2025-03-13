import React, { useState } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { 
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  PlusIcon,
  MapPinIcon,
  ClockIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

// Mock job data (replace with real data later)
const mockJobs = [
  {
    id: 1,
    title: 'Frontend Developer',
    company: 'TechStartup Inc.',
    location: 'Irvine, CA',
    hoursPerWeek: '40 hours/week',
    description: 'Looking for a passionate frontend developer to join our growing team. Experience with React and TypeScript required.',
    skills: ['React', 'TypeScript', 'Tailwind CSS'],
    postedDate: '2 days ago',
    logo: 'https://tailwindui.com/img/logos/mark.svg?color=black&shade=600',
  },
  {
    id: 2,
    title: 'Product Manager',
    company: 'InnovateCo',
    location: 'Newport Beach, CA',
    hoursPerWeek: '35-40 hours/week',
    description: 'Seeking an experienced product manager to lead our product development initiatives and drive growth.',
    skills: ['Product Strategy', 'Agile', 'Data Analytics'],
    postedDate: '3 days ago',
    logo: 'https://tailwindui.com/img/logos/mark.svg?color=black&shade=600',
  },
  {
    id: 3,
    title: 'Marketing Specialist',
    company: 'GrowthLabs',
    location: 'Costa Mesa, CA',
    hoursPerWeek: '20 hours/week',
    description: 'Join our marketing team to help drive customer acquisition and brand awareness for early-stage startups.',
    skills: ['Digital Marketing', 'Social Media', 'Content Creation'],
    postedDate: '1 week ago',
    logo: 'https://tailwindui.com/img/logos/mark.svg?color=black&shade=600',
  },
];

const filters = {
  hoursPerWeek: ['10-20 hours/week', '20-30 hours/week', '30-40 hours/week', '40+ hours/week'],
  location: ['Remote', 'On-site', 'Hybrid'],
  compensation: ['Paid', 'Equity', 'Unpaid'],
};

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

  return (
    <DashboardLayout>
      <div className="content-container max-w-6xl mx-auto">
        <div className="content-header mt-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Jobs Board
          </h1>
          <p className="mt-2 text-lg text-gray-600 max-w-2xl mx-auto">
            Find exciting opportunities at innovative startups
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
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
                  placeholder="Search jobs by title, company, or skills"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-3 py-2.5 border rounded-lg text-sm font-medium transition-all duration-200 bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
            >
              <AdjustmentsHorizontalIcon className="h-5 w-5 text-gray-400 mr-2" />
              Filters
            </button>
          </div>
          
          {/* Expandable Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-100 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Hours per Week</h3>
                  <div className="space-y-2">
                    {filters.hoursPerWeek.map((option) => (
                      <div key={option} className="flex items-center">
                        <input
                          id={`hours-${option}`}
                          name="hours"
                          type="checkbox"
                          className="h-4 w-4 text-black focus:ring-gray-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`hours-${option}`} className="ml-2 text-sm text-gray-600">
                          {option}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Location</h3>
                  <div className="space-y-2">
                    {filters.location.map((option) => (
                      <div key={option} className="flex items-center">
                        <input
                          id={`location-${option}`}
                          name="location"
                          type="checkbox"
                          className="h-4 w-4 text-black focus:ring-gray-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`location-${option}`} className="ml-2 text-sm text-gray-600">
                          {option}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Compensation</h3>
                  <div className="space-y-2">
                    {filters.compensation.map((option) => (
                      <div key={option} className="flex items-center">
                        <input
                          id={`compensation-${option}`}
                          name="compensation"
                          type="checkbox"
                          className="h-4 w-4 text-black focus:ring-gray-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`compensation-${option}`} className="ml-2 text-sm text-gray-600">
                          {option}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <button type="button" className="text-sm text-gray-600 hover:text-gray-900">
                  Clear All Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Jobs List */}
        <div className="mt-6 space-y-6">
          {mockJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md"
            >
              <div className="p-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <img
                      className="h-12 w-12 rounded-md"
                      src={job.logo}
                      alt={job.company}
                    />
                  </div>
                  <div className="ml-4 flex-1">
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
                      <div className="flex-shrink-0">
                        <span className="text-sm text-gray-500">
                          {job.postedDate}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="flex items-center space-x-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                          <ClockIcon className="h-3.5 w-3.5 mr-1" />
                          {job.hoursPerWeek}
                        </span>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">
                      {job.description}
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
                      <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                      >
                        Apply Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Post a Job Button */}
        <div className="fixed right-6 bottom-6">
          <button
            type="button"
            className="inline-flex items-center p-3 border border-transparent rounded-full shadow-lg text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            <PlusIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
} 