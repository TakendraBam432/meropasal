
import { Database } from "@/integrations/supabase/types";

export type UserAddress = {
  id: string;
  user_id: string;
  address_line1: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  created_at?: string;
  updated_at?: string;
};

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Order = Database["public"]["Tables"]["orders"]["Row"];
export type OrderItem = Database["public"]["Tables"]["order_items"]["Row"];
export type Product = Database["public"]["Tables"]["products"]["Row"];
export type Review = Database["public"]["Tables"]["reviews"]["Row"];
