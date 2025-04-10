
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ItemEmptyStateProps {
  onNewItemClick: () => void;
}

export function ItemEmptyState({ onNewItemClick }: ItemEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="mx-auto rounded-full bg-primary/10 p-3 mb-4">
        <PlusCircle className="h-10 w-10 text-primary" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No items yet</h3>
      <p className="text-muted-foreground mb-6 max-w-sm">
        Create your first item to quickly add it to estimates and invoices.
      </p>
      <Button onClick={onNewItemClick}>
        <PlusCircle className="mr-2 h-4 w-4" />
        New Item
      </Button>
    </div>
  );
}
