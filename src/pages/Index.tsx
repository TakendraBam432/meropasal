
import { useState } from "react";
import NavBar from "@/components/NavBar";
import ProductCard from "@/components/ProductCard";
import { Search, Camera } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { id: 1, name: "20% OFF", icon: "💎", link: "/offers" },
    { id: 2, name: "Fashion", icon: "👔", link: "/fashion" },
    { id: 3, name: "Buy Any 3", icon: "🛍️", link: "/special-offers" },
    { id: 4, name: "Free Delivery", icon: "🚚", link: "/free-delivery" },
    { id: 5, name: "Beauty", icon: "✨", link: "/beauty" },
    { id: 6, name: "New Arrival", icon: "🆕", link: "/new" },
  ];

  const vouchers = [
    { id: 1, discount: "5%", code: "VOUCHER MAX" },
    { id: 2, discount: "6%", code: "VOUCHER MAX" },
  ];

  const flashSaleItems = [
    {
      id: 1,
      name: "Atomic Habits",
      price: 106,
      discount: 87,
      image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=300&q=80",
    },
    {
      id: 2,
      name: "Product 2",
      price: 88,
      discount: 71,
      image: "https://placehold.co/300",
    },
    {
      id: 3,
      name: "Product 3",
      price: 920,
      discount: 23,
      image: "https://placehold.co/300",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Search Bar - Updated for mobile */}
      <div className="sticky top-0 z-50 bg-white px-4 py-3 shadow-sm md:py-4">
        <div className="relative max-w-lg mx-auto flex items-center gap-2">
          <div className="flex-1 relative">
            <Input
              type="search"
              placeholder="iphone 15 pro max"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-4 pr-12 h-11 rounded-full border-2 border-orange-500 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <Button 
              size="icon"
              variant="ghost"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-gray-500"
            >
              <Camera className="h-5 w-5" />
            </Button>
          </div>
          <Button 
            className="h-11 px-6 bg-orange-500 hover:bg-orange-600 rounded-full"
          >
            Search
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-4">
        {/* Categories - Updated for mobile */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 mb-8">
          {categories.map((category) => (
            <a 
              key={category.id}
              href={category.link}
              className="flex flex-col items-center text-center p-2"
            >
              <div className="w-12 h-12 mb-2 rounded-xl bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
                <span className="text-2xl">{category.icon}</span>
              </div>
              <span className="text-xs font-medium">{category.name}</span>
            </a>
          ))}
        </div>

        {/* Vouchers - Updated for mobile */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Voucher & Discount</h2>
            <a href="/vouchers" className="text-sm text-gray-600 flex items-center">
              More vouchers
              <span className="ml-1">›</span>
            </a>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {vouchers.map((voucher) => (
              <Card key={voucher.id} className="p-4 text-center bg-gradient-to-r from-pink-50 to-red-50 border-0">
                <div className="text-2xl font-bold text-red-500">{voucher.discount}OFF</div>
                <div className="text-sm text-red-600">{voucher.code}</div>
              </Card>
            ))}
          </div>
        </div>

        {/* Flash Sale - Updated for mobile */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold">Flash Sale</h2>
              <span className="text-red-500 text-sm">⚡️</span>
            </div>
            <a href="/flash-sale" className="text-sm text-gray-600 flex items-center">
              SHOP MORE
              <span className="ml-1">›</span>
            </a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {flashSaleItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="relative">
                  <img src={item.image} alt={item.name} className="w-full aspect-square object-cover" />
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    -{item.discount}%
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-medium mb-1 line-clamp-2">{item.name}</h3>
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-semibold">Rs.{item.price}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>

      {/* Bottom Navigation - Updated for mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around items-center p-2">
        <a href="/" className="flex flex-col items-center text-orange-500">
          <span className="text-2xl">🏠</span>
          <span className="text-[10px] mt-1">For You</span>
        </a>
        <a href="/messages" className="flex flex-col items-center text-gray-500">
          <span className="text-2xl">💬</span>
          <span className="text-[10px] mt-1">Messages</span>
        </a>
        <a href="/cart" className="flex flex-col items-center text-gray-500">
          <span className="text-2xl">🛒</span>
          <span className="text-[10px] mt-1">Cart</span>
        </a>
        <a href="/account" className="flex flex-col items-center text-gray-500">
          <span className="text-2xl">👤</span>
          <span className="text-[10px] mt-1">Account</span>
        </a>
      </div>
    </div>
  );
};

export default Index;
