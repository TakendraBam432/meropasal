export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      addresses: {
        Row: {
          address_line1: string | null
          address_line2: string | null
          city: string | null
          country: string | null
          created_at: string | null
          id: string
          is_default: boolean | null
          postal_code: string | null
          state: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          postal_code?: string | null
          state?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          postal_code?: string | null
          state?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "addresses_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string | null
          product_id: string | null
          quantity: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          order_id?: string | null
          product_id?: string | null
          quantity?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string | null
          product_id?: string | null
          quantity?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
      orders: {
        Row: {
          address_id: string | null
          created_at: string
          id: string
          status: Database["public"]["Enums"]["order_status"] | null
          total_amount: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          address_id?: string | null
          created_at?: string
          id?: string
          status?: Database["public"]["Enums"]["order_status"] | null
          total_amount?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          address_id?: string | null
          created_at?: string
          id?: string
          status?: Database["public"]["Enums"]["order_status"] | null
          total_amount?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_address_id_fkey"
            columns: ["address_id"]
            referencedRelation: "addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      products: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string | null
          price: number | null
          quantity: number | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string | null
          price?: number | null
          quantity?: number | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string | null
          price?: number | null
          quantity?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      order_status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
      user_role: "buyer" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & { step: { Row: { test: string } } })
    | { schema: string; table: string } = keyof Database["public"]["Tables"]
> = PublicTableNameOrOptions extends { schema: string; table: string }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][PublicTableNameOrOptions["table"]]["Row"]
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions]["Row"]
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: string; enumName: string } = keyof Database["public"]["Enums"]
> = PublicEnumNameOrOptions extends { schema: string; enumName: string }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][PublicEnumNameOrOptions["enumName"]]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
    ? Database["public"]["Enums"][PublicEnumNameOrOptions]
    : never

export interface UserAddress {
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
}

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: 'buyer' | 'admin';
  created_at?: string;
  updated_at?: string;
}
