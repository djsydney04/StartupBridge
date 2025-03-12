import React, { useState } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { useAuth } from '@/utils/AuthContext';
import {
  UserCircleIcon,
  PencilIcon,
  LinkIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

const tabs = [
  { name: 'Profile', href: '#profile' },
  { name: 'Saved Items', href: '#saved' },
  { name: 'Settings', href: '#settings' }
];

// Mock saved items (replace with real data later)
const mockSavedItems = {
  jobs: [
    { id: 1, title: 'Frontend Developer', company: 'TechStartup' },
    { id: 2, title: 'Marketing Lead', company: 'EduTech Innovators' }
  ],
  events: [
    { id: 1, title: 'Startup Pitch Competition', date: '2024-03-15' },
    { id: 2, title: 'Networking Mixer: Tech Founders', date: '2024-03-20' }
  ],
  resources: [
    { id: 1, title: 'Startup Pitch Deck Template', type: 'Template' },
    { id: 2, title: 'How to Raise Seed Funding', type: 'Guide' }
  ]
};

export default function Profile() {
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState('Profile');
  const [isEditing, setIsEditing] = useState(false);

  // Calculate profile completion percentage
  const calculateProfileCompletion = () => {
    const fields = [
      profile?.full_name,
      profile?.major,
      profile?.year,
      profile?.interests,
      profile?.skills,
      profile?.linkedin_url
    ];
    const filledFields = fields.filter(field => field).length;
    return Math.round((filledFields / fields.length) * 100);
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Profile & Settings</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your profile, preferences, and saved content
          </p>
        </div>

        {/* Profile Completion */}
        <div className="mb-8 bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Profile Completion</h2>
            <span className="text-sm font-medium text-purple-600">
              {calculateProfileCompletion()}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-purple-600 h-2.5 rounded-full"
              style={{ width: `${calculateProfileCompletion()}%` }}
            ></div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === tab.name
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="py-8">
          {activeTab === 'Profile' && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <UserCircleIcon className="h-16 w-16 text-gray-400" />
                    <div className="ml-4">
                      <h2 className="text-xl font-medium text-gray-900">
                        {profile?.full_name || 'Your Name'}
                      </h2>
                      <p className="text-sm text-gray-500">
                        {profile?.major || 'Your Major'} • {profile?.year || 'Year'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    <PencilIcon className="h-4 w-4 mr-2" />
                    Edit Profile
                  </button>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Skills
                    </h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {profile?.skills?.map((skill: string) => (
                        <span
                          key={skill}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Interests
                    </h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {profile?.interests?.map((interest: string) => (
                        <span
                          key={interest}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Links
                    </h3>
                    <div className="mt-2">
                      {profile?.linkedin_url && (
                        <a
                          href={profile.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-sm text-gray-600 hover:text-purple-600"
                        >
                          <LinkIcon className="h-4 w-4 mr-2" />
                          LinkedIn
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Settings' && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Account Settings</h3>
                
                <div className="space-y-6">
                  {/* Email Preferences */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
                    <div className="mt-4 space-y-4">
                      <div className="flex items-center">
                        <input
                          id="new-matches"
                          type="checkbox"
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                        <label htmlFor="new-matches" className="ml-3 text-sm text-gray-600">
                          New co-founder matches
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="job-updates"
                          type="checkbox"
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                        <label htmlFor="job-updates" className="ml-3 text-sm text-gray-600">
                          Job application updates
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Privacy Settings */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Privacy</h4>
                    <div className="mt-4 space-y-4">
                      <div className="flex items-center">
                        <input
                          id="profile-visibility"
                          type="checkbox"
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                        <label htmlFor="profile-visibility" className="ml-3 text-sm text-gray-600">
                          Make profile visible to other users
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="mt-6">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
} 