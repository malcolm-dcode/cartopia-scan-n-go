import React, { createContext, useState, useContext, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from './AuthContext';

// Types
export interface Product {
  id: string;
  name: string;
  price: number;
  barcode: string;
  imageUrl: string;
  description?: string;
  uniqueId?: string; // Added to track individual scan instances
}

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

// Create the context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Provider component
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Load cart from localStorage when user changes
  useEffect(() => {
    if (user) {
      const savedCart = localStorage.getItem(`cart_${user.id}`);
      if (savedCart) {
        try {
          setItems(JSON.parse(savedCart));
        } catch (error) {
          console.error('Failed to parse cart from localStorage:', error);
        }
      }
    } else {
      // Clear cart when user logs out
      setItems([]);
    }
  }, [user]);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(`cart_${user.id}`, JSON.stringify(items));
    }
  }, [items, user]);
  
  const addItem = (product: Product) => {
    setItems(currentItems => {
      // If the product has a uniqueId, treat it as a new item
      // Otherwise, check if the item with the same product ID exists
      const identifier = product.uniqueId || product.id;
      const existingItemIndex = currentItems.findIndex(
        item => (item.product.uniqueId && item.product.uniqueId === identifier) || 
              (!item.product.uniqueId && !product.uniqueId && item.product.id === product.id)
      );
      
      if (existingItemIndex > -1) {
        // Increment quantity if item exists
        const updatedItems = [...currentItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1
        };
        return updatedItems;
      } else {
        // Add new item
        return [...currentItems, { product, quantity: 1 }];
      }
    });
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };
  
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(productId);
      return;
    }
    
    setItems(currentItems => 
      currentItems.map(item => {
        // Check both uniqueId and id for matching
        const itemId = item.product.uniqueId || item.product.id;
        return itemId === productId ? { ...item, quantity } : item;
      })
    );
  };
  
  const removeItem = (productId: string) => {
    const itemToRemove = items.find(item => {
      const itemId = item.product.uniqueId || item.product.id;
      return itemId === productId;
    });
    
    setItems(currentItems => 
      currentItems.filter(item => {
        const itemId = item.product.uniqueId || item.product.id;
        return itemId !== productId;
      })
    );
    
    if (itemToRemove) {
      toast({
        title: "Removed from cart",
        description: `${itemToRemove.product.name} has been removed from your cart.`,
      });
    }
  };
  
  const clearCart = () => {
    setItems([]);
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart.",
    });
  };
  
  // Calculate total items
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  
  // Calculate total price
  const totalPrice = items.reduce(
    (total, item) => total + item.product.price * item.quantity, 
    0
  );
  
  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        totalItems,
        totalPrice
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook for using the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
