
import { useNavigate } from "react-router-dom";

interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  image: string;
}

const ProductCard = ({ id, title, price, image }: ProductCardProps) => {
  const navigate = useNavigate();

  const viewProductDetails = () => {
    navigate(`/product/${id}`);
  };

  return (
    <div 
      className="product-card rounded-lg border border-gray-200 overflow-hidden flex flex-col h-full bg-white cursor-pointer hover:shadow-md transition-all duration-300"
      onClick={viewProductDetails}
    >
      <div className="aspect-square w-full overflow-hidden bg-gray-100 relative group">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300">
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <p className="text-white text-xs font-medium text-center">View Details</p>
          </div>
        </div>
      </div>
      <div className="p-3 flex flex-col flex-grow">
        <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-1">
          {title}
        </h3>
        <div className="mt-auto pt-2">
          <p className="text-lg font-semibold">${price.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
