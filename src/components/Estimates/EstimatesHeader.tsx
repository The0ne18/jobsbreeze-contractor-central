
import { Search, Download, FilePlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface EstimatesHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onNewEstimateClick: () => void;
}

export function EstimatesHeader({ 
  searchQuery, 
  onSearchChange, 
  onNewEstimateClick 
}: EstimatesHeaderProps) {
  return (
    <div className="mb-6 px-4 sm:px-0">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search all estimates by Name, Address, or Estimate #"
            className="pl-9"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button className="gap-2" onClick={onNewEstimateClick}>
            <FilePlus className="h-4 w-4" />
            New Estimate
          </Button>
        </div>
      </div>
    </div>
  );
}
