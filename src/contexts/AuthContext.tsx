
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
  isAdmin: false,
});

// Try to get the cached session from localStorage
const getCachedSession = () => {
  try {
    const cachedSession = localStorage.getItem('supabase.auth.token');
    return cachedSession ? JSON.parse(cachedSession) : null;
  } catch (error) {
    console.error('Error reading cached session:', error);
    return null;
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const cachedSession = getCachedSession();
    return cachedSession?.currentSession?.user ?? null;
  });
  const [loading, setLoading] = useState(!getCachedSession());
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Get the current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (mounted) {
          if (session?.user) {
            setUser(session.user);
            await checkAdminStatus(session.user.id);
          }
        }

        // Set up session change listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (mounted) {
              setUser(session?.user ?? null);
              if (session?.user) {
                await checkAdminStatus(session.user.id);
              } else {
                setIsAdmin(false);
              }

              if (event === 'SIGNED_OUT') {
                localStorage.removeItem('supabase.auth.token');
                navigate('/auth');
              }
            }
          }
        );

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Cleanup function
    return () => {
      mounted = false;
    };
  }, [navigate]);

  const checkAdminStatus = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
        return;
      }

      setIsAdmin(!!data?.is_admin);
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setIsAdmin(false);
      localStorage.removeItem('supabase.auth.token');
      navigate("/auth");
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: error.message,
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut, isAdmin }}>
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
