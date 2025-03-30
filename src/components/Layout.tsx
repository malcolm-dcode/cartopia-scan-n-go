
import React from 'react';
import { Navbar } from './Navbar';
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
  hideNavbar?: boolean;
  className?: string;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  hideNavbar = false,
  className 
}) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {!hideNavbar && <Navbar />}
      <main className={cn(
        "flex-1 container mx-auto px-4 pb-6 pt-2",
        hideNavbar ? "pt-4" : "",
        className
      )}>
        {children}
      </main>
      <Toaster position="top-center" />
    </div>
  );
};

export default Layout;
