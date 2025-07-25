
import { useCallback, useMemo, memo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/auth";
import { useQuery } from "@tanstack/react-query";
import { Loading } from "@/components/ui/loading";

interface Product {
  id: string;
  title: string;
  description: string | null;
  price: number;
  status: string;
  image_url: string | null;
  category: string | null;
  stock: number;
}

// Memoized product card component to prevent unnecessary re-renders
const ProductCard = memo(({ 
  product, 
  onEdit, 
  onToggleStatus, 
  onDelete 
}: { 
  product: Product, 
  onEdit: (id: string) => void,
  onToggleStatus: (id: string, status: string) => void,
  onDelete: (id: string) => void
}) => (
  <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
    <div className="aspect-w-16 aspect-h-9 bg-gray-100">
      {product.image_url ? (
        <img
          src={product.image_url}
          alt={product.title}
          className="object-cover w-full h-48"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <div className="flex items-center justify-center h-48 bg-gray-100">
          <span className="text-gray-400">No image</span>
        </div>
      )}
    </div>
    <div className="p-4">
      <h3 className="font-semibold text-lg mb-2">{product.title}</h3>
      <p className="text-gray-600 mb-2">
        Price: ${product.price.toFixed(2)}
      </p>
      <p className="text-gray-600 mb-4">Stock: {product.stock}</p>
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => onEdit(product.id)}
        >
          Edit
        </Button>
        <Button
          variant="outline"
          onClick={() => onToggleStatus(product.id, product.status)}
        >
          {product.status === "published" ? "Unpublish" : "Publish"}
        </Button>
        <Button
          variant="destructive"
          onClick={() => onDelete(product.id)}
        >
          Delete
        </Button>
      </div>
    </div>
  </div>
));

ProductCard.displayName = "ProductCard";

// Memoized empty state component
const EmptyState = memo(() => (
  <div className="text-center py-12">
    <p className="text-gray-500">No products yet. Create your first product!</p>
  </div>
));

EmptyState.displayName = "EmptyState";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  // Optimize React Query for faster loading
  const { data: products = [], isLoading, refetch } = useQuery({
    queryKey: ['userProducts', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("seller_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Product[];
    },
    enabled: !!user?.id,
    staleTime: 60 * 1000, // 1 minute
    gcTime: 300000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

  const handleDeleteProduct = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", id);

      if (error) throw error;

      // Optimistically update UI before refetching
      refetch();
      
      toast({
        title: "Product deleted",
        description: "The product has been successfully deleted.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  }, [refetch, toast]);

  const handleStatusToggle = useCallback(async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "published" ? "draft" : "published";
    try {
      const { error } = await supabase
        .from("products")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;

      // Optimistically update UI before refetching
      refetch();

      toast({
        title: "Status updated",
        description: `Product is now ${newStatus}.`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  }, [refetch, toast]);

  const handleNavigateToEdit = useCallback((id: string) => {
    navigate(`/products/edit/${id}`);
  }, [navigate]);

  const handleNavigateToNew = useCallback(() => {
    navigate("/products/new");
  }, [navigate]);

  // Memoize the product grid to prevent unnecessary re-renders
  const productGrid = useMemo(() => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-12">
          <Loading size="lg" />
        </div>
      );
    }
    
    if (products.length === 0) {
      return <EmptyState />;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard 
            key={product.id}
            product={product}
            onEdit={handleNavigateToEdit}
            onToggleStatus={handleStatusToggle}
            onDelete={handleDeleteProduct}
          />
        ))}
      </div>
    );
  }, [products, handleNavigateToEdit, handleDeleteProduct, handleStatusToggle, isLoading]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">My Products</h1>
        <Button onClick={handleNavigateToNew}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {productGrid}
    </div>
  );
};

export default Dashboard;
