
import { supabase } from "@/integrations/supabase/client";
import { Client, NewClient } from "@/models/Client";
import { DbClient } from "@/models/database/DbClient";
import { mapDbClientToModel, mapNewClientToDb, mapClientUpdateToDb } from "@/mappers/ClientMapper";
import { IClientService } from "./interfaces/IClientService";
import { toast } from "sonner";

/**
 * Implementation of IClientService using Supabase
 */
export class SupabaseClientService implements IClientService {
  async getClients(): Promise<Client[]> {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching clients:', error);
        throw error;
      }
      
      return data ? data.map(mapDbClientToModel) : [];
    } catch (error) {
      console.error('Failed to fetch clients:', error);
      throw error;
    }
  }

  async getClient(id: string): Promise<Client | undefined> {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        if (error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
          console.error('Error fetching client:', error);
          throw error;
        }
        return undefined;
      }
      
      return mapDbClientToModel(data as DbClient);
    } catch (error) {
      console.error('Failed to fetch client:', error);
      throw error;
    }
  }

  async createClient(client: NewClient): Promise<Client> {
    try {
      const dbClient = mapNewClientToDb(client);
      
      const { data, error } = await supabase
        .from('clients')
        .insert([dbClient])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating client:', error);
        throw error;
      }
      
      return mapDbClientToModel(data as DbClient);
    } catch (error) {
      console.error('Failed to create client:', error);
      throw error;
    }
  }

  async updateClient(id: string, updatedClient: Partial<Client>): Promise<Client | null> {
    try {
      const dbClient = mapClientUpdateToDb(updatedClient);
      
      const { data, error } = await supabase
        .from('clients')
        .update(dbClient)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating client:', error);
        throw error;
      }
      
      return mapDbClientToModel(data as DbClient);
    } catch (error) {
      console.error('Failed to update client:', error);
      throw error;
    }
  }

  async deleteClient(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting client:', error);
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error('Failed to delete client:', error);
      throw error;
    }
  }
}

// Create a singleton instance of the service
export const clientService = new SupabaseClientService();
