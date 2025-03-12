import React, { useState } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { 
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  PlusIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

// Mock job data (replace with real data later)
const mockJobs = [
  {
    id: 1,
    title: 'Frontend Developer',
    company: 'TechStartup',
    location: 'Remote',
    type: 'Part-time',
    compensation: 'Paid',
    description: 'Looking for a frontend developer to help build our MVP. Experience with React and TypeScript required.',
    skills: ['React', 'TypeScript', 'Tailwind CSS'],
    postedAt: '2 days ago',
    applicants: 5
  },
  {
    id: 2,
    title: 'Marketing Lead',
    company: 'EduTech Innovators',
    location: 'Hybrid',
    type: 'Full-time',
    compensation: 'Equity + Stipend',
    description: 'Join our early-stage startup as a marketing lead. Help us grow our educational platform.',
    skills: ['Digital Marketing', 'Social Media', 'Content Strategy'],
    postedAt: '1 week ago',
    applicants: 12
  },
  // Add more mock jobs...
];

const filters = {
  type: ['Full-time', 'Part-time', 'Internship'],
  location: ['Remote', 'On-site', 'Hybrid'],
  compensation: ['Paid', 'Equity', 'Unpaid'],
};

export default function Jobs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    type: [],
    location: [],
    compensation: [],
  });

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Startup Jobs</h1>
            <p className="mt-1 text-sm text-gray-500">
              Find startup opportunities or post positions for your venture
            </p>
          </div>
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Post a Job
          </button>
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
                  placeholder="Search jobs by title, company, or skills..."
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

        {/* Jobs List */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {mockJobs.map((job) => (
              <li key={job.id}>
                <div className="px-4 py-4 sm:px-6 hover:bg-gray-50 transition-colors duration-150">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-lg font-medium text-purple-600 truncate">
                          {job.title}
                        </p>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {job.type}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm font-medium text-gray-600">
                          {job.company}
                        </p>
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                          <MapPinIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                          <span>{job.location}</span>
                          <CurrencyDollarIcon className="flex-shrink-0 mx-1.5 h-5 w-5 text-gray-400" />
                          <span>{job.compensation}</span>
                          <ClockIcon className="flex-shrink-0 mx-1.5 h-5 w-5 text-gray-400" />
                          <span>{job.postedAt}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {job.description}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {job.skills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <p className="text-sm text-gray-500">
                      {job.applicants} applicants
                    </p>
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-purple-600 rounded-md shadow-sm text-sm font-medium text-purple-600 bg-white hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
} 