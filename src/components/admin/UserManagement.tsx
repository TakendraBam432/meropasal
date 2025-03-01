
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

interface UserData {
  id: string;
  email: string;
  full_name: string | null;
  is_admin: boolean;
  is_super_admin: boolean;
}

interface UserManagementProps {
  initialUsers: UserData[];
}

const UserManagement = ({ initialUsers }: UserManagementProps) => {
  const [users, setUsers] = useState<UserData[]>(initialUsers);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
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
    <Card className="mb-8">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Manage admin users</CardDescription>
          </div>
          <Button variant="outline" size="icon" onClick={fetchUsers}>
            <RefreshCw className={`h-4 w-4 ${loadingUsers ? 'animate-spin' : ''}`} />
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
  );
};

export default UserManagement;
