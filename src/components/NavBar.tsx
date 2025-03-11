
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { useCart } from "@/contexts/CartContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
  SearchIcon, 
  ShoppingCart, 
  User, 
  Menu, 
  X,
  Package,
  Home
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet";

const NavBar = () => {
  const { user, profile, signOut } = useAuth();
  const { state } = useCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      if (isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    }
  };

  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isSigningOut) return;
    
    try {
      setIsSigningOut(true);
      console.log("Initiating sign out...");
      await signOut();
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="font-bold text-2xl">
            MeroPasal
          </Link>

          {/* Desktop Search */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Search products..."
                className="w-full pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
              >
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </button>
            </div>
          </form>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="flex items-center text-gray-700 hover:text-gray-900">
              <Home className="h-5 w-5 mr-1" />
              <span>Home</span>
            </Link>
            
            <Link to="/track-order" className="flex items-center text-gray-700 hover:text-gray-900">
              <Package className="h-5 w-5 mr-1" />
              <span>Track Order</span>
            </Link>
            
            <Link to="/cart" className="flex items-center text-gray-700 hover:text-gray-900 relative">
              <ShoppingCart className="h-5 w-5" />
              {state.items.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {state.items.length}
                </span>
              )}
            </Link>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={profile?.avatar_url || ""}
                        alt={profile?.full_name || user.email || ""}
                      />
                      <AvatarFallback>
                        {profile?.full_name?.[0] || user.email?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/orders")}>
                    Orders
                  </DropdownMenuItem>
                  {profile?.is_admin && (
                    <DropdownMenuItem onClick={() => navigate("/admin")}>
                      Admin Dashboard
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} disabled={isSigningOut}>
                    {isSigningOut ? "Signing out..." : "Log out"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="outline" size="sm" onClick={() => navigate("/auth")}>
                <User className="h-4 w-4 mr-2" /> Sign In
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <Link to="/cart" className="mr-4 relative">
              <ShoppingCart className="h-6 w-6" />
              {state.items.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {state.items.length}
                </span>
              )}
            </Link>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[80%] sm:w-[350px] p-0">
                <div className="flex flex-col h-full">
                  {/* Mobile Search */}
                  <div className="p-4 border-b">
                    <form onSubmit={handleSearch} className="relative">
                      <Input
                        type="text"
                        placeholder="Search products..."
                        className="w-full pr-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <button
                        type="submit"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      >
                        <SearchIcon className="h-5 w-5 text-gray-400" />
                      </button>
                    </form>
                  </div>

                  {/* Mobile Navigation */}
                  <div className="flex-1 overflow-auto py-4">
                    <SheetClose asChild>
                      <Link to="/" className="flex items-center p-4 hover:bg-gray-100">
                        <Home className="h-5 w-5 mr-3" />
                        <span className="font-medium">Home</span>
                      </Link>
                    </SheetClose>
                    
                    <SheetClose asChild>
                      <Link to="/track-order" className="flex items-center p-4 hover:bg-gray-100">
                        <Package className="h-5 w-5 mr-3" />
                        <span className="font-medium">Track Order</span>
                      </Link>
                    </SheetClose>
                    
                    <SheetClose asChild>
                      <Link to="/cart" className="flex items-center p-4 hover:bg-gray-100">
                        <ShoppingCart className="h-5 w-5 mr-3" />
                        <span className="font-medium">Cart</span>
                        {state.items.length > 0 && (
                          <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {state.items.length}
                          </span>
                        )}
                      </Link>
                    </SheetClose>
                  </div>

                  {/* Mobile User Menu */}
                  <div className="border-t p-4">
                    {user ? (
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarImage
                              src={profile?.avatar_url || ""}
                              alt={profile?.full_name || user.email || ""}
                            />
                            <AvatarFallback>
                              {profile?.full_name?.[0] || user.email?.[0] || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {profile?.full_name || user.email}
                            </p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <SheetClose asChild>
                            <Button variant="ghost" className="w-full justify-start" onClick={() => navigate("/dashboard")}>
                              Dashboard
                            </Button>
                          </SheetClose>
                          <SheetClose asChild>
                            <Button variant="ghost" className="w-full justify-start" onClick={() => navigate("/orders")}>
                              Orders
                            </Button>
                          </SheetClose>
                          {profile?.is_admin && (
                            <SheetClose asChild>
                              <Button variant="ghost" className="w-full justify-start" onClick={() => navigate("/admin")}>
                                Admin Dashboard
                              </Button>
                            </SheetClose>
                          )}
                          <Button variant="destructive" className="w-full" onClick={handleSignOut} disabled={isSigningOut}>
                            {isSigningOut ? "Signing out..." : "Log out"}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <SheetClose asChild>
                        <Button className="w-full" onClick={() => navigate("/auth")}>
                          <User className="h-4 w-4 mr-2" /> Sign In
                        </Button>
                      </SheetClose>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
