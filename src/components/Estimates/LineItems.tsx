
import { EstimateItem } from "@/models/Estimate";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { LineItemRow } from "./LineItemRow";
import { ItemSelector } from "@/components/Items/ItemSelector";
import { useEffect } from "react";

interface LineItemsProps {
  items: EstimateItem[];
  onAddItem: () => void;
  onUpdateItem: (id: string, field: keyof EstimateItem, value: any) => void;
  onRemoveItem: (id: string) => void;
  onAddItemFromCatalog?: (item: EstimateItem) => void;
}
  
export function LineItems({ 
  items, 
  onAddItem, 
  onUpdateItem, 
  onRemoveItem, 
  onAddItemFromCatalog 
}: LineItemsProps) {

  // Log component rendering and props
  console.log("LineItems rendered with props:", { 
    itemsCount: items.length, 
    hasAddItemFromCatalog: !!onAddItemFromCatalog,
    items: items 
  });

  // Log items whenever they change
  useEffect(() => {
    console.log("LineItems - items updated:", items);
  }, [items]);
  
  // Handler for when an item is selected from the catalog
  const handleItemSelected = (item: EstimateItem) => {
    console.log("LineItems - handleItemSelected called with item:", item);
    
    // Check for required properties
    if (!item || !item.id || !item.description) {
      console.error("LineItems - Invalid item received:", item);
      return;
    }
    
    // Ensure quantity is valid
    if (!item.quantity || item.quantity <= 0) {
      console.log("LineItems - Fixing invalid quantity:", item.quantity);
      item.quantity = 1;
    }
    
    // Ensure rate is valid
    if (typeof item.rate !== 'number') {
      console.log("LineItems - Fixing invalid rate:", item.rate);
      item.rate = 0;
    }
    
    // Calculate total correctly
    const calculatedTotal = item.quantity * item.rate;
    if (item.total !== calculatedTotal) {
      console.log(`LineItems - Fixing item total: ${item.total} -> ${calculatedTotal}`);
      item.total = calculatedTotal;
    }
    
    console.log("LineItems - Final validated item:", item);
    
    // Use the specific callback if provided, or fall back to generic add
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
