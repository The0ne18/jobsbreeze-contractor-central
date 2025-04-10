
import { Item } from "@/models/Item";
import { PenLine } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ItemListItemProps {
  item: Item;
  onClick: () => void;
}

export function ItemListItem({ item, onClick }: ItemListItemProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "labor":
        return "bg-blue-100 text-blue-800";
      case "materials":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="border rounded-md p-4 hover:border-primary/50 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex justify-between mb-2">
            <h3 className="font-medium text-md truncate">{item.name}</h3>
            <span className="font-semibold">{formatCurrency(item.rate)}</span>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium mr-2", getCategoryColor(item.category))}>
              {item.category}
            </span>
            {item.tax && <span className="text-xs text-amber-600 font-medium">Taxable</span>}
            {item.description && (
              <p className="ml-2 truncate">{item.description}</p>
            )}
          </div>
        </div>
        
        <Button variant="ghost" size="sm" className="ml-2" onClick={onClick}>
          <PenLine className="h-4 w-4" />
          <span className="sr-only">Edit</span>
        </Button>
      </div>
    </div>
  );
}
