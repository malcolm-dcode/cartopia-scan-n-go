
// Custom database types that work with the existing Supabase structure
import { Database as OriginalDatabase } from "@/integrations/supabase/types";

// Extend the original database type with our custom tables
export interface DatabaseTables {
  profiles: {
    Row: {
      id: string;
      name: string;
      email: string;
      created_at: string;
      updated_at: string;
    };
  };
  products: {
    Row: {
      id: string;
      name: string;
      price: number;
      barcode: string;
      image_url: string;
      description: string;
      created_at: string;
    };
  };
  orders: {
    Row: {
      id: string;
      user_id: string;
      order_number: string;
      total: number;
      status: string;
      created_at: string;
      updated_at: string;
    };
  };
  order_items: {
    Row: {
      id: string;
      order_id: string;
      product_id: string;
      name: string;
      price: number;
      quantity: number;
      created_at: string;
    };
  };
}

// Type helper for Supabase queries
export type TableRow<T extends keyof DatabaseTables> = DatabaseTables[T]['Row'];
