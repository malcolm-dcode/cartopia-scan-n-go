import React from 'react';
import { useCart, CartItem } from '@/context/CartContext';
import { ProductCard } from './ProductCard';
import { Button } from '@/components/ui/button';
import { ShoppingCart, ArrowRight, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";

export const Cart: React.FC = () => {
  const { items, updateQuantity, removeItem, clearCart, totalPrice } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleCheckout = () => {
    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Add items to your cart before checkout",
        variant: "destructive"
      });
      return;
    }
    
    navigate('/checkout');
  };
  
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="bg-gray-100 rounded-full p-6 mb-6">
          <ShoppingCart className="h-12 w-12 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Start shopping by scanning products</p>
        <Button onClick={() => navigate('/scan')} className="bg-brand hover:bg-brand-dark">
          Scan Products
        </Button>
      </div>
    );
  }
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Cart</h1>
        <Button 
          variant="outline" 
          size="sm"
          onClick={clearCart}
          className="text-red-500 border-red-200 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Clear Cart
        </Button>
      </div>
      
      <div className="grid gap-4 mb-8">
        {items.map((item: CartItem) => (
          <ProductCard 
            key={item.product.id}
            product={item.product}
            inCart={true}
            quantity={item.quantity}
            onIncreaseQuantity={() => updateQuantity(item.product.id, item.quantity + 1)}
            onDecreaseQuantity={() => updateQuantity(item.product.id, item.quantity - 1)}
          />
        ))}
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-sm border mb-4">
        <div className="flex justify-between py-2">
          <span className="text-gray-600">Subtotal:</span>
          <span>₦{formatCurrency(totalPrice)}</span>
        </div>
        <div className="flex justify-between py-2 border-t border-dashed">
          <span className="font-bold">Total:</span>
          <span className="font-bold text-brand">₦{formatCurrency(totalPrice)}</span>
        </div>
      </div>
      
      <Button 
        onClick={handleCheckout} 
        className="w-full py-6 text-lg bg-brand hover:bg-brand-dark"
      >
        Proceed to Checkout
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
    </div>
  );
};

export default Cart;
