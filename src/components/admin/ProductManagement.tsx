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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RefreshCw, Plus, Pencil, Trash, ImageIcon } from "lucide-react";

interface Product {
  id: string;
  title: string;
  price: number;
  description: string | null;
  stock: number;
  category: string | null;
  image_url: string | null;
}

const CATEGORIES = [
  "electronics",
  "fashion",
  "home-garden",
  "sports",
  "beauty",
  "toys",
];

const ProductManagement = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // Form state
  const [productTitle, setProductTitle] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productStock, setProductStock] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productImage, setProductImage] = useState<File | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('id, title, price, description, stock, category, image_url');

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

  const resetForm = () => {
    setProductTitle("");
    setProductPrice("");
    setProductDescription("");
    setProductStock("");
    setProductCategory("");
    setProductImage(null);
    setImagePreview(null);
    setSelectedProduct(null);
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setProductImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setProductTitle(product.title);
    setProductPrice(product.price.toString());
    setProductDescription(product.description || "");
    setProductStock(product.stock.toString());
    setProductCategory(product.category || "");
    setImagePreview(product.image_url || null);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = async (productId: string) => {
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
      let imageUrl = selectedProduct?.image_url || null;
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

      if (selectedProduct) {
        // Update existing product
        const { error } = await supabase
          .from('products')
          .update({
            title: productTitle,
            price: parseFloat(productPrice),
            description: productDescription || null,
            stock: parseInt(productStock),
            category: productCategory || null,
            image_url: imageUrl,
            updated_at: new Date().toISOString() // Fixed line
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
            title: productTitle,
            price: parseFloat(productPrice),
            description: productDescription || null,
            stock: parseInt(productStock),
            category: productCategory || null,
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

  const ProductForm = () => (
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
        <label htmlFor="category">Category</label>
        <Select value={productCategory} onValueChange={setProductCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map(category => (
              <SelectItem key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' & ')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
        <div className="flex items-center gap-4">
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="flex-1"
          />
          {imagePreview && (
            <div className="w-16 h-16 relative border rounded overflow-hidden">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => {
            resetForm();
            selectedProduct ? setIsEditDialogOpen(false) : setIsAddDialogOpen(false);
          }}
        >
          Cancel
        </Button>
        <Button type="submit">{selectedProduct ? 'Update' : 'Add'} Product</Button>
      </div>
    </form>
  );

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
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Product</DialogTitle>
                  <DialogDescription>
                    Add a new product to your store. Fill out the details below.
                  </DialogDescription>
                </DialogHeader>
                <ProductForm />
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
                <TableHead>Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    <div className="flex justify-center">
                      <RefreshCw className="h-5 w-5 animate-spin" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : products.length > 0 ? (
                products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      {product.image_url ? (
                        <div className="w-10 h-10 rounded overflow-hidden">
                          <img 
                            src={product.image_url} 
                            alt={product.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center">
                          <ImageIcon className="h-4 w-4 text-gray-400" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{product.title}</TableCell>
                    <TableCell>{product.category ? product.category.charAt(0).toUpperCase() + product.category.slice(1).replace('-', ' & ') : '-'}</TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditClick(product)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteClick(product.id)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    No products found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update product details below.
            </DialogDescription>
          </DialogHeader>
          <ProductForm />
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ProductManagement;
