
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ScanBarcode, ShoppingCart, CreditCard, Truck } from "lucide-react";
import Layout from '@/components/Layout';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/utils';

const Index = () => {
  const { user } = useAuth();
  const { totalItems, totalPrice } = useCart();
  const navigate = useNavigate();
  
  if (!user) {
    navigate('/login');
    return null;
  }
  
  return (
    <Layout>
      <div className="space-y-8 pb-8">
        <div className="text-center mt-4 space-y-2">
          <h1 className="text-3xl font-bold">Welcome, {user.name}!</h1>
          <p className="text-gray-600">Scan products and checkout with ease</p>
        </div>
        
        <div className="grid gap-6 mb-8">
          <Button 
            onClick={() => navigate('/scan')}
            className="flex items-center justify-center py-8 text-xl bg-brand hover:bg-brand-dark"
          >
            <ScanBarcode className="mr-3 h-6 w-6" />
            Scan Products
          </Button>
          
          <div className="grid md:grid-cols-2 gap-4">
            <Button 
              onClick={() => navigate('/cart')} 
              variant="outline"
              className="py-6 text-lg border-2"
            >
              <ShoppingCart className="mr-3 h-5 w-5" />
              View Cart
              {totalItems > 0 && (
                <span className="ml-2 bg-brand text-white rounded-full h-6 w-6 inline-flex items-center justify-center text-sm">
                  {totalItems}
                </span>
              )}
            </Button>
            
            <Button 
              onClick={() => navigate('/checkout')}
              variant="outline"
              className="py-6 text-lg border-2"
              disabled={totalItems === 0}
            >
              <CreditCard className="mr-3 h-5 w-5" />
              Checkout
              {totalPrice > 0 && (
                <span className="ml-2 text-brand font-medium">
                  ₦{formatCurrency(totalPrice)}
                </span>
              )}
            </Button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">How It Works</h2>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-brand/10 p-3 rounded-full mr-4">
                <ScanBarcode className="h-6 w-6 text-brand" />
              </div>
              <div>
                <h3 className="font-medium">1. Scan Products</h3>
                <p className="text-gray-600 text-sm">Use your phone's camera to scan product barcodes</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-brand/10 p-3 rounded-full mr-4">
                <ShoppingCart className="h-6 w-6 text-brand" />
              </div>
              <div>
                <h3 className="font-medium">2. Add to Cart</h3>
                <p className="text-gray-600 text-sm">View product details and add to your shopping cart</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-brand/10 p-3 rounded-full mr-4">
                <CreditCard className="h-6 w-6 text-brand" />
              </div>
              <div>
                <h3 className="font-medium">3. Easy Checkout</h3>
                <p className="text-gray-600 text-sm">Fast and secure payment with Nigerian banks</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-brand/10 p-3 rounded-full mr-4">
                <Truck className="h-6 w-6 text-brand" />
              </div>
              <div>
                <h3 className="font-medium">4. Skip the Queue</h3>
                <p className="text-gray-600 text-sm">Show receipt to the staff and walk out with your items</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
