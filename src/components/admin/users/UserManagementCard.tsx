
import { useState, useCallback, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { UserData } from "./types";
import { Loading } from "@/components/ui/loading";
import { useToast } from "@/components/ui/use-toast";
import { UserTable } from "./UserTable";

export const UserManagementCard = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Optimize React Query settings for faster data loading
  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, email:auth.users(email), full_name, is_admin, is_super_admin")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Transform data to match UserData interface
      return data.map((user: any) => ({
        id: user.id,
        email: user.email?.[0]?.email || "No email",
        full_name: user.full_name,
        is_admin: user.is_admin,
        is_super_admin: user.is_super_admin,
      }));
    },
    // Optimize with improved caching settings
    staleTime: 1000 * 60 * 2, // 2 minutes cache (reduced from 5)
    gcTime: 1000 * 60 * 5,   // 5 minutes garbage collection (reduced from 10)
    retry: 1,
    refetchOnMount: true,
    refetchOnReconnect: false,
  });

  // Memoize role toggle mutation to prevent unnecessary recreations
  const toggleRoleMutation = useMutation({
    mutationFn: async ({ userId, role, value }: { userId: string, role: "admin" | "super_admin", value: boolean }) => {
      const updateData = role === "admin" 
        ? { is_admin: value } 
        : { is_super_admin: value };
        
      const { error } = await supabase
        .from("profiles")
        .update(updateData)
        .eq("id", userId);

      if (error) throw error;
      return { userId, role, value };
    },
    onSuccess: () => {
      toast({
        title: "User updated",
        description: "User role updated successfully.",
      });
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error updating user",
        description: error.message,
      });
    }
  });

  // Memoize delete user mutation to prevent unnecessary recreations
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase.auth.admin.deleteUser(userId);
      if (error) throw error;
      return userId;
    },
    onSuccess: () => {
      toast({
        title: "User deleted",
        description: "User deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error deleting user",
        description: "Only super admins can delete users.",
      });
    }
  });

  // Use useCallback for handler functions to prevent recreations
  const handleToggleAdmin = useCallback((userId: string, value: boolean) => {
    toggleRoleMutation.mutate({ userId, role: "admin", value });
  }, [toggleRoleMutation]);

  const handleToggleSuperAdmin = useCallback((userId: string, value: boolean) => {
    toggleRoleMutation.mutate({ userId, role: "super_admin", value });
  }, [toggleRoleMutation]);

  const handleDeleteUser = useCallback((userId: string) => {
    deleteUserMutation.mutate(userId);
  }, [deleteUserMutation]);

  // Memoized error state UI
  const errorUI = useMemo(() => (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>User Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-red-500">Error loading users. Please try again.</div>
      </CardContent>
    </Card>
  ), []);

  if (error) {
    return errorUI;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>User Management</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading || toggleRoleMutation.isPending || deleteUserMutation.isPending ? (
          <div className="flex justify-center py-10">
            <Loading size="lg" />
          </div>
        ) : (
          <UserTable 
            users={users} 
            onToggleAdmin={handleToggleAdmin}
            onToggleSuperAdmin={handleToggleSuperAdmin}
            onDeleteUser={handleDeleteUser}
          />
        )}
      </CardContent>
    </Card>
  );
};
