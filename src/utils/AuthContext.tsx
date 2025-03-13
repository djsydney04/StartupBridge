'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { supabase, signIn, signOut, isAuthenticated, getProfile, getAuthUser, updateProfile, User, Profile } from './supabase';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: any }>;
  signOut: () => Promise<{ success: boolean; error?: any }>;
  updateProfile: (profileData: Partial<Profile>) => Promise<{ success: boolean; profile?: Profile; error?: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const isDemo = router.query.demo === 'true';
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check active session and fetch user profile
    const checkUser = async () => {
      try {
        setIsLoading(true);
        
        // Handle demo mode
        if (isDemo) {
          console.log('Demo mode detected, creating demo user');
          const result = await signIn('demo@example.com', 'password123');
          
          if (result.success && result.user && result.profile) {
            setUser(result.user);
            setProfile(result.profile);
          }
          
          setIsLoading(false);
          return;
        }
        
        // Check if the user is authenticated
        const { authenticated, user: authUser } = await isAuthenticated();
        
        if (!authenticated || !authUser) {
          // Not authenticated, clear state
          setUser(null);
          setProfile(null);
          setIsLoading(false);
          return;
        }
        
        // Set the user
        setUser({
          id: authUser.id,
          email: authUser.email || '',
        });
        
        // Fetch user profile
        if (authUser.id) {
          const { profile: userProfile } = await getProfile(authUser.id);
          setProfile(userProfile);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error checking authentication:', error);
        setUser(null);
        setProfile(null);
        setIsLoading(false);
      }
    };
    
    // Only run when router is ready
    if (router.isReady) {
      checkUser();
    }
  }, [isDemo, router.isReady]);
  
  const handleSignIn = async (email: string, password: string) => {
    try {
      const result = await signIn(email, password);
      
      if (result.success && result.user) {
        setUser({
          id: result.user.id,
          email: result.user.email || '',
        });
        
        // Fetch user profile
        if (result.user.id) {
          const { profile: userProfile } = await getProfile(result.user.id);
          setProfile(userProfile);
        }
        
        return { success: true };
      }
      
      return { success: false, error: result.error };
    } catch (error: any) {
      console.error('Error during sign in:', error);
      return { success: false, error: error.message };
    }
  };
  
  const handleSignOut = async () => {
    try {
      const result = await signOut();
      
      if (result.success) {
        setUser(null);
        setProfile(null);
        router.push('/auth/signin');
      }
      
      return result;
    } catch (error: any) {
      console.error('Error during sign out:', error);
      return { success: false, error: error.message };
    }
  };
  
  const handleUpdateProfile = async (profileData: Partial<Profile>) => {
    try {
      if (!user?.id) {
        return { success: false, error: 'User not authenticated' };
      }
      
      const result = await updateProfile(user.id, profileData);
      
      if (result.success && result.profile) {
        setProfile(result.profile);
      }
      
      return result;
    } catch (error: any) {
      console.error('Error updating profile:', error);
      return { success: false, error: error.message };
    }
  };
  
  const value = {
    user,
    profile,
    isLoading,
    signIn: handleSignIn,
    signOut: handleSignOut,
    updateProfile: handleUpdateProfile,
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
} 