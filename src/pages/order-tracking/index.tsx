
import React, { useState } from "react";
import NavBar from "@/components/NavBar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MyOrdersTab from "./components/MyOrdersTab";
import TrackOrderTab from "./components/TrackOrderTab";

const OrderTracking = () => {
  const [activeTab, setActiveTab] = useState<string>("myOrders");

  return (
    <div>
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Order Tracking</h1>
        
        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="myOrders">My Orders</TabsTrigger>
            <TabsTrigger value="tracking">Track an Order</TabsTrigger>
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
  );
};

export default OrderTracking;
