
export interface Item {
  id: string;
  name: string;
  description: string | null;
  category: 'labor' | 'materials' | 'other';
  rate: number;
  tax: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  user_id?: string;
}

export interface NewItem {
  name: string;
  description: string | null;
  category: 'labor' | 'materials' | 'other';
  rate: number;
  tax: boolean;
}
