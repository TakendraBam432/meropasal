
import { lazy, Suspense } from "react";
import { useAuth } from "@/contexts/auth";
import { Loading } from "@/components/ui/loading";
import { useAdminStats } from "@/hooks/use-admin-stats";

// Lazy load the components for better performance
const StatsCards = lazy(() => import("@/components/admin/StatsCards"));
const UserManagement = lazy(() => import("@/components/admin/UserManagement"));
const ProductManagement = lazy(() => import("@/components/admin/ProductManagement"));

const AdminDashboard = () => {
  const { profile } = useAuth();
  const { data: stats = { totalUsers: 0, totalOrders: 0, totalProducts: 0 }, isLoading } = useAdminStats();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      {/* Stats Cards Section */}
      <Suspense fallback={<Loading size="md" />}>
        <StatsCards stats={stats} />
      </Suspense>
      
      {/* User Management Section - Only visible to super admins */}
      {profile?.is_super_admin && (
        <Suspense fallback={<Loading size="md" />}>
          <UserManagement />
        </Suspense>
      )}
      
      {/* Product Management Section - Visible to all admins */}
      {profile?.is_admin && (
        <Suspense fallback={<Loading size="md" />}>
          <ProductManagement />
        </Suspense>
      )}
    </div>
  );
};

export default AdminDashboard;
