
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

  // Show loading state only briefly on initial load
  if (loading && isAuthorized === null) {
    return null; // Return nothing during initial load to prevent flashing
  }

  // If not authorized but not redirected yet
  if (!isAuthorized && !loading) {
    // Don't show anything, just redirect
    return null;
  }

  return isAuthorized ? <>{children}</> : null;
});

ProtectedRoute.displayName = "ProtectedRoute";
