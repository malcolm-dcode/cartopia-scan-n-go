
// Mock product database
const productDatabase: Record<string, any> = {
  // Snacks
  '8901491004881': {
    id: '1',
    name: 'Potato Chips',
    price: 150.00,
    barcode: '8901491004881',
    imageUrl: '/assets/chips.png',
    description: 'Crunchy potato chips with sea salt'
  },
  '5449000267412': {
    id: '2',
    name: 'Coca Cola',
    price: 120.00,
    barcode: '5449000267412',
    imageUrl: '/assets/coke.png',
    description: '500ml refreshing cola drink'
  },
  '4902220013876': {
    id: '3',
    name: 'Chocolate Bar',
    price: 250.00,
    barcode: '4902220013876',
    imageUrl: '/assets/chocolate.png',
    description: 'Milk chocolate with nuts'
  },
  // Household items
  '8901396317501': {
    id: '4',
    name: 'Dish Soap',
    price: 350.00,
    barcode: '8901396317501',
    imageUrl: '/assets/dishsoap.png',
    description: '500ml antibacterial dish washing liquid'
  },
  '8901023015373': {
    id: '5',
    name: 'Laundry Detergent',
    price: 800.00,
    barcode: '8901023015373',
    imageUrl: '/assets/detergent.png',
    description: '2kg powder for all washing machines'
  },
  // Electronics
  '6925582900016': {
    id: '6',
    name: 'USB Cable',
    price: 1200.00,
    barcode: '6925582900016',
    imageUrl: '/assets/usbcable.png',
    description: '1.5m fast charging cable'
  },
  // Food items
  '8901725132828': {
    id: '7',
    name: 'Instant Noodles',
    price: 80.00,
    barcode: '8901725132828',
    imageUrl: '/assets/noodles.png',
    description: 'Ready in 2 minutes, chicken flavor'
  },
  '8901063010638': {
    id: '8',
    name: 'Bread Loaf',
    price: 250.00,
    barcode: '8901063010638',
    imageUrl: '/assets/bread.png',
    description: 'Fresh whole wheat bread'
  },
  '8901030584350': {
    id: '9',
    name: 'Milk Carton',
    price: 320.00,
    barcode: '8901030584350',
    imageUrl: '/assets/milk.png',
    description: '1L full cream milk'
  },
  '8901030615863': {
    id: '10',
    name: 'Eggs',
    price: 450.00,
    barcode: '8901030615863',
    imageUrl: '/assets/eggs.png',
    description: 'Pack of 12 farm fresh eggs'
  },
  // Use this for testing when no barcode is available
  'test123': {
    id: '11',
    name: 'Test Product',
    price: 500.00,
    barcode: 'test123',
    imageUrl: '/assets/sample.png',
    description: 'Test product for demo purposes'
  }
};

// Simulate API call delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// API methods
export const api = {
  // Search for product by barcode
  getProductByBarcode: async (barcode: string) => {
    await delay(800); // Simulate network request
    
    const product = productDatabase[barcode];
    if (!product) {
      throw new Error('Product not found');
    }
    
    return product;
  },
  
  // Simulate a checkout process
  processCheckout: async (items: any[], paymentDetails: any) => {
    await delay(2000); // Simulate payment processing
    
    // Simple validation
    if (!items.length) {
      throw new Error('Cart is empty');
    }
    
    if (!paymentDetails.cardNumber || !paymentDetails.expiryDate || !paymentDetails.cvv) {
      throw new Error('Invalid payment details');
    }
    
    // In a real app, this would connect to a payment gateway
    return {
      success: true,
      orderId: `ORD-${Math.floor(Math.random() * 1000000)}`,
      timestamp: new Date().toISOString()
    };
  },
  
  // Get order history for a user
  getUserOrders: async (userId: string) => {
    await delay(1000);
    
    // Mock order history
    return [
      {
        id: 'ORD-123456',
        date: '2023-06-15',
        items: [
          { name: 'Potato Chips', quantity: 2, price: 150.00 },
          { name: 'Coca Cola', quantity: 1, price: 120.00 }
        ],
        total: 420.00,
        status: 'Completed'
      },
      {
        id: 'ORD-123457',
        date: '2023-06-10',
        items: [
          { name: 'Bread Loaf', quantity: 1, price: 250.00 },
          { name: 'Milk Carton', quantity: 2, price: 320.00 }
        ],
        total: 890.00,
        status: 'Completed'
      }
    ];
  },
  
  // Simulate connecting to store inventory system
  verifyStoreConnection: async (storeId: string) => {
    await delay(1500);
    
    // For demo purposes, always return success
    return {
      connected: true,
      storeName: 'Demo Supermarket',
      location: 'Lagos, Nigeria',
      connectionId: `CONN-${storeId}`
    };
  }
};
