
import { useState } from "react";
import { toast } from "sonner";
import { 
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";
import ItemForm from "@/components/Items/ItemForm";
import { NewItem } from "@/models/Item";
import { createItem } from "@/services/itemService";

interface NewItemSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onItemCreated?: () => void;
}

export default function NewItemSheet({ 
  open, 
  onOpenChange,
  onItemCreated
}: NewItemSheetProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: NewItem) => {
    setIsSubmitting(true);
    try {
      await createItem(data);
      toast.success("Item created successfully");
      onOpenChange(false);
      if (onItemCreated) {
        onItemCreated();
      }
    } catch (error) {
      console.error("Failed to create item:", error);
      toast.error("Failed to create item");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <ItemForm 
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </SheetContent>
    </Sheet>
  );
}
