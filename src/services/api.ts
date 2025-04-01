
import { supabase } from "@/integrations/supabase/client";
import { TableRow } from "@/types/database";
import { Product } from "@/context/CartContext";

// API methods
export const api = {
  // Search for product by barcode
  getProductByBarcode: async (barcode: string): Promise<Product> => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('barcode', barcode)
        .single();
      
      if (error) {
        throw new Error('Product not found');
      }
      
      // Map database fields to the Product interface
      const product: Product = {
        id: data.id,
        name: data.name,
        price: data.price,
        barcode: data.barcode,
        description: data.description,
        imageUrl: data.image_url, // Map image_url to imageUrl
        uniqueId: data.id // Default uniqueId to id
      };
      
      return product;
    } catch (error) {
      throw new Error('Product not found');
    }
  },
  
  // Process checkout and create order
  processCheckout: async (items: any[], paymentDetails: any) => {
    try {
      // Simple validation
      if (!items.length) {
        throw new Error('Cart is empty');
      }
      
      // Validate payment details based on payment method
      if (paymentDetails.method === 'card') {
        if (!paymentDetails.cardNumber || !paymentDetails.expiryDate || !paymentDetails.cvv) {
          throw new Error('Invalid card payment details');
        }
      } else if (paymentDetails.method === 'bank_transfer') {
        if (!paymentDetails.reference) {
          throw new Error('Invalid bank transfer reference');
        }
      }
      
      // Get the current authenticated user
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('You must be logged in to checkout');
      }
      
      // Calculate total price
      const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
      
      // Create a new order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: session.user.id,
          order_number: `ORD-${Math.floor(Math.random() * 1000000)}`,
          total: total,
          status: 'Completed'
        })
        .select()
        .single();
      
      if (orderError || !orderData) {
        throw new Error('Error creating order');
      }
      
      // Create order items
      const orderItems = items.map(item => ({
        order_id: orderData.id,
        product_id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity
      }));
      
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);
      
      if (itemsError) {
        throw new Error('Error creating order items');
      }
      
      return {
        success: true,
        orderId: orderData.order_number,
        timestamp: orderData.created_at
      };
    } catch (error: any) {
      throw error;
    }
  },
  
  // Get order history for a user
  getUserOrders: async (userId: string) => {
    try {
      // Get all orders for this user
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (ordersError || !orders) {
        throw new Error('Error fetching orders');
      }
      
      // For each order, get its items
      const ordersWithItems = await Promise.all(orders.map(async (order) => {
        const { data: items, error: itemsError } = await supabase
          .from('order_items')
          .select('*')
          .eq('order_id', order.id);
        
        if (itemsError) {
          throw new Error('Error fetching order items');
        }
        
        return {
          id: order.order_number,
          date: new Date(order.created_at).toISOString().split('T')[0],
          items: (items || []).map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price
          })),
          total: order.total,
          status: order.status
        };
      }));
      
      return ordersWithItems;
    } catch (error) {
      console.error('Error in getUserOrders:', error);
      return [];
    }
  },
  
  // Simulate connecting to store inventory system
  verifyStoreConnection: async (storeId: string) => {
    // For demo purposes, always return success
    return {
      connected: true,
      storeName: 'Demo Supermarket',
      location: 'Lagos, Nigeria',
      connectionId: `CONN-${storeId}`
    };
  }
};
