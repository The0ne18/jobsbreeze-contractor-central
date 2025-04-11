import { useState, useEffect } from "react";
import { Plus, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getItems } from "@/services/itemService";
import { Item } from "@/models/Item";
import { EstimateItem } from "@/models/Estimate";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

interface ItemSelectorProps {
  onItemSelected: (item: EstimateItem) => void;
}

export function ItemSelector({ onItemSelected }: ItemSelectorProps) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  // Load items when the popover is opened
  useEffect(() => {
    const fetchItems = async () => {
      if (open && items.length === 0) {
        console.log("ItemSelector - Fetching items");
        setLoading(true);
        try {
          const fetchedItems = await getItems();
          console.log("ItemSelector - Fetched items:", fetchedItems);
          setItems(fetchedItems);
        } catch (error) {
          console.error("Failed to fetch items:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchItems();
  }, [open, items.length]);
  
  // Improved item selection handler with better error handling
  const handleItemSelection = (itemId: string) => {
    console.log("ItemSelector - handleItemSelection called with ID:", itemId);
    
    // Find the selected item from our items array
    const selectedItem = items.find(item => item.id === itemId);
    
    if (!selectedItem) {
      console.error("ItemSelector - Selected item not found:", itemId);
      return;
    }
    
    console.log("ItemSelector - Found selected item:", selectedItem);
    
    // Create a properly formatted EstimateItem from the catalog Item
    const estimateItem: EstimateItem = {
      id: uuidv4(), // Generate a new ID for the estimate item
      description: selectedItem.name,
      quantity: 1,
      rate: selectedItem.rate || 0,
      tax: selectedItem.tax || false,
      total: selectedItem.rate || 0, // Initial total is rate × quantity (1)
      category: selectedItem.category as 'labor' | 'materials' | 'other'
    };
    
    console.log("ItemSelector - Created estimateItem:", estimateItem);
    
    try {
      // Call the parent callback with the formatted item
      onItemSelected(estimateItem);
      console.log("ItemSelector - onItemSelected callback executed");
      
      // Close the popover after successfully adding the item
      setOpen(false);
    } catch (error) {
      console.error("ItemSelector - Error in onItemSelected callback:", error);
    }
  };
  
  const handleCreateNewItem = () => {
    navigate("/items/new");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between w-full"
        >
          <span>Select from saved items...</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start" sideOffset={5} side="bottom">
        <Command>
          <CommandInput placeholder="Search items..." />
          <CommandList>
            <CommandEmpty>
              {loading ? (
                <div className="flex items-center justify-center p-4">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-r-transparent" />
                </div>
              ) : (
                <div className="py-6 text-center text-sm">
                  <p>No items found.</p>
                  <Button 
                    variant="link" 
                    className="mt-2" 
                    onClick={handleCreateNewItem}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create new item
                  </Button>
                </div>
              )}
            </CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={item.id}
                  value={item.id}
                  onSelect={(value) => {
                    console.log("ItemSelector - CommandItem onSelect called with:", value);
                    handleItemSelection(value);
                  }}
                  className="cursor-pointer"
                >
                  <div className="flex flex-col">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-muted-foreground flex justify-between">
                      <span>${item.rate.toFixed(2)}</span>
                      <span className="capitalize">{item.category}</span>
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
            <div className="p-2 border-t">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={handleCreateNewItem}
              >
                <Plus className="mr-2 h-4 w-4" />
                Create new item
              </Button>
            </div>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
