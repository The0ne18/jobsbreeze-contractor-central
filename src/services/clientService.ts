
import { supabase } from "@/integrations/supabase/client";
import { Client, NewClient } from "@/models/Client";
import { toast } from "sonner";

// Helper function to convert database client to our model
const mapDbClientToModel = (dbClient: any): Client => {
  return {
    id: dbClient.id,
    name: dbClient.name,
    email: dbClient.email,
    phone: dbClient.phone,
    address: dbClient.address,
    notes: dbClient.notes,
    user_id: dbClient.user_id,
    created_at: dbClient.created_at,
    updated_at: dbClient.updated_at,
  };
};

export const getClients = async (): Promise<Client[]> => {
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
};

export const getClient = async (id: string): Promise<Client | undefined> => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code !== 'PGRST116') { // PGRST116 is "no rows returned" which we handle by returning undefined
        console.error('Error fetching client:', error);
        throw error;
      }
      return undefined;
    }
    
    return mapDbClientToModel(data);
  } catch (error) {
    console.error('Failed to fetch client:', error);
    throw error;
  }
};

export const createClient = async (client: NewClient): Promise<Client> => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .insert([client])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating client:', error);
      throw error;
    }
    
    return mapDbClientToModel(data);
  } catch (error) {
    console.error('Failed to create client:', error);
    throw error;
  }
};

export const updateClient = async (id: string, updatedClient: Partial<Client>): Promise<Client | null> => {
  try {
    // Convert Client model to DB format
    const dbClient: any = { ...updatedClient };
    
    // Remove fields that don't exist in the database
    delete dbClient.createdAt;
    delete dbClient.updatedAt;
    
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
    
    return mapDbClientToModel(data);
  } catch (error) {
    console.error('Failed to update client:', error);
    throw error;
  }
};

export const deleteClient = async (id: string): Promise<boolean> => {
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
};
