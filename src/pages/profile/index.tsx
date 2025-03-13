import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { useAuth } from '@/utils/AuthContext';
import {
  UserCircleIcon,
  PencilIcon,
  LinkIcon,
  ChevronRightIcon,
  XMarkIcon,
  PlusIcon
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

// Role options
const roleOptions = [
  { id: 'cofounder', label: 'I\'m a Founder Looking for a Co-Founder' },
  { id: 'talent', label: 'I\'m a Founder Looking for Talent (but not a Co-Founder)' },
  { id: 'job', label: 'I\'m Looking for a Startup Job/Internship' },
  { id: 'resources', label: 'I\'m Looking for Startup Resources & Networking' }
];

// Startup stage options
const startupStageOptions = [
  { id: 'idea', label: 'Idea' },
  { id: 'mvp', label: 'MVP' },
  { id: 'launched', label: 'Launched' },
  { id: 'scaling', label: 'Scaling' }
];

// Job role options
const jobRoleOptions = [
  'Software Engineer',
  'Frontend Developer',
  'Backend Developer',
  'Full-Stack Developer',
  'Mobile App Developer',
  'Data Scientist',
  'AI/ML Engineer',
  'Blockchain Developer',
  'Cybersecurity Specialist',
  'UI/UX Designer',
  'Graphic Designer',
  'Product Manager',
  'Marketing Specialist',
  'Growth Hacker',
  'Social Media Manager',
  'Content Creator/Copywriter',
  'Sales & Business Development',
  'Finance & Accounting',
  'Operations Manager',
  'Legal & Compliance',
  'Customer Success Manager',
  'Community Manager',
  'HR & Talent Acquisition',
  'Event Coordinator',
  'Research & Strategy Analyst',
  'Other'
];

// Year options
const yearOptions = [
  'Freshman',
  'Sophomore',
  'Junior',
  'Senior',
  'Graduate Student',
  'Alumni'
];

export default function Profile() {
  const { user, profile, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('Profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    major: '',
    year: '',
    interests: [] as string[],
    skills: [] as string[],
    linkedin_url: '',
    twitter_url: '',
    bio: '',
    
    // Role selection
    roles: {
      cofounder: false,
      talent: false,
      job: false,
      resources: false
    },
    
    // Founder section
    founder_looking_for: '',
    startup_name: '',
    startup_idea: '',
    roles_looking_for: '',
    skills_bringing: '',
    startup_stage: '',
    
    // Job seeker section
    interested_roles: [] as string[],
    experience: '',
    
    // Additional matching
    industries_interest: '',
    commitment_type: ''
  });
  
  // New interest/skill input state
  const [newInterest, setNewInterest] = useState('');
  const [newSkill, setNewSkill] = useState('');
  
  // Initialize form data from profile
  useEffect(() => {
    if (profile) {
      setFormData(prevData => ({
        ...prevData,
        full_name: profile.full_name || '',
        email: user?.email || '',
        major: profile.major || '',
        year: profile.year || '',
        interests: profile.interests || [],
        skills: profile.skills || [],
        linkedin_url: profile.linkedin_url || '',
        twitter_url: profile.twitter_url || '',
        bio: profile.bio || '',
        // Initialize new fields
        roles: profile.roles || {
          cofounder: false,
          talent: false,
          job: false,
          resources: false
        },
        founder_looking_for: profile.founder_looking_for || '',
        startup_name: profile.startup_name || '',
        startup_idea: profile.startup_idea || '',
        roles_looking_for: profile.roles_looking_for || '',
        skills_bringing: profile.skills_bringing || '',
        startup_stage: profile.startup_stage || '',
        interested_roles: profile.interested_roles || [],
        experience: profile.experience || '',
        industries_interest: profile.industries_interest || '',
        commitment_type: profile.commitment_type || ''
      }));
    }
  }, [profile, user]);

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
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  // Handle checkbox changes
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    
    if (name.startsWith('roles.')) {
      const role = name.split('.')[1];
      setFormData(prevData => ({
        ...prevData,
        roles: {
          ...prevData.roles,
          [role]: checked
        }
      }));
    } else {
      setFormData(prevData => ({
        ...prevData,
        [name]: checked
      }));
    }
  };
  
  // Handle multi-select changes
  const handleMultiSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name } = e.target;
    const options = Array.from(e.target.selectedOptions).map(option => option.value);
    
    setFormData(prevData => ({
      ...prevData,
      [name]: options
    }));
  };
  
  // Add new interest
  const handleAddInterest = () => {
    if (newInterest.trim() && !formData.interests.includes(newInterest.trim())) {
      setFormData(prevData => ({
        ...prevData,
        interests: [...prevData.interests, newInterest.trim()]
      }));
      setNewInterest('');
    }
  };
  
  // Remove interest
  const handleRemoveInterest = (interest: string) => {
    setFormData(prevData => ({
      ...prevData,
      interests: prevData.interests.filter(i => i !== interest)
    }));
  };
  
  // Add new skill
  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prevData => ({
        ...prevData,
        skills: [...prevData.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };
  
  // Remove skill
  const handleRemoveSkill = (skill: string) => {
    setFormData(prevData => ({
      ...prevData,
      skills: prevData.skills.filter(s => s !== skill)
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    setSuccess('');
    
    try {
      // Prepare profile data for update
      const profileData = {
        full_name: formData.full_name,
        major: formData.major,
        year: formData.year,
        interests: formData.interests,
        skills: formData.skills,
        linkedin_url: formData.linkedin_url,
        twitter_url: formData.twitter_url,
        bio: formData.bio,
        // Add additional fields to the profile update
        roles: formData.roles,
        founder_looking_for: formData.founder_looking_for,
        startup_name: formData.startup_name,
        startup_idea: formData.startup_idea,
        roles_looking_for: formData.roles_looking_for,
        skills_bringing: formData.skills_bringing,
        startup_stage: formData.startup_stage,
        interested_roles: formData.interested_roles,
        experience: formData.experience,
        industries_interest: formData.industries_interest,
        commitment_type: formData.commitment_type
      };
      
      const result = await updateProfile(profileData);
      
      if (result.success) {
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
      } else {
        setError(result.error || 'Failed to update profile');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-full mx-auto px-2 sm:px-3 lg:px-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Profile & Settings</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your profile, preferences, and saved content
          </p>
        </div>

        {/* Profile Completion */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between mb-2">
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
        <div className="py-6">
          {activeTab === 'Profile' && (
            <div className="bg-white shadow rounded-lg">
              {!isEditing && (
                <div className="relative h-48 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-t-lg">
                  <div className="absolute -bottom-16 left-8">
                    <div className="h-32 w-32 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center overflow-hidden">
                      <UserCircleIcon className="h-28 w-28 text-gray-400" />
                    </div>
                  </div>
                  <div className="absolute top-4 right-4">
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                      <PencilIcon className="h-4 w-4 mr-2" />
                      Edit Profile
                    </button>
                  </div>
                </div>
              )}
              <div className={`px-4 py-5 sm:p-6 ${!isEditing ? 'pt-20' : ''}`}>
                {/* Success/Error Messages */}
                {success && (
                  <div className="mb-4 p-4 bg-green-50 rounded-md border border-green-200">
                    <p className="text-green-700">{success}</p>
                  </div>
                )}
                {error && (
                  <div className="mb-4 p-4 bg-red-50 rounded-md border border-red-200">
                    <p className="text-red-700">{error}</p>
                  </div>
                )}
                
                {/* Profile Header */}
                {isEditing ? (
                  <div className="flex justify-between items-start mb-6">
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
                      {isEditing ? 'Cancel Editing' : 'Edit Profile'}
                  </button>
                </div>
                ) : (
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {profile?.full_name || 'Your Name'}
                    </h2>
                    <p className="text-lg text-gray-600">
                      {profile?.major || 'Your Major'} • {profile?.year || 'Year'} • Chapman University
                    </p>
                    
                    {profile?.linkedin_url && (
                      <a
                        href={profile.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center mt-2 text-sm text-purple-600 hover:text-purple-800"
                      >
                        <LinkIcon className="h-4 w-4 mr-1" />
                        LinkedIn
                      </a>
                    )}
                  </div>
                )}

                {isEditing ? (
                  /* Edit Profile Form */
                  <form onSubmit={handleSubmit} className="mt-6">
                    <div className="space-y-8">
                      {/* Basic Information Section */}
                  <div>
                        <h3 className="text-xl font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">Basic Information</h3>
                        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                          <div className="sm:col-span-3">
                            <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
                              Full Name
                            </label>
                            <div className="mt-1">
                              <input
                                type="text"
                                name="full_name"
                                id="full_name"
                                value={formData.full_name}
                                onChange={handleInputChange}
                                className="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
                              />
                            </div>
                          </div>

                          <div className="sm:col-span-3">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                              Chapman University Email
                            </label>
                            <div className="mt-1">
                              <input
                                type="email"
                                name="email"
                                id="email"
                                value={formData.email}
                                disabled
                                className="shadow-sm bg-gray-50 block w-full sm:text-sm border-gray-300 rounded-md"
                              />
                            </div>
                          </div>

                          <div className="sm:col-span-3">
                            <label htmlFor="major" className="block text-sm font-medium text-gray-700">
                              Major
                            </label>
                            <div className="mt-1">
                              <input
                                type="text"
                                name="major"
                                id="major"
                                value={formData.major}
                                onChange={handleInputChange}
                                className="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
                              />
                            </div>
                          </div>

                          <div className="sm:col-span-3">
                            <label htmlFor="year" className="block text-sm font-medium text-gray-700">
                              Year
                            </label>
                            <div className="mt-1">
                              <select
                                id="year"
                                name="year"
                                value={formData.year}
                                onChange={handleInputChange}
                                className="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
                              >
                                <option value="">Select Year</option>
                                {yearOptions.map(year => (
                                  <option key={year} value={year}>{year}</option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div className="sm:col-span-6">
                            <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                              Bio
                            </label>
                            <div className="mt-1">
                              <textarea
                                id="bio"
                                name="bio"
                                rows={3}
                                value={formData.bio || ''}
                                onChange={handleInputChange}
                                className="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
                              />
                            </div>
                          </div>

                          <div className="sm:col-span-6">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Interests
                            </label>
                            <div className="flex flex-wrap gap-2 mb-2">
                              {formData.interests.map((interest) => (
                                <span
                                  key={interest}
                                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                >
                                  {interest}
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveInterest(interest)}
                                    className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none"
                                  >
                                    <XMarkIcon className="h-3 w-3" />
                                  </button>
                                </span>
                              ))}
                            </div>
                            <div className="flex">
                              <input
                                type="text"
                                value={newInterest}
                                onChange={(e) => setNewInterest(e.target.value)}
                                placeholder="Add an interest"
                                className="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-l-md"
                              />
                              <button
                                type="button"
                                onClick={handleAddInterest}
                                className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 shadow-sm text-sm font-medium rounded-r-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                              >
                                <PlusIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </div>

                          <div className="sm:col-span-6">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                      Skills
                            </label>
                            <div className="flex flex-wrap gap-2 mb-2">
                              {formData.skills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                        >
                          {skill}
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveSkill(skill)}
                                    className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-purple-400 hover:bg-purple-200 hover:text-purple-500 focus:outline-none"
                                  >
                                    <XMarkIcon className="h-3 w-3" />
                                  </button>
                        </span>
                      ))}
                            </div>
                            <div className="flex">
                              <input
                                type="text"
                                value={newSkill}
                                onChange={(e) => setNewSkill(e.target.value)}
                                placeholder="Add a skill"
                                className="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-l-md"
                              />
                              <button
                                type="button"
                                onClick={handleAddSkill}
                                className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 shadow-sm text-sm font-medium rounded-r-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                              >
                                <PlusIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </div>

                          <div className="sm:col-span-3">
                            <label htmlFor="linkedin_url" className="block text-sm font-medium text-gray-700">
                              LinkedIn URL
                            </label>
                            <div className="mt-1">
                              <input
                                type="url"
                                name="linkedin_url"
                                id="linkedin_url"
                                value={formData.linkedin_url}
                                onChange={handleInputChange}
                                className="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
                              />
                            </div>
                          </div>

                          <div className="sm:col-span-3">
                            <label htmlFor="twitter_url" className="block text-sm font-medium text-gray-700">
                              X (Twitter) URL
                            </label>
                            <div className="mt-1">
                              <input
                                type="url"
                                name="twitter_url"
                                id="twitter_url"
                                value={formData.twitter_url || ''}
                                onChange={handleInputChange}
                                className="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Role Selection Section */}
                      <div>
                        <h3 className="text-xl font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">What Are You Looking For?</h3>
                        <p className="text-sm text-gray-500 mb-4">Select one or multiple options that best describe your goals.</p>
                        
                        <div className="space-y-4">
                          {roleOptions.map((role) => (
                            <div key={role.id} className="flex items-start">
                              <div className="flex items-center h-5">
                                <input
                                  id={`roles.${role.id}`}
                                  name={`roles.${role.id}`}
                                  type="checkbox"
                                  checked={formData.roles[role.id as keyof typeof formData.roles]}
                                  onChange={handleCheckboxChange}
                                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                                />
                              </div>
                              <div className="ml-3 text-sm">
                                <label htmlFor={`roles.${role.id}`} className="font-medium text-gray-700">
                                  {role.label}
                                </label>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Founder Section - Show if founder role is selected */}
                      {(formData.roles.cofounder || formData.roles.talent) && (
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 mb-4">Founder Information</h3>
                          
                          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                            <div className="sm:col-span-6">
                              <label htmlFor="founder_looking_for" className="block text-sm font-medium text-gray-700">
                                Are you looking for a co-founder or just hiring talent?
                              </label>
                              <div className="mt-1">
                                <select
                                  id="founder_looking_for"
                                  name="founder_looking_for"
                                  value={formData.founder_looking_for}
                                  onChange={handleInputChange}
                                  className="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                >
                                  <option value="">Select an option</option>
                                  <option value="Co-Founder">Co-Founder</option>
                                  <option value="Hiring for Specific Roles">Hiring for Specific Roles</option>
                                  <option value="Both">Both</option>
                                </select>
                              </div>
                            </div>

                            <div className="sm:col-span-6">
                              <label htmlFor="startup_name" className="block text-sm font-medium text-gray-700">
                                Startup Name (if applicable)
                              </label>
                              <div className="mt-1">
                                <input
                                  type="text"
                                  name="startup_name"
                                  id="startup_name"
                                  value={formData.startup_name}
                                  onChange={handleInputChange}
                                  className="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                />
                              </div>
                            </div>

                            <div className="sm:col-span-6">
                              <label htmlFor="startup_idea" className="block text-sm font-medium text-gray-700">
                                Briefly describe your startup idea
                              </label>
                              <div className="mt-1">
                                <textarea
                                  id="startup_idea"
                                  name="startup_idea"
                                  rows={3}
                                  value={formData.startup_idea}
                                  onChange={handleInputChange}
                                  placeholder="100 words max"
                                  className="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                />
                              </div>
                            </div>

                            <div className="sm:col-span-6">
                              <label htmlFor="roles_looking_for" className="block text-sm font-medium text-gray-700">
                                What roles are you looking for?
                              </label>
                              <div className="mt-1">
                                <textarea
                                  id="roles_looking_for"
                                  name="roles_looking_for"
                                  rows={3}
                                  value={formData.roles_looking_for}
                                  onChange={handleInputChange}
                                  placeholder="100 words max"
                                  className="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                />
                              </div>
                            </div>

                            <div className="sm:col-span-6">
                              <label htmlFor="skills_bringing" className="block text-sm font-medium text-gray-700">
                                What skills do you bring?
                              </label>
                              <div className="mt-1">
                                <textarea
                                  id="skills_bringing"
                                  name="skills_bringing"
                                  rows={3}
                                  value={formData.skills_bringing}
                                  onChange={handleInputChange}
                                  placeholder="100 words max"
                                  className="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                />
                              </div>
                            </div>

                            <div className="sm:col-span-6">
                              <label htmlFor="startup_stage" className="block text-sm font-medium text-gray-700">
                                Startup Stage
                              </label>
                              <div className="mt-1">
                                <select
                                  id="startup_stage"
                                  name="startup_stage"
                                  value={formData.startup_stage}
                                  onChange={handleInputChange}
                                  className="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                >
                                  <option value="">Select a stage</option>
                                  {startupStageOptions.map(option => (
                                    <option key={option.id} value={option.id}>{option.label}</option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Job Seeker Section - Show if job role is selected */}
                      {formData.roles.job && (
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 mb-4">Job Seeker Information</h3>
                          
                          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                            <div className="sm:col-span-6">
                              <label htmlFor="interested_roles" className="block text-sm font-medium text-gray-700">
                                What roles are you interested in?
                              </label>
                              <div className="mt-1">
                                <select
                                  id="interested_roles"
                                  name="interested_roles"
                                  multiple
                                  value={formData.interested_roles}
                                  onChange={handleMultiSelectChange}
                                  className="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                  size={5}
                                >
                                  {jobRoleOptions.map(role => (
                                    <option key={role} value={role}>{role}</option>
                                  ))}
                                </select>
                                <p className="mt-1 text-xs text-gray-500">Hold Ctrl (or Cmd) to select multiple options</p>
                              </div>
                            </div>

                            <div className="sm:col-span-6">
                              <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
                                Experience
                              </label>
                              <div className="mt-1">
                                <textarea
                                  id="experience"
                                  name="experience"
                                  rows={3}
                                  value={formData.experience}
                                  onChange={handleInputChange}
                                  placeholder="100 words max"
                                  className="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Additional Matching Questions - Show for all users */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Matching Questions</h3>
                        <p className="text-sm text-gray-500 mb-4">Optional but recommended for better matches</p>
                        
                        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                          <div className="sm:col-span-6">
                            <label htmlFor="industries_interest" className="block text-sm font-medium text-gray-700">
                              What industries interest you?
                            </label>
                            <div className="mt-1">
                              <textarea
                                id="industries_interest"
                                name="industries_interest"
                                rows={3}
                                value={formData.industries_interest}
                                onChange={handleInputChange}
                                placeholder="100 words max"
                                className="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
                              />
                            </div>
                          </div>

                          <div className="sm:col-span-6">
                            <label htmlFor="commitment_type" className="block text-sm font-medium text-gray-700">
                              Are you looking for short-term projects or long-term commitments?
                            </label>
                            <div className="mt-1">
                              <select
                                id="commitment_type"
                                name="commitment_type"
                                value={formData.commitment_type}
                                onChange={handleInputChange}
                                className="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
                              >
                                <option value="">Select an option</option>
                                <option value="Short-term">Short-term projects</option>
                                <option value="Long-term">Long-term commitments</option>
                                <option value="Both">Both</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Save Button */}
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="mr-3 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isSaving}
                          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
                        >
                          {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                      </div>
                    </div>
                  </form>
                ) : (
                  /* Profile View - LinkedIn Style */
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left Column - About */}
                    <div className="md:col-span-2 space-y-6">
                      {/* About Section */}
                      <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">About</h3>
                        {profile?.bio ? (
                          <p className="text-gray-600">
                            {profile.bio}
                          </p>
                        ) : (
                          <p className="text-gray-400 italic">Add a bio to tell people more about yourself</p>
                        )}
                  </div>

                      {/* Founder Information */}
                      {(profile?.roles?.cofounder || profile?.roles?.talent) && (
                        <div className="bg-white p-6 rounded-lg shadow">
                          <h3 className="text-lg font-medium text-gray-900 mb-4">Startup Information</h3>
                          
                          {profile?.startup_name && (
                            <div className="mb-4">
                              <h4 className="text-sm font-medium text-gray-700">Startup</h4>
                              <p className="text-gray-600">{profile.startup_name}</p>
                            </div>
                          )}
                          
                          {profile?.startup_idea && (
                            <div className="mb-4">
                              <h4 className="text-sm font-medium text-gray-700">Startup Idea</h4>
                              <p className="text-gray-600">{profile.startup_idea}</p>
                            </div>
                          )}
                          
                          {profile?.startup_stage && (
                            <div className="mb-4">
                              <h4 className="text-sm font-medium text-gray-700">Stage</h4>
                              <p className="text-gray-600">
                                {startupStageOptions.find(s => s.id === profile.startup_stage)?.label || profile.startup_stage}
                              </p>
                            </div>
                          )}
                          
                          {profile?.roles_looking_for && (
                            <div className="mb-4">
                              <h4 className="text-sm font-medium text-gray-700">Roles Looking For</h4>
                              <p className="text-gray-600">{profile.roles_looking_for}</p>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Job Seeker Information */}
                      {profile?.roles?.job && profile?.interested_roles && profile.interested_roles.length > 0 && (
                        <div className="bg-white p-6 rounded-lg shadow">
                          <h3 className="text-lg font-medium text-gray-900 mb-4">Job Interests</h3>
                          
                          <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-700">Interested Roles</h4>
                    <div className="mt-2 flex flex-wrap gap-2">
                              {profile.interested_roles.map((role: string) => (
                                <span
                                  key={role}
                                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                                >
                                  {role}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          {profile?.experience && (
                            <div className="mb-4">
                              <h4 className="text-sm font-medium text-gray-700">Experience</h4>
                              <p className="text-gray-600">{profile.experience}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* Right Column - Skills, Interests, etc. */}
                    <div className="space-y-6">
                      {/* Looking For Section */}
                      <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Looking For</h3>
                        <div className="space-y-2">
                          {profile?.roles && Object.entries(profile.roles).map(([key, value]) => (
                            value && (
                              <div key={key} className="flex items-center">
                                <div className="h-2 w-2 rounded-full bg-purple-600 mr-2"></div>
                                <p className="text-gray-600">
                                  {roleOptions.find(r => r.id === key)?.label}
                                </p>
                              </div>
                            )
                          ))}
                        </div>
                      </div>
                      
                      {/* Skills Section */}
                      <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Skills</h3>
                        <div className="flex flex-wrap gap-2">
                          {profile?.skills?.map((skill: string) => (
                            <span
                              key={skill}
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      {/* Interests Section */}
                      <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Interests</h3>
                        <div className="flex flex-wrap gap-2">
                      {profile?.interests?.map((interest: string) => (
                        <span
                          key={interest}
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>

                      {/* Additional Information */}
                      {(profile?.industries_interest || profile?.commitment_type) && (
                        <div className="bg-white p-6 rounded-lg shadow">
                          <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Information</h3>
                          
                          {profile?.industries_interest && (
                            <div className="mb-4">
                              <h4 className="text-sm font-medium text-gray-700">Industries of Interest</h4>
                              <p className="text-gray-600">{profile.industries_interest}</p>
                            </div>
                          )}
                          
                          {profile?.commitment_type && (
                  <div>
                              <h4 className="text-sm font-medium text-gray-700">Commitment Preference</h4>
                              <p className="text-gray-600">{profile.commitment_type}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
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