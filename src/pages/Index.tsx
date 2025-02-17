
import NavBar from "@/components/NavBar";
import ProductCard from "@/components/ProductCard";

const FEATURED_PRODUCTS = [
  {
    id: 1,
    title: "Premium Wireless Headphones",
    price: 299.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
  },
  {
    id: 2,
    title: "Smart Watch Series 5",
    price: 399.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80",
  },
  {
    id: 3,
    title: "Professional Camera Kit",
    price: 1299.99,
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&q=80",
  },
  {
    id: 4,
    title: "Designer Sunglasses",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&q=80",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <NavBar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <section className="mb-16 text-center animate-fade-in">
          <h1 className="text-4xl font-bold mb-4">Welcome to Store</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our curated collection of premium products
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-8">Featured Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURED_PRODUCTS.map((product) => (
              <ProductCard
                key={product.id}
                title={product.title}
                price={product.price}
                image={product.image}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
