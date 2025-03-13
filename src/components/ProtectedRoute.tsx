
import { useEffect, useState, memo, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { Loading } from "@/components/ui/loading";

export const ProtectedRoute = memo(({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  
  // Use faster debounced loading detection with shorter timeout
  useEffect(() => {
    let timeoutId: number | undefined;
    
    if (!loading) {
      if (!user) {
        // Navigate immediately to auth
        navigate("/auth", { replace: true });
      } else {
        setIsAuthorized(true);
      }
    } else if (isAuthorized === null) {
      // Shorter timeout (50ms instead of 100ms) for faster loading detection
      timeoutId = window.setTimeout(() => {
        if (loading) setIsAuthorized(null);
      }, 50);
    }
    
    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [user, loading, navigate, isAuthorized]);

  // Memoize the loading UI to prevent unnecessary rerenders
  const loadingUI = useMemo(() => (
    <div className="flex justify-center items-center h-screen">
      <Loading size="lg" />
    </div>
  ), []);

  if (loading && isAuthorized === null) {
    return loadingUI;
  }

  return isAuthorized ? children : null;
});

ProtectedRoute.displayName = "ProtectedRoute";
