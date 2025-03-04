
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { useToast } from "@/components/ui/use-toast";

export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    // Only check authorization when we have all the data
    if (!loading) {
      if (!user || !profile?.is_admin) {
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "You don't have permission to access this area",
        });
        navigate("/", { replace: true });
      } else {
        setIsAuthorized(true);
      }
    }
  }, [user, profile, loading, navigate, toast]);

  // Show loading state only on initial load, not during transitions
  if (loading && isAuthorized === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return isAuthorized ? <>{children}</> : null;
};
