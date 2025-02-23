
import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/AdminDashboard/AdminLayout";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { OrderStatus } from "@/types/orders";
import { OrdersTable } from "@/components/Orders/OrdersTable";
import { OrdersHeader } from "@/components/Orders/OrdersHeader";
import { generateCsv } from "@/components/Orders/utils";

interface Order {
  id: string;
  created_at: string;
  status: OrderStatus;
  total_amount: number;
  buyer_id: string;
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      const typedOrders: Order[] = (data || []).map(order => ({
        ...order,
        status: order.status as OrderStatus
      }));
      
      setOrders(typedOrders);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error fetching orders",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);

      if (error) throw error;

      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));

      toast({
        title: "Status updated",
        description: "Order status has been updated successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating status",
        description: error.message,
      });
    }
  };

  const handleExport = () => {
    const csv = generateCsv(orders);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "orders.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredOrders = orders.filter((order) =>
    order.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-4">
        <OrdersHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onExport={handleExport}
        />
        
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <OrdersTable
            orders={filteredOrders}
            onStatusChange={handleStatusChange}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default Orders;
