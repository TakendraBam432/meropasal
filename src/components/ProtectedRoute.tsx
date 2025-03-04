
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
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

  return isAuthorized ? <>{children}</> : null;
};
