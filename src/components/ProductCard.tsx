
import React from 'react';
import { Product } from '@/context/CartContext';
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus, Minus, ImageOff } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
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
  // Use uniqueId as a key if available, otherwise fall back to regular id
  const productId = product.uniqueId || product.id;
  
  return (
    <Card className="overflow-hidden shadow-md">
      <div className="relative">
        <AspectRatio ratio={1 / 1}>
          {product.imageUrl ? (
            <img 
              src={product.imageUrl} 
              alt={product.name}
              className="object-cover w-full h-full transition-transform hover:scale-105"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder.svg';
              }}
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-gray-100">
              <ImageOff className="w-12 h-12 text-gray-400" />
            </div>
          )}
        </AspectRatio>
        {product.barcode && (
          <div className="absolute top-2 right-2">
            <span className="bg-black/60 text-white text-xs px-2 py-1 rounded-md">
              {product.barcode}
            </span>
          </div>
        )}
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
