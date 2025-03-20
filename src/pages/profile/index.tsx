import { useEffect, useState } from 'react';
import { useAuth } from '@/utils/AuthContext';
import { Profile } from '@/utils/supabase';
import { PencilIcon, UserCircleIcon, Cog6ToothIcon, UserPlusIcon, UserGroupIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

interface FormData {
  id: string;
  user_id: string;
  full_name: string;
  major: string;
  year: string;
  bio: string;
  skills: string;
  linkedin_url: string;
  twitter_url: string;
  role: string;
  industry: string;
  startup_stage: string;
  looking_for: string;
  startup_name: string;
  startup_idea: string;
  roles_looking_for: string;
  skills_bringing: string;
  interested_roles: string[];
  experience: string;
  industries_interest: string;
  commitment_type: string;
  university: string;
  interests: string[];
  created_at: string;
  admin_code: string;
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
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}

function ProfileContent() {
  const { user, profile: initialProfile, updateProfile: updateAuthProfile, uploadAvatar, isLoading } = useAuth();
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
    created_at: '',
    admin_code: '',
  });
  const [requests, setRequests] = useState<CoFounderRequest[]>([]);
  const [connections, setConnections] = useState<CoFounderConnection[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [adminCodeError, setAdminCodeError] = useState<string | null>(null);
  const [adminCodeSuccess, setAdminCodeSuccess] = useState(false);

  useEffect(() => {
    console.log('Profile component - initialProfile changed:', initialProfile);
    if (initialProfile) {
      console.log('Setting profile state with initial profile data');
      setProfile(initialProfile);
      
      // Convert skills array to comma-separated string for the form
      const skillsString = Array.isArray(initialProfile.skills) 
        ? initialProfile.skills.join(', ') 
        : initialProfile.skills || '';
      
      // Ensure interests is an array
      const interestsArray = Array.isArray(initialProfile.interests)
        ? initialProfile.interests
        : initialProfile.interests || [];
        
      // Create a properly typed form data object
      const newFormData: FormData = {
        id: initialProfile.id || '',
        user_id: initialProfile.user_id || '',
        full_name: initialProfile.full_name || '',
        major: initialProfile.major || '',
        year: initialProfile.year || '',
        bio: initialProfile.bio || '',
        skills: skillsString,
        linkedin_url: initialProfile.linkedin_url || '',
        twitter_url: initialProfile.twitter_url || '',
        role: initialProfile.role || '',
        industry: initialProfile.industry || '',
        startup_stage: initialProfile.startup_stage || '',
        looking_for: initialProfile.looking_for || '',
        startup_name: initialProfile.startup_name || '',
        startup_idea: initialProfile.startup_idea || '',
        roles_looking_for: initialProfile.roles_looking_for || '',
        skills_bringing: initialProfile.skills_bringing || '',
        interested_roles: initialProfile.interested_roles || [],
        experience: initialProfile.experience || '',
        industries_interest: initialProfile.industries_interest || '',
        commitment_type: initialProfile.commitment_type || '',
        university: initialProfile.university || '',
        interests: interestsArray,
        created_at: initialProfile.created_at || '',
        admin_code: '',
      };
      
      console.log('Setting form data with initial profile data:', newFormData);
      setFormData(newFormData);
    } else {
      console.log('No profile data available');
    }
  }, [initialProfile]);

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async (section: string) => {
    if (!user?.id) {
      console.error('Cannot save profile: No user ID available');
      return;
    }

    try {
      console.log('Updating profile for section:', section);
      console.log('Current form data:', formData);

      // Convert comma-separated skills to array
      const skillsArray = formData.skills
        ? formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill)
        : [];

      // Make sure we don't lose any existing data
      const existingProfileData = profile || {};
      
      const updatedData = {
        ...existingProfileData,
        ...formData,
        skills: skillsArray,
        // Make sure user_id is set
        user_id: user.id
      };

      console.log('Sending updated data:', updatedData);
      const { success, error, profile: updatedProfile } = await updateAuthProfile(updatedData);
      
      if (success && updatedProfile) {
        console.log('Profile updated successfully:', updatedProfile);
        setEditSection(null);
        // Update the full profile with the response from the server
        setProfile(updatedProfile);
        
        // Update form data to reflect the server response
        const updatedSkillsString = Array.isArray(updatedProfile.skills) 
          ? updatedProfile.skills.join(', ') 
          : updatedProfile.skills || '';
        
        const updatedInterestsArray = Array.isArray(updatedProfile.interests)
          ? updatedProfile.interests
          : updatedProfile.interests || [];
        
        setFormData({
          ...formData,
          skills: updatedSkillsString,
          interests: updatedInterestsArray,
          // Update other fields that might have been modified
          id: updatedProfile.id || '',
          user_id: updatedProfile.user_id || '',
          full_name: updatedProfile.full_name || '',
          major: updatedProfile.major || '',
          year: updatedProfile.year || '',
          bio: updatedProfile.bio || '',
          linkedin_url: updatedProfile.linkedin_url || '',
          twitter_url: updatedProfile.twitter_url || '',
          role: updatedProfile.role || '',
          industry: updatedProfile.industry || '',
          startup_stage: updatedProfile.startup_stage || '',
          looking_for: updatedProfile.looking_for || '',
          startup_name: updatedProfile.startup_name || '',
          startup_idea: updatedProfile.startup_idea || '',
          roles_looking_for: updatedProfile.roles_looking_for || '',
          skills_bringing: updatedProfile.skills_bringing || '',
          interested_roles: updatedProfile.interested_roles || [],
          experience: updatedProfile.experience || '',
          industries_interest: updatedProfile.industries_interest || '',
          commitment_type: updatedProfile.commitment_type || '',
          university: updatedProfile.university || '',
          created_at: updatedProfile.created_at || '',
        });
      } else {
        console.error('Error updating profile:', error);
      }
    } catch (error) {
      console.error('Exception during profile update:', error);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    setUploadError(null);
    
    try {
      const result = await uploadAvatar(file);
      
      if (result.success) {
        // Profile state is already updated in the AuthContext when upload is successful
      } else {
        setUploadError(result.error || 'Failed to upload avatar');
      }
    } catch (error: any) {
      setUploadError(error.message || 'An unexpected error occurred');
      console.error('Error uploading avatar:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleVerifyAdminCode = async () => {
    if (!formData.admin_code) {
      setAdminCodeError('Please enter an admin code');
      return;
    }

    setAdminCodeError(null);
    
    // This is a simplified example - in a real app, you'd validate this server-side
    // The admin code is hardcoded here for demonstration only
    const validAdminCodes = ['CHAPMAN2024', 'LEATHERBY2024', 'CEO2024'];
    
    if (validAdminCodes.includes(formData.admin_code)) {
      try {
        // Update the user's profile with admin status
        const updatedData = {
          ...profile,
          is_admin: true
        };
        
        const { success, profile: updatedProfile } = await updateAuthProfile(updatedData);
        
        if (success && updatedProfile) {
          setProfile(updatedProfile);
          setAdminCodeSuccess(true);
          // Clear the admin code field
          setFormData(prev => ({ ...prev, admin_code: '' }));
        } else {
          setAdminCodeError('Failed to update admin status. Please try again.');
        }
      } catch (error) {
        console.error('Error updating admin status:', error);
        setAdminCodeError('An error occurred. Please try again.');
      }
    } else {
      setAdminCodeError('Invalid admin code');
    }
  };

  // Show loading state if auth is still loading
  if (isLoading) {
    console.log('Profile page is loading...');
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-pulse flex flex-col items-center space-y-4">
            <div className="rounded-full bg-gray-200 h-24 w-24"></div>
            <div className="h-4 bg-gray-200 rounded w-48"></div>
            <div className="h-3 bg-gray-200 rounded w-32"></div>
            <div className="h-3 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Show prompt to log in if no user
  if (!user) {
    console.log('No user found, showing login prompt');
    return (
      <DashboardLayout>
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold mb-4">Please log in to view your profile</h2>
          <p className="text-gray-600">You need to be logged in to access your profile information.</p>
        </div>
      </DashboardLayout>
    );
  }

  // Show "creating profile" message if user exists but no profile
  if (user && !profile) {
    console.log("User exists but no profile found, userId:", user.id);
    return (
      <DashboardLayout>
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold mb-4">Setting up your profile...</h2>
          <p className="text-gray-600 mb-4">Please wait while we create your profile.</p>
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        </div>
      </DashboardLayout>
    );
  }

  console.log("Rendering profile page with profile data:", profile);

  return (
    <DashboardLayout>
      <div className="container mx-auto py-10 px-4 max-w-5xl space-y-8">
        {/* Profile header */}
        <div className="bg-white rounded-xl shadow-sm p-8 relative border border-gray-100">
          {/* Avatar and basic info */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
            {/* Avatar with upload functionality */}
            <div className="relative group">
              <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-white shadow-md">
                {profile?.avatar_url ? (
                  <Image 
                    src={profile.avatar_url} 
                    alt={profile?.full_name || "User"} 
                    width={144} 
                    height={144} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-400">
                    <UserCircleIcon className="w-20 h-20" />
                  </div>
                )}
              </div>
              
              {/* Upload overlay */}
              <label 
                htmlFor="avatar-upload" 
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <span className="text-white text-sm font-medium">Change Photo</span>
              </label>
              
              <input 
                type="file" 
                id="avatar-upload" 
                accept="image/*" 
                className="hidden" 
                onChange={handleAvatarChange}
                disabled={isUploading}
              />
              
              {/* Upload indicator */}
              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
              )}
            </div>
            
            {/* Basic info */}
            <div className="text-center sm:text-left flex-grow">
              <h1 className="text-4xl font-bold text-gray-900 mb-3">{profile?.full_name || "Complete Your Profile"}</h1>
              
              <div className="flex flex-wrap gap-2 mt-3 mb-5 justify-center sm:justify-start">
                {profile?.major && (
                  <span className="bg-gray-100 text-gray-800 rounded-full px-4 py-1.5 text-sm font-medium">
                    {profile.major}
                  </span>
                )}
                
                {profile?.year && (
                  <span className="bg-gray-200 text-gray-800 rounded-full px-4 py-1.5 text-sm font-medium">
                    {profile.year}
                  </span>
                )}
                
                {profile?.university && (
                  <span className="bg-gray-100 text-gray-800 rounded-full px-4 py-1.5 text-sm font-medium">
                    {profile.university}
                  </span>
                )}
                
                {profile?.role && (
                  <span className="bg-gray-200 text-gray-800 rounded-full px-4 py-1.5 text-sm font-medium">
                    {profile.role}
                  </span>
                )}
                
                {profile?.is_admin && (
                  <span className="bg-gray-800 text-white rounded-full px-4 py-1.5 text-sm font-medium flex items-center gap-1">
                    <ShieldCheckIcon className="w-4 h-4" /> Admin
                  </span>
                )}
              </div>
              
              {/* Social links */}
              <div className="mt-5 flex gap-4 justify-center sm:justify-start">
                {profile?.linkedin_url && (
                  <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-gray-900 transition-colors">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                      <span className="text-sm font-medium">LinkedIn</span>
                    </div>
                  </a>
                )}
                
                {profile?.twitter_url && (
                  <a href={profile.twitter_url} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-gray-900 transition-colors">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                      </svg>
                      <span className="text-sm font-medium">Twitter/X</span>
                    </div>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      
        {/* About Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">About</h2>
              <button
                onClick={() => setEditSection('about')}
                className="text-gray-700 hover:text-gray-900 text-sm font-medium flex items-center gap-1 bg-gray-100 hover:bg-gray-200 transition-colors py-2 px-4 rounded-lg"
              >
                <PencilIcon className="h-4 w-4" />
                Edit
              </button>
            </div>
            
            {editSection === 'about' ? (
              <div className="space-y-6">
                <textarea
                  rows={4}
                  value={formData.bio || ''}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                  placeholder="Tell us about yourself..."
                />
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setEditSection(null)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSave('about')}
                    className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800 transition-colors"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-700 text-lg leading-relaxed">
                {profile?.bio || 'No bio added yet. Click Edit to add information about yourself.'}
              </p>
            )}
          </div>
        </div>
      
        {/* Skills & Experience Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Skills & Experience</h2>
              <button
                onClick={() => setEditSection('skills')}
                className="text-gray-700 hover:text-gray-900 text-sm font-medium flex items-center gap-1 bg-gray-100 hover:bg-gray-200 transition-colors py-2 px-4 rounded-lg"
              >
                <PencilIcon className="h-4 w-4" />
                Edit
              </button>
            </div>
            
            {editSection === 'skills' ? (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
                  <input
                    type="text"
                    value={formData.skills || ''}
                    onChange={(e) => handleInputChange('skills', e.target.value)}
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                    placeholder="e.g., Programming, Marketing, Design (comma-separated)"
                  />
                  <p className="text-xs text-gray-500 mt-2">Separate skills with commas</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
                  <textarea
                    rows={3}
                    value={formData.experience || ''}
                    onChange={(e) => handleInputChange('experience', e.target.value)}
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                    placeholder="Briefly describe your experience..."
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                    <select
                      value={formData.role || ''}
                      onChange={(e) => handleInputChange('role', e.target.value)}
                      className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                    >
                      <option value="">Select Role</option>
                      <option value="Founder">Founder</option>
                      <option value="Co-Founder">Co-Founder</option>
                      <option value="Technical Co-Founder">Technical Co-Founder</option>
                      <option value="Business Co-Founder">Business Co-Founder</option>
                      <option value="Job Seeker">Job Seeker</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                    <input
                      type="text"
                      value={formData.industry || ''}
                      onChange={(e) => handleInputChange('industry', e.target.value)}
                      className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                      placeholder="e.g., Technology, Healthcare"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setEditSection(null)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSave('skills')}
                    className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800 transition-colors"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <div>
                  <h3 className="text-sm uppercase font-medium text-gray-500 mb-2">Role</h3>
                  <p className="text-gray-900 font-medium">{profile?.role || 'Not specified'}</p>
                </div>
                
                <div>
                  <h3 className="text-sm uppercase font-medium text-gray-500 mb-2">Industry</h3>
                  <p className="text-gray-900 font-medium">{profile?.industry || 'Not specified'}</p>
                </div>
                
                <div>
                  <h3 className="text-sm uppercase font-medium text-gray-500 mb-2">Skills</h3>
                  {Array.isArray(profile?.skills) && profile.skills.length > 0 ? (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {profile.skills.map((skill, index) => (
                        <span 
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-900 font-medium">No skills specified</p>
                  )}
                </div>
                
                <div>
                  <h3 className="text-sm uppercase font-medium text-gray-500 mb-2">Experience</h3>
                  <p className="text-gray-900 leading-relaxed">{profile?.experience || 'Not specified'}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      
        {/* Startup Information (conditional rendering based on role) */}
        {profile?.role === 'Founder' || profile?.role === 'Co-Founder' ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Startup Information</h2>
                <button
                  onClick={() => setEditSection('startup')}
                  className="text-gray-700 hover:text-gray-900 text-sm font-medium flex items-center gap-1 bg-gray-100 hover:bg-gray-200 transition-colors py-2 px-4 rounded-lg"
                >
                  <PencilIcon className="h-4 w-4" />
                  Edit
                </button>
              </div>
              
              {editSection === 'startup' ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Startup Name</label>
                    <input
                      type="text"
                      value={formData.startup_name || ''}
                      onChange={(e) => handleInputChange('startup_name', e.target.value)}
                      className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                      placeholder="Your startup's name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Startup Idea</label>
                    <textarea
                      rows={3}
                      value={formData.startup_idea || ''}
                      onChange={(e) => handleInputChange('startup_idea', e.target.value)}
                      className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                      placeholder="Describe your startup idea..."
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Stage</label>
                      <select
                        value={formData.startup_stage || ''}
                        onChange={(e) => handleInputChange('startup_stage', e.target.value)}
                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">Looking For</label>
                      <input
                        type="text"
                        value={formData.looking_for || ''}
                        onChange={(e) => handleInputChange('looking_for', e.target.value)}
                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                        placeholder="e.g., Technical Co-Founder, Marketing Lead"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={() => setEditSection(null)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSave('startup')}
                      className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800 transition-colors"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{profile?.startup_name || 'Unnamed Startup'}</h3>
                    <p className="text-gray-700 text-lg leading-relaxed">{profile?.startup_idea || 'No description available'}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="text-sm uppercase font-medium text-gray-500 mb-2">Stage</h3>
                      <p className="text-gray-900 font-medium">{profile?.startup_stage || 'Not specified'}</p>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="text-sm uppercase font-medium text-gray-500 mb-2">Looking For</h3>
                      <p className="text-gray-900 font-medium">{profile?.looking_for || 'Not specified'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : null}
      
        {/* Settings Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-8">Settings</h2>
            
            <div className="space-y-10">
              {/* Admin Access Section */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Admin Access</h3>
                {profile?.is_admin ? (
                  <div className="flex items-center p-6 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="bg-gray-200 p-3 rounded-full mr-4">
                      <ShieldCheckIcon className="h-6 w-6 text-gray-800" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-lg">Admin privileges are active</p>
                      <p className="text-gray-600">You can create events and manage resources</p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="space-y-3">
                      <label htmlFor="admin_code" className="block text-sm font-medium text-gray-700">
                        Admin Code
                      </label>
                      <div className="flex">
                        <input
                          id="admin_code"
                          type="password"
                          placeholder="Enter admin access code"
                          className={`block w-full rounded-l-lg ${adminCodeError ? 'border-red-300' : 'border-gray-300'} shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm`}
                          value={formData.admin_code}
                          onChange={(e) => handleInputChange('admin_code', e.target.value)}
                        />
                        <button 
                          className="px-6 py-2 border border-transparent text-sm font-medium rounded-r-lg text-white bg-gray-900 hover:bg-gray-800 focus:outline-none transition-colors"
                          onClick={handleVerifyAdminCode}
                        >
                          Verify
                        </button>
                      </div>
                      {adminCodeError && (
                        <p className="mt-2 text-sm text-red-600">{adminCodeError}</p>
                      )}
                      {adminCodeSuccess && (
                        <p className="mt-2 text-sm text-green-600">Admin code verified! Refresh the page to see changes.</p>
                      )}
                      <p className="mt-2 text-sm text-gray-500">
                        Enter the admin code to gain access to event creation and resource management
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Profile Privacy */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Privacy</h3>
                <div className="flex items-start p-6 bg-gray-50 rounded-lg">
                  <div className="flex items-center h-5 mt-0.5">
                    <input
                      id="profile_visibility"
                      name="profile_visibility"
                      type="checkbox"
                      className="h-5 w-5 rounded border-gray-300 text-gray-700 focus:ring-gray-500"
                      defaultChecked
                    />
                  </div>
                  <div className="ml-3">
                    <label htmlFor="profile_visibility" className="font-medium text-gray-900">Public Profile</label>
                    <p className="text-gray-600">Make your profile visible to other Chapman students</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 