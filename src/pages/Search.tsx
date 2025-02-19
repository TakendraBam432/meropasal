
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ProductCard from "@/components/ProductCard";
import NavBar from "@/components/NavBar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Product {
  id: string;
  title: string;
  price: number;
  image_url: string;
  category: string;
  stock: number;
  status: string;
}

const CATEGORIES = ["Electronics", "Clothing", "Books", "Home", "Sports"];
const MAX_PRICE = 2000;

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "",
    minPrice: Number(searchParams.get("minPrice")) || 0,
    maxPrice: Number(searchParams.get("maxPrice")) || MAX_PRICE,
    inStock: searchParams.get("inStock") === "true",
  });

  const query = searchParams.get("q") || "";

  const { data: products, isLoading } = useQuery({
    queryKey: ["products", query, filters],
    queryFn: async () => {
      let queryBuilder = supabase
        .from("products")
        .select("*")
        .eq("status", "active");

      if (query) {
        queryBuilder = queryBuilder.ilike("title", `%${query}%`);
      }

      if (filters.category) {
        queryBuilder = queryBuilder.eq("category", filters.category);
      }

      queryBuilder = queryBuilder
        .gte("price", filters.minPrice)
        .lte("price", filters.maxPrice);

      if (filters.inStock) {
        queryBuilder = queryBuilder.gt("stock", 0);
      }

      const { data, error } = await queryBuilder;
      if (error) throw error;
      return data as Product[];
    },
  });

  const updateFilters = (newFilters: Partial<typeof filters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    
    const params = new URLSearchParams(searchParams);
    Object.entries(updatedFilters).forEach(([key, value]) => {
      if (value) {
        params.set(key, String(value));
      } else {
        params.delete(key);
      }
    });
    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilters({
      category: "",
      minPrice: 0,
      maxPrice: MAX_PRICE,
      inStock: false,
    });
    setSearchParams({ q: query });
  };

  return (
    <div>
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full md:w-64 space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Filters</h3>
              <Button
                variant="outline"
                className="w-full mb-4"
                onClick={clearFilters}
              >
                Clear Filters
              </Button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select
                value={filters.category}
                onValueChange={(value) => updateFilters({ category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Price Range</label>
              <div className="pt-6">
                <Slider
                  min={0}
                  max={MAX_PRICE}
                  step={10}
                  value={[filters.minPrice, filters.maxPrice]}
                  onValueChange={([min, max]) =>
                    updateFilters({ minPrice: min, maxPrice: max })
                  }
                />
                <div className="flex justify-between mt-2 text-sm text-gray-600">
                  <span>${filters.minPrice}</span>
                  <span>${filters.maxPrice}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.inStock}
                  onChange={(e) => updateFilters({ inStock: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <span className="text-sm font-medium">In Stock Only</span>
              </label>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-4">
                {query ? `Search Results for "${query}"` : "All Products"}
              </h2>
              <div className="flex flex-wrap gap-2">
                {Object.entries(filters).map(([key, value]) => {
                  if (!value || (key === "maxPrice" && value === MAX_PRICE)) return null;
                  return (
                    <Badge key={key} variant="secondary">
                      {key === "minPrice"
                        ? `Min $${value}`
                        : key === "maxPrice"
                        ? `Max $${value}`
                        : key === "inStock"
                        ? "In Stock"
                        : `${key}: ${value}`}
                    </Badge>
                  );
                })}
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 rounded-lg aspect-square mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  </div>
                ))}
              </div>
            ) : !products?.length ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No products found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    title={product.title}
                    price={product.price}
                    image={product.image_url}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
