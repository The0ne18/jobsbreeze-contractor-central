
import { Estimate } from "@/models/Estimate";
import { EstimateListItem } from "./EstimateListItem";

interface EstimateMonthGroupProps {
  monthYear: string;
  estimates: Estimate[];
  onOpen?: (estimate: Estimate) => void;
  onEdit?: (estimate: Estimate) => void;
}

export function EstimateMonthGroup({ 
  monthYear, 
  estimates, 
  onOpen, 
  onEdit 
}: EstimateMonthGroupProps) {
  return (
    <div className="py-4">
      <div className="flex justify-between items-center px-4 py-2">
        <h3 className="text-lg font-medium">{monthYear}</h3>
        <div className="text-right">
          <span className="font-semibold">
            Total: ${estimates.reduce((sum, est) => sum + est.total, 0).toFixed(2)}
          </span>
        </div>
      </div>
      
      <div className="space-y-1 mt-2">
        {estimates.map(estimate => (
          <EstimateListItem 
            key={estimate.id} 
            estimate={estimate} 
            onOpen={onOpen}
            onEdit={onEdit}
          />
        ))}
      </div>
    </div>
  );
}
