import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nhjnbypbpikvfdkyowco.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5oam5ieXBicGlrdmZka3lvd2NvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0NTc1NjMsImV4cCI6MjA1ODAzMzU2M30.pyNmvhO4vhJSu8DMdLH3zXM9CH7INVil1zHEDRDgvv8';

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Known test users (only for development)
const DEMO_USERS = [
  { email: 'mitic@chapman.edu', password: 'password123' },
  { email: 'demo@example.com', password: 'password123' },
];

// Types based on the database schema
export type Profile = {
  id: string;
  user_id: string | null;
  university: string;
  bio: string | null;
  interests: string[] | null;
  created_at: string | null;
  full_name?: string;
  major?: string;
  year?: string;
  skills?: string[];
  linkedin_url?: string;
  twitter_url?: string;
  avatar_url?: string;
  role?: string;
  industry?: string;
  startup_stage?: string;
  looking_for?: string;
  startup_name?: string;
  startup_idea?: string;
  roles_looking_for?: string;
  skills_bringing?: string;
  interested_roles?: string[];
  experience?: string;
  industries_interest?: string;
  commitment_type?: string;
  is_admin?: boolean;
  email?: string;
};

export type Event = {
  id: string;
  title: string;
  description: string;
  location: any; // Using 'any' for jsonb type
  category: string;
  start_date: string;
  end_date: string | null;
  created_by: string;
  images: string[] | null;
  created_at: string;
  university: string;
};

// Auth related types
export type User = {
  id: string;
  email: string;
};

// ========== AUTHENTICATION FUNCTIONS ==========

/**
 * Sets the authenticated user in localStorage
 */
export const setAuthUser = (user: any) => {
  try {
    localStorage.setItem('auth_user', JSON.stringify(user));
  } catch (error) {
    console.error('Error setting auth user in localStorage:', error);
  }
};

/**
 * Gets the authenticated user from localStorage
 */
export const getAuthUser = () => {
  try {
    const user = localStorage.getItem('auth_user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error getting auth user from localStorage:', error);
    return null;
  }
};

/**
 * Clears the authenticated user from localStorage
 */
export const clearAuthUser = () => {
  try {
    localStorage.removeItem('auth_user');
  } catch (error) {
    console.error('Error clearing auth user from localStorage:', error);
  }
};

/**
 * Sign in with email and password
 */
export const signIn = async (email: string, password: string) => {
  try {
    console.log('Attempting sign in for:', email);
    
    // Perform the actual Supabase authentication
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      console.error('Sign in error:', error.message);
      return { 
        success: false, 
        error: error.message 
      };
    }
    
    if (!data?.user) {
      return { 
        success: false, 
        error: 'No user returned from authentication' 
      };
    }
    
    // Store user in localStorage
    setAuthUser(data.user);
    
    // Ensure user exists in users table
    try {
      const { data: userData, error: userCheckError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .maybeSingle();
      
      if (userCheckError) {
        console.error('Error checking user in users table:', userCheckError);
      } else if (!userData) {
        // User not in table, add them
        console.log('User not found in users table, adding now...');
        await supabase
          .from('users')
          .insert([{
            id: data.user.id,
            email: email,
            created_at: new Date().toISOString(),
            full_name: data.user.user_metadata?.full_name || '',
          }]);
      }
    } catch (userError) {
      console.error('Exception checking/creating user record:', userError);
    }
    
    // Try to get existing profile or create one if it doesn't exist
    let profile = null;
    let profileError = null;
    
    try {
      const profileResult = await getProfile(data.user.id);
      profile = profileResult.profile;
      profileError = profileResult.error;
      
      // If profile is null but no error, explicitly create one
      if (!profile && !profileError) {
        console.log('No profile found, explicitly creating one');
        
        const { error: profileInsertError } = await supabase
          .from('profiles')
          .insert([{
            user_id: data.user.id,
            university: 'Chapman University',
            full_name: data.user.user_metadata?.full_name || '',
            created_at: new Date().toISOString(),
            skills: [],
            interests: []
          }]);
        
        if (profileInsertError) {
          console.error('Error creating profile during sign in:', profileInsertError);
        } else {
          console.log('Profile created during sign in');
          
          // Fetch the newly created profile
          const newProfileResult = await getProfile(data.user.id);
          profile = newProfileResult.profile;
          profileError = newProfileResult.error;
        }
      }
    } catch (profileFetchError) {
      console.error('Exception fetching/creating profile during sign in:', profileFetchError);
    }
    
    if (profileError) {
      console.error('Error with profile during sign in:', profileError);
    }
    
    // Check if we have questionnaire data from landing page to add to profile
    let questionnaire = null;
    try {
      const questData = localStorage.getItem('founderConnectQuestionnaire');
      if (questData) {
        questionnaire = JSON.parse(questData);
        console.log('Found questionnaire data:', questionnaire);
        
        // If we have questionnaire data and a profile, update the profile with this data
        if (questionnaire && profile) {
          const profileUpdate: Partial<Profile> = {};
          
          // Add name from questionnaire if available
          if (questionnaire.name && (!profile.full_name || profile.full_name === '')) {
            profileUpdate.full_name = questionnaire.name;
          }
          
          // Set role based on questionnaire
          if (questionnaire.role && (!profile.role || profile.role === '')) {
            profileUpdate.role = questionnaire.role.includes('Founder') ? 'Founder' : 
              questionnaire.role.includes('Developer') ? 'Technical Co-Founder' :
              questionnaire.role.includes('Designer') ? 'Creative Co-Founder' :
              questionnaire.role.includes('Business') ? 'Business Co-Founder' : 'Job Seeker';
          }
          
          // Set interests if we have them from questionnaire
          if (questionnaire.interest) {
            const currentInterests = profile.interests || [];
            if (!currentInterests.includes(questionnaire.interest)) {
              profileUpdate.interests = [...currentInterests, questionnaire.interest];
            }
          }
          
          // Only update if we have changes to make
          if (Object.keys(profileUpdate).length > 0) {
            console.log('Updating profile with questionnaire data:', profileUpdate);
            const updateResult = await updateProfile(data.user.id, profileUpdate);
            
            if (updateResult.success && updateResult.profile) {
              profile = updateResult.profile;
            }
          }
          
          // Clean up questionnaire data after using it
          localStorage.removeItem('founderConnectQuestionnaire');
        }
      }
    } catch (e) {
      console.error('Error processing questionnaire data:', e);
    }
    
    return { 
      success: true, 
      user: data.user,
      profile,
      isDemo: false
    };
  } catch (error: any) {
    console.error('Unexpected error during sign in:', error);
    return { 
      success: false, 
      error: error.message || 'An unexpected error occurred' 
    };
  }
};

/**
 * Sign out the current user
 */
export const signOut = async () => {
  try {
    // First clear the local storage
    clearAuthUser();
    
    // Then sign out from Supabase using the correct method
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Error during sign out:', error.message);
      return { 
        success: false, 
        error: error.message 
      };
    }
    
    return { success: true };
  } catch (error: any) {
    console.error('Error during sign out:', error);
    return { 
      success: false, 
      error: error.message || 'An unexpected error occurred during sign out' 
    };
  }
};

/**
 * Check if a user is authenticated
 */
export const isAuthenticated = async () => {
  try {
    // First check localStorage
    const localUser = getAuthUser();
    if (localUser) {
      return { authenticated: true, user: localUser };
    }
    
    // If not in localStorage, check with Supabase using the correct method
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error getting session:', error.message);
      return { authenticated: false, error: error.message };
    }
    
    if (!data || !data.session || !data.session.user) {
      return { authenticated: false };
    }
    
    const user = data.session.user;
    
    // Store user in localStorage
    setAuthUser(user);
    
    return { authenticated: true, user };
  } catch (error: any) {
    console.error('Error checking authentication:', error);
    return { authenticated: false, error: error.message };
  }
};

/**
 * Get the current user's profile
 */
export const getProfile = async (userId: string) => {
  try {
    console.log(`Fetching profile for user ${userId}`);
    
    // For demo user, return the demo profile from localStorage if exists, otherwise use default
    if (userId === 'demo-user-id') {
      let customProfile = null;
      
      try {
        // Check if there's a custom profile in localStorage
        const storedProfile = localStorage.getItem('demoUserProfile');
        if (storedProfile) {
          customProfile = JSON.parse(storedProfile);
          console.log('Retrieved custom profile from localStorage:', customProfile);
        }
      } catch (e) {
        console.error('Error reading demo profile from localStorage:', e);
      }
      
      // If we have a custom profile, use it
      if (customProfile) {
        return { profile: customProfile, error: null };
      }
      
      // Otherwise use the default demo profile
      const demoProfile = {
        id: 'demo-profile-id',
        user_id: 'demo-user-id',
        university: 'Chapman University',
        bio: 'Passionate entrepreneur and computer science student at Chapman University. Currently working on innovative solutions in the AI and machine learning space. Looking to connect with like-minded founders and potential co-founders.',
        interests: ['Artificial Intelligence', 'Startups', 'Technology', 'Entrepreneurship'],
        created_at: new Date().toISOString(),
        full_name: 'Alex Chapman',
        major: 'Computer Science',
        year: 'Senior',
        skills: ['Programming', 'Machine Learning', 'Product Management', 'UI/UX Design'],
        linkedin_url: 'https://linkedin.com/in/demo',
        twitter_url: 'https://twitter.com/demo',
        avatar_url: 'https://avatars.githubusercontent.com/u/12345678',
        role: 'Founder',
        industry: 'Technology',
        startup_stage: 'MVP',
        looking_for: 'Technical Co-Founder, Marketing Lead',
        startup_name: 'AI Innovate',
        startup_idea: 'Building an AI-powered platform that helps students find and connect with potential co-founders based on complementary skills and shared interests.',
        roles_looking_for: 'Technical Co-Founder, Marketing Lead',
        skills_bringing: 'Product vision, technical architecture, UI/UX design',
        interested_roles: ['Founder', 'CTO'],
        experience: '3 years of software development experience, previously founded a student-led startup',
        industries_interest: 'Artificial Intelligence, EdTech, SaaS',
        commitment_type: 'Full-time',
        is_admin: true
      };
      
      return { profile: demoProfile, error: null };
    }

    // Make multiple attempts to get or create the profile
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        // Try to get the user's profile
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', userId)
          .single();
        
        // If profile found, return it
        if (data) {
          console.log(`Profile found for user ${userId} on attempt ${attempt + 1}:`, data);
          return { profile: data, error: null };
        }
        
        // If no profile found, create one
        if (error) {
          console.log(`Profile not found on attempt ${attempt + 1}, creating a new one`);
          
          // Get user info if available
          let fullName = '';
          try {
            const { data: userData } = await supabase
              .from('users')
              .select('full_name')
              .eq('id', userId)
              .single();
              
            if (userData && userData.full_name) {
              fullName = userData.full_name;
            }
          } catch (nameError) {
            console.error('Error getting full name:', nameError);
          }
          
          // Create a basic profile with direct SQL insert
          const newProfile = {
            user_id: userId,
            university: 'Chapman University',
            full_name: fullName,
            skills: [],
            interests: [],
            created_at: new Date().toISOString()
          };
          
          const { error: insertError } = await supabase
            .from('profiles')
            .insert([newProfile]);
          
          if (insertError) {
            console.error(`Error creating profile on attempt ${attempt + 1}:`, insertError.message);
            
            if (attempt === 2) {
              // On final attempt, return a fabricated profile to prevent UI issues
              console.log('Returning fabricated profile after all attempts failed');
              return { 
                profile: { 
                  id: `temp-${userId}`,
                  user_id: userId,
                  university: 'Chapman University',
                  full_name: fullName || '',
                  skills: [],
                  interests: [],
                  created_at: new Date().toISOString(),
                  bio: null
                }, 
                error: null 
              };
            }
          } else {
            console.log(`Profile created successfully on attempt ${attempt + 1}`);
            
            // Fetch the newly created profile
            const { data: createdProfile, error: fetchError } = await supabase
              .from('profiles')
              .select('*')
              .eq('user_id', userId)
              .single();
            
            if (fetchError) {
              console.error('Error fetching newly created profile:', fetchError.message);
            } else if (createdProfile) {
              console.log('Retrieved newly created profile:', createdProfile);
              return { profile: createdProfile, error: null };
            }
          }
          
          // If we reach here, we'll retry on the next attempt
          await new Promise(resolve => setTimeout(resolve, 500)); // Wait before retrying
        }
      } catch (attemptError) {
        console.error(`Error on profile fetch/create attempt ${attempt + 1}:`, attemptError);
        
        if (attempt === 2) {
          // On final attempt, return a fabricated profile to prevent UI issues
          return { 
            profile: { 
              id: `temp-${userId}`,
              user_id: userId,
              university: 'Chapman University',
              full_name: '',
              skills: [],
              interests: [],
              created_at: new Date().toISOString(),
              bio: null
            }, 
            error: null 
          };
        }
        
        await new Promise(resolve => setTimeout(resolve, 500)); // Wait before retrying
      }
    }
    
    // Fallback with a minimal profile if all attempts failed
    console.log('Fallback: Returning minimal profile after all attempts');
    return { 
      profile: { 
        id: `fallback-${userId}`,
        user_id: userId,
        university: 'Chapman University',
        full_name: '',
        skills: [],
        interests: [],
        created_at: new Date().toISOString(),
        bio: null
      }, 
      error: null 
    };
  } catch (error: any) {
    console.error('Top-level error in getProfile:', error);
    // Return a minimal profile even in case of error to prevent endless loading
    return { 
      profile: { 
        id: `error-${userId}`,
        user_id: userId,
        university: 'Chapman University',
        full_name: '',
        skills: [],
        interests: [],
        created_at: new Date().toISOString(),
        bio: null
      }, 
      error: null 
    };
  }
};

// Profile functions
export const getEvents = async (university?: string) => {
  try {
    let query = supabase
      .from('events')
      .select('*')
      .order('start_date', { ascending: true });
    
    if (university) {
      query = query.eq('university', university);
    }
    
    const { data, error } = await query;
    
    return { events: data as Event[] | null, error };
  } catch (err) {
    console.error('Get events error:', err);
    return { events: null, error: err };
  }
};

export const getEvent = async (eventId: string) => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single();
    
    return { event: data as Event | null, error };
  } catch (err) {
    console.error('Get event error:', err);
    return { event: null, error: err };
  }
};

export const createEvent = async (event: Omit<Event, 'id' | 'created_at'>) => {
  try {
    const { data, error } = await supabase
      .from('events')
      .insert([event])
      .select();
    
    return { event: data?.[0] as Event | null, error };
  } catch (err) {
    console.error('Create event error:', err);
    return { event: null, error: err };
  }
};

export const updateEvent = async (eventId: string, updates: Partial<Omit<Event, 'id' | 'created_by' | 'created_at'>>) => {
  try {
    const { data, error } = await supabase
      .from('events')
      .update(updates)
      .eq('id', eventId)
      .select();
    
    return { event: data?.[0] as Event | null, error };
  } catch (err) {
    console.error('Update event error:', err);
    return { event: null, error: err };
  }
};

export const deleteEvent = async (eventId: string) => {
  try {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId);
    
    return { error };
  } catch (err) {
    console.error('Delete event error:', err);
    return { error: err };
  }
};

/**
 * Get the current authenticated user
 */
export const getCurrentUser = async () => {
  try {
    // First check localStorage
    const localUser = getAuthUser();
    if (localUser) {
      return { user: localUser };
    }
    
    // If not in localStorage, check with Supabase using the correct method
    const { data, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Error getting current user:', error.message);
      return { error: error.message };
    }
    
    if (!data || !data.user) {
      return { error: 'No user found' };
    }
    
    // Store user in localStorage
    setAuthUser(data.user);
    
    return { user: data.user };
  } catch (error: any) {
    console.error('Error getting current user:', error);
    return { error: error.message };
  }
};

/**
 * Sign up a new user
 */
export const signUp = async (email: string, password: string, profileData?: Partial<Profile>) => {
  try {
    console.log('Creating new user with email:', email, 'and profile data:', profileData);
    
    // Prepare the userData for auth.signUp
    const userData = {
      full_name: profileData?.full_name || ''
    };
    
    // First register the user in Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });
    
    if (error) {
      console.error('Sign up error:', error.message);
      return { success: false, error: error.message };
    }
    
    if (!data || !data.user) {
      return { success: false, error: 'No user returned from sign up' };
    }
    
    console.log('User created successfully in Auth:', data.user);
    
    // Wait a moment for auth to be fully registered
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Create user in users table - using RLS policies
    let userInsertSuccess = false;
    try {
      // Add record to users table
      const userInsertResponse = await supabase
        .from('users')
        .insert({
          id: data.user.id,
          email: email,
          created_at: new Date().toISOString(),
          full_name: profileData?.full_name || ''
        })
        .select();
      
      if (userInsertResponse.error) {
        console.error('Error inserting user record:', userInsertResponse.error);
        
        // Try an upsert as fallback
        const userUpsertResponse = await supabase
          .from('users')
          .upsert({
            id: data.user.id,
            email: email,
            created_at: new Date().toISOString(),
            full_name: profileData?.full_name || ''
          })
          .select();
          
        if (userUpsertResponse.error) {
          console.error('Error upserting user record:', userUpsertResponse.error);
        } else {
          console.log('User record upserted successfully:', userUpsertResponse.data);
          userInsertSuccess = true;
        }
      } else {
        console.log('User record created successfully:', userInsertResponse.data);
        userInsertSuccess = true;
      }
    } catch (userError) {
      console.error('Exception creating user record:', userError);
    }
    
    if (!userInsertSuccess) {
      console.warn('Failed to create user record in users table, attempting direct SQL');
      try {
        // Try a direct SQL insert as a last resort
        const { error: sqlError } = await supabase.rpc('insert_user', {
          user_id: data.user.id,
          user_email: email,
          user_fullname: profileData?.full_name || ''
        });
        
        if (sqlError) {
          console.error('SQL insert user error:', sqlError);
        } else {
          console.log('User inserted via SQL function');
          userInsertSuccess = true;
        }
      } catch (sqlError) {
        console.error('Exception during SQL user insert:', sqlError);
      }
    }
    
    // Create profile for user - will try multiple methods for reliability
    let profileInsertSuccess = false;
    
    // Prepare complete profile data
    const completeProfileData = {
      user_id: data.user.id,
      university: profileData?.university || 'Chapman University',
      full_name: profileData?.full_name || '',
      major: profileData?.major || '',
      year: profileData?.year || '',
      skills: profileData?.skills || [],
      interests: profileData?.interests || [],
      linkedin_url: profileData?.linkedin_url || '',
      twitter_url: profileData?.twitter_url || '',
      created_at: new Date().toISOString()
    };
    
    // Try method 1: direct profile insert
    try {
      const profileInsertResponse = await supabase
        .from('profiles')
        .insert(completeProfileData)
        .select();
      
      if (profileInsertResponse.error) {
        console.error('Error inserting profile directly:', profileInsertResponse.error);
      } else {
        console.log('Profile created successfully via direct insert:', profileInsertResponse.data);
        profileInsertSuccess = true;
      }
    } catch (profileError) {
      console.error('Exception inserting profile directly:', profileError);
    }
    
    // Try method 2: upsert method if insert failed
    if (!profileInsertSuccess) {
      try {
        const profileUpsertResponse = await supabase
          .from('profiles')
          .upsert(completeProfileData)
          .select();
        
        if (profileUpsertResponse.error) {
          console.error('Error upserting profile:', profileUpsertResponse.error);
        } else {
          console.log('Profile upserted successfully:', profileUpsertResponse.data);
          profileInsertSuccess = true;
        }
      } catch (upsertError) {
        console.error('Exception upserting profile:', upsertError);
      }
    }
    
    // Try method 3: RPC function if all else failed
    if (!profileInsertSuccess) {
      try {
        const { error: rpcError } = await supabase.rpc('create_profile', {
          profile_user_id: data.user.id,
          profile_fullname: profileData?.full_name || '',
          profile_data: JSON.stringify(completeProfileData)
        });
        
        if (rpcError) {
          console.error('Error creating profile via RPC:', rpcError);
        } else {
          console.log('Profile created via RPC function');
          profileInsertSuccess = true;
        }
      } catch (rpcError) {
        console.error('Exception creating profile via RPC:', rpcError);
      }
    }
    
    // If we couldn't create profile, log warning but allow signup to complete
    if (!profileInsertSuccess) {
      console.warn('Failed to create profile after multiple attempts. User will need to create profile later.');
    }
    
    return { 
      success: true, 
      user: data.user, 
      userTableSuccess: userInsertSuccess,
      profileSuccess: profileInsertSuccess
    };
  } catch (error: any) {
    console.error('Unexpected error during sign up:', error);
    return { success: false, error: error.message || 'An unexpected error occurred' };
  }
};

/**
 * Create a user profile
 */
export const createProfile = async (profileData: ExtendedProfileData) => {
  try {
    console.log('Creating new profile:', profileData);
    
    // Handle demo mode
    if (profileData.user_id === 'demo-user-id') {
      console.log('Demo mode - simulating profile creation');
      const demoProfile = {
        id: 'demo-profile-id',
        user_id: 'demo-user-id',
        university: profileData.university || 'Chapman University',
        bio: profileData.bio || 'Passionate entrepreneur and computer science student at Chapman University.',
        interests: profileData.interests || ['Artificial Intelligence', 'Startups', 'Technology'],
        full_name: profileData.full_name || 'Alex Chapman',
        major: profileData.major || 'Computer Science',
        year: profileData.year || 'Senior',
        skills: profileData.skills || ['Programming', 'Machine Learning'],
        created_at: new Date().toISOString(),
        is_admin: profileData.is_admin || false
      };
      
      return { 
        success: true, 
        profile: demoProfile 
      };
    }
    
    // Check if user exists in users table before creating profile
    if (profileData.user_id) {
      // First check if a profile already exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', profileData.user_id)
        .maybeSingle();
      
      if (existingProfile) {
        console.log('Profile already exists, returning existing profile:', existingProfile);
        return { 
          success: true, 
          profile: existingProfile,
          message: 'Profile already exists'
        };
      }
      
      // Check if the user exists in the users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', profileData.user_id)
        .maybeSingle();
      
      // If user doesn't exist in users table, try to add them
      if (!userData && !userError) {
        console.log('User not found in users table, attempting to add');
        
        // Get user from auth if we need to
        if (profileData.user_id && (!profileData.email || !profileData.full_name)) {
          try {
            // Try to get user info from auth
            const { data: authUserData } = await supabase.auth.getUser(profileData.user_id);
            
            if (authUserData?.user) {
              // Try to insert the user into the users table
              await supabase
                .from('users')
                .insert([{
                  id: profileData.user_id,
                  email: authUserData.user.email,
                  created_at: new Date().toISOString(),
                  full_name: profileData.full_name || authUserData.user.user_metadata?.full_name || '',
                }]);
              
              console.log('Added user to users table from auth data');
            }
          } catch (authErr) {
            console.error('Error getting auth user:', authErr);
          }
        } else if (profileData.user_id && profileData.email) {
          // Insert with known data
          await supabase
            .from('users')
            .insert([{
              id: profileData.user_id,
              email: profileData.email,
              created_at: new Date().toISOString(),
              full_name: profileData.full_name || '',
            }]);
          
          console.log('Added user to users table from profile data');
        }
      }
    }
    
    // Prepare the profile data (exclude any email field since it's not in the profiles table schema)
    const { email, ...cleanProfileData } = profileData;
    
    // Create new profile
    const { data, error } = await supabase
      .from('profiles')
      .insert([cleanProfileData])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating profile:', error.message);
      return { 
        success: false, 
        error: error.message 
      };
    }
    
    console.log('Profile created successfully:', data);
    return { 
      success: true, 
      profile: data 
    };
  } catch (error: any) {
    console.error('Unexpected error creating profile:', error);
    return { 
      success: false, 
      error: error.message || 'An unexpected error occurred' 
    };
  }
};

interface ExtendedProfileData extends Partial<Profile> {
  email?: string;
}

/**
 * Update a user profile
 */
export const updateProfile = async (userId: string, profileData: ExtendedProfileData) => {
  try {
    console.log(`Updating profile for user ${userId}:`, profileData);
    
    // Handle demo mode
    if (userId === 'demo-user-id') {
      console.log('Demo mode - simulating profile update');
      
      // Ensure we're properly handling the existing demo profile
      // Get the current demo profile from localStorage if it exists
      let existingDemoProfile: any = null;
      try {
        const storedProfile = localStorage.getItem('demoUserProfile');
        if (storedProfile) {
          existingDemoProfile = JSON.parse(storedProfile);
          console.log('Retrieved existing profile from localStorage for update:', existingDemoProfile);
        } else {
          console.log('No existing profile found in localStorage');
        }
      } catch (e) {
        console.error('Error reading profile from localStorage during update:', e);
      }

      // If no stored profile, use a default base profile
      if (!existingDemoProfile) {
        console.log('Creating new base profile for update');
        existingDemoProfile = {
          id: 'demo-profile-id',
          user_id: 'demo-user-id',
          university: 'Chapman University',
          bio: '',
          interests: [],
          created_at: new Date().toISOString(),
          full_name: '',
          major: '',
          year: '',
          skills: [],
          role: '',
          industry: '',
          startup_stage: '',
          looking_for: '',
          startup_name: '',
          startup_idea: '',
        };
      }
      
      // Create an updated profile by merging existing and new data
      const updatedProfile = {
        ...existingDemoProfile,
        ...profileData,
      };
      
      // Handle array fields specially to ensure they remain arrays
      if (profileData.skills) {
        if (Array.isArray(profileData.skills)) {
          updatedProfile.skills = profileData.skills;
        } else if (typeof profileData.skills === 'string') {
          updatedProfile.skills = profileData.skills.split(',').map(s => s.trim()).filter(Boolean);
        } else {
          updatedProfile.skills = existingDemoProfile.skills || [];
        }
      }
      
      if (profileData.interests) {
        if (Array.isArray(profileData.interests)) {
          updatedProfile.interests = profileData.interests;
        } else if (typeof profileData.interests === 'string') {
          updatedProfile.interests = profileData.interests.split(',').map(i => i.trim()).filter(Boolean);
        } else {
          updatedProfile.interests = existingDemoProfile.interests || [];
        }
      }
      
      if (profileData.interested_roles) {
        if (Array.isArray(profileData.interested_roles)) {
          updatedProfile.interested_roles = profileData.interested_roles;
        } else if (typeof profileData.interested_roles === 'string') {
          updatedProfile.interested_roles = profileData.interested_roles.split(',').map(r => r.trim()).filter(Boolean);
        } else {
          updatedProfile.interested_roles = existingDemoProfile.interested_roles || [];
        }
      }
      
      // Store the updated profile in localStorage for persistence
      try {
        localStorage.setItem('demoUserProfile', JSON.stringify(updatedProfile));
        console.log('Saved updated profile to localStorage:', updatedProfile);
      } catch (e) {
        console.error('Error saving updated profile to localStorage:', e);
      }
      
      return { 
        success: true, 
        profile: updatedProfile 
      };
    }
    
    // Extract fields that should be updated in the users table
    const { full_name, email } = profileData;
    const userFields: Record<string, any> = {};
    
    if (full_name !== undefined) {
      userFields.full_name = full_name;
    }
    
    if (email !== undefined) {
      userFields.email = email;
    }
    
    // If we have user fields to update, do that first
    if (Object.keys(userFields).length > 0) {
      console.log('Updating user data in users table:', userFields);
      try {
        const { error: userUpdateError } = await supabase
          .from('users')
          .update(userFields)
          .eq('id', userId);
        
        if (userUpdateError) {
          console.error('Error updating user data:', userUpdateError);
        } else {
          console.log('User data updated successfully');
        }
      } catch (userError) {
        console.error('Exception updating user data:', userError);
      }
    }
    
    // Remove fields that don't belong in the profile table
    const { email: _, ...cleanProfileData } = profileData;
    
    // Check if the profile exists
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking for existing profile:', checkError.message);
      return { 
        success: false, 
        error: checkError.message 
      };
    }
    
    // If no profile exists, create one
    if (!existingProfile) {
      console.log('No profile exists, creating new profile');
      const newProfile = {
        user_id: userId,
        ...cleanProfileData
      };
      
      const { data: insertedProfile, error: insertError } = await supabase
        .from('profiles')
        .insert([newProfile])
        .select()
        .single();
      
      if (insertError) {
        console.error('Error creating profile:', insertError.message);
        return { 
          success: false, 
          error: insertError.message 
        };
      }
      
      return { 
        success: true, 
        profile: insertedProfile 
      };
    }
    
    // Update existing profile
    const { data: updatedProfile, error: updateError } = await supabase
      .from('profiles')
      .update(cleanProfileData)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (updateError) {
      console.error('Error updating profile:', updateError.message);
      return { 
        success: false, 
        error: updateError.message 
      };
    }
    
    return { 
      success: true, 
      profile: updatedProfile 
    };
  } catch (error: any) {
    console.error('Exception updating profile in updateProfile:', error);
    return { 
      success: false, 
      error: error.message || 'An unexpected error occurred' 
    };
  }
};

/**
 * Upload an avatar image for a user
 */
export const uploadAvatar = async (userId: string, file: File) => {
  try {
    if (!userId) {
      return { success: false, error: 'User ID is required' };
    }

    // Create a unique file path for the avatar
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/avatar-${Date.now()}.${fileExt}`;
    const filePath = `${userId}/avatar-${Date.now()}.${fileExt}`;

    // Upload the file to the 'profile_pictures' bucket with the user's ID as the folder name
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('profile_pictures')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) {
      console.error('Error uploading avatar:', uploadError);
      return { success: false, error: uploadError.message };
    }

    // Get the public URL for the uploaded file
    const { data: publicURLData } = supabase.storage
      .from('profile_pictures')
      .getPublicUrl(filePath);

    const avatarUrl = publicURLData.publicUrl;

    // Update the user's profile with the new avatar URL
    const { data: profile, error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: avatarUrl })
      .eq('user_id', userId)
      .select('*')
      .single();

    if (updateError) {
      console.error('Error updating profile with avatar URL:', updateError);
      return { success: false, error: updateError.message };
    }

    return { success: true, profile, url: avatarUrl };
  } catch (error: any) {
    console.error('Unexpected error uploading avatar:', error);
    return { success: false, error: error.message || 'An unexpected error occurred' };
  }
};

// ========== CONNECTIONS FUNCTIONS ==========

/**
 * Type for connection data
 */
export type Connection = {
  id: string;
  requester_id: string;
  recipient_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  updated_at: string;
};

/**
 * Get connection requests received by the user
 */
export const getConnectionRequests = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('connections')
      .select(`
        id,
        requester_id,
        status,
        created_at,
        updated_at,
        requester:profiles!requester_id(id, user_id, full_name, major, year, interests, skills, linkedin_url, twitter_url)
      `)
      .eq('recipient_id', userId)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching connection requests:', error.message);
      return { requests: null, error: error.message };
    }
    
    return { requests: data, error: null };
  } catch (error: any) {
    console.error('Unexpected error fetching connection requests:', error);
    return { 
      requests: null, 
      error: error.message || 'An unexpected error occurred' 
    };
  }
};

/**
 * Get active connections (accepted) for the user
 */
export const getConnections = async (userId: string) => {
  try {
    // Get connections where user is the requester
    const { data: sentConnections, error: sentError } = await supabase
      .from('connections')
      .select(`
        id,
        recipient_id,
        status,
        created_at,
        updated_at,
        recipient:profiles!recipient_id(id, user_id, full_name, major, year, interests, skills, linkedin_url, twitter_url)
      `)
      .eq('requester_id', userId)
      .eq('status', 'accepted');
    
    if (sentError) {
      console.error('Error fetching sent connections:', sentError.message);
      return { connections: null, error: sentError.message };
    }
    
    // Get connections where user is the recipient
    const { data: receivedConnections, error: receivedError } = await supabase
      .from('connections')
      .select(`
        id,
        requester_id,
        status,
        created_at,
        updated_at,
        requester:profiles!requester_id(id, user_id, full_name, major, year, interests, skills, linkedin_url, twitter_url)
      `)
      .eq('recipient_id', userId)
      .eq('status', 'accepted');
    
    if (receivedError) {
      console.error('Error fetching received connections:', receivedError.message);
      return { connections: null, error: receivedError.message };
    }
    
    // Format sent connections to have a unified format
    const formattedSentConnections = sentConnections.map(conn => ({
      id: conn.id,
      connection_id: conn.recipient?.user_id,
      full_name: conn.recipient?.full_name,
      major: conn.recipient?.major,
      year: conn.recipient?.year,
      interests: conn.recipient?.interests,
      skills: conn.recipient?.skills,
      linkedin_url: conn.recipient?.linkedin_url,
      twitter_url: conn.recipient?.twitter_url,
      created_at: conn.created_at
    }));
    
    // Format received connections to have a unified format
    const formattedReceivedConnections = receivedConnections.map(conn => ({
      id: conn.id,
      connection_id: conn.requester?.user_id,
      full_name: conn.requester?.full_name,
      major: conn.requester?.major,
      year: conn.requester?.year,
      interests: conn.requester?.interests,
      skills: conn.requester?.skills,
      linkedin_url: conn.requester?.linkedin_url,
      twitter_url: conn.requester?.twitter_url,
      created_at: conn.created_at
    }));
    
    // Combine both sets of connections
    const allConnections = [...formattedSentConnections, ...formattedReceivedConnections];
    
    return { connections: allConnections, error: null };
  } catch (error: any) {
    console.error('Unexpected error fetching connections:', error);
    return { 
      connections: null, 
      error: error.message || 'An unexpected error occurred' 
    };
  }
};

/**
 * Send a connection request to another user
 */
export const sendConnectionRequest = async (requesterId: string, recipientId: string) => {
  try {
    // Check if connection already exists
    const { data: existingConnection, error: checkError } = await supabase
      .from('connections')
      .select('*')
      .or(`and(requester_id.eq.${requesterId},recipient_id.eq.${recipientId}),and(requester_id.eq.${recipientId},recipient_id.eq.${requesterId})`)
      .maybeSingle();
    
    if (checkError) {
      console.error('Error checking existing connection:', checkError.message);
      return { 
        success: false, 
        error: checkError.message 
      };
    }
    
    // If connection already exists, return info about it
    if (existingConnection) {
      return { 
        success: false, 
        error: `Connection already exists with status: ${existingConnection.status}`,
        connectionStatus: existingConnection.status
      };
    }
    
    // Create new connection request
    const { data, error } = await supabase
      .from('connections')
      .insert([
        { 
          requester_id: requesterId, 
          recipient_id: recipientId,
          status: 'pending'
        }
      ])
      .select()
      .single();
    
    if (error) {
      console.error('Error sending connection request:', error.message);
      return { 
        success: false, 
        error: error.message 
      };
    }
    
    return { 
      success: true, 
      connection: data 
    };
  } catch (error: any) {
    console.error('Unexpected error sending connection request:', error);
    return { 
      success: false, 
      error: error.message || 'An unexpected error occurred' 
    };
  }
};

/**
 * Respond to a connection request (accept or reject)
 */
export const respondToConnectionRequest = async (connectionId: string, response: 'accepted' | 'rejected') => {
  try {
    const { data, error } = await supabase
      .from('connections')
      .update({ 
        status: response,
        updated_at: new Date().toISOString()
      })
      .eq('id', connectionId)
      .select()
      .single();
    
    if (error) {
      console.error(`Unexpected error ${response === 'accepted' ? 'accepting' : 'rejecting'} connection request:`, error);
      return { 
        success: false, 
        error: error.message || 'An unexpected error occurred' 
      };
    }
    
    return { 
      success: true, 
      connection: data 
    };
  } catch (error: any) {
    console.error(`Unexpected error ${response === 'accepted' ? 'accepting' : 'rejecting'} connection request:`, error);
    return { 
      success: false, 
      error: error.message || 'An unexpected error occurred' 
    };
  }
};