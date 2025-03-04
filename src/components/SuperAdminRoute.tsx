
import { useEffect, useState, memo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { useToast } from "@/components/ui/use-toast";

export const SuperAdminRoute = memo(({ children }: { children: React.ReactNode }) => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    if (!loading) {
      if (!user || !profile?.is_super_admin) {
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "Super Admin access required",
        });
        navigate("/", { replace: true });
      } else {
        setIsAuthorized(true);
      }
    }
  }, [user, profile, loading, navigate, toast]);

  // Only show loading state on initial load
  if (loading && isAuthorized === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return isAuthorized ? <>{children}</> : null;
});

SuperAdminRoute.displayName = "SuperAdminRoute";
