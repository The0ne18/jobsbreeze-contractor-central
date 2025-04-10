
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/Layout/Layout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import NewEstimateSheet from "@/components/Estimates/NewEstimateSheet";
import { Estimate } from "@/models/Estimate";
import { getEstimates } from "@/services/estimateService";
import { EstimatesHeader } from "@/components/Estimates/EstimatesHeader";
import { EstimatesList } from "@/components/Estimates/EstimatesList";
import { ViewEstimateDialog } from "@/components/Estimates/ViewEstimateDialog";
import { EditEstimateSheet } from "@/components/Estimates/EditEstimateSheet";
import { Progress } from "@/components/ui/progress";

export default function Estimates() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("pending");
  const [currentPage, setCurrentPage] = useState(1);
  const [newEstimateOpen, setNewEstimateOpen] = useState(false);
  const [selectedEstimateId, setSelectedEstimateId] = useState<string | undefined>(undefined);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editSheetOpen, setEditSheetOpen] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Define query parameters based on active tab and search query
  const queryOptions = {
    page: currentPage,
    limit: 10,
    searchQuery: searchQuery !== "" ? searchQuery : undefined,
    status: activeTab !== "pending" ? activeTab : undefined
  };
  
  // Use React Query to fetch and cache estimates
  const { 
    data, 
    isLoading, 
    refetch 
  } = useQuery({
    queryKey: ['estimates', queryOptions],
    queryFn: () => getEstimates(queryOptions),
    staleTime: 60000, // Data is fresh for 1 minute
    keepPreviousData: true // Keep previous data while loading new data
  });
  
  const estimates = data?.data || [];
  const totalEstimates = data?.total || 0;
  
  useEffect(() => {
    if (location.pathname === "/estimates/new") {
      setNewEstimateOpen(true);
    }
  }, [location.pathname]);
  
  const handleNewEstimateOpenChange = (open: boolean) => {
    setNewEstimateOpen(open);
    if (!open && location.pathname === "/estimates/new") {
      navigate("/estimates");
    }
  };
  
  const handleNewEstimateClick = () => {
    navigate("/estimates/new");
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handleOpenEstimate = (estimate: Estimate) => {
    setSelectedEstimateId(estimate.id);
    setViewDialogOpen(true);
  };

  const handleEditEstimate = (estimate: Estimate) => {
    setSelectedEstimateId(estimate.id);
    setEditSheetOpen(true);
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Layout title="Estimates" className="px-0 sm:px-6">
      <EstimatesHeader 
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onNewEstimateClick={handleNewEstimateClick}
      />

      <Tabs 
        defaultValue="pending" 
        value={activeTab} 
        onValueChange={(value) => {
          setActiveTab(value);
          setCurrentPage(1); // Reset page when changing tabs
        }}
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
            onNewEstimateClick={handleNewEstimateClick}
            onOpenEstimate={handleOpenEstimate}
            onEditEstimate={handleEditEstimate}
            totalItems={totalEstimates}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </TabsContent>
        <TabsContent value="approved" className="mt-0 rounded-none border-none p-0">
          <EstimatesList 
            estimates={estimates} 
            isLoading={isLoading} 
            onNewEstimateClick={handleNewEstimateClick}
            onOpenEstimate={handleOpenEstimate}
            onEditEstimate={handleEditEstimate}
            totalItems={totalEstimates}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </TabsContent>
        <TabsContent value="declined" className="mt-0 rounded-none border-none p-0">
          <EstimatesList 
            estimates={estimates} 
            isLoading={isLoading} 
            onNewEstimateClick={handleNewEstimateClick}
            onOpenEstimate={handleOpenEstimate}
            onEditEstimate={handleEditEstimate}
            totalItems={totalEstimates}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </TabsContent>
      </Tabs>

      <NewEstimateSheet 
        open={newEstimateOpen} 
        onOpenChange={handleNewEstimateOpenChange}
        onEstimateCreated={refetch}
      />

      <ViewEstimateDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        estimateId={selectedEstimateId}
        onEdit={(estimate) => {
          setViewDialogOpen(false);
          handleEditEstimate(estimate);
        }}
      />

      <EditEstimateSheet
        open={editSheetOpen}
        onOpenChange={setEditSheetOpen}
        estimateId={selectedEstimateId}
        onEstimateUpdated={refetch}
      />
    </Layout>
  );
}
