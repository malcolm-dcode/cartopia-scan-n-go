
import React from 'react';
import { Product } from '@/context/CartContext';
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  inCart?: boolean;
  quantity?: number;
  onAddToCart?: () => void;
  onIncreaseQuantity?: () => void;
  onDecreaseQuantity?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  inCart = false,
  quantity = 0,
  onAddToCart,
  onIncreaseQuantity,
  onDecreaseQuantity
}) => {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-square w-full bg-gray-100 relative overflow-hidden">
        <img 
          src={product.imageUrl || '/placeholder.svg'} 
          alt={product.name}
          className="object-cover w-full h-full transition-transform hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder.svg';
          }}
        />
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-base line-clamp-1">{product.name}</h3>
          <span className="font-bold text-brand">₦{formatCurrency(product.price)}</span>
        </div>
        
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{product.description || 'No description available'}</p>
        
        {inCart ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8"
                onClick={onDecreaseQuantity}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium w-6 text-center">{quantity}</span>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8"
                onClick={onIncreaseQuantity}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-sm font-medium">
              ₦{formatCurrency(product.price * quantity)}
            </div>
          </div>
        ) : (
          <Button 
            onClick={onAddToCart} 
            className="w-full bg-brand hover:bg-brand-dark"
            size="sm"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductCard;
