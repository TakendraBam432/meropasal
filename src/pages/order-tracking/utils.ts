
import { supabase } from "@/integrations/supabase/client";
import { Order, OrderItem, PackageDetails, ShipmentUpdate } from "./types";

export const fetchUserOrders = async (userId: string): Promise<Order[]> => {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("buyer_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  
  // Transform the data to match the Order interface
  return data.map(order => ({
    ...order,
    shipping_address: order.shipping_address as Order["shipping_address"],
    items: mockOrderItems(order.id),
    package_details: mockPackageDetails(order.id),
    shipment_updates: mockShipmentUpdates(order.id, order.status),
    can_modify_address: canModifyAddress(order.status)
  }));
};

export const searchOrderById = async (orderId: string): Promise<Order> => {
  if (orderId.length < 8) {
    throw new Error("Order ID must be at least 8 characters");
  }
  
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .ilike("id", `${orderId}%`)
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error("Order not found");
  
  return {
    ...data,
    shipping_address: data.shipping_address as Order["shipping_address"],
    items: mockOrderItems(data.id),
    package_details: mockPackageDetails(data.id),
    shipment_updates: mockShipmentUpdates(data.id, data.status),
    can_modify_address: canModifyAddress(data.status)
  };
};

export const searchOrderByTrackingNumber = async (trackingNumber: string): Promise<Order> => {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("tracking_number", trackingNumber)
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error("Order not found");
  
  return {
    ...data,
    shipping_address: data.shipping_address as Order["shipping_address"],
    items: mockOrderItems(data.id),
    package_details: mockPackageDetails(data.id),
    shipment_updates: mockShipmentUpdates(data.id, data.status),
    can_modify_address: canModifyAddress(data.status)
  };
};

// Helper function to determine if an address can be modified based on order status
const canModifyAddress = (status: string): boolean => {
  return ['pending', 'processing'].includes(status);
};

// Since we don't have these fields in the database yet, let's create mock data
// In a real application, this would come from the database
const mockOrderItems = (orderId: string): OrderItem[] => {
  // Generate 1-3 mock items based on the order ID
  const numItems = (parseInt(orderId.slice(-2), 16) % 3) + 1;
  const items: OrderItem[] = [];
  
  for (let i = 0; i < numItems; i++) {
    items.push({
      id: `item-${orderId}-${i}`,
      product_id: `prod-${orderId.slice(-4)}-${i}`,
      product_name: `Product ${i + 1}`,
      product_image: i % 2 === 0 ? `https://source.unsplash.com/300x300/?product&sig=${orderId}-${i}` : undefined,
      quantity: (i % 3) + 1,
      unit_price: 19.99 + (i * 10)
    });
  }
  
  return items;
};

const mockPackageDetails = (orderId: string): PackageDetails => {
  // Generate mock package details based on the order ID
  return {
    weight: 1.5 + (parseInt(orderId.slice(-2), 16) % 10),
    weight_unit: "lbs",
    dimensions: {
      length: 10 + (parseInt(orderId.slice(-2), 16) % 10),
      width: 8 + (parseInt(orderId.slice(-3, -1), 16) % 6),
      height: 4 + (parseInt(orderId.slice(-4, -2), 16) % 4),
      unit: "in"
    }
  };
};

const mockShipmentUpdates = (orderId: string, status: string): ShipmentUpdate[] => {
  const updates: ShipmentUpdate[] = [];
  
  // Always add order confirmed update
  const orderDate = new Date();
  orderDate.setDate(orderDate.getDate() - 7); // One week ago
  
  updates.push({
    timestamp: orderDate.toISOString(),
    status: "Order Confirmed",
    description: "Your order has been received and confirmed.",
    location: "Warehouse"
  });
  
  // Add processing update if status is at least processing
  if (['processing', 'shipped', 'delivered'].includes(status)) {
    const processingDate = new Date(orderDate);
    processingDate.setDate(processingDate.getDate() + 1);
    
    updates.push({
      timestamp: processingDate.toISOString(),
      status: "Processing",
      description: "Your order is being prepared for shipping.",
      location: "Fulfillment Center"
    });
  }
  
  // Add shipped update if status is at least shipped
  if (['shipped', 'delivered'].includes(status)) {
    const shippedDate = new Date(orderDate);
    shippedDate.setDate(shippedDate.getDate() + 2);
    
    updates.push({
      timestamp: shippedDate.toISOString(),
      status: "Shipped",
      description: "Your order has been shipped.",
      location: "Distribution Center"
    });
    
    // Add in-transit updates for shipped
    if (status === 'shipped') {
      const inTransitDate = new Date(shippedDate);
      inTransitDate.setDate(inTransitDate.getDate() + 1);
      
      updates.push({
        timestamp: inTransitDate.toISOString(),
        status: "In Transit",
        description: "Your package is on its way.",
        location: "In Transit"
      });
    }
  }
  
  // Add delivered update if status is delivered
  if (status === 'delivered') {
    const deliveredDate = new Date(orderDate);
    deliveredDate.setDate(deliveredDate.getDate() + 5);
    
    updates.push({
      timestamp: deliveredDate.toISOString(),
      status: "Delivered",
      description: "Your package has been delivered.",
      location: "Destination"
    });
  }
  
  // Add cancelled update if status is cancelled
  if (status === 'cancelled') {
    const cancelledDate = new Date(orderDate);
    cancelledDate.setDate(cancelledDate.getDate() + 1);
    
    updates.push({
      timestamp: cancelledDate.toISOString(),
      status: "Cancelled",
      description: "Your order has been cancelled.",
    });
  }
  
  return updates;
};
