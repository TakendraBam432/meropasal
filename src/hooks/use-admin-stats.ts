
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export interface AdminStats {
  totalUsers: number;
  totalOrders: number;
  totalProducts: number;
}

export function useAdminStats() {
  const fetchStats = useCallback(async (): Promise<AdminStats> => {
    // Use Promise.all for parallel requests for faster data fetching
    const [usersData, ordersData, productsData] = await Promise.all([
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase.from('orders').select('id', { count: 'exact', head: true }),
      supabase.from('products').select('id', { count: 'exact', head: true })
    ]);

    return {
      totalUsers: usersData.count || 0,
      totalOrders: ordersData.count || 0,
      totalProducts: productsData.count || 0
    };
  }, []);

  return useQuery({
    queryKey: ['adminStats'],
    queryFn: fetchStats,
    staleTime: 5 * 60 * 1000, // 5 minutes to reduce unnecessary refetches
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: 1
  });
}
