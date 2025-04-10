
import Layout from "@/components/Layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FilePlus } from "lucide-react";

export default function Estimates() {
  return (
    <Layout title="Estimates">
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="mb-6">
          <img 
            src="/placeholder.svg" 
            alt="No Estimates" 
            className="w-24 h-24 mx-auto mb-4"
          />
          <h2 className="text-xl font-semibold mb-2">No Estimates Yet</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Create your first estimate to start tracking your business proposals and convert them to invoices.
          </p>
        </div>
        <Button asChild className="mt-4">
          <Link to="/estimates/new">
            <FilePlus className="mr-2 h-4 w-4" />
            Create New Estimate
          </Link>
        </Button>
      </div>
    </Layout>
  );
}
