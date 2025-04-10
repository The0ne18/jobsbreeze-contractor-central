
import { useState } from "react";
import Layout from "@/components/Layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function Settings() {
  const [businessInfo, setBusinessInfo] = useState({
    name: "Your Business Name",
    email: "your.email@example.com",
    phone: "(555) 123-4567",
    address: "123 Business St, Suite 101, City, State, 12345",
    website: "www.yourbusiness.com",
    logo: ""
  });

  const [defaults, setDefaults] = useState({
    taxRate: "7.5",
    estimateExpiryDays: "30",
    invoiceDueDays: "14",
    terms: "Payment is due within 14 days of invoice date. Please make checks payable to Your Business Name or pay online via the payment link provided on the invoice.",
    notes: "Thank you for your business!"
  });

  const handleBusinessInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBusinessInfo({ ...businessInfo, [name]: value });
  };

  const handleDefaultsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDefaults({ ...defaults, [name]: value });
  };

  const handleSaveBusinessInfo = () => {
    // In a real app, you would save to backend here
    toast.success("Business information saved successfully");
  };

  const handleSaveDefaults = () => {
    // In a real app, you would save to backend here
    toast.success("Default settings saved successfully");
  };

  return (
    <Layout title="Settings">
      <Tabs defaultValue="business" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="business">Business Info</TabsTrigger>
          <TabsTrigger value="defaults">Default Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="business">
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
              <CardDescription>
                This information will appear on your estimates and invoices
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="business-name">Business Name</Label>
                <Input
                  id="business-name"
                  name="name"
                  value={businessInfo.name}
                  onChange={handleBusinessInfoChange}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="business-email">Email</Label>
                  <Input
                    id="business-email"
                    name="email"
                    type="email"
                    value={businessInfo.email}
                    onChange={handleBusinessInfoChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="business-phone">Phone</Label>
                  <Input
                    id="business-phone"
                    name="phone"
                    value={businessInfo.phone}
                    onChange={handleBusinessInfoChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="business-address">Address</Label>
                <Textarea
                  id="business-address"
                  name="address"
                  value={businessInfo.address}
                  onChange={handleBusinessInfoChange}
                  rows={2}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="business-website">Website</Label>
                <Input
                  id="business-website"
                  name="website"
                  value={businessInfo.website}
                  onChange={handleBusinessInfoChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="business-logo">Logo</Label>
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 border rounded-md flex items-center justify-center bg-muted">
                    {businessInfo.logo ? (
                      <img
                        src={businessInfo.logo}
                        alt="Business Logo"
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <span className="text-muted-foreground text-sm">No logo</span>
                    )}
                  </div>
                  <Button variant="outline" size="sm">Upload Logo</Button>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleSaveBusinessInfo}>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="defaults">
          <Card>
            <CardHeader>
              <CardTitle>Default Settings</CardTitle>
              <CardDescription>
                Set your default values for new estimates and invoices
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="default-tax-rate">Default Tax Rate (%)</Label>
                  <Input
                    id="default-tax-rate"
                    name="taxRate"
                    type="number"
                    step="0.1"
                    value={defaults.taxRate}
                    onChange={handleDefaultsChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="default-estimate-expiry">Estimate Expiry (days)</Label>
                  <Input
                    id="default-estimate-expiry"
                    name="estimateExpiryDays"
                    type="number"
                    value={defaults.estimateExpiryDays}
                    onChange={handleDefaultsChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="default-invoice-due">Invoice Due (days)</Label>
                  <Input
                    id="default-invoice-due"
                    name="invoiceDueDays"
                    type="number"
                    value={defaults.invoiceDueDays}
                    onChange={handleDefaultsChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="default-terms">Default Terms</Label>
                <Textarea
                  id="default-terms"
                  name="terms"
                  value={defaults.terms}
                  onChange={handleDefaultsChange}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="default-notes">Default Notes</Label>
                <Textarea
                  id="default-notes"
                  name="notes"
                  value={defaults.notes}
                  onChange={handleDefaultsChange}
                  rows={2}
                />
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleSaveDefaults}>Save Defaults</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
}
