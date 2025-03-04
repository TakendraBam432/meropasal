
import { useEffect, useState, useCallback, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth";
import StatsCards from "@/components/admin/StatsCards";
import UserManagement from "@/components/admin/UserManagement";
import ProductManagement from "@/components/admin/ProductManagement";
import { useToast } from "@/components/ui/use-toast";

interface UserData {
  id: string;
  email: string;
  full_name: string | null;
  is_admin: boolean;
  is_super_admin: boolean;
}

interface StatsData {
  totalUsers: number;
  totalOrders: number;
  totalProducts: number;
}

const AdminDashboard = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<StatsData>({
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0
  });
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(false);

  // Memoized fetch stats function
  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      
      // Use Promise.all for parallel requests
      const [usersData, ordersData, productsData] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('orders').select('id', { count: 'exact', head: true }),
        supabase.from('products').select('id', { count: 'exact', head: true })
      ]);

      setStats({
        totalUsers: usersData.count || 0,
        totalOrders: ordersData.count || 0,
        totalProducts: productsData.count || 0
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      toast({
        variant: "destructive",
        title: "Error loading stats",
        description: "Failed to load dashboard statistics."
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Memoized fetch users function
  const fetchUsers = useCallback(async () => {
    if (!profile?.is_super_admin) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, is_admin, is_super_admin');

      if (error) throw error;

      const usersWithEmail = data.map(user => ({
        ...user,
        email: `User-${user.id.substring(0, 8)}`,
      }));

      setUsers(usersWithEmail as UserData[]);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        variant: "destructive",
        title: "Error loading users",
        description: "Failed to load user data."
      });
    } finally {
      setLoading(false);
    }
  }, [profile, toast]);

  // Load data when component mounts and when profile changes
  useEffect(() => {
    if (profile) {
      fetchStats();
      if (profile.is_super_admin) {
        fetchUsers();
      }
    }
  }, [profile, fetchStats, fetchUsers]);

  // Memoize the user management component to prevent unnecessary re-renders
  const userManagementComponent = useMemo(() => {
    if (!profile?.is_super_admin) return null;
    return <UserManagement initialUsers={users} />;
  }, [profile?.is_super_admin, users]);

  // Memoize the product management component
  const productManagementComponent = useMemo(() => {
    if (!profile?.is_admin) return null;
    return <ProductManagement />;
  }, [profile?.is_admin]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      {/* Stats Cards Section */}
      <StatsCards stats={stats} />
      
      {/* User Management Section - Only visible to super admins */}
      {userManagementComponent}
      
      {/* Product Management Section - Visible to all admins */}
      {productManagementComponent}
    </div>
  );
};

export default AdminDashboard;
