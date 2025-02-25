
import { useState } from "react";
import NavBar from "@/components/NavBar";
import ProductCard from "@/components/ProductCard";
import { Search } from "lucide-react";
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
      {/* Search Bar */}
      <div className="sticky top-0 z-50 bg-white p-4 shadow-sm">
        <div className="relative max-w-lg mx-auto">
          <Input
            type="search"
            placeholder="iphone 15 pro max"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-4 pr-20 h-12 rounded-full border-2 border-orange-500"
          />
          <Button 
            className="absolute right-0 top-0 h-12 px-6 bg-orange-500 hover:bg-orange-600 rounded-r-full"
          >
            Search
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-4">
        {/* Banner */}
        <div className="relative mb-6 rounded-xl overflow-hidden">
          <img 
            src="/public/lovable-uploads/38ef8083-9f13-4a7b-98f1-e9ea87780cfc.png" 
            alt="Payday Sale"
            className="w-full h-auto"
          />
          <Button
            className="absolute bottom-4 left-4 bg-green-600 hover:bg-green-700"
          >
            Shop Now
          </Button>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 mb-8">
          {categories.map((category) => (
            <a 
              key={category.id}
              href={category.link}
              className="flex flex-col items-center text-center p-2"
            >
              <div className="text-2xl mb-1">{category.icon}</div>
              <span className="text-sm">{category.name}</span>
            </a>
          ))}
        </div>

        {/* Vouchers */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Voucher & Discount</h2>
            <a href="/vouchers" className="text-sm text-gray-600">
              More vouchers →
            </a>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {vouchers.map((voucher) => (
              <Card key={voucher.id} className="p-4 text-center bg-pink-50">
                <div className="text-2xl font-bold text-pink-500">{voucher.discount}OFF</div>
                <div className="text-sm text-pink-600">{voucher.code}</div>
              </Card>
            ))}
          </div>
        </div>

        {/* Flash Sale */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Flash Sale</h2>
            <a href="/flash-sale" className="text-sm text-gray-600">
              SHOP MORE →
            </a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {flashSaleItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
                <div className="p-3">
                  <div className="flex justify-between items-center">
                    <div className="text-lg font-semibold">Rs.{item.price}</div>
                    <div className="text-red-500">-{item.discount}%</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around items-center p-3">
        <a href="/" className="flex flex-col items-center text-orange-500">
          <span className="text-xl">🏠</span>
          <span className="text-xs">For You</span>
        </a>
        <a href="/messages" className="flex flex-col items-center text-gray-600">
          <span className="text-xl">💬</span>
          <span className="text-xs">Messages</span>
        </a>
        <a href="/cart" className="flex flex-col items-center text-gray-600">
          <span className="text-xl">🛒</span>
          <span className="text-xs">Cart</span>
        </a>
        <a href="/account" className="flex flex-col items-center text-gray-600">
          <span className="text-xl">👤</span>
          <span className="text-xs">Account</span>
        </a>
      </div>
    </div>
  );
};

export default Index;
