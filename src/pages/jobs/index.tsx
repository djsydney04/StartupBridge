import React, { useState } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
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
    company: 'TechStartup Inc.',
    location: 'Irvine, CA',
    type: 'Full-time',
    salary: '$80,000 - $120,000',
    description: 'Looking for a passionate frontend developer to join our growing team. Experience with React and TypeScript required.',
    skills: ['React', 'TypeScript', 'Tailwind CSS'],
    postedDate: '2 days ago',
    logo: 'https://tailwindui.com/img/logos/mark.svg?color=purple&shade=600',
  },
  {
    id: 2,
    title: 'Product Manager',
    company: 'InnovateCo',
    location: 'Newport Beach, CA',
    type: 'Full-time',
    salary: '$100,000 - $150,000',
    description: 'Seeking an experienced product manager to lead our product development initiatives and drive growth.',
    skills: ['Product Strategy', 'Agile', 'Data Analytics'],
    postedDate: '3 days ago',
    logo: 'https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600',
  },
  {
    id: 3,
    title: 'Marketing Specialist',
    company: 'GrowthLabs',
    location: 'Costa Mesa, CA',
    type: 'Part-time',
    salary: '$30-40/hour',
    description: 'Join our marketing team to help drive customer acquisition and brand awareness for early-stage startups.',
    skills: ['Digital Marketing', 'Social Media', 'Content Creation'],
    postedDate: '1 week ago',
    logo: 'https://tailwindui.com/img/logos/mark.svg?color=blue&shade=600',
  },
];

const filters = {
  type: ['Full-time', 'Part-time', 'Internship'],
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
  const [selectedFilters, setSelectedFilters] = useState({
    type: [],
    location: [],
    compensation: [],
  });

  return (
    <DashboardLayout>
      <div className="content-container">
        <div className="content-header">
          <h1 className="text-3xl font-bold text-gray-900">
            Startup Jobs
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Find exciting opportunities at innovative startups
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
                  placeholder="Search jobs by title, company, or skills"
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

        {/* Jobs List */}
        <div className="content-section">
          <div className="space-y-4">
            {mockJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <img
                        className="h-12 w-12"
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
                            <span className="text-sm text-gray-500">
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
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {job.type}
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {job.salary}
                          </span>
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        {job.description}
                      </p>
                      <div className="mt-4">
                        <div className="flex flex-wrap gap-2">
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
                      <div className="mt-4">
                        <button
                          type="button"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
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
        </div>
      </div>
    </DashboardLayout>
  );
} 