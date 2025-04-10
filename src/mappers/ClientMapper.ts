
import { Client, NewClient } from "@/models/Client";
import { DbClient, DbNewClient } from "@/models/database/DbClient";

/**
 * Maps a database client entity to a frontend client model
 */
export const mapDbClientToModel = (dbClient: DbClient): Client => {
  return {
    id: dbClient.id,
    name: dbClient.name,
    email: dbClient.email,
    phone: dbClient.phone,
    address: dbClient.address,
    notes: dbClient.notes || undefined,
    user_id: dbClient.user_id,
    created_at: dbClient.created_at,
    updated_at: dbClient.updated_at,
  };
};

/**
 * Maps a frontend new client to a database new client entity
 */
export const mapNewClientToDb = (client: NewClient): DbNewClient => {
  return {
    name: client.name,
    email: client.email,
    phone: client.phone,
    address: client.address,
    notes: client.notes || null,
    user_id: client.user_id,
  };
};

/**
 * Maps a frontend client model to a database update client entity
 */
export const mapClientUpdateToDb = (client: Partial<Client>): Partial<DbClient> => {
  const dbClient: Partial<DbClient> = {};
  
  // Only map properties that exist on DbClient
  if (client.id !== undefined) dbClient.id = client.id;
  if (client.name !== undefined) dbClient.name = client.name;
  if (client.email !== undefined) dbClient.email = client.email;
  if (client.phone !== undefined) dbClient.phone = client.phone;
  if (client.address !== undefined) dbClient.address = client.address;
  if (client.notes !== undefined) dbClient.notes = client.notes || null;
  if (client.user_id !== undefined) dbClient.user_id = client.user_id;
  
  // Convert Date objects to strings if they exist
  if (client.created_at instanceof Date) {
    dbClient.created_at = client.created_at.toISOString();
  } else if (typeof client.created_at === 'string') {
    dbClient.created_at = client.created_at;
  }
  
  if (client.updated_at instanceof Date) {
    dbClient.updated_at = client.updated_at.toISOString();
  } else if (typeof client.updated_at === 'string') {
    dbClient.updated_at = client.updated_at;
  }
  
  return dbClient;
};
