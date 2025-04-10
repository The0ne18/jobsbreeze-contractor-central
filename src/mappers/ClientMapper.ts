
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
  const dbClient: Partial<DbClient> = { ...client };
  
  // Remove fields that shouldn't be sent to the database
  delete (dbClient as any).createdAt;
  delete (dbClient as any).updatedAt;
  
  return dbClient;
};
