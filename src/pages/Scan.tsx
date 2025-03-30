import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import Scanner from '@/components/Scanner';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { useCart, Product } from '@/context/CartContext';
import { ArrowLeft } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const Scan = () => {
  const [scannedProduct, setScannedProduct] = useState<Product | null>(null);
  const { addItem } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleScan = (product: Product) => {
    setScannedProduct(product);
  };
  
  const handleError = (message: string) => {
    toast({
      title: "Scan Error",
      description: message,
      variant: "destructive"
    });
  };
  
  const handleAddToCart = () => {
    if (scannedProduct) {
      addItem(scannedProduct);
      setScannedProduct(null);
    }
  };
  
  const handleContinueShopping = () => {
    setScannedProduct(null);
  };
  
  const handleViewCart = () => {
    navigate('/cart');
  };
  
  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="p-0"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-xl font-bold">Scan Products</h1>
        <div className="w-10"></div> {/* Empty div for alignment */}
      </div>
      
      {scannedProduct ? (
        <div className="space-y-6">
          <div className="max-w-sm mx-auto">
            <ProductCard 
              product={scannedProduct} 
              onAddToCart={handleAddToCart}
            />
          </div>
          
          <div className="flex flex-col space-y-3">
            <Button 
              onClick={handleAddToCart}
              className="py-6 bg-brand hover:bg-brand-dark"
            >
              Add to Cart
            </Button>
            <Button 
              onClick={handleContinueShopping}
              variant="outline"
              className="py-6"
            >
              Scan Another Product
            </Button>
            <Button 
              onClick={handleViewCart}
              variant="ghost"
              className="py-6"
            >
              View Cart
            </Button>
          </div>
        </div>
      ) : (
        <Scanner onScan={handleScan} onError={handleError} />
      )}
    </Layout>
  );
};

export default Scan;
