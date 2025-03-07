
import React, { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import OrderDetailsCard from "./OrderDetailsCard";
import { Order } from "../types";
import { searchOrderById, searchOrderByTrackingNumber } from "../utils";
import { RefreshCw, Search, HistoryIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TrackOrderTab = () => {
  const [orderId, setOrderId] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const saved = localStorage.getItem("recentOrderSearches");
    return saved ? JSON.parse(saved) : [];
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  const saveSearch = (searchTerm: string) => {
    if (!searchTerm) return;

    const updatedSearches = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 5);
    setRecentSearches(updatedSearches);
    localStorage.setItem("recentOrderSearches", JSON.stringify(updatedSearches));
  };

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
      let searchTerm = orderId || trackingNumber;

      if (orderId) {
        foundOrder = await searchOrderById(orderId);
        saveSearch(`Order #${orderId}`);
      } else {
        foundOrder = await searchOrderByTrackingNumber(trackingNumber);
        saveSearch(`Tracking #${trackingNumber}`);
      }

      setOrder(foundOrder);
      toast({
        title: "Order found",
        description: `Found order #${foundOrder.id.slice(0, 8)}`,
      });
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

  const handleSelectRecentSearch = (searchTerm: string) => {
    if (searchTerm.startsWith("Order #")) {
      setOrderId(searchTerm.replace("Order #", ""));
      setTrackingNumber("");
    } else if (searchTerm.startsWith("Tracking #")) {
      setTrackingNumber(searchTerm.replace("Tracking #", ""));
      setOrderId("");
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
              <div className="flex gap-2">
                <Input
                  id="orderId"
                  placeholder="Enter order ID"
                  value={orderId}
                  onChange={(e) => {
                    setOrderId(e.target.value);
                    setTrackingNumber(""); // Clear tracking when order ID is entered
                  }}
                />
              </div>
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
                onChange={(e) => {
                  setTrackingNumber(e.target.value);
                  setOrderId(""); // Clear order ID when tracking is entered
                }}
              />
            </div>
            
            <div className="pt-2">
              <Button 
                onClick={handleSearch}
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Track Order
                  </>
                )}
              </Button>
            </div>
            
            {recentSearches.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2 flex items-center">
                  <HistoryIcon className="h-4 w-4 mr-1" />
                  Recent Searches
                </h3>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((search, index) => (
                    <Button 
                      key={index} 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleSelectRecentSearch(search)}
                    >
                      {search}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-gray-500">
            Already have an account? <Button variant="link" className="p-0 h-auto" onClick={() => navigate("/auth")}>Sign in</Button> to view all your orders.
          </p>
        </CardFooter>
      </Card>
      
      {order && (
        <OrderDetailsCard 
          order={order} 
          showSummary={true} 
          showContinueShopping={true}
          showBackButton={false}
        />
      )}
    </>
  );
};

export default TrackOrderTab;
