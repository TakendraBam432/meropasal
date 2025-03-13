
import { ChangeEvent, FormEvent, memo, useState, useEffect } from "react";
import { Product, CATEGORIES } from "./types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductFormProps {
  product: Product | null;
  onSubmit: (
    e: FormEvent, 
    productData: {
      title: string;
      price: string;
      description: string;
      stock: string;
      category: string;
      image: File | null;
      imagePreview: string | null;
    }
  ) => void;
  onCancel: () => void;
}

const ProductForm = memo(({ product, onSubmit, onCancel }: ProductFormProps) => {
  const [productTitle, setProductTitle] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productStock, setProductStock] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productImage, setProductImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Initialize form with product data if editing
  useEffect(() => {
    if (product) {
      setProductTitle(product.title);
      setProductPrice(product.price.toString());
      setProductDescription(product.description || "");
      setProductStock(product.stock.toString());
      setProductCategory(product.category || "");
      setImagePreview(product.image_url || null);
    } else {
      // Reset form when adding new product
      setProductTitle("");
      setProductPrice("");
      setProductDescription("");
      setProductStock("");
      setProductCategory("");
      setProductImage(null);
      setImagePreview(null);
    }
  }, [product]);

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

  const handleSubmitForm = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(e, {
      title: productTitle,
      price: productPrice,
      description: productDescription,
      stock: productStock,
      category: productCategory,
      image: productImage,
      imagePreview
    });
  };

  return (
    <form onSubmit={handleSubmitForm} className="space-y-4 pt-4">
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
          <div className="flex-1">
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="cursor-pointer"
            />
            <p className="text-xs text-gray-500 mt-1">Recommended size: 800x800px</p>
          </div>
          {imagePreview ? (
            <div className="w-20 h-20 relative border rounded overflow-hidden">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                className="absolute top-0 right-0 bg-red-500 text-white rounded-bl p-1 text-xs"
                onClick={() => {
                  setImagePreview(null);
                  setProductImage(null);
                }}
              >
                ✕
              </button>
            </div>
          ) : null}
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button type="submit">{product ? 'Update' : 'Add'} Product</Button>
      </div>
    </form>
  );
});

ProductForm.displayName = "ProductForm";

export default ProductForm;
