
import { Item } from "@/models/Item";
import { ItemListItem } from "./ItemListItem";
import { ItemEmptyState } from "./ItemEmptyState";

interface ItemListProps {
  items: Item[];
  isLoading: boolean;
  onEditItem: (item: Item) => void;
  onNewItemClick: () => void;
}

export function ItemList({ items, isLoading, onEditItem, onNewItemClick }: ItemListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, index) => (
          <div 
            key={index} 
            className="w-full h-16 bg-muted/40 animate-pulse rounded-md"
          />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return <ItemEmptyState onNewItemClick={onNewItemClick} />;
  }

  return (
    <div className="space-y-2">
      {items.map(item => (
        <ItemListItem 
          key={item.id} 
          item={item} 
          onClick={() => onEditItem(item)} 
        />
      ))}
    </div>
  );
}
