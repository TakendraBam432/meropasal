
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
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
          <span className="text-white opacity-0 group-hover:opacity-100 text-sm font-medium transition-opacity duration-300 bg-primary px-3 py-1 rounded-full transform -translate-y-2 group-hover:translate-y-0">
            View Details
          </span>
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
