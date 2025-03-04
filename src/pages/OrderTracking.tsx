
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Package, Truck, CheckCircle, Search } from "lucide-react";
import NavBar from "@/components/NavBar";
import { useAuth } from "@/contexts/auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

interface Order {
  id: string;
  created_at: string;
  status: OrderStatus;
  total_amount: number;
  tracking_number: string | null;
  estimated_delivery: string | null;
  shipping_address: {
    fullName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

const statusColors: Record<OrderStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const statusIcons = {
  pending: null,
  processing: <Package className="h-5 w-5" />,
  shipped: <Truck className="h-5 w-5" />,
  delivered: <CheckCircle className="h-5 w-5" />,
  cancelled: null,
};

const OrderTracking = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orderId, setOrderId] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("myOrders");
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchUserOrders();
    }
  }, [user]);

  const fetchUserOrders = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("buyer_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      // Transform the data to match the Order interface
      const transformedOrders = data.map(order => ({
        ...order,
        shipping_address: order.shipping_address as Order["shipping_address"]
      }));
      
      setUserOrders(transformedOrders);
      
      // If there are orders, automatically select the first one
      if (transformedOrders.length > 0) {
        setOrder(transformedOrders[0]);
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
      let query = supabase.from("orders").select("*");

      if (orderId) {
        if (orderId.length < 8) {
          throw new Error("Order ID must be at least 8 characters");
        }
        query = query.ilike("id", `${orderId}%`);
      } else if (trackingNumber) {
        query = query.eq("tracking_number", trackingNumber);
      }

      const { data, error } = await query.single();

      if (error) throw error;
      
      // Transform the data to match the Order interface
      setOrder({
        ...data,
        shipping_address: data.shipping_address as Order["shipping_address"]
      });
      
      // Switch to tracking tab if coming from search
      setActiveTab("tracking");
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

  const handleSelectOrder = (selectedOrder: Order) => {
    setOrder(selectedOrder);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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
            {user ? (
              <>
                {loading && (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                )}
                
                {!loading && userOrders.length === 0 && (
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <p className="text-lg">You don't have any orders yet.</p>
                      <Button onClick={() => navigate("/")} className="mt-4">
                        Start Shopping
                      </Button>
                    </CardContent>
                  </Card>
                )}
                
                {!loading && userOrders.length > 0 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-lg font-medium mb-2">Your Recent Orders</h3>
                        <div className="space-y-2 pr-4 max-h-[400px] overflow-y-auto">
                          {userOrders.map(userOrder => (
                            <Card 
                              key={userOrder.id}
                              className={`cursor-pointer hover:border-primary transition-colors ${
                                userOrder.id === order?.id ? "border-primary" : ""
                              }`}
                              onClick={() => handleSelectOrder(userOrder)}
                            >
                              <CardContent className="p-4">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <p className="font-medium">Order #{userOrder.id.slice(0, 8)}</p>
                                    <p className="text-sm text-gray-500">{formatDate(userOrder.created_at)}</p>
                                  </div>
                                  <Badge className={statusColors[userOrder.status]}>
                                    {userOrder.status.charAt(0).toUpperCase() + userOrder.status.slice(1)}
                                  </Badge>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        {order && (
                          <Card>
                            <CardHeader>
                              <div className="flex justify-between items-start">
                                <div>
                                  <CardTitle>Order #{order.id.slice(0, 8)}</CardTitle>
                                  <CardDescription>
                                    Placed on {formatDate(order.created_at)}
                                  </CardDescription>
                                </div>
                                <Badge className={statusColors[order.status]}>
                                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent>
                              {/* Order Status Timeline */}
                              <div className="relative mb-6">
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-200 rounded-full"></div>
                                <div className="space-y-8 pl-6">
                                  <div className="relative">
                                    <div className={`absolute left-0 -translate-x-1/2 w-4 h-4 rounded-full ${order.status !== 'pending' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                    <h3 className="font-medium">Order Placed</h3>
                                    <p className="text-sm text-gray-500">{formatDate(order.created_at)}</p>
                                  </div>
                                  
                                  <div className="relative">
                                    <div className={`absolute left-0 -translate-x-1/2 w-4 h-4 rounded-full ${['processing', 'shipped', 'delivered'].includes(order.status) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                    <h3 className="font-medium">Processing</h3>
                                    <p className="text-sm text-gray-500">Your order is being prepared</p>
                                  </div>
                                  
                                  <div className="relative">
                                    <div className={`absolute left-0 -translate-x-1/2 w-4 h-4 rounded-full ${['shipped', 'delivered'].includes(order.status) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                    <h3 className="font-medium">Shipped</h3>
                                    {order.tracking_number && (
                                      <p className="text-sm text-gray-500">
                                        Tracking #: {order.tracking_number}
                                      </p>
                                    )}
                                  </div>
                                  
                                  <div className="relative">
                                    <div className={`absolute left-0 -translate-x-1/2 w-4 h-4 rounded-full ${order.status === 'delivered' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                    <h3 className="font-medium">Delivered</h3>
                                    {order.estimated_delivery && order.status !== 'delivered' && (
                                      <p className="text-sm text-gray-500">
                                        Est. delivery: {formatDate(order.estimated_delivery)}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                              
                              <div>
                                <h3 className="font-medium mb-2">Shipping Address</h3>
                                <div className="text-sm text-gray-600">
                                  <p>{order.shipping_address.fullName}</p>
                                  <p>{order.shipping_address.address}</p>
                                  <p>
                                    {order.shipping_address.city}, {order.shipping_address.state}{" "}
                                    {order.shipping_address.zipCode}
                                  </p>
                                  <p>{order.shipping_address.country}</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-lg mb-4">Please sign in to view your orders</p>
                  <Button onClick={() => navigate("/auth")}>
                    Sign In
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="tracking">
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
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>Order #{order.id.slice(0, 8)}</CardTitle>
                      <CardDescription>
                        Placed on {formatDate(order.created_at)}
                      </CardDescription>
                    </div>
                    <Badge className={statusColors[order.status]}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Order Status Timeline */}
                    <div className="relative">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-200 rounded-full"></div>
                      <div className="space-y-8 pl-6">
                        <div className="relative">
                          <div className={`absolute left-0 -translate-x-1/2 w-4 h-4 rounded-full ${order.status !== 'pending' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                          <h3 className="font-medium">Order Placed</h3>
                          <p className="text-sm text-gray-500">{formatDate(order.created_at)}</p>
                        </div>
                        
                        <div className="relative">
                          <div className={`absolute left-0 -translate-x-1/2 w-4 h-4 rounded-full ${['processing', 'shipped', 'delivered'].includes(order.status) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                          <h3 className="font-medium">Processing</h3>
                          <p className="text-sm text-gray-500">Your order is being prepared</p>
                        </div>
                        
                        <div className="relative">
                          <div className={`absolute left-0 -translate-x-1/2 w-4 h-4 rounded-full ${['shipped', 'delivered'].includes(order.status) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                          <h3 className="font-medium">Shipped</h3>
                          {order.tracking_number && (
                            <p className="text-sm text-gray-500">
                              Tracking #: {order.tracking_number}
                            </p>
                          )}
                        </div>
                        
                        <div className="relative">
                          <div className={`absolute left-0 -translate-x-1/2 w-4 h-4 rounded-full ${order.status === 'delivered' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                          <h3 className="font-medium">Delivered</h3>
                          {order.estimated_delivery && order.status !== 'delivered' && (
                            <p className="text-sm text-gray-500">
                              Est. delivery: {formatDate(order.estimated_delivery)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-medium mb-2">Shipping Address</h3>
                        <div className="text-sm text-gray-600">
                          <p>{order.shipping_address.fullName}</p>
                          <p>{order.shipping_address.address}</p>
                          <p>
                            {order.shipping_address.city}, {order.shipping_address.state}{" "}
                            {order.shipping_address.zipCode}
                          </p>
                          <p>{order.shipping_address.country}</p>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium mb-2">Order Summary</h3>
                        <div className="text-sm text-gray-600">
                          <p>Total Amount: ${order.total_amount.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <Button 
                        variant="outline" 
                        onClick={() => navigate("/")}
                      >
                        Continue Shopping
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default OrderTracking;
