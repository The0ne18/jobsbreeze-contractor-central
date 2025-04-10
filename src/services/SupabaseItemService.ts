
import { supabase } from "@/integrations/supabase/client";
import { Item, NewItem } from "@/models/Item";
import { DbItem } from "@/models/database/DbItem";
import { mapDbItemToModel, mapItemUpdateToDb, mapNewItemToDb } from "@/mappers/ItemMapper";
import { IItemService } from "./interfaces/IItemService";

/**
 * Implementation of IItemService using Supabase
 */
export class SupabaseItemService implements IItemService {
  async getItems(): Promise<Item[]> {
    try {
      // Use a cast to avoid type errors with the 'items' table
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching items:', error);
        throw error;
      }
      
      // Cast the data to DbItem[] to use our mapper
      return data ? (data as DbItem[]).map(mapDbItemToModel) : [];
    } catch (error) {
      console.error('Failed to fetch items:', error);
      throw error;
    }
  }

  async getItem(id: string): Promise<Item | undefined> {
    try {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        if (error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
          console.error('Error fetching item:', error);
          throw error;
        }
        return undefined;
      }
      
      // Cast the data to DbItem to use our mapper
      return mapDbItemToModel(data as DbItem);
    } catch (error) {
      console.error('Failed to fetch item:', error);
      throw error;
    }
  }

  async createItem(item: NewItem): Promise<Item> {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('Error getting current user:', userError);
        throw userError;
      }
      
      const userId = userData.user?.id;
      if (!userId) {
        throw new Error('User not authenticated');
      }
      
      const dbItem = mapNewItemToDb(item as Omit<Item, 'id' | 'createdAt' | 'updatedAt'>, userId);
      
      const { data, error } = await supabase
        .from('items')
        .insert([dbItem])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating item:', error);
        throw error;
      }
      
      // Cast the data to DbItem to use our mapper
      return mapDbItemToModel(data as DbItem);
    } catch (error) {
      console.error('Failed to create item:', error);
      throw error;
    }
  }

  async updateItem(id: string, updatedItem: Partial<Item>): Promise<Item | null> {
    try {
      const dbItem = mapItemUpdateToDb(updatedItem);
      
      const { data, error } = await supabase
        .from('items')
        .update(dbItem)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating item:', error);
        throw error;
      }
      
      // Cast the data to DbItem to use our mapper
      return mapDbItemToModel(data as DbItem);
    } catch (error) {
      console.error('Failed to update item:', error);
      throw error;
    }
  }

  async deleteItem(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('items')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting item:', error);
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error('Failed to delete item:', error);
      throw error;
    }
  }
}

// Create a singleton instance of the service
export const itemService = new SupabaseItemService();
