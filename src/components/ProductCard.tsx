
import { Button } from "@/components/ui/button";
import { ShoppingCart, Eye } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/auth";
import { useNavigate } from "react-router-dom";

interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  image: string;
}

const ProductCard = ({ id, title, price, image }: ProductCardProps) => {
  const { addItem } = useCart();
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to add items to your cart",
        variant: "destructive"
      });
      navigate("/auth");
      return;
    }

    addItem({ id, title, price, image });
    toast({
      title: "Added to cart",
      description: `${title} has been added to your cart.`,
    });
  };

  const viewProductDetails = () => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="product-card rounded-lg border border-gray-200 overflow-hidden flex flex-col h-full bg-white">
      <div 
        className="aspect-square w-full overflow-hidden bg-gray-100 cursor-pointer"
        onClick={viewProductDetails}
      >
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover object-center transition-transform duration-300 hover:scale-105"
        />
      </div>
      <div className="p-3 flex flex-col flex-grow">
        <h3 
          className="text-sm font-medium text-gray-900 mb-1 line-clamp-1 cursor-pointer"
          onClick={viewProductDetails}
        >
          {title}
        </h3>
        <div className="mt-auto pt-2 flex flex-col gap-2">
          <p className="text-lg font-semibold">${price.toFixed(2)}</p>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={viewProductDetails}
              className="flex-1 h-8 px-2"
            >
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
            <Button 
              size="sm" 
              onClick={handleAddToCart}
              className="flex-1 h-8 px-2"
            >
              <ShoppingCart className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
