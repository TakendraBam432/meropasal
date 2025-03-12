
import React from "react";
import { useAuth } from "@/contexts/auth";
import { useAdminStats } from "@/hooks/use-admin-stats";
import StatsCards from "@/components/admin/StatsCards";
import UserManagement from "@/components/admin/UserManagement";
import ProductManagement from "@/components/admin/ProductManagement";

const AdminDashboard = () => {
  const { profile } = useAuth();
  // Pre-populate with default data to avoid loading states
  const { data: stats = { totalUsers: 0, totalOrders: 0, totalProducts: 0 } } = useAdminStats();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      {/* Stats Cards Section - Always render with default values if needed */}
      <StatsCards stats={stats} />
      
      {/* User Management Section - Only visible to super admins */}
      {profile?.is_super_admin && (
        <UserManagement />
      )}
      
      {/* Product Management Section - Visible to all admins */}
      {profile?.is_admin && (
        <ProductManagement />
      )}
    </div>
  );
};

export default AdminDashboard;
