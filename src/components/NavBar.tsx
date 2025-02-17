
import { ShoppingCart, Search, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 w-full bg-white bg-opacity-80 backdrop-blur-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <a href="/" className="text-xl font-semibold">
              Store
            </a>
          </div>
          
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="search"
                placeholder="Search products..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white bg-opacity-90 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition duration-150 ease-in-out"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")} className="nav-link">
                  <User className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="nav-link relative">
                  <ShoppingCart className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-4 w-4 text-xs flex items-center justify-center bg-primary text-primary-foreground rounded-full">
                    0
                  </span>
                </Button>
                <Button variant="ghost" size="icon" onClick={() => signOut()}>
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <Button variant="default" onClick={() => navigate("/auth")}>
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
