import { useEffect, useState } from 'react';
import { useAuth } from '@/utils/AuthContext';
import { Profile } from '@/utils/supabase';
import { PencilIcon, UserCircleIcon, Cog6ToothIcon, UserPlusIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

interface FormData extends Omit<Profile, 'skills'> {
  skills: string;
}

interface CoFounderRequest {
  id: string;
  sender: Profile;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
}

interface CoFounderConnection {
  id: string;
  user: Profile;
  connected_at: string;
}

export default function ProfilePage() {
  const { user, profile: initialProfile, updateProfile: updateAuthProfile } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [editSection, setEditSection] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    id: '',
    user_id: '',
    full_name: '',
    major: '',
    year: '',
    bio: '',
    skills: '',
    linkedin_url: '',
    twitter_url: '',
    role: '',
    industry: '',
    startup_stage: '',
    looking_for: '',
    startup_name: '',
    startup_idea: '',
    roles_looking_for: '',
    skills_bringing: '',
    interested_roles: [],
    experience: '',
    industries_interest: '',
    commitment_type: '',
    university: '',
    interests: [],
    created_at: ''
  });
  const [requests, setRequests] = useState<CoFounderRequest[]>([]);
  const [connections, setConnections] = useState<CoFounderConnection[]>([]);

  useEffect(() => {
    if (initialProfile) {
      setProfile(initialProfile);
      setFormData({
        ...initialProfile,
        skills: Array.isArray(initialProfile.skills) ? initialProfile.skills.join(', ') : initialProfile.skills || '',
      });
    }
  }, [initialProfile]);

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async (section: string) => {
    if (!user?.id) return;

    try {
      const updatedData = {
        ...formData,
        skills: formData.skills.split(',').map(skill => skill.trim()),
      };

      const { success } = await updateAuthProfile(updatedData);
      if (success) {
        setEditSection(null);
        setProfile(prev => ({ ...prev, ...updatedData }));
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (!user || !profile) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-chapman-red"></div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="px-6 py-6">
              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2 space-y-6">
                  <section className="bg-white shadow rounded-lg">
                    <div className="p-6">
                      <div className="flex items-center">
                        <div className="flex items-center space-x-5">
                          <div className="flex-shrink-0">
                            <div className="relative h-20 w-20 rounded-full overflow-hidden border-2 border-white shadow">
                              {profile.avatar_url ? (
                                <Image
                                  src={profile.avatar_url}
                                  alt={profile.full_name || ''}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <UserCircleIcon className="h-full w-full text-gray-300" />
                              )}
                            </div>
                          </div>
                          <div>
                            <h1 className="text-2xl font-bold text-gray-900">{profile.full_name}</h1>
                            <p className="text-sm text-gray-500">{profile.major} • Class of {profile.year}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className="bg-white shadow rounded-lg">
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-medium text-gray-900">About</h2>
                        <button
                          onClick={() => setEditSection('about')}
                          className="text-chapman-red hover:text-chapman-red/80 text-sm flex items-center"
                        >
                          <PencilIcon className="h-4 w-4 mr-1" />
                          Edit
                        </button>
                      </div>
                      {editSection === 'about' ? (
                        <div className="space-y-4">
                          <textarea
                            rows={4}
                            value={formData.bio}
                            onChange={(e) => handleInputChange('bio', e.target.value)}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-chapman-red focus:ring-chapman-red sm:text-sm"
                            placeholder="Tell us about yourself..."
                          />
                          <div className="flex justify-end space-x-3">
                            <button
                              onClick={() => setEditSection(null)}
                              className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleSave('about')}
                              className="px-3 py-2 bg-black text-white rounded-md text-sm hover:bg-black/90"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-900">{profile.bio || 'No bio added yet.'}</p>
                      )}
                    </div>
                  </section>

                  <section className="bg-white shadow rounded-lg">
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-medium text-gray-900">Details</h2>
                        <button
                          onClick={() => setEditSection('details')}
                          className="text-chapman-red hover:text-chapman-red/80 text-sm flex items-center"
                        >
                          <PencilIcon className="h-4 w-4 mr-1" />
                          Edit
                        </button>
                      </div>
                      {editSection === 'details' ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Role</label>
                              <select
                                value={formData.role}
                                onChange={(e) => handleInputChange('role', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-chapman-red focus:ring-chapman-red sm:text-sm"
                              >
                                <option value="">Select Role</option>
                                <option value="Founder">Founder</option>
                                <option value="Co-Founder">Co-Founder</option>
                                <option value="Job Seeker">Job Seeker</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Industry</label>
                              <input
                                type="text"
                                value={formData.industry}
                                onChange={(e) => handleInputChange('industry', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-chapman-red focus:ring-chapman-red sm:text-sm"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Skills</label>
                            <input
                              type="text"
                              value={formData.skills}
                              onChange={(e) => handleInputChange('skills', e.target.value)}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-chapman-red focus:ring-chapman-red sm:text-sm"
                              placeholder="e.g., Programming, Marketing, Design (comma-separated)"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Experience</label>
                            <textarea
                              rows={3}
                              value={formData.experience}
                              onChange={(e) => handleInputChange('experience', e.target.value)}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-chapman-red focus:ring-chapman-red sm:text-sm"
                            />
                          </div>
                          <div className="flex justify-end space-x-3">
                            <button
                              onClick={() => setEditSection(null)}
                              className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleSave('details')}
                              className="px-3 py-2 bg-black text-white rounded-md text-sm hover:bg-black/90"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <dl className="grid grid-cols-2 gap-x-4 gap-y-6">
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Role</dt>
                            <dd className="mt-1 text-sm text-gray-900">{profile.role || 'Not specified'}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Industry</dt>
                            <dd className="mt-1 text-sm text-gray-900">{profile.industry || 'Not specified'}</dd>
                          </div>
                          <div className="col-span-2">
                            <dt className="text-sm font-medium text-gray-500">Skills</dt>
                            <dd className="mt-1">
                              {Array.isArray(profile.skills) && profile.skills.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                  {profile.skills.map((skill, index) => (
                                    <span
                                      key={index}
                                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                                    >
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-sm text-gray-900">Not specified</span>
                              )}
                            </dd>
                          </div>
                          <div className="col-span-2">
                            <dt className="text-sm font-medium text-gray-500">Experience</dt>
                            <dd className="mt-1 text-sm text-gray-900">{profile.experience || 'Not specified'}</dd>
                          </div>
                        </dl>
                      )}
                    </div>
                  </section>

                  {profile.role === 'Founder' && (
                    <section className="bg-white shadow rounded-lg">
                      <div className="p-6">
                        <div className="flex justify-between items-center mb-4">
                          <h2 className="text-lg font-medium text-gray-900">Startup Information</h2>
                          <button
                            onClick={() => setEditSection('startup')}
                            className="text-chapman-red hover:text-chapman-red/80 text-sm flex items-center"
                          >
                            <PencilIcon className="h-4 w-4 mr-1" />
                            Edit
                          </button>
                        </div>
                        {editSection === 'startup' ? (
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Startup Name</label>
                              <input
                                type="text"
                                value={formData.startup_name}
                                onChange={(e) => handleInputChange('startup_name', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-chapman-red focus:ring-chapman-red sm:text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Startup Idea</label>
                              <textarea
                                rows={3}
                                value={formData.startup_idea}
                                onChange={(e) => handleInputChange('startup_idea', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-chapman-red focus:ring-chapman-red sm:text-sm"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700">Stage</label>
                                <select
                                  value={formData.startup_stage}
                                  onChange={(e) => handleInputChange('startup_stage', e.target.value)}
                                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-chapman-red focus:ring-chapman-red sm:text-sm"
                                >
                                  <option value="">Select Stage</option>
                                  <option value="Idea">Idea</option>
                                  <option value="Prototype">Prototype</option>
                                  <option value="MVP">MVP</option>
                                  <option value="Early Revenue">Early Revenue</option>
                                  <option value="Growth">Growth</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700">Looking For</label>
                                <input
                                  type="text"
                                  value={formData.looking_for}
                                  onChange={(e) => handleInputChange('looking_for', e.target.value)}
                                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-chapman-red focus:ring-chapman-red sm:text-sm"
                                />
                              </div>
                            </div>
                            <div className="flex justify-end space-x-3">
                              <button
                                onClick={() => setEditSection(null)}
                                className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleSave('startup')}
                                className="px-3 py-2 bg-black text-white rounded-md text-sm hover:bg-black/90"
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div>
                              <h3 className="text-base font-medium text-gray-900">{profile.startup_name || 'Unnamed Startup'}</h3>
                              <p className="mt-1 text-sm text-gray-500">{profile.startup_idea || 'No description available'}</p>
                            </div>
                            <dl className="grid grid-cols-2 gap-4">
                              <div>
                                <dt className="text-sm font-medium text-gray-500">Stage</dt>
                                <dd className="mt-1 text-sm text-gray-900">{profile.startup_stage || 'Not specified'}</dd>
                              </div>
                              <div>
                                <dt className="text-sm font-medium text-gray-500">Looking For</dt>
                                <dd className="mt-1 text-sm text-gray-900">{profile.looking_for || 'Not specified'}</dd>
                              </div>
                            </dl>
                          </div>
                        )}
                      </div>
                    </section>
                  )}

                  <section className="bg-white shadow rounded-lg">
                    <div className="p-6">
                      <h2 className="text-lg font-medium text-gray-900 mb-6">Settings</h2>
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 mb-4">Notification Preferences</h3>
                          <div className="space-y-4">
                            <div className="flex items-start">
                              <div className="flex items-center h-5">
                                <input
                                  id="email_notifications"
                                  type="checkbox"
                                  className="h-4 w-4 text-chapman-red border-gray-300 rounded focus:ring-chapman-red"
                                />
                              </div>
                              <div className="ml-3">
                                <label htmlFor="email_notifications" className="text-sm text-gray-700">
                                  Email Notifications
                                </label>
                                <p className="text-xs text-gray-500">Receive updates about new connections and messages.</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-gray-900 mb-4">Privacy</h3>
                          <div className="space-y-4">
                            <div className="flex items-start">
                              <div className="flex items-center h-5">
                                <input
                                  id="profile_visibility"
                                  type="checkbox"
                                  className="h-4 w-4 text-chapman-red border-gray-300 rounded focus:ring-chapman-red"
                                />
                              </div>
                              <div className="ml-3">
                                <label htmlFor="profile_visibility" className="text-sm text-gray-700">
                                  Public Profile
                                </label>
                                <p className="text-xs text-gray-500">Make your profile visible to all Chapman students.</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-gray-900 mb-4">Account</h3>
                          <div className="space-y-3">
                            <button className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                              Change Password
                            </button>
                            <button className="w-full flex justify-center py-2 px-4 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50">
                              Deactivate Account
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>

                <div className="space-y-6">
                  <section className="bg-white shadow rounded-lg">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-medium text-gray-900">Co-founder Requests</h2>
                        <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-800 text-xs font-medium">
                          {requests.length}
                        </span>
                      </div>
                      <div className="space-y-4">
                        {requests.map((request) => (
                          <div key={request.id} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="flex-shrink-0">
                                <div className="relative h-10 w-10 rounded-full overflow-hidden">
                                  {request.sender.avatar_url ? (
                                    <Image
                                      src={request.sender.avatar_url}
                                      alt={request.sender.full_name}
                                      fill
                                      className="object-cover"
                                    />
                                  ) : (
                                    <UserCircleIcon className="h-full w-full text-gray-300" />
                                  )}
                                </div>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{request.sender.full_name}</p>
                                <p className="text-xs text-gray-500">{request.sender.role}</p>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <button className="px-2 py-1 bg-black text-white text-xs rounded-md hover:bg-black/90">
                                Accept
                              </button>
                              <button className="px-2 py-1 border border-gray-300 text-xs rounded-md hover:bg-gray-50">
                                Decline
                              </button>
                            </div>
                          </div>
                        ))}
                        {requests.length === 0 && (
                          <p className="text-sm text-gray-500 text-center">No pending requests</p>
                        )}
                      </div>
                    </div>
                  </section>

                  <section className="bg-white shadow rounded-lg">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-medium text-gray-900">Connected Co-founders</h2>
                        <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-800 text-xs font-medium">
                          {connections.length}
                        </span>
                      </div>
                      <div className="space-y-4">
                        {connections.map((connection) => (
                          <div key={connection.id} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="flex-shrink-0">
                                <div className="relative h-10 w-10 rounded-full overflow-hidden">
                                  {connection.user.avatar_url ? (
                                    <Image
                                      src={connection.user.avatar_url}
                                      alt={connection.user.full_name}
                                      fill
                                      className="object-cover"
                                    />
                                  ) : (
                                    <UserCircleIcon className="h-full w-full text-gray-300" />
                                  )}
                                </div>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{connection.user.full_name}</p>
                                <p className="text-xs text-gray-500">{connection.user.role}</p>
                              </div>
                            </div>
                            <button className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700">
                              Message
                            </button>
                          </div>
                        ))}
                        {connections.length === 0 && (
                          <p className="text-sm text-gray-500 text-center">No connections yet</p>
                        )}
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
} 