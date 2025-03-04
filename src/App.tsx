
import { Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import Cart from "@/pages/Cart";
import ResetPassword from "@/pages/ResetPassword";
import AdminDashboard from "@/pages/AdminDashboard";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AdminRoute } from "@/components/AdminRoute";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/auth";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import Search from "@/pages/Search";
import Checkout from "@/pages/Checkout";
import Orders from "@/pages/Orders";
import OrderTracking from "@/pages/OrderTracking";

function App() {
  return (
    <ThemeProvider defaultTheme="light" attribute="class">
      <AuthProvider>
        <CartProvider>
          <main>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/search" element={<Search />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/track-order" element={<OrderTracking />} />
              
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/admin" element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } />
              
              <Route path="/orders" element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              } />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Toaster />
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
