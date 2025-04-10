
import { Item } from "@/models/Item";
import { DbItem } from "@/models/database/DbItem";

export function mapDbItemToModel(dbItem: DbItem): Item {
  return {
    id: dbItem.id,
    name: dbItem.name,
    description: dbItem.description,
    category: dbItem.category as 'labor' | 'materials' | 'other',
    rate: dbItem.rate,
    tax: dbItem.tax,
    createdAt: dbItem.created_at,
    updatedAt: dbItem.updated_at,
    user_id: dbItem.user_id
  };
}

export function mapNewItemToDb(item: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>, userId: string): Omit<DbItem, 'id' | 'created_at' | 'updated_at'> {
  return {
    name: item.name,
    description: item.description,
    category: item.category,
    rate: item.rate,
    tax: item.tax,
    user_id: userId
  };
}

export function mapItemUpdateToDb(item: Partial<Item>): Partial<DbItem> {
  const dbItem: Partial<DbItem> = {};
  
  if (item.name !== undefined) dbItem.name = item.name;
  if (item.description !== undefined) dbItem.description = item.description;
  if (item.category !== undefined) dbItem.category = item.category;
  if (item.rate !== undefined) dbItem.rate = item.rate;
  if (item.tax !== undefined) dbItem.tax = item.tax;
  
  return dbItem;
}
