
import { clientService as supabaseClientService } from "./SupabaseClientService";
import { Client, NewClient } from "@/models/Client";

// This file exists only for backward compatibility
// It re-exports the actual implementation methods from SupabaseClientService
// so that existing code doesn't break during the transition to the new architecture

export const getClients = (): Promise<Client[]> => {
  return supabaseClientService.getClients();
};

export const getClient = (id: string): Promise<Client | undefined> => {
  return supabaseClientService.getClient(id);
};

export const createClient = (client: NewClient): Promise<Client> => {
  return supabaseClientService.createClient(client);
};

export const updateClient = (id: string, updatedClient: Partial<Client>): Promise<Client | null> => {
  return supabaseClientService.updateClient(id, updatedClient);
};

export const deleteClient = (id: string): Promise<boolean> => {
  return supabaseClientService.deleteClient(id);
};
