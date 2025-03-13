
import { useState, useEffect, useCallback, memo } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import NavBar from "@/components/NavBar";
import ProductCard from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Filter, Search as SearchIcon } from "lucide-react";

interface Product {
  id: string;
  title: string;
  price: number;
  image_url: string;
  category: string;
  description: string;
}

// Memoized components for better performance
const SearchForm = memo(({ 
  searchQuery, 
  setSearchQuery, 
  selectedCategory, 
  setSelectedCategory,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  categories,
  onSubmit,
  onClearFilters
}: {
  searchQuery: string,
  setSearchQuery: (value: string) => void,
  selectedCategory: string,
  setSelectedCategory: (value: string) => void,
  minPrice: string,
  setMinPrice: (value: string) => void,
  maxPrice: string,
  setMaxPrice: (value: string) => void,
  categories: string[],
  onSubmit: (e: React.FormEvent) => void,
  onClearFilters: () => void
}) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label htmlFor="search" className="block text-sm font-medium mb-1">
          Search
        </label>
        <div className="relative">
          <Input
            id="search"
            placeholder="Search by product name, description or category"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <SearchIcon size={16} />
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium mb-1">
          Category
        </label>
        <Select
          value={selectedCategory}
          onValueChange={setSelectedCategory}
        >
          <SelectTrigger id="category">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label htmlFor="minPrice" className="block text-sm font-medium mb-1">
            Min Price
          </label>
          <Input
            id="minPrice"
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            min="0"
          />
        </div>
        <div>
          <label htmlFor="maxPrice" className="block text-sm font-medium mb-1">
            Max Price
          </label>
          <Input
            id="maxPrice"
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            min="0"
          />
        </div>
      </div>
    </div>

    <div className="flex justify-between">
      <Button type="submit" className="w-full md:w-auto">
        Apply Filters
      </Button>
      <Button 
        type="button" 
        variant="outline" 
        onClick={onClearFilters}
        className="w-full md:w-auto mt-2 md:mt-0"
      >
        Clear All
      </Button>
    </div>
  </form>
));

SearchForm.displayName = "SearchForm";

// Memoized filter badge component
const FilterBadge = memo(({ 
  label, 
  value, 
  onRemove 
}: { 
  label: string, 
  value: string, 
  onRemove: () => void 
}) => (
  <Badge variant="outline" className="flex items-center gap-1">
    {label}: {value}
    <X 
      className="h-3 w-3 cursor-pointer" 
      onClick={onRemove} 
    />
  </Badge>
));

FilterBadge.displayName = "FilterBadge";

// Memoized product grid component
const ProductGrid = memo(({ products }: { products: Product[] }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {products.map((product) => (
      <ProductCard
        key={product.id}
        id={product.id}
        title={product.title}
        price={product.price}
        image={product.image_url || "/placeholder.svg"}
      />
    ))}
  </div>
));

ProductGrid.displayName = "ProductGrid";

// Memoized loading component
const LoadingSpinner = memo(() => (
  <div className="flex justify-center py-20">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
));

LoadingSpinner.displayName = "LoadingSpinner";

// Memoized empty results component
const EmptyResults = memo(({ onClearFilters }: { onClearFilters: () => void }) => (
  <div className="text-center py-20">
    <h2 className="text-2xl font-semibold mb-2">No products found</h2>
    <p className="text-gray-600 mb-6">
      Try adjusting your search or filter criteria
    </p>
    <Button onClick={onClearFilters}>View All Products</Button>
  </div>
));

EmptyResults.displayName = "EmptyResults";

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const categoryFilter = searchParams.get("category") || "";
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(query);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(categoryFilter);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  
  const { toast } = useToast();

  // Optimize data fetching to make it more efficient
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      let productsQuery = supabase
        .from("products")
        .select("id, title, price, image_url, category, description")
        .order("created_at", { ascending: false });

      // Apply search filter (search in title, description, and category)
      if (query) {
        productsQuery = productsQuery.or(
          `title.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`
        );
      }

      // Apply category filter
      if (categoryFilter) {
        productsQuery = productsQuery.eq("category", categoryFilter);
      }

      // Apply min price filter
      if (searchParams.get("min_price")) {
        const min = parseFloat(searchParams.get("min_price") || "0");
        productsQuery = productsQuery.gte("price", min);
      }
      
      // Apply max price filter
      if (searchParams.get("max_price")) {
        const max = parseFloat(searchParams.get("max_price") || "1000000");
        productsQuery = productsQuery.lte("price", max);
      }

      const { data, error } = await productsQuery;

      if (error) throw error;

      setProducts(data as Product[]);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error fetching products",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  }, [query, categoryFilter, searchParams, toast]);

  const fetchCategories = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("category")
        .not("category", "is", null)
        .order("category");

      if (error) throw error;

      const uniqueCategories = Array.from(
        new Set(data.map((item) => item.category))
      ).filter(Boolean) as string[];

      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    updateSearchParams();
  }, []);

  const updateSearchParams = useCallback(() => {
    const params = new URLSearchParams();
    
    if (searchQuery.trim()) {
      params.set("q", searchQuery.trim());
    } else {
      params.delete("q");
    }
    
    if (selectedCategory) {
      params.set("category", selectedCategory);
    } else {
      params.delete("category");
    }
    
    if (minPrice) {
      params.set("min_price", minPrice);
    } else {
      params.delete("min_price");
    }
    
    if (maxPrice) {
      params.set("max_price", maxPrice);
    } else {
      params.delete("max_price");
    }
    
    setSearchParams(params);
  }, [searchQuery, selectedCategory, minPrice, maxPrice, setSearchParams]);

  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedCategory("");
    setMinPrice("");
    setMaxPrice("");
    setSearchParams(new URLSearchParams());
  }, [setSearchParams]);

  const removeFilter = useCallback((filterName: string) => {
    const params = new URLSearchParams(searchParams);
    params.delete(filterName);
    setSearchParams(params);

    if (filterName === "q") setSearchQuery("");
    if (filterName === "category") setSelectedCategory("");
    if (filterName === "min_price") setMinPrice("");
    if (filterName === "max_price") setMaxPrice("");
  }, [searchParams, setSearchParams]);

  const toggleShowFilters = useCallback(() => {
    setShowFilters(prev => !prev);
  }, []);

  return (
    <div>
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            {query ? `Search Results: "${query}"` : "All Products"}
          </h1>
          <Button 
            variant="outline" 
            size="sm"
            onClick={toggleShowFilters}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>

        {showFilters && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <SearchForm 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              minPrice={minPrice}
              setMinPrice={setMinPrice}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              categories={categories}
              onSubmit={handleSearch}
              onClearFilters={clearFilters}
            />
          </div>
        )}

        {/* Active filters */}
        {(query || categoryFilter || searchParams.get("min_price") || searchParams.get("max_price")) && (
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="text-sm font-medium py-1">Active filters:</span>
            {query && (
              <FilterBadge 
                label="Search" 
                value={query} 
                onRemove={() => removeFilter("q")} 
              />
            )}
            {categoryFilter && (
              <FilterBadge 
                label="Category" 
                value={categoryFilter} 
                onRemove={() => removeFilter("category")} 
              />
            )}
            {searchParams.get("min_price") && (
              <FilterBadge 
                label="Min Price" 
                value={`$${searchParams.get("min_price")}`} 
                onRemove={() => removeFilter("min_price")} 
              />
            )}
            {searchParams.get("max_price") && (
              <FilterBadge 
                label="Max Price" 
                value={`$${searchParams.get("max_price")}`} 
                onRemove={() => removeFilter("max_price")} 
              />
            )}
          </div>
        )}

        {loading ? (
          <LoadingSpinner />
        ) : products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <EmptyResults onClearFilters={clearFilters} />
        )}
      </div>
    </div>
  );
};

export default Search;
