
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { UserData } from "./types";
import { Loading } from "@/components/ui/loading";
import { useToast } from "@/components/ui/use-toast";
import { UserTable } from "./UserTable";

export const UserManagementCard = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("id, email:auth.users(email), full_name, is_admin, is_super_admin")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Transform data to match UserData interface
      const formattedUsers: UserData[] = data.map((user: any) => ({
        id: user.id,
        email: user.email?.[0]?.email || "No email",
        full_name: user.full_name,
        is_admin: user.is_admin,
        is_super_admin: user.is_super_admin,
      }));

      setUsers(formattedUsers);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error fetching users",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleUserRole = async (userId: string, role: "admin" | "super_admin", value: boolean) => {
    try {
      const updateData = role === "admin" 
        ? { is_admin: value } 
        : { is_super_admin: value };
        
      const { error } = await supabase
        .from("profiles")
        .update(updateData)
        .eq("id", userId);

      if (error) throw error;

      // Refresh user list
      fetchUsers();
      
      toast({
        title: "User updated",
        description: `User role updated successfully.`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating user",
        description: error.message,
      });
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      // Delete the user from the auth.users table
      // Note: This requires admin privileges
      const { error } = await supabase.auth.admin.deleteUser(userId);
      
      if (error) throw error;
      
      // Refresh user list
      fetchUsers();
      
      toast({
        title: "User deleted",
        description: "User deleted successfully.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error deleting user",
        description: "Only super admins can delete users.",
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>User Management</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loading size="lg" />
          </div>
        ) : (
          <UserTable 
            users={users} 
            onToggleAdmin={(userId, value) => toggleUserRole(userId, "admin", value)}
            onToggleSuperAdmin={(userId, value) => toggleUserRole(userId, "super_admin", value)}
            onDeleteUser={deleteUser}
          />
        )}
      </CardContent>
    </Card>
  );
};
