
import { PlusCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ItemsHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onNewItemClick: () => void;
}

export function ItemsHeader({ searchQuery, onSearchChange, onNewItemClick }: ItemsHeaderProps) {
  return (
    <div className="flex flex-col gap-4 pb-4 md:flex-row md:items-center md:justify-between">
      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search items..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <Button onClick={onNewItemClick}>
        <PlusCircle className="mr-2 h-4 w-4" />
        New Item
      </Button>
    </div>
  );
}
