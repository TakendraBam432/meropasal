
import { useState, useEffect } from "react";
import NavBar from "@/components/NavBar";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

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

const Index = () => {
  const navigate = useNavigate();
  const [currentDealIndex, setCurrentDealIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDealIndex((prevIndex) => (prevIndex + 1) % DEALS.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <NavBar />
      
      {/* Deals Slider */}
      <div className="bg-primary text-white py-2 text-center overflow-hidden">
        <div className="animate-pulse">
          {DEALS[currentDealIndex]}
        </div>
      </div>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        {/* Hero Section */}
        <section className="mb-8 sm:mb-12 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl sm:text-4xl font-bold mb-4">Premium Products, Direct to You</h1>
            <p className="text-sm sm:text-lg text-gray-600 mb-6">
              Quality products sourced globally at competitive prices. No middleman, no markup.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => document.getElementById('featured-products')?.scrollIntoView({ behavior: 'smooth' })}>
                Shop Now
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/auth")}>
                Join Us
              </Button>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="mb-10">
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
