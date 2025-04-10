
export interface EstimateItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  tax: boolean;
  total: number;
  category: 'labor' | 'materials' | 'other';
}

export interface Estimate {
  id: string;
  clientId: string;
  clientName: string;
  status: 'draft' | 'pending' | 'approved' | 'declined';
  date: Date;
  expirationDate: Date;
  items: EstimateItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  notes: string;
  terms: string;
  createdAt: Date;
}

export interface NewEstimate {
  clientId: string;
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
