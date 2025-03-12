
import { useEffect, useState, memo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { Loading } from "@/components/ui/loading";

export const ProtectedRoute = memo(({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/auth", { replace: true });
      } else {
        setIsAuthorized(true);
      }
    }
  }, [user, loading, navigate]);

  if (loading && isAuthorized === null) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading size="lg" />
      </div>
    );
  }

  return isAuthorized ? children : null;
});

ProtectedRoute.displayName = "ProtectedRoute";
