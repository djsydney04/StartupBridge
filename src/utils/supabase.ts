import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://goolmqemnjpyiluwxnkg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdvb2xtcWVtbmpweWlsdXd4bmtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0MTI2OTksImV4cCI6MjA1Njk4ODY5OX0.icxzNy6587kAiJHZ1GvONiqP320qnT6HYLZGUXd6u_g';

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
    
    // Check if this is a demo user
    const isDemo = DEMO_USERS.some(user => 
      user.email === email && user.password === password
    );
    
    // Only use demo login - Supabase email logins are disabled
    if (isDemo) {
      console.log('Using demo login');
      // Create a fake user for demo purposes
      const demoUser = {
        id: `demo-${Date.now()}`,
        email: email,
        last_sign_in_at: new Date().toISOString()
      };
      
      // Store in localStorage
      setAuthUser(demoUser);
      
      return { 
        success: true, 
        user: demoUser, 
        isDemo: true 
      };
    } else {
      // Return clear error message about demo accounts
      return {
        success: false,
        error: 'Email sign-in is available only for demo accounts. Please use mitic@chapman.edu with password123 or demo@example.com with password123'
      };
    }
    
    // Commented out actual Supabase auth since email logins are disabled
    /*
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
    
    return { 
      success: true, 
      user: data.user,
      isDemo: false
    };
    */
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
    
    // Then sign out from Supabase
    await supabase.auth.signOut();
    
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
    
    // If not in localStorage, check with Supabase
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error checking authentication:', error.message);
      return { authenticated: false };
    }
    
    if (data?.session?.user) {
      // Store the user in localStorage for next time
      setAuthUser(data.session.user);
      return { authenticated: true, user: data.session.user };
    }
    
    return { authenticated: false };
  } catch (error) {
    console.error('Unexpected error checking authentication:', error);
    return { authenticated: false };
  }
};

/**
 * Get the current user's profile
 */
export const getProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching profile:', error.message);
      return { profile: null, error: error.message };
    }
    
    return { profile: data, error: null };
  } catch (error: any) {
    console.error('Unexpected error fetching profile:', error);
    return { 
      profile: null, 
      error: error.message || 'An unexpected error occurred' 
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
 * Get the current user
 */
export const getCurrentUser = async () => {
  try {
    // First check localStorage
    const localUser = getAuthUser();
    if (localUser) {
      return { user: localUser, error: null };
    }
    
    // If not in localStorage, check with Supabase
    const { data, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Error getting current user:', error.message);
      return { user: null, error: error.message };
    }
    
    if (data?.user) {
      // Store the user in localStorage for next time
      setAuthUser(data.user);
      return { user: data.user, error: null };
    }
    
    return { user: null, error: 'No user found' };
  } catch (error: any) {
    console.error('Unexpected error getting current user:', error);
    return { user: null, error: error.message || 'An unexpected error occurred' };
  }
};

/**
 * Sign up a new user
 */
export const signUp = async (email: string, password: string, fullName?: string) => {
  try {
    // Register the user with Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName || '',
        },
      },
    });
    
    if (error) {
      console.error('Sign up error:', error.message);
      return { 
        data: null,
        error: error.message 
      };
    }
    
    return { 
      data: data,
      error: null
    };
  } catch (error: any) {
    console.error('Unexpected error during sign up:', error);
    return { 
      data: null,
      error: error.message || 'An unexpected error occurred' 
    };
  }
};

/**
 * Create a user profile
 */
export const createProfile = async (profileData: Partial<Profile>) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .insert([profileData])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating profile:', error.message);
      return { 
        success: false, 
        error: error.message 
      };
    }
    
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