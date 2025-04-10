
import { format } from "date-fns";
import { PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Estimate } from "@/models/Estimate";

interface EstimateListItemProps {
  estimate: Estimate;
  onOpen?: (estimate: Estimate) => void;
  onEdit?: (estimate: Estimate) => void;
}

export function EstimateListItem({ estimate, onOpen, onEdit }: EstimateListItemProps) {
  return (
    <div className="border-t py-4 px-4">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-primary">#{estimate.id}</span>
            <Badge variant="outline" className="bg-gray-100 text-gray-600 font-medium uppercase text-xs">
              {estimate.status}
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground">
            {format(new Date(estimate.date), "MMMM do yyyy")}
          </div>
          <div className="text-sm font-medium mt-1">
            {estimate.clientName}
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-2 md:flex-row">
          <div className="text-right font-medium mr-4">
            ${estimate.total.toFixed(2)}
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="rounded-full"
              onClick={() => onOpen && onOpen(estimate)}
            >
              Open
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="rounded-full"
              onClick={() => onEdit && onEdit(estimate)}
            >
              <PenLine className="h-4 w-4" />
              <span className="ml-1">Edit</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
