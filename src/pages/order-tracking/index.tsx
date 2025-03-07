
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import NavBar from "@/components/NavBar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MyOrdersTab from "./components/MyOrdersTab";
import TrackOrderTab from "./components/TrackOrderTab";
import { Package, User } from "lucide-react";

const OrderTracking = () => {
  const [activeTab, setActiveTab] = useState<string>("myOrders");
  const location = useLocation();

  // Parse URL query parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get("tab");
    const orderId = searchParams.get("orderId");
    const trackingNumber = searchParams.get("trackingNumber");
    
    // Set active tab based on URL parameters
    if (tab === "tracking" || orderId || trackingNumber) {
      setActiveTab("tracking");
    } else {
      setActiveTab("myOrders");
    }
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-6">Order Tracking & History</h1>
          
          <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="myOrders" className="flex items-center justify-center">
                <User className="h-4 w-4 mr-2" />
                <span>My Orders</span>
              </TabsTrigger>
              <TabsTrigger value="tracking" className="flex items-center justify-center">
                <Package className="h-4 w-4 mr-2" />
                <span>Track an Order</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="myOrders">
              <MyOrdersTab />
            </TabsContent>
            
            <TabsContent value="tracking">
              <TrackOrderTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Simple Footer */}
      <div className="border-t bg-white py-4">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-gray-500">
            Questions about your order? Contact our customer support team at help@meropasal.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
