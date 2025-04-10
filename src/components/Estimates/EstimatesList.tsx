import React from "react";
import { format } from "date-fns";
import { Estimate } from "@/models/Estimate";
import { EstimateEmptyState } from "./EstimateEmptyState";
import { EstimateMonthGroup } from "./EstimateMonthGroup";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious,
  PaginationEllipsis 
} from "@/components/ui/pagination";
import { Loader2 } from "lucide-react";

interface EstimatesListProps {
  estimates: Estimate[];
  isLoading: boolean;
  onNewEstimateClick: () => void;
  onOpenEstimate?: (estimate: Estimate) => void;
  onEditEstimate?: (estimate: Estimate) => void;
  totalItems?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
}

export function EstimatesList({ 
  estimates, 
  isLoading, 
  onNewEstimateClick,
  onOpenEstimate,
  onEditEstimate,
  totalItems = 0,
  currentPage = 1,
  onPageChange
}: EstimatesListProps) {
  if (isLoading && estimates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
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

  const itemsPerPage = 10;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const getPageNumbers = () => {
    const pages = [];
    
    pages.push(1);
    
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }
    
    if (totalPages > 1 && !pages.includes(totalPages)) {
      pages.push(totalPages);
    }
    
    return pages.sort((a, b) => a - b);
  };

  const pageNumbers = getPageNumbers();

  return (
    <div>
      <div className="divide-y">
        {Object.entries(estimatesByMonth).map(([monthYear, monthEstimates]) => (
          <EstimateMonthGroup 
            key={monthYear} 
            monthYear={monthYear} 
            estimates={monthEstimates}
            onOpen={onOpenEstimate}
            onEdit={onEditEstimate}
          />
        ))}
      </div>
      
      {totalPages > 1 && (
        <Pagination className="my-4">
          <PaginationContent>
            {currentPage > 1 && (
              <PaginationItem>
                <PaginationPrevious 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    onPageChange?.(currentPage - 1);
                  }} 
                />
              </PaginationItem>
            )}
            
            {pageNumbers.map((page, index) => {
              const prevPage = pageNumbers[index - 1];
              const showEllipsisBefore = prevPage && page - prevPage > 1;
              
              return (
                <React.Fragment key={page}>
                  {showEllipsisBefore && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                  <PaginationItem>
                    <PaginationLink 
                      href="#" 
                      isActive={page === currentPage}
                      onClick={(e) => {
                        e.preventDefault();
                        onPageChange?.(page);
                      }}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                </React.Fragment>
              );
            })}
            
            {currentPage < totalPages && (
              <PaginationItem>
                <PaginationNext 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    onPageChange?.(currentPage + 1);
                  }}
                />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
