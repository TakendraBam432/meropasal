
import { useState, useEffect } from "react";
import NavBar from "@/components/NavBar";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

const FEATURED_PRODUCTS = [
  {
    id: "1",
    title: "Premium Wireless Headphones",
    price: 299.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
  },
  {
    id: "2",
    title: "Smart Watch Series 5",
    price: 399.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80",
  },
  {
    id: "3",
    title: "Professional Camera Kit",
    price: 1299.99,
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&q=80",
  },
  {
    id: "4",
    title: "Designer Sunglasses",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&q=80",
  },
  {
    id: "5",
    title: "Smartphone Pro Max",
    price: 899.99,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80",
  },
  {
    id: "6",
    title: "Fitness Tracker Ultra",
    price: 149.99,
    image: "https://images.unsplash.com/photo-1576243345690-4e4b79b63eaa?w=500&q=80",
  },
];

const CATEGORIES = [
  { name: "Electronics", icon: "💻" },
  { name: "Fashion", icon: "👕" },
  { name: "Home & Garden", icon: "🏡" },
  { name: "Sports", icon: "🏀" },
  { name: "Beauty", icon: "💄" },
  { name: "Toys", icon: "🧸" }
];

const DEALS = [
  "🔥 Flash Sale! 50% OFF on all Electronics - Today Only!",
  "🚚 Free Shipping on Orders over $50 - Limited Time!",
  "🎁 Buy One Get One Free on Selected Items!",
  "⏰ Last Chance! Summer Collection Clearance Sale Ends Soon"
];

const SHOWCASE_IMAGES = [
  "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80",
  "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1200&q=80",
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=80",
  "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=1200&q=80"
];

const Index = () => {
  const navigate = useNavigate();
  const [currentDealIndex, setCurrentDealIndex] = useState(0);
  const [showcaseIndex, setShowcaseIndex] = useState(0);
  
  useEffect(() => {
    const dealInterval = setInterval(() => {
      setCurrentDealIndex((prevIndex) => (prevIndex + 1) % DEALS.length);
    }, 3000);
    
    const showcaseInterval = setInterval(() => {
      setShowcaseIndex((prevIndex) => (prevIndex + 1) % SHOWCASE_IMAGES.length);
    }, 5000);
    
    return () => {
      clearInterval(dealInterval);
      clearInterval(showcaseInterval);
    };
  }, []);
  
  const nextShowcase = () => {
    setShowcaseIndex((prevIndex) => (prevIndex + 1) % SHOWCASE_IMAGES.length);
  };
  
  const prevShowcase = () => {
    setShowcaseIndex((prevIndex) => (prevIndex - 1 + SHOWCASE_IMAGES.length) % SHOWCASE_IMAGES.length);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <NavBar />
      
      {/* Deals Slider */}
      <div className="bg-primary text-white py-2 text-center overflow-hidden">
        <div className="animate-pulse">
          {DEALS[currentDealIndex]}
        </div>
      </div>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Image Showcase */}
        <section className="mb-8 relative overflow-hidden rounded-xl shadow-lg">
          <div className="relative h-[200px] sm:h-[300px] md:h-[400px] w-full overflow-hidden">
            {SHOWCASE_IMAGES.map((img, index) => (
              <div 
                key={index}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === showcaseIndex ? 'opacity-100' : 'opacity-0'}`}
              >
                <img 
                  src={img} 
                  alt={`Showcase ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end">
                  <div className="p-4 sm:p-6 text-white">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">New Arrivals</h2>
                    <p className="text-sm sm:text-base mb-4 max-w-md">Discover the latest trending products at unbeatable prices</p>
                    <Button onClick={() => document.getElementById('featured-products')?.scrollIntoView({ behavior: 'smooth' })}>
                      Shop Now
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button 
            onClick={prevShowcase}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white p-2 rounded-full"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button 
            onClick={nextShowcase}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white p-2 rounded-full"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
          {/* Dots indicator */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {SHOWCASE_IMAGES.map((_, index) => (
              <button
                key={index}
                onClick={() => setShowcaseIndex(index)}
                className={`w-2 h-2 rounded-full ${index === showcaseIndex ? 'bg-white' : 'bg-white/50'}`}
              />
            ))}
          </div>
        </section>

        {/* Categories Section */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Shop by Category</h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-4">
            {CATEGORIES.map((category, index) => (
              <div 
                key={index} 
                className="flex flex-col items-center justify-center p-3 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow border border-gray-100 cursor-pointer"
              >
                <span className="text-2xl mb-1">{category.icon}</span>
                <span className="text-xs sm:text-sm font-medium text-center">{category.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Products */}
        <section id="featured-products">
          <h2 className="text-xl font-semibold mb-4">Featured Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {FEATURED_PRODUCTS.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                title={product.title}
                price={product.price}
                image={product.image}
              />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button onClick={() => navigate("/search")}>View All Products</Button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
