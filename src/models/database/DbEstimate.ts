
/**
 * Database entity for estimate records as they exist in Supabase
 */
export interface DbEstimate {
  id: string;
  client_id: string;
  client_name: string;
  status: string;
  date: string;
  expiration_date: string;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total: number;
  notes: string | null;
  terms: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
}

/**
 * Type for creating a new estimate in the database
 */
export interface DbNewEstimate {
  id: string;
  client_id: string;
  client_name: string;
  status: string;
  date: string;
  expiration_date: string;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total: number;
  notes?: string | null;
  terms?: string | null;
  user_id: string;
}

/**
 * Database entity for estimate item records as they exist in Supabase
 */
export interface DbEstimateItem {
  id: string;
  estimate_id: string;
  description: string;
  quantity: number;
  rate: number;
  tax: boolean;
  total: number;
  category: string;
  created_at: string;
}

/**
 * Type for creating a new estimate item in the database
 */
export interface DbNewEstimateItem {
  estimate_id: string;
  description: string;
  quantity: number;
  rate: number;
  tax: boolean;
  total: number;
  category: string;
}
