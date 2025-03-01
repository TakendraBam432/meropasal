
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import StatsCards from "@/components/admin/StatsCards";
import UserManagement from "@/components/admin/UserManagement";
import ProductManagement from "@/components/admin/ProductManagement";

interface UserData {
  id: string;
  email: string;
  full_name: string | null;
  is_admin: boolean;
  is_super_admin: boolean;
}

const AdminDashboard = () => {
  const { profile } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0
  });
  const [users, setUsers] = useState<UserData[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      const [usersData, ordersData, productsData] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact' }),
        supabase.from('orders').select('id', { count: 'exact' }),
        supabase.from('products').select('id', { count: 'exact' })
      ]);

      setStats({
        totalUsers: usersData.count || 0,
        totalOrders: ordersData.count || 0,
        totalProducts: productsData.count || 0
      });
    };

    fetchStats();
  }, []);

  useEffect(() => {
    if (profile?.is_super_admin) {
      fetchUsers();
    }
  }, [profile]);

  const fetchUsers = async () => {
    try {
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
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      {/* Stats Cards Section */}
      <StatsCards stats={stats} />
      
      {/* User Management Section - Only visible to super admins */}
      {profile?.is_super_admin && (
        <UserManagement initialUsers={users} />
      )}
      
      {/* Product Management Section - Visible to all admins */}
      {profile?.is_admin && (
        <ProductManagement />
      )}
    </div>
  );
};

export default AdminDashboard;
