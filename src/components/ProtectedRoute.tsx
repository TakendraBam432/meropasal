
import { useEffect, useState, memo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

export const ProtectedRoute = memo(({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    // Only redirect if we're done loading and there's no user
    if (!loading) {
      if (!user) {
        navigate("/auth", { replace: true });
      } else {
        setIsAuthorized(true);
      }
    }
  }, [user, loading, navigate]);

  // Show loading state only on initial load, not during transitions
  if (loading && isAuthorized === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not authorized but not redirected yet
  if (!isAuthorized && !loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <h2 className="text-2xl font-semibold mb-4">Authentication Required</h2>
        <p className="text-gray-600 mb-6">Please sign in to access this page</p>
        <Button onClick={() => navigate("/auth")} size="lg">
          <LogIn className="mr-2 h-5 w-5" />
          Sign In
        </Button>
      </div>
    );
  }

  return isAuthorized ? <>{children}</> : null;
});

ProtectedRoute.displayName = "ProtectedRoute";
