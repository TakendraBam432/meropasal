
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { useToast } from "@/components/ui/use-toast";

export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && (!user || !profile?.is_admin)) {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "You don't have permission to access this area",
      });
      navigate("/");
    }
  }, [user, profile, loading, navigate, toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (user && profile?.is_admin) ? <>{children}</> : null;
};
