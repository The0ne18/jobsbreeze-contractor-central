
import { useQuery } from "@tanstack/react-query";
import { getItems } from "@/services/itemService";

export function useItemsData() {
  return useQuery({
    queryKey: ['items'],
    queryFn: getItems,
    staleTime: 60000, // Data is fresh for 1 minute
  });
}
