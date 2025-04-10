
import { Item, NewItem } from "@/models/Item";

export interface IItemService {
  /**
   * Get all items
   */
  getItems(): Promise<Item[]>;
  
  /**
   * Get a specific item by ID
   */
  getItem(id: string): Promise<Item | undefined>;
  
  /**
   * Create a new item
   */
  createItem(item: NewItem): Promise<Item>;
  
  /**
   * Update an existing item
   */
  updateItem(id: string, updatedItem: Partial<Item>): Promise<Item | null>;
  
  /**
   * Delete an item
   */
  deleteItem(id: string): Promise<boolean>;
}
