
export interface CompanySettings {
  id: string;
  whatsapp_number: string;
  company_name?: string | null;
  company_address?: string | null;
  delivery_fee?: number | null;
  minimum_order?: number | null;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  items: OrderItem[];
  total_amount: number;
  payment_method: string;
  notes?: string | null;
  status: 'pending' | 'processing' | 'delivered' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}
