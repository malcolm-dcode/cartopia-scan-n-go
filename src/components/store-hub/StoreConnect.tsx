
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldCheck, Database } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { storeIntegration } from '@/services/storeIntegration';

const StoreConnect = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Form states
  const [storeId, setStoreId] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [apiEndpoint, setApiEndpoint] = useState("");
  
  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!storeId || !apiKey || !apiEndpoint) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // First verify the connection
      const verification = await storeIntegration.verifyConnection(storeId, apiKey, apiEndpoint);
      
      if (!verification.connected) {
        toast({
          title: "Connection Failed",
          description: "Could not connect to the store API. Please check your credentials.",
          variant: "destructive"
        });
        return;
      }
      
      // Save connection
      const connection = await storeIntegration.connectToStore(storeId, apiKey, apiEndpoint);
      
      toast({
        title: "Connection Successful",
        description: `Successfully connected to ${connection.name}`,
      });
      
      // Reset form
      setStoreId("");
      setApiKey("");
      setApiEndpoint("");
    } catch (error: any) {
      toast({
        title: "Connection Error",
        description: error.message || "An error occurred while connecting to the store",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Connect to Store API</CardTitle>
            <CardDescription>
              Link your inventory management system with CartScan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleConnect} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="storeId" className="text-sm font-medium">
                  Store ID
                </label>
                <Input
                  id="storeId"
                  placeholder="Enter your store ID"
                  value={storeId}
                  onChange={(e) => setStoreId(e.target.value)}
                />
                <p className="text-xs text-gray-500">This is your unique store identifier</p>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="apiKey" className="text-sm font-medium">
                  API Key
                </label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="Enter your API key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
                <p className="text-xs text-gray-500">Find this in your store management system</p>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="apiEndpoint" className="text-sm font-medium">
                  API Endpoint URL
                </label>
                <Input
                  id="apiEndpoint"
                  placeholder="https://api.yourstore.com/v1"
                  value={apiEndpoint}
                  onChange={(e) => setApiEndpoint(e.target.value)}
                />
                <p className="text-xs text-gray-500">The base URL for your inventory API</p>
              </div>
              
              <Alert>
                <ShieldCheck className="h-4 w-4" />
                <AlertTitle>Secure Connection</AlertTitle>
                <AlertDescription>
                  Your API credentials are encrypted and securely stored.
                </AlertDescription>
              </Alert>
            </form>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
              onClick={handleConnect}
            >
              {isLoading ? "Connecting..." : "Connect to Store"}
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Supported Systems</CardTitle>
            <CardDescription>
              Works with popular Nigerian retail systems
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="bg-brand/10 p-2 rounded-full">
                <Database className="h-4 w-4 text-brand" />
              </div>
              <div>
                <h4 className="text-sm font-medium">RetailPro</h4>
                <p className="text-xs text-gray-500">Most common in Nigerian supermarkets</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="bg-brand/10 p-2 rounded-full">
                <Database className="h-4 w-4 text-brand" />
              </div>
              <div>
                <h4 className="text-sm font-medium">SAP Retail</h4>
                <p className="text-xs text-gray-500">Enterprise-grade inventory system</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="bg-brand/10 p-2 rounded-full">
                <Database className="h-4 w-4 text-brand" />
              </div>
              <div>
                <h4 className="text-sm font-medium">Microsoft Dynamics</h4>
                <p className="text-xs text-gray-500">Integrated retail management</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="bg-brand/10 p-2 rounded-full">
                <Database className="h-4 w-4 text-brand" />
              </div>
              <div>
                <h4 className="text-sm font-medium">Custom Systems</h4>
                <p className="text-xs text-gray-500">Compatible with custom-built APIs</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StoreConnect;
