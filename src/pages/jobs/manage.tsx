import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { 
  ArrowLeftIcon, 
  PlusIcon, 
  EyeIcon, 
  PencilSquareIcon, 
  TrashIcon,
  CheckCircleIcon, 
  ClockIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  status: 'active' | 'expired' | 'draft';
  applications: number;
  postedDate: string;
  skills: string[];
}

const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Frontend Developer',
    company: 'TechStartup',
    location: 'Remote',
    type: 'Full-time',
    status: 'active',
    applications: 12,
    postedDate: 'March 14, 2024',
    skills: ['React', 'TypeScript', 'Tailwind CSS']
  },
  {
    id: '2',
    title: 'Product Manager',
    company: 'InnovateCo',
    location: 'San Francisco, CA',
    type: 'Full-time',
    status: 'active',
    applications: 8,
    postedDate: 'March 13, 2024',
    skills: ['Product Strategy', 'User Research', 'Agile']
  },
  {
    id: '3',
    title: 'Growth Marketing Manager',
    company: 'FinTech Solutions',
    location: 'New York, NY',
    type: 'Full-time',
    status: 'active',
    applications: 5,
    postedDate: 'March 12, 2024',
    skills: ['SEO', 'Content Marketing', 'Analytics']
  },
  {
    id: '4',
    title: 'Full Stack Developer',
    company: 'HealthTech',
    location: 'Remote',
    type: 'Full-time',
    status: 'active',
    applications: 15,
    postedDate: 'March 11, 2024',
    skills: ['React', 'Node.js', 'MongoDB']
  },
  {
    id: '5',
    title: 'UI/UX Designer',
    company: 'EdTech Innovators',
    location: 'Boston, MA',
    type: 'Full-time',
    status: 'active',
    applications: 7,
    postedDate: 'March 10, 2024',
    skills: ['Figma', 'User Research', 'Prototyping']
  },
];

export default function ManageJobs() {
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const filteredJobs = statusFilter === 'all' 
    ? jobs 
    : jobs.filter(job => job.status === statusFilter);

  const handleDeleteJob = (jobId: string) => {
    if (confirmDelete === jobId) {
      setJobs(jobs.filter(job => job.id !== jobId));
      setConfirmDelete(null);
    } else {
      setConfirmDelete(jobId);
    }
  };

  const cancelDelete = () => {
    setConfirmDelete(null);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'expired':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case 'draft':
        return <ClockIcon className="h-5 w-5 text-amber-500" />;
      default:
        return null;
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <Head>
          <title>Manage Jobs | Founder Connect</title>
        </Head>
        <div className="pb-16">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <div className="mb-1">
                <Link 
                  href="/jobs" 
                  className="inline-flex items-center text-gray-500 hover:text-gray-700 text-sm font-medium"
                >
                  <ArrowLeftIcon className="h-4 w-4 mr-1" />
                  Back to jobs
                </Link>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Manage Jobs</h1>
              <p className="mt-2 text-gray-600">
                View and manage your job postings
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link
                href="/jobs/create"
                className="inline-flex items-center px-5 py-2.5 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors shadow-sm"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Create Job
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-5 border-b border-gray-200 bg-gray-50 flex justify-between items-center flex-wrap gap-4">
              <div className="flex space-x-2">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    statusFilter === 'all'
                      ? 'bg-gray-900 text-white'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  All Jobs
                </button>
                <button
                  onClick={() => setStatusFilter('active')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    statusFilter === 'active'
                      ? 'bg-gray-900 text-white'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  Active
                </button>
                <button
                  onClick={() => setStatusFilter('draft')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    statusFilter === 'draft'
                      ? 'bg-gray-900 text-white'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  Drafts
                </button>
                <button
                  onClick={() => setStatusFilter('expired')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    statusFilter === 'expired'
                      ? 'bg-gray-900 text-white'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  Expired
                </button>
              </div>
              <div className="text-sm text-gray-500">
                Showing {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Job Details
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Posted Date
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applications
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredJobs.map((job) => (
                    <tr 
                      key={job.id} 
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-lg font-semibold text-gray-900">{job.title}</span>
                          <span className="text-sm text-gray-600">{job.company} • {job.location}</span>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {job.skills.map((skill, index) => (
                              <span 
                                key={index} 
                                className="inline-flex px-2 py-1 bg-gray-100 text-gray-800 rounded-md text-xs font-medium"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {getStatusIcon(job.status)}
                          <span className="ml-2 capitalize text-sm font-medium">
                            {job.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {job.postedDate}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium">
                          {job.applications}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Link 
                            href={`/jobs/${job.id}`}
                            className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            title="View Job"
                          >
                            <EyeIcon className="w-5 h-5" />
                          </Link>
                          <Link 
                            href={`/jobs/edit/${job.id}`}
                            className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Edit Job"
                          >
                            <PencilSquareIcon className="w-5 h-5" />
                          </Link>
                          {confirmDelete === job.id ? (
                            <div className="flex items-center space-x-2 bg-red-50 rounded-lg px-2 py-1">
                              <button
                                onClick={() => handleDeleteJob(job.id)} 
                                className="text-red-600 hover:text-red-700 text-sm font-medium"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={cancelDelete}
                                className="text-gray-600 hover:text-gray-700 text-sm"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button 
                              onClick={() => handleDeleteJob(job.id)}
                              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Delete Job"
                            >
                              <TrashIcon className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredJobs.length === 0 && (
                <div className="text-center py-16">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <ClockIcon className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">No jobs found</h3>
                  <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto">
                    {statusFilter === 'all' 
                      ? "You haven't created any job postings yet."
                      : `You don't have any ${statusFilter} jobs.`}
                  </p>
                  <div className="mt-6">
                    <Link
                      href="/jobs/create"
                      className="inline-flex items-center px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                    >
                      <PlusIcon className="h-5 w-5 mr-2" />
                      Create a New Job
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
} 