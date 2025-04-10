
import { itemService } from "./SupabaseItemService";
import { Item, NewItem } from "@/models/Item";

export const getItems = (): Promise<Item[]> => {
  return itemService.getItems();
};

export const getItem = (id: string): Promise<Item | undefined> => {
  return itemService.getItem(id);
};

export const createItem = (item: NewItem): Promise<Item> => {
  return itemService.createItem(item);
};

export const updateItem = (id: string, updatedItem: Partial<Item>): Promise<Item | null> => {
  return itemService.updateItem(id, updatedItem);
};

export const deleteItem = (id: string): Promise<boolean> => {
  return itemService.deleteItem(id);
};
