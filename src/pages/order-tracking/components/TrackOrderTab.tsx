
import React, { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import OrderDetailsCard from "./OrderDetailsCard";
import { Order } from "../types";
import { searchOrderById, searchOrderByTrackingNumber } from "../utils";

const TrackOrderTab = () => {
  const [orderId, setOrderId] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!orderId && !trackingNumber) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter either an order ID or tracking number",
      });
      return;
    }

    setLoading(true);
    try {
      let foundOrder: Order;

      if (orderId) {
        foundOrder = await searchOrderById(orderId);
      } else {
        foundOrder = await searchOrderByTrackingNumber(trackingNumber);
      }

      setOrder(foundOrder);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to find order",
      });
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Track Any Order</CardTitle>
          <CardDescription>
            Enter an order ID or tracking number to check the status of an order.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label htmlFor="orderId" className="block text-sm font-medium mb-1">
                Order ID
              </label>
              <Input
                id="orderId"
                placeholder="Enter order ID"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
              />
            </div>
            
            <div className="text-center font-medium text-gray-500">OR</div>
            
            <div>
              <label htmlFor="trackingNumber" className="block text-sm font-medium mb-1">
                Tracking Number
              </label>
              <Input
                id="trackingNumber"
                placeholder="Enter tracking number"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
              />
            </div>
            
            <div className="pt-2">
              <Button 
                onClick={handleSearch}
                disabled={loading}
                className="w-full"
              >
                {loading ? "Searching..." : "Track Order"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {order && (
        <OrderDetailsCard 
          order={order} 
          showSummary={true} 
          showContinueShopping={true} 
        />
      )}
    </>
  );
};

export default TrackOrderTab;
