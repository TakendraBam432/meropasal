
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, ChevronLeft, Minus, Plus, Star, Truck, Shield, RotateCcw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/auth";

// This is a mock product database
// In a real application, this would come from an API
const PRODUCTS = [
  {
    id: "1",
    title: "Premium Wireless Headphones",
    price: 299.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
    description: "Experience premium sound quality with these wireless headphones. Perfect for music lovers and professionals alike. Features noise cancellation technology and long battery life.",
    rating: 4.8,
    reviews: 152,
    inStock: true,
    freeShipping: true,
    deliveryTime: "2-3 business days",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
      "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=500&q=80",
      "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&q=80"
    ]
  },
  {
    id: "2",
    title: "Smart Watch Series 5",
    price: 399.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80",
    description: "Stay connected with this premium smartwatch. Track your fitness goals, receive notifications, and more. Water resistant and long battery life make it perfect for everyday use.",
    rating: 4.6,
    reviews: 98,
    inStock: true,
    freeShipping: true,
    deliveryTime: "2-4 business days",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80",
      "https://images.unsplash.com/photo-1617043786394-f977fa12eddf?w=500&q=80",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&q=80"
    ]
  },
  {
    id: "3",
    title: "Professional Camera Kit",
    price: 1299.99,
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&q=80",
    description: "Capture stunning photos and videos with this professional-grade camera kit. Includes multiple lenses, tripod, and carrying case. Perfect for photography enthusiasts and professionals.",
    rating: 4.9,
    reviews: 75,
    inStock: true,
    freeShipping: true,
    deliveryTime: "3-5 business days",
    images: [
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&q=80",
      "https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?w=500&q=80",
      "https://images.unsplash.com/photo-1480365501497-199581be0e66?w=500&q=80"
    ]
  },
  {
    id: "4",
    title: "Designer Sunglasses",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&q=80",
    description: "Stylish designer sunglasses with UV protection. Lightweight frame and polarized lenses make them perfect for everyday use and outdoor activities.",
    rating: 4.5,
    reviews: 63,
    inStock: true,
    freeShipping: true,
    deliveryTime: "1-3 business days",
    images: [
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&q=80",
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&q=80",
      "https://images.unsplash.com/photo-1577803645773-f96470509666?w=500&q=80"
    ]
  },
  {
    id: "5",
    title: "Smartphone Pro Max",
    price: 899.99,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80",
    description: "The latest smartphone with cutting-edge technology. Features a high-resolution camera, fast processor, and long battery life. Available in multiple colors.",
    rating: 4.7,
    reviews: 211,
    inStock: true,
    freeShipping: true,
    deliveryTime: "1-2 business days",
    images: [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80",
      "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=500&q=80",
      "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=500&q=80"
    ]
  },
  {
    id: "6",
    title: "Fitness Tracker Ultra",
    price: 149.99,
    image: "https://images.unsplash.com/photo-1576243345690-4e4b79b63eaa?w=500&q=80",
    description: "Track your fitness goals with this advanced fitness tracker. Monitor heart rate, steps, sleep, and more. Water-resistant and comfortable for all-day wear.",
    rating: 4.4,
    reviews: 89,
    inStock: true,
    freeShipping: true,
    deliveryTime: "2-3 business days",
    images: [
      "https://images.unsplash.com/photo-1576243345690-4e4b79b63eaa?w=500&q=80",
      "https://images.unsplash.com/photo-1575311373937-040b8e1fd6b0?w=500&q=80",
      "https://images.unsplash.com/photo-1581244277943-fe4a9c777540?w=500&q=80"
    ]
  }
];

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addItem } = useCart();
  const { user } = useAuth();
  
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  
  const product = PRODUCTS.find(p => p.id === id);
  
  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-bold">Product not found</h2>
          <Button 
            className="mt-4" 
            onClick={() => navigate("/")}
          >
            Back to Home
          </Button>
        </div>
      </div>
    );
  }
  
  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };
  
  const decrementQuantity = () => {
    setQuantity(prev => prev > 1 ? prev - 1 : 1);
  };
  
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

    // Add the product to cart with the selected quantity
    for (let i = 0; i < quantity; i++) {
      addItem({ 
        id: product.id, 
        title: product.title, 
        price: product.price,
        image: product.image
      });
    }
    
    toast({
      title: "Added to cart",
      description: `${quantity} x ${product.title} has been added to your cart.`,
    });
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Back button */}
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-sm text-gray-600 mb-6"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </button>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden border border-gray-200 bg-white">
              <img 
                src={product.images[selectedImage]} 
                alt={product.title} 
                className="w-full h-full object-cover object-center"
              />
            </div>
            
            {/* Thumbnail images */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.images.map((img, index) => (
                <div 
                  key={index}
                  className={`w-20 h-20 rounded-md overflow-hidden border-2 cursor-pointer
                    ${selectedImage === index ? 'border-primary' : 'border-gray-200'}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img 
                    src={img} 
                    alt={`${product.title} preview ${index + 1}`} 
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Product details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{product.title}</h1>
              
              <div className="flex items-center mt-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">{product.rating} ({product.reviews} reviews)</span>
              </div>
            </div>
            
            <div className="text-3xl font-bold text-gray-900">${product.price.toFixed(2)}</div>
            
            <p className="text-gray-700">{product.description}</p>
            
            {/* Delivery Info */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center text-sm">
                  <Truck className="h-4 w-4 mr-2 text-green-600" />
                  {product.freeShipping ? 
                    <span className="text-green-600 font-medium">Free Shipping</span> :
                    <span>Standard Shipping</span>
                  }
                </div>
                <div className="flex items-center text-sm">
                  <Shield className="h-4 w-4 mr-2 text-blue-600" />
                  <span>Money-back Guarantee</span>
                </div>
                <div className="flex items-center text-sm">
                  <RotateCcw className="h-4 w-4 mr-2 text-blue-600" />
                  <span>30-day Returns</span>
                </div>
              </CardContent>
            </Card>
            
            {/* Quantity selector */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded-md">
                <button 
                  onClick={decrementQuantity}
                  className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-4 py-1">{quantity}</span>
                <button 
                  onClick={incrementQuantity}
                  className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            {/* Add to cart button */}
            <Button 
              size="lg" 
              className="w-full sm:w-auto"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetails;
