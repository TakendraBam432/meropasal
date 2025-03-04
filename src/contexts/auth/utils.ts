
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { UserProfile } from "./types";

// Helper function to get cached user data
export const getCachedUser = () => {
  const cachedUserData = localStorage.getItem('userData');
  if (cachedUserData) {
    try {
      return JSON.parse(cachedUserData);
    } catch (error) {
      console.error('Error parsing cached user data:', error);
      localStorage.removeItem('userData');
    }
  }
  return null;
};

// Function to fetch user profile data
export const fetchUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      throw error;
    }
    
    return data as UserProfile;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

// Function to cache user data
export const cacheUserData = (userData: { user: User | null, profile: UserProfile | null }) => {
  localStorage.setItem('userData', JSON.stringify(userData));
};
