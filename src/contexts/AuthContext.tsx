
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";

interface UserProfile {
  is_admin: boolean;
  is_super_admin?: boolean;
  full_name?: string;
  avatar_url?: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  setAsSuperAdmin: (userId: string) => Promise<void>;
  createAdmin: (userId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
  setAsSuperAdmin: async () => {},
  createAdmin: async () => {},
});

// Helper function to get cached user data
const getCachedUser = () => {
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

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(getCachedUser()?.user || null);
  const [profile, setProfile] = useState<UserProfile | null>(getCachedUser()?.profile || null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Function to fetch user profile data
  const fetchUserProfile = async (userId: string) => {
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
  const cacheUserData = (userData: { user: User | null, profile: UserProfile | null }) => {
    localStorage.setItem('userData', JSON.stringify(userData));
  };

  useEffect(() => {
    // Initial check for active session
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setUser(session.user);
        
        // Fetch profile data
        const profileData = await fetchUserProfile(session.user.id);
        setProfile(profileData);
        
        // Cache the user data
        cacheUserData({ user: session.user, profile: profileData });
      }
      
      setLoading(false);
    };

    initializeAuth();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setLoading(true);
        
        if (session?.user) {
          setUser(session.user);
          
          // Fetch profile data on auth change
          const profileData = await fetchUserProfile(session.user.id);
          setProfile(profileData);
          
          // Cache the updated user data
          cacheUserData({ user: session.user, profile: profileData });
        } else {
          setUser(null);
          setProfile(null);
          localStorage.removeItem('userData');
        }
        
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      console.log("Signing out user...");
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      // Clear user data from state and localStorage
      setUser(null);
      setProfile(null);
      localStorage.removeItem('userData');
      
      // Navigate to auth page
      navigate("/auth");
      
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account",
      });
    } catch (error: any) {
      console.error("Error signing out:", error.message);
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: error.message,
      });
    }
  };

  const setAsSuperAdmin = async (userId: string) => {
    if (!profile?.is_admin) {
      toast({
        variant: "destructive",
        title: "Permission denied",
        description: "Only admin users can perform this action",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_admin: true, is_super_admin: true })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "User has been set as a super admin",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating user",
        description: error.message,
      });
    }
  };

  const createAdmin = async (userId: string) => {
    // Only super admins can create other admins
    if (!profile?.is_super_admin) {
      toast({
        variant: "destructive",
        title: "Permission denied",
        description: "Only super admin users can create other admins",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_admin: true })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "User has been set as an admin",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating user",
        description: error.message,
      });
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      loading, 
      signOut, 
      setAsSuperAdmin, 
      createAdmin 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
