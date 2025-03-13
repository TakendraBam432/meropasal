
import { memo, useState, FormEvent } from "react";
import { useAuth } from "@/contexts/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RefreshCw, Plus } from "lucide-react";
import { Product } from "./types";
import { useProductManagement } from "./useProductManagement";
import ProductTable from "./ProductTable";
import ProductForm from "./ProductForm";

const ProductManagementCard = memo(() => {
  const { user } = useAuth();
  const { products, loading, fetchProducts, handleDeleteProduct } = useProductManagement();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  const resetForm = () => {
    setSelectedProduct(null);
  };

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setIsEditDialogOpen(true);
  };

  const handleSubmit = async (
    e: FormEvent, 
    formData: {
      title: string;
      price: string;
      description: string;
      stock: string;
      category: string;
      image: File | null;
      imagePreview: string | null;
    }
  ) => {
    e.preventDefault();
    
    try {
      // Validate form
      if (!formData.title || !formData.price || !formData.stock) {
        toast({
          variant: "destructive",
          title: "Missing fields",
          description: "Please fill in all required fields."
        });
        return;
      }

      // Upload image if provided
      let imageUrl = selectedProduct?.image_url || null;
      if (formData.image) {
        const fileExt = formData.image.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        
        const { error: uploadError, data } = await supabase.storage
          .from('products')
          .upload(fileName, formData.image);
        
        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('products')
          .getPublicUrl(fileName);
          
        imageUrl = publicUrl;
      }

      if (selectedProduct) {
        // Update existing product
        const { error } = await supabase
          .from('products')
          .update({
            title: formData.title,
            price: parseFloat(formData.price),
            description: formData.description || null,
            stock: parseInt(formData.stock),
            category: formData.category || null,
            image_url: imageUrl,
            updated_at: new Date().toISOString()
          })
          .eq('id', selectedProduct.id);

        if (error) throw error;

        toast({
          title: "Product updated",
          description: "Product has been successfully updated."
        });
        setIsEditDialogOpen(false);
      } else {
        // Add new product
        const { error } = await supabase
          .from('products')
          .insert({
            title: formData.title,
            price: parseFloat(formData.price),
            description: formData.description || null,
            stock: parseInt(formData.stock),
            category: formData.category || null,
            image_url: imageUrl,
            seller_id: user?.id,
            status: 'active'
          });

        if (error) throw error;

        toast({
          title: "Product added",
          description: "Product has been successfully added."
        });
        setIsAddDialogOpen(false);
      }
      
      // Reset form and refresh product list
      resetForm();
      fetchProducts();
      
    } catch (error) {
      console.error("Error handling product:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${selectedProduct ? 'update' : 'add'} product.`
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Product Management</CardTitle>
            <CardDescription>Manage store products</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={fetchProducts}>
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => resetForm()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Product</DialogTitle>
                  <DialogDescription>
                    Add a new product to your store. Fill out the details below.
                  </DialogDescription>
                </DialogHeader>
                <ProductForm 
                  product={null} 
                  onSubmit={handleSubmit} 
                  onCancel={() => setIsAddDialogOpen(false)} 
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ProductTable 
          products={products}
          loading={loading}
          onEditProduct={handleEditClick}
          onDeleteProduct={handleDeleteProduct}
        />
      </CardContent>

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update product details below.
            </DialogDescription>
          </DialogHeader>
          <ProductForm 
            product={selectedProduct} 
            onSubmit={handleSubmit} 
            onCancel={() => setIsEditDialogOpen(false)} 
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
});

ProductManagementCard.displayName = "ProductManagementCard";

export default ProductManagementCard;
