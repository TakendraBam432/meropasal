
import { createContext, useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";
import { AuthContextType, UserProfile } from "./types";
import { getCachedUser, fetchUserProfile, cacheUserData } from "./utils";
import { setAsSuperAdmin, createAdmin } from "./adminUtils";

export const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
  setAsSuperAdmin: async () => {},
  createAdmin: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(getCachedUser()?.user || null);
  const [profile, setProfile] = useState<UserProfile | null>(getCachedUser()?.profile || null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch user profile with memoization to prevent unnecessary data fetching
  const fetchProfile = async (userId: string) => {
    try {
      const profileData = await fetchUserProfile(userId);
      setProfile(profileData);
      return profileData;
    } catch (error) {
      console.error("Error fetching profile:", error);
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;
    
    // Initial check for active session - optimized to avoid multiple fetches
    const initializeAuth = async () => {
      try {
        // Get cached session first for immediate UI update
        const cachedUser = getCachedUser();
        if (cachedUser?.user) {
          setUser(cachedUser.user);
          setProfile(cachedUser.profile);
        }
        
        // Then check for actual session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user && mounted) {
          setUser(session.user);
          
          // Only fetch profile if we don't have it or if user ID changed
          if (!profile || profile.id !== session.user.id) {
            const profileData = await fetchProfile(session.user.id);
            
            // Cache the user data if we got a valid profile
            if (profileData) {
              cacheUserData({ user: session.user, profile: profileData });
            }
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initializeAuth();

    // Subscribe to auth changes - improved with cleanup
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!mounted) return;
        
        setLoading(true);
        
        if (session?.user) {
          setUser(session.user);
          
          // Only fetch profile if needed
          if (!profile || profile.id !== session.user.id) {
            const profileData = await fetchProfile(session.user.id);
            
            if (profileData && mounted) {
              cacheUserData({ user: session.user, profile: profileData });
            }
          } else {
            setLoading(false);
          }
        } else {
          setUser(null);
          setProfile(null);
          localStorage.removeItem('userData');
          setLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const handleSetAsSuperAdmin = async (userId: string) => {
    try {
      await setAsSuperAdmin(userId);
      
      toast({
        title: "User promoted",
        description: "User has been granted super admin privileges",
      });
    } catch (error: any) {
      console.error("Error promoting user:", error.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update user permissions.",
      });
    }
  };

  const handleCreateAdmin = async (userId: string) => {
    try {
      await createAdmin(userId);
      
      toast({
        title: "User promoted",
        description: "User has been granted admin privileges",
      });
    } catch (error: any) {
      console.error("Error promoting user:", error.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update user permissions.",
      });
    }
  };

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    user, 
    profile, 
    loading, 
    signOut, 
    setAsSuperAdmin: handleSetAsSuperAdmin, 
    createAdmin: handleCreateAdmin
  }), [user, profile, loading]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
