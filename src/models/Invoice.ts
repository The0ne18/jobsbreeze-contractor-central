
export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  tax: boolean;
  total: number;
  category: 'labor' | 'materials' | 'other';
}

export interface Invoice {
  id: string;
  clientId: string;
  clientName: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  date: Date;
  dueDate: Date;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  notes: string;
  terms: string;
  createdAt: Date;
  paidDate?: Date;
  estimateId?: string;
}

export interface NewInvoice {
  clientId: string;
  date: Date;
  dueDate: Date;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  notes: string;
  terms: string;
  estimateId?: string;
}
