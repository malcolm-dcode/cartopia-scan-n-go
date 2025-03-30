
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ShoppingCart, 
  User, 
  LogOut,
  Search,
  ScanBarcode
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { Badge } from "@/components/ui/badge";

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  if (!user) {
    return null; // Don't show navbar if user is not authenticated
  }
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex items-center justify-between w-full">
          <Link to="/" className="flex items-center space-x-2">
            <ShoppingCart className="h-6 w-6 text-brand" />
            <span className="font-bold text-xl text-brand">CartScan</span>
          </Link>
          
          <div className="flex items-center md:space-x-4 space-x-2">
            <Link to="/scan" className={`p-2 rounded-full ${isActive('/scan') ? 'bg-brand/10 text-brand' : 'hover:bg-gray-100'}`}>
              <ScanBarcode className="h-5 w-5" />
            </Link>
            
            <Link to="/cart" className="relative p-2 rounded-full hover:bg-gray-100">
              <ShoppingCart className={`h-5 w-5 ${isActive('/cart') ? 'text-brand' : ''}`} />
              {totalItems > 0 && (
                <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {totalItems}
                </Badge>
              )}
            </Link>
            
            <Link to="/profile" className={`p-2 rounded-full ${isActive('/profile') ? 'bg-brand/10 text-brand' : 'hover:bg-gray-100'}`}>
              <User className="h-5 w-5" />
            </Link>
            
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleLogout}
              className="hidden md:flex"
              aria-label="Logout"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
