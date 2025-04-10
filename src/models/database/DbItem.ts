
export interface DbItem {
  id: string;
  name: string;
  description: string | null;
  category: string;
  rate: number;
  tax: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
}
