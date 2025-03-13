
import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "./types";
import { toast } from "@/components/ui/use-toast";

export function useProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('id, title, price, description, stock, category, image_url')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data as Product[]);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast({
        variant: "destructive",
        title: "Error fetching products",
        description: "There was an error fetching the product list."
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Memoize product data to prevent unnecessary re-renders
  const memoizedProducts = useMemo(() => products, [products]);
  
  // Load products on component mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);
  
  const handleDeleteProduct = useCallback(async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);
        
      if (error) throw error;
      
      toast({
        title: "Product deleted",
        description: "Product has been successfully deleted."
      });
      
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete product."
      });
    }
  }, [fetchProducts]);

  return {
    products: memoizedProducts,
    loading,
    fetchProducts,
    handleDeleteProduct
  };
}
