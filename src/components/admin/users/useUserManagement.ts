
import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { UserData } from "./types";
import { createAdmin, setAsSuperAdmin } from "@/contexts/auth/adminUtils";

export function useUserManagement() {
  const [processingUserId, setProcessingUserId] = useState<string | null>(null);
  const { toast } = useToast();

  // Use React Query for better data fetching and caching
  const { 
    data: users = [], 
    isLoading: loadingUsers, 
    refetch 
  } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, is_admin, is_super_admin');

      if (error) throw error;

      return data.map(user => ({
        ...user,
        email: `User-${user.id.substring(0, 8)}`,
      })) as UserData[];
    },
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: false,
  });

  // Optimized handler with better loading states
  const handleMakeAdmin = async (userId: string) => {
    try {
      setProcessingUserId(userId);
      
      await createAdmin(userId);
      await refetch();

      toast({
        title: "User promoted",
        description: "User has been granted admin privileges"
      });
    } catch (error: any) {
      console.error("Error promoting user:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update user permissions."
      });
    } finally {
      setProcessingUserId(null);
    }
  };

  // Optimized super admin handler
  const handleMakeSuperAdmin = async (userId: string) => {
    try {
      setProcessingUserId(userId);
      
      await setAsSuperAdmin(userId);
      await refetch();

      toast({
        title: "User promoted",
        description: "User has been granted super admin privileges"
      });
    } catch (error: any) {
      console.error("Error promoting user:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update user permissions."
      });
    } finally {
      setProcessingUserId(null);
    }
  };

  return {
    users,
    loadingUsers,
    processingUserId,
    refetch,
    handleMakeAdmin,
    handleMakeSuperAdmin
  };
}
