
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { EstimatesList } from "@/components/Estimates/EstimatesList";
import { cn } from "@/lib/utils";
import { Estimate } from "@/models/Estimate";
import { Progress } from "@/components/ui/progress";

interface EstimateTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  estimates: Estimate[];
  isLoading: boolean;
  onNewEstimateClick: () => void;
  onOpenEstimate: (estimate: Estimate) => void;
  onEditEstimate: (estimate: Estimate) => void;
  totalEstimates: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function EstimateTabs({
  activeTab,
  onTabChange,
  estimates,
  isLoading,
  onNewEstimateClick,
  onOpenEstimate,
  onEditEstimate,
  totalEstimates,
  currentPage,
  onPageChange
}: EstimateTabsProps) {
  return (
    <Tabs 
      defaultValue="pending" 
      value={activeTab} 
      onValueChange={onTabChange}
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-3 rounded-none border-b bg-transparent p-0">
        <TabsTrigger 
          value="pending" 
          className={cn(
            "rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none",
            activeTab === "pending" ? "font-semibold text-primary" : "text-muted-foreground"
          )}
        >
          PENDING
        </TabsTrigger>
        <TabsTrigger 
          value="approved" 
          className={cn(
            "rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none",
            activeTab === "approved" ? "font-semibold text-primary" : "text-muted-foreground"
          )}
        >
          APPROVED
        </TabsTrigger>
        <TabsTrigger 
          value="declined" 
          className={cn(
            "rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none",
            activeTab === "declined" ? "font-semibold text-primary" : "text-muted-foreground"
          )}
        >
          DECLINED
        </TabsTrigger>
      </TabsList>

      {isLoading && (
        <div className="py-4 px-4">
          <Progress value={50} className="h-1" />
        </div>
      )}

      <TabsContent value="pending" className="mt-0 rounded-none border-none p-0">
        <EstimatesList 
          estimates={estimates} 
          isLoading={isLoading} 
          onNewEstimateClick={onNewEstimateClick}
          onOpenEstimate={onOpenEstimate}
          onEditEstimate={onEditEstimate}
          totalItems={totalEstimates}
          currentPage={currentPage}
          onPageChange={onPageChange}
        />
      </TabsContent>
      <TabsContent value="approved" className="mt-0 rounded-none border-none p-0">
        <EstimatesList 
          estimates={estimates} 
          isLoading={isLoading} 
          onNewEstimateClick={onNewEstimateClick}
          onOpenEstimate={onOpenEstimate}
          onEditEstimate={onEditEstimate}
          totalItems={totalEstimates}
          currentPage={currentPage}
          onPageChange={onPageChange}
        />
      </TabsContent>
      <TabsContent value="declined" className="mt-0 rounded-none border-none p-0">
        <EstimatesList 
          estimates={estimates} 
          isLoading={isLoading} 
          onNewEstimateClick={onNewEstimateClick}
          onOpenEstimate={onOpenEstimate}
          onEditEstimate={onEditEstimate}
          totalItems={totalEstimates}
          currentPage={currentPage}
          onPageChange={onPageChange}
        />
      </TabsContent>
    </Tabs>
  );
}
