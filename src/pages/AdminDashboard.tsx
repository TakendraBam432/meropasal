
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RefreshCw, UserPlus } from "lucide-react";

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
  const [emailInput, setEmailInput] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userIdToPromote, setUserIdToPromote] = useState<string | null>(null);

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
      setLoadingUsers(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, is_admin, is_super_admin');

      if (error) throw error;

      // Fetch emails from auth.users through a view or function (this would need server-side)
      // For now, we'll just display the user IDs
      setUsers(data as UserData[]);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        variant: "destructive",
        title: "Error fetching users",
        description: "There was an error fetching the user list."
      });
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleMakeAdmin = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_admin: true })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "User promoted",
        description: "User has been granted admin privileges"
      });
      
      fetchUsers();
    } catch (error) {
      console.error("Error promoting user:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update user permissions."
      });
    }
  };

  const handleMakeSuperAdmin = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_admin: true, is_super_admin: true })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "User promoted",
        description: "User has been granted super admin privileges"
      });
      
      fetchUsers();
    } catch (error) {
      console.error("Error promoting user:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update user permissions."
      });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
            <CardDescription>Number of registered users</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{stats.totalUsers}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Orders</CardTitle>
            <CardDescription>Number of orders placed</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{stats.totalOrders}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Products</CardTitle>
            <CardDescription>Number of products listed</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{stats.totalProducts}</p>
          </CardContent>
        </Card>
      </div>

      {profile?.is_super_admin && (
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage admin users</CardDescription>
              </div>
              <Button variant="outline" size="icon" onClick={fetchUsers}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">User ID</th>
                    <th className="text-left py-2">Name</th>
                    <th className="text-left py-2">Admin</th>
                    <th className="text-left py-2">Super Admin</th>
                    <th className="text-right py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingUsers ? (
                    <tr>
                      <td colSpan={5} className="text-center py-4">
                        <div className="flex justify-center">
                          <RefreshCw className="h-5 w-5 animate-spin" />
                        </div>
                      </td>
                    </tr>
                  ) : users.length > 0 ? (
                    users.map((user) => (
                      <tr key={user.id} className="border-b">
                        <td className="py-2 truncate max-w-[150px]">{user.id}</td>
                        <td className="py-2">{user.full_name || 'N/A'}</td>
                        <td className="py-2">{user.is_admin ? 'Yes' : 'No'}</td>
                        <td className="py-2">{user.is_super_admin ? 'Yes' : 'No'}</td>
                        <td className="py-2 text-right">
                          <div className="flex justify-end gap-2">
                            {!user.is_admin && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleMakeAdmin(user.id)}
                              >
                                Make Admin
                              </Button>
                            )}
                            {user.is_admin && !user.is_super_admin && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleMakeSuperAdmin(user.id)}
                              >
                                Make Super Admin
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center py-4">
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminDashboard;
