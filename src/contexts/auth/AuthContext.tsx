
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";
import { AuthContextType, UserProfile } from "./types";
import { getCachedUser, fetchUserProfile, cacheUserData } from "./utils";
import { setUserAsSuperAdmin, createUserAsAdmin } from "./adminUtils";

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
    await setUserAsSuperAdmin(userId, profile, toast);
  };

  const createAdmin = async (userId: string) => {
    await createUserAsAdmin(userId, profile, toast);
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
