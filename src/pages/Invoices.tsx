
import Layout from "@/components/Layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FilePlus } from "lucide-react";

export default function Invoices() {
  return (
    <Layout title="Invoices">
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="mb-6">
          <img 
            src="/placeholder.svg" 
            alt="No Invoices" 
            className="w-24 h-24 mx-auto mb-4"
          />
          <h2 className="text-xl font-semibold mb-2">No Invoices Yet</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Create your first invoice or convert an estimate to start tracking payments for your business.
          </p>
        </div>
        <Button asChild className="mt-4">
          <Link to="/invoices/new">
            <FilePlus className="mr-2 h-4 w-4" />
            Create New Invoice
          </Link>
        </Button>
      </div>
    </Layout>
  );
}
