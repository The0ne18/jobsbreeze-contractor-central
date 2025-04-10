
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { 
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";
import ItemForm from "@/components/Items/ItemForm";
import { Item, NewItem } from "@/models/Item";
import { getItem, updateItem } from "@/services/itemService";

interface EditItemSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemId?: string;
  onItemUpdated?: () => void;
}

export default function EditItemSheet({ 
  open, 
  onOpenChange,
  itemId,
  onItemUpdated
}: EditItemSheetProps) {
  const [item, setItem] = useState<Item | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      if (open && itemId) {
        setIsLoading(true);
        try {
          const data = await getItem(itemId);
          if (data) {
            setItem(data);
          }
        } catch (error) {
          console.error("Failed to fetch item:", error);
          toast.error("Failed to load item");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchItem();
  }, [open, itemId]);

  const handleSubmit = async (data: NewItem) => {
    if (!itemId) return;
    
    try {
      await updateItem(itemId, data);
      toast.success("Item updated successfully");
      onOpenChange(false);
      if (onItemUpdated) {
        onItemUpdated();
      }
    } catch (error) {
      console.error("Failed to update item:", error);
      toast.error("Failed to update item");
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  if (isLoading) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="sm:max-w-md">
          <div className="flex items-center justify-center h-full">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent"></div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        {item && (
          <ItemForm 
            item={item}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}
