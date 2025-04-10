
export interface EstimateItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  tax: boolean;
  total: number;
  category: 'labor' | 'materials' | 'other';
  estimate_id?: string;
  created_at?: string | Date;
}

export interface Estimate {
  id: string;
  clientId: string;
  clientName: string;
  status: 'draft' | 'pending' | 'approved' | 'declined';
  date: string | Date;
  expirationDate: string | Date;
  items: EstimateItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  notes: string;
  terms: string;
  createdAt: string | Date;
  user_id?: string;
  
  // Database mapping fields
  client_id?: string;
  client_name?: string;
  expiration_date?: string | Date;
  tax_rate?: number;
  tax_amount?: number;
  created_at?: string | Date;
  updated_at?: string | Date;
}

export interface NewEstimate {
  clientId: string;
  clientName: string;
  date: Date;
  expirationDate: Date;
  items: EstimateItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  notes: string;
  terms: string;
}
