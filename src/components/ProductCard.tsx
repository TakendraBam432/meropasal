
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
  title: string;
  price: number;
  image: string;
}

const ProductCard = ({ title, price, image }: ProductCardProps) => {
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
        <p className="text-lg font-semibold">${price.toFixed(2)}</p>
        <Button size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
