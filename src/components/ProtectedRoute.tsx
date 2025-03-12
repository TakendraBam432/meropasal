
import { useEffect, useState, memo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";

export const ProtectedRoute = memo(({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    // Optimize authorization check to be more responsive
    if (!loading) {
      if (!user) {
        // Redirect immediately if no user
        navigate("/auth", { replace: true });
      } else {
        setIsAuthorized(true);
      }
    }
  }, [user, loading, navigate]);

  // Skip rendering completely during loading to improve performance
  if (loading && isAuthorized === null) {
    return null;
  }

  // Return children directly when authorized
  return isAuthorized ? children : null;
});

ProtectedRoute.displayName = "ProtectedRoute";
