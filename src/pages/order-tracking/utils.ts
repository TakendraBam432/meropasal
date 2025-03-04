
import { supabase } from "@/integrations/supabase/client";
import { Order } from "./types";

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
    shipping_address: order.shipping_address as Order["shipping_address"]
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
    shipping_address: data.shipping_address as Order["shipping_address"]
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
    shipping_address: data.shipping_address as Order["shipping_address"]
  };
};
