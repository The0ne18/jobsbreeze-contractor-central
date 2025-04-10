
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "@/components/Layout/Layout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import NewEstimateSheet from "@/components/Estimates/NewEstimateSheet";
import { Estimate } from "@/models/Estimate";
import { getEstimates } from "@/services/estimateService";
import { EstimatesHeader } from "@/components/Estimates/EstimatesHeader";
import { EstimatesList } from "@/components/Estimates/EstimatesList";

export default function Estimates() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("pending");
  const [estimates, setEstimates] = useState<Estimate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newEstimateOpen, setNewEstimateOpen] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    fetchEstimates();
  }, []);
  
  useEffect(() => {
    if (location.pathname === "/estimates/new") {
      setNewEstimateOpen(true);
    }
  }, [location.pathname]);
  
  const fetchEstimates = async () => {
    setIsLoading(true);
    try {
      const data = await getEstimates();
      setEstimates(data);
    } catch (error) {
      console.error("Failed to fetch estimates:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const filteredEstimates = estimates.filter(estimate => {
    const matchesTab = 
      (activeTab === "pending" && estimate.status !== "approved" && estimate.status !== "declined") ||
      estimate.status === activeTab;
    
    const matchesSearch = 
      searchQuery === "" || 
      estimate.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      estimate.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesTab && matchesSearch;
  });
  
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
        onValueChange={setActiveTab}
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

        <TabsContent value="pending" className="mt-0 rounded-none border-none p-0">
          <EstimatesList 
            estimates={filteredEstimates} 
            isLoading={isLoading} 
            onNewEstimateClick={handleNewEstimateClick} 
          />
        </TabsContent>
        <TabsContent value="approved" className="mt-0 rounded-none border-none p-0">
          <EstimatesList 
            estimates={filteredEstimates} 
            isLoading={isLoading} 
            onNewEstimateClick={handleNewEstimateClick} 
          />
        </TabsContent>
        <TabsContent value="declined" className="mt-0 rounded-none border-none p-0">
          <EstimatesList 
            estimates={filteredEstimates} 
            isLoading={isLoading} 
            onNewEstimateClick={handleNewEstimateClick} 
          />
        </TabsContent>
      </Tabs>

      <NewEstimateSheet 
        open={newEstimateOpen} 
        onOpenChange={handleNewEstimateOpenChange}
        onEstimateCreated={fetchEstimates}
      />
    </Layout>
  );
}
