import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/auth";

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

const Dashboard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("seller_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setProducts(products.filter((product) => product.id !== id));
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
  };

  const handleStatusToggle = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "published" ? "draft" : "published";
    try {
      const { error } = await supabase
        .from("products")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;

      setProducts(
        products.map((product) =>
          product.id === id ? { ...product, status: newStatus } : product
        )
      );

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
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">My Products</h1>
        <Button onClick={() => navigate("/products/new")}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No products yet. Create your first product!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="border rounded-lg overflow-hidden shadow-sm"
            >
              <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.title}
                    className="object-cover w-full h-48"
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
                    onClick={() => navigate(`/products/edit/${product.id}`)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleStatusToggle(product.id, product.status)}
                  >
                    {product.status === "published" ? "Unpublish" : "Publish"}
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
