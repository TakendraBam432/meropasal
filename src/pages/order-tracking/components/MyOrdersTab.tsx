
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth";
import OrderList from "./OrderList";
import OrderDetailsCard from "./OrderDetailsCard";
import { Order } from "../types";
import { fetchUserOrders } from "../utils";

const MyOrdersTab = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadUserOrders();
    }
  }, [user]);

  const loadUserOrders = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const orders = await fetchUserOrders(user.id);
      setUserOrders(orders);
      
      // If there are orders, automatically select the first one
      if (orders.length > 0) {
        setSelectedOrder(orders[0]);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to fetch your orders",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOrder = (order: Order) => {
    setSelectedOrder(order);
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-lg mb-4">Please sign in to view your orders</p>
          <Button onClick={() => navigate("/auth")}>
            Sign In
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (userOrders.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-lg">You don't have any orders yet.</p>
          <Button onClick={() => navigate("/")} className="mt-4">
            Start Shopping
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg font-medium mb-2">Your Recent Orders</h3>
          <OrderList 
            orders={userOrders} 
            selectedOrderId={selectedOrder?.id || null}
            onSelectOrder={handleSelectOrder} 
          />
        </div>
        
        <div>
          {selectedOrder && <OrderDetailsCard order={selectedOrder} />}
        </div>
      </div>
    </div>
  );
};

export default MyOrdersTab;
