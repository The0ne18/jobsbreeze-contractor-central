
/**
 * Database entity for client records as they exist in Supabase
 */
export interface DbClient {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  notes: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
}

/**
 * Type for creating a new client in the database
 */
export interface DbNewClient {
  name: string;
  email: string;
  phone: string;
  address: string;
  notes?: string | null;
  user_id: string;
}
