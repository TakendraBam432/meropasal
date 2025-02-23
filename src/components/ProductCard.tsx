
import { Button } from "@/components/ui/button";
import { ShoppingCart, Star } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/components/ui/use-toast";

interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  image: string;
  rating?: number;
}

const ProductCard = ({ id, title, price, image, rating }: ProductCardProps) => {
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addItem({ id, title, price, image });
    toast({
      title: "Added to cart",
      description: `${title} has been added to your cart.`,
    });
  };

  return (
    <div className="product-card group">
      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 mb-4">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <h3 className="text-sm font-medium text-gray-900 mb-1">{title}</h3>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-lg font-semibold">${price.toFixed(2)}</p>
          {typeof rating === 'number' && (
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm text-gray-600">
                {rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>
        <Button 
          size="sm" 
          className="opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={handleAddToCart}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
