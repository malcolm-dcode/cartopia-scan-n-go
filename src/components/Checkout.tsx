import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatCurrency } from '@/lib/utils';
import { api } from '@/services/api';
import { CreditCard, Check, ArrowLeft, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export const Checkout: React.FC = () => {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');
  const [processing, setProcessing] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Add items to your cart before checkout",
        variant: "destructive"
      });
      return;
    }
    
    // Simple validation
    if (!cardNumber || !expiryDate || !cvv || !name) {
      toast({
        title: "Missing information",
        description: "Please fill in all payment details",
        variant: "destructive"
      });
      return;
    }
    
    setProcessing(true);
    
    try {
      const result = await api.processCheckout(items, {
        cardNumber,
        expiryDate,
        cvv,
        name
      });
      
      if (result.success) {
        toast({
          title: "Payment successful!",
          description: `Order ID: ${result.orderId}`,
        });
        
        clearCart();
        navigate('/success', { 
          state: { 
            orderId: result.orderId,
            timestamp: result.timestamp
          } 
        });
      }
    } catch (error) {
      toast({
        title: "Payment failed",
        description: error.message || "An error occurred during checkout",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };
  
  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, '').substring(0, 16);
    
    // Split into groups of 4
    const groups = [];
    for (let i = 0; i < digits.length; i += 4) {
      groups.push(digits.substring(i, i + 4));
    }
    
    return groups.join(' ');
  };
  
  const formatExpiryDate = (value: string) => {
    const digits = value.replace(/\D/g, '').substring(0, 4);
    
    if (digits.length > 2) {
      return `${digits.substring(0, 2)}/${digits.substring(2)}`;
    }
    
    return digits;
  };
  
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/cart')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Cart
        </Button>
        
        <h1 className="text-2xl font-bold mb-2">Checkout</h1>
        <p className="text-gray-500">Complete your order by providing payment details</p>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
        <div className="flex justify-between py-2">
          <span className="text-gray-600">Items ({items.length}):</span>
          <span>₦{formatCurrency(totalPrice)}</span>
        </div>
        <div className="flex justify-between py-2 border-t border-dashed">
          <span className="font-bold">Total:</span>
          <span className="font-bold text-brand">₦{formatCurrency(totalPrice)}</span>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-lg font-medium mb-4">Payment Details</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Cardholder Name</Label>
              <Input 
                id="name"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={processing}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <div className="relative">
                <Input 
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  disabled={processing}
                />
                <CreditCard className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input 
                  id="expiryDate"
                  placeholder="MM/YY"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                  disabled={processing}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input 
                  id="cvv"
                  placeholder="123"
                  type="password"
                  maxLength={3}
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').substring(0, 3))}
                  disabled={processing}
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full py-6 mt-4 bg-brand hover:bg-brand-dark"
              disabled={processing}
            >
              {processing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Pay ₦{formatCurrency(totalPrice)}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
      
      <div className="mt-4 text-center text-xs text-gray-500">
        <p>This is a demo app. No actual payment will be processed.</p>
      </div>
    </div>
  );
};

export default Checkout;
