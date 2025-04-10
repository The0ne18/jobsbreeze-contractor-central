
import { EstimateItem } from "@/models/Estimate";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { LineItemRow } from "./LineItemRow";
import { ItemSelector } from "@/components/Items/ItemSelector";

// Add this at the top of the file, just after your imports
console.log("LineItems component loaded");

interface LineItemsProps {
  items: EstimateItem[];
  onAddItem: () => void;
  onUpdateItem: (id: string, field: keyof EstimateItem, value: any) => void;
  onRemoveItem: (id: string) => void;
  onAddItemFromCatalog?: (item: EstimateItem) => void; // Optional prop
}

// In the LineItems function component, add this line at the very beginning
export function LineItems({ items, onAddItem, onUpdateItem, onRemoveItem, onAddItemFromCatalog }: LineItemsProps) {
  console.log("LineItems rendered with props:", { 
    itemsCount: items.length, 
    hasAddItemFromCatalog: !!onAddItemFromCatalog 
  });
  
export function LineItems({ 
  items, 
  onAddItem, 
  onUpdateItem, 
  onRemoveItem, 
  onAddItemFromCatalog 
}: LineItemsProps) {
  
  // Handle item selection from the catalog
  const handleItemSelected = (item: EstimateItem) => {
    console.log("LineItems - item selected from catalog:", item);
    
    // Validate the item to make sure it has the required properties
    if (!item || !item.id || !item.description) {
      console.error("LineItems - Invalid item received:", item);
      return;
    }
    
    // Double check that the total is calculated correctly
    const calculatedTotal = item.quantity * item.rate;
    if (item.total !== calculatedTotal) {
      console.log(`LineItems - Fixing item total: ${item.total} -> ${calculatedTotal}`);
      item.total = calculatedTotal;
    }
    
    // Use the specific callback if provided, otherwise fallback to generic add
    if (onAddItemFromCatalog) {
      console.log("LineItems - Using onAddItemFromCatalog callback");
      onAddItemFromCatalog(item);
    } else {
      console.log("LineItems - No onAddItemFromCatalog provided, using onAddItem fallback");
      onAddItem();
    }
  };

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
        <div className="space-y-4">
          <div className="text-center py-4 text-muted-foreground">
            No items added. Add a blank item or select from your catalog.
          </div>
          <ItemSelector onItemSelected={handleItemSelected} />
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
          
          {/* Add item from catalog */}
          <div className="pt-2">
            <ItemSelector onItemSelected={handleItemSelected} />
          </div>
        </div>
      )}
    </div>
  );
}
