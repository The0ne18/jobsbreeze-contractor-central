
import { format } from "date-fns";
import { Estimate } from "@/models/Estimate";
import { EstimateEmptyState } from "./EstimateEmptyState";
import { EstimateMonthGroup } from "./EstimateMonthGroup";

interface EstimatesListProps {
  estimates: Estimate[];
  isLoading: boolean;
  onNewEstimateClick: () => void;
}

export function EstimatesList({ estimates, isLoading, onNewEstimateClick }: EstimatesListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="text-center">Loading estimates...</div>
      </div>
    );
  }

  if (estimates.length === 0) {
    return <EstimateEmptyState onNewEstimateClick={onNewEstimateClick} />;
  }

  const estimatesByMonth: Record<string, Estimate[]> = {};
  estimates.forEach(estimate => {
    const monthYear = format(new Date(estimate.date), "MMMM yyyy");
    if (!estimatesByMonth[monthYear]) {
      estimatesByMonth[monthYear] = [];
    }
    estimatesByMonth[monthYear].push(estimate);
  });

  return (
    <div className="divide-y">
      {Object.entries(estimatesByMonth).map(([monthYear, monthEstimates]) => (
        <EstimateMonthGroup 
          key={monthYear} 
          monthYear={monthYear} 
          estimates={monthEstimates} 
        />
      ))}
    </div>
  );
}
