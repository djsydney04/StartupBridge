import React, { useState } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import JobForm, { JobFormData } from '@/components/JobForm';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

// This would come from your backend in a real app
const mockUserJobs: JobFormData[] = [
  {
    id: 1,
    title: 'Frontend Developer',
    company: 'TechStartup Inc.',
    location: 'Irvine, CA',
    hoursPerWeek: '40 hours/week',
    description: 'Looking for a passionate frontend developer to join our growing team. Experience with React and TypeScript required.',
    skills: ['React', 'TypeScript', 'Tailwind CSS'],
    applicationFormUrl: 'https://forms.example.com/apply',
    compensation: '$30-40/hour'
  },
  // Add more mock jobs as needed
];

function ManageJobs() {
  const [jobs, setJobs] = useState<JobFormData[]>(mockUserJobs);
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState<JobFormData | null>(null);

  const handleCreateJob = (jobData: JobFormData) => {
    // In a real app, you would make an API call here
    const newJob = {
      ...jobData,
      id: Math.max(0, ...jobs.map(j => j.id || 0)) + 1,
    };
    setJobs([newJob, ...jobs]);
    setShowForm(false);
  };

  const handleUpdateJob = (jobData: JobFormData) => {
    // In a real app, you would make an API call here
    setJobs(jobs.map(job => job.id === jobData.id ? jobData : job));
    setEditingJob(null);
  };

  const handleDeleteJob = (jobId: number) => {
    // In a real app, you would make an API call here
    if (confirm('Are you sure you want to delete this job posting?')) {
      setJobs(jobs.filter(job => job.id !== jobId));
    }
  };

  return (
    <DashboardLayout>
      <div className="content-header py-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <Link
              href="/jobs"
              className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Manage Jobs
              </h1>
              <p className="mt-2 text-lg text-gray-600">
                Create and manage your job postings
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-800"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Create Job
          </button>
        </div>
      </div>

      {/* Job Form Modal */}
      {(showForm || editingJob) && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => {
                setShowForm(false);
                setEditingJob(null);
              }}></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full sm:p-6">
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingJob ? 'Edit Job Posting' : 'Create New Job Posting'}
                </h2>
              </div>
              <JobForm
                initialData={editingJob || undefined}
                onSubmit={editingJob ? handleUpdateJob : handleCreateJob}
                onCancel={() => {
                  setShowForm(false);
                  setEditingJob(null);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Jobs List */}
      <div className="mt-8 space-y-6">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md"
          >
            <div className="p-8">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                  <p className="mt-1 text-sm text-gray-500">{job.company}</p>
                  <div className="mt-2 flex flex-wrap gap-4">
                    <span className="inline-flex items-center text-sm text-gray-500">
                      <svg className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {job.location}
                    </span>
                    <span className="inline-flex items-center text-sm text-gray-500">
                      <svg className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {job.hoursPerWeek}
                    </span>
                    <span className="inline-flex items-center text-sm text-gray-500">
                      <svg className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {job.compensation}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setEditingJob(job)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteJob(job.id!)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-sm text-gray-600">{job.description}</p>
              </div>

              <div className="mt-4">
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-sm text-gray-500">
                    Posted {new Date().toLocaleDateString()}
                  </span>
                </div>
                <a
                  href={job.applicationFormUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-gray-900 hover:text-gray-700"
                >
                  View Application Form →
                </a>
              </div>
            </div>
          </div>
        ))}

        {jobs.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No jobs posted</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new job posting.</p>
            <div className="mt-6">
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Post New Job
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default function ManageJobsPage() {
  return (
    <ProtectedRoute>
      <ManageJobs />
    </ProtectedRoute>
  );
} 