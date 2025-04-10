
import { useQuery } from "@tanstack/react-query";
import { getEstimates } from "@/services/estimateService";
import { Estimate } from "@/models/Estimate";

export interface EstimateQueryOptions {
  page: number;
  limit: number;
  searchQuery?: string;
  status?: string;
}

export function useEstimatesData(queryOptions: EstimateQueryOptions) {
  return useQuery({
    queryKey: ['estimates', queryOptions],
    queryFn: () => getEstimates(queryOptions),
    staleTime: 60000, // Data is fresh for 1 minute
    placeholderData: { data: [], total: 0 } // Provide placeholder data to avoid type errors
  });
}
