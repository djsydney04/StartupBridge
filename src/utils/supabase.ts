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
  // New fields for enhanced profile
  roles?: {
    cofounder: boolean;
    talent: boolean;
    job: boolean;
    resources: boolean;
  };
  founder_looking_for?: string;
  startup_name?: string;
  startup_idea?: string;
  roles_looking_for?: string;
  skills_bringing?: string;
  startup_stage?: string;
  interested_roles?: string[];
  experience?: string;
  industries_interest?: string;
  commitment_type?: string;
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

/**
 * Update a user profile
 */
export const updateProfile = async (userId: string, profileData: Partial<Profile>) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating profile:', error.message);
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
    console.error('Unexpected error updating profile:', error);
    return { 
      success: false, 
      error: error.message || 'An unexpected error occurred' 
    };
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
      console.error(`Error ${response === 'accepted' ? 'accepting' : 'rejecting'} connection request:`, error.message);
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
    console.error(`Unexpected error ${response === 'accepted' ? 'accepting' : 'rejecting'} connection request:`, error);
    return { 
      success: false, 
      error: error.message || 'An unexpected error occurred' 
    };
  }
}; 