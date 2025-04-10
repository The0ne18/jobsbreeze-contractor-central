
import { Client, NewClient } from "@/models/Client";

/**
 * Interface for client service operations
 */
export interface IClientService {
  /**
   * Get all clients
   */
  getClients(): Promise<Client[]>;
  
  /**
   * Get a specific client by ID
   */
  getClient(id: string): Promise<Client | undefined>;
  
  /**
   * Create a new client
   */
  createClient(client: NewClient): Promise<Client>;
  
  /**
   * Update an existing client
   */
  updateClient(id: string, updatedClient: Partial<Client>): Promise<Client | null>;
  
  /**
   * Delete a client
   */
  deleteClient(id: string): Promise<boolean>;
}
