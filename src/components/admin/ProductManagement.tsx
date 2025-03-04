import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RefreshCw, Plus, Pencil, Trash } from "lucide-react";

interface Product {
  id: string;
  title: string;
  price: number;
  description: string | null;
  stock: number;
  image_url: string | null;
}

const ProductManagement = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // Form state
  const [productTitle, setProductTitle] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productStock, setProductStock] = useState("");
  const [productImage, setProductImage] = useState<File | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('id, title, price, description, stock, image_url');

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
  };

  // Load products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setProductImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate form
      if (!productTitle || !productPrice || !productStock) {
        toast({
          variant: "destructive",
          title: "Missing fields",
          description: "Please fill in all required fields."
        });
        return;
      }

      // Upload image if provided
      let imageUrl = null;
      if (productImage) {
        const fileExt = productImage.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        
        const { error: uploadError, data } = await supabase.storage
          .from('products')
          .upload(fileName, productImage);
        
        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('products')
          .getPublicUrl(fileName);
          
        imageUrl = publicUrl;
      }

      // Add product to database
      const { error } = await supabase
        .from('products')
        .insert({
          title: productTitle,
          price: parseFloat(productPrice),
          description: productDescription || null,
          stock: parseInt(productStock),
          image_url: imageUrl,
          seller_id: user?.id
        });

      if (error) throw error;

      // Success
      toast({
        title: "Product added",
        description: "Product has been successfully added."
      });
      
      // Reset form and close dialog
      setProductTitle("");
      setProductPrice("");
      setProductDescription("");
      setProductStock("");
      setProductImage(null);
      setIsAddDialogOpen(false);
      
      // Refresh product list
      fetchProducts();
      
    } catch (error) {
      console.error("Error adding product:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add product."
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
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Product</DialogTitle>
                  <DialogDescription>
                    Add a new product to your store. Fill out the details below.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                  <div className="grid w-full gap-1.5">
                    <label htmlFor="title">Title *</label>
                    <Input
                      id="title"
                      value={productTitle}
                      onChange={e => setProductTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid w-full gap-1.5">
                    <label htmlFor="price">Price *</label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={productPrice}
                      onChange={e => setProductPrice(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid w-full gap-1.5">
                    <label htmlFor="description">Description</label>
                    <Textarea
                      id="description"
                      value={productDescription}
                      onChange={e => setProductDescription(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="grid w-full gap-1.5">
                    <label htmlFor="stock">Stock *</label>
                    <Input
                      id="stock"
                      type="number"
                      value={productStock}
                      onChange={e => setProductStock(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid w-full gap-1.5">
                    <label htmlFor="image">Product Image</label>
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsAddDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Add Product</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    <div className="flex justify-center">
                      <RefreshCw className="h-5 w-5 animate-spin" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : products.length > 0 ? (
                products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.title}</TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    No products found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductManagement;
