
import { EstimateItem } from "@/models/Estimate";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { LineItemRow } from "./LineItemRow";

interface LineItemsProps {
  items: EstimateItem[];
  onAddItem: () => void;
  onUpdateItem: (id: string, field: keyof EstimateItem, value: any) => void;
  onRemoveItem: (id: string) => void;
}

export function LineItems({ items, onAddItem, onUpdateItem, onRemoveItem }: LineItemsProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Line Items</h3>
        <Button type="button" variant="outline" size="sm" onClick={onAddItem}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </div>
      
      {items.length === 0 ? (
        <div className="text-center py-4 text-muted-foreground">
          No items added. Click "Add Item" to add your first item.
        </div>
      ) : (
        <div className="space-y-4">
          {/* Header Row */}
          <div className="grid grid-cols-12 gap-2 text-sm font-medium text-muted-foreground">
            <div className="col-span-5">Description</div>
            <div className="col-span-2">Category</div>
            <div className="col-span-1">Qty</div>
            <div className="col-span-2">Rate</div>
            <div className="col-span-1">Total</div>
            <div className="col-span-1"></div>
          </div>
          
          {/* Item Rows */}
          {items.map((item) => (
            <LineItemRow 
              key={item.id} 
              item={item} 
              onUpdate={onUpdateItem} 
              onRemove={onRemoveItem} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
