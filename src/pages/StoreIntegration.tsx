import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle2, Database, RefreshCcw, ServerOff, Settings, Clock } from "lucide-react";
import { storeIntegration, StoreConnection } from '@/services/storeIntegration';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

const StoreIntegration = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("connect");
  const [isLoading, setIsLoading] = useState(false);
  const [connections, setConnections] = useState<any[]>([]);
  const [syncResults, setSyncResults] = useState<any>(null);
  
  // Form states
  const [storeId, setStoreId] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [apiEndpoint, setApiEndpoint] = useState("");

  // API Key visibility state
  const [visibleApiKey, setVisibleApiKey] = useState<string | null>(null);
  
  // Fetch existing connections
  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const connectedStores = await storeIntegration.getConnectedStores();
        setConnections(connectedStores);
      } catch (error) {
        console.error("Error fetching store connections:", error);
      }
    };
    
    fetchConnections();
  }, []);
  
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
      
      // Update connections list
      setConnections([connection, ...connections]);
      setActiveTab("manage");
      
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
  
  const handleSyncInventory = async (connectionId: string) => {
    setIsLoading(true);
    
    try {
      const result = await storeIntegration.syncInventory(connectionId);
      setSyncResults(result);
      
      if (result.status === 'success') {
        toast({
          title: "Sync Completed",
          description: `Updated ${result.productsUpdated} products, added ${result.productsAdded} new products`,
        });
      } else {
        toast({
          title: "Sync Partially Completed",
          description: `Some items could not be synchronized. Check the logs for details.`,
          variant: "destructive"
        });
      }
      
      // Refresh connections to update last synced time
      const refreshedConnections = await storeIntegration.getConnectedStores();
      setConnections(refreshedConnections);
    } catch (error: any) {
      toast({
        title: "Sync Failed",
        description: error.message || "An error occurred during synchronization",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSetupAutoSync = async (connectionId: string) => {
    try {
      // Set up auto sync for every 30 minutes
      const result = await storeIntegration.setupAutoSync(connectionId, 30);
      
      if (result.success) {
        toast({
          title: "Auto Sync Enabled",
          description: result.message,
        });
        
        // Refresh connections list
        const refreshedConnections = await storeIntegration.getConnectedStores();
        setConnections(refreshedConnections);
      } else {
        toast({
          title: "Auto Sync Setup Failed",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to set up auto sync",
        variant: "destructive"
      });
    }
  };
  
  const handleCheckPrices = async (connectionId: string) => {
    setIsLoading(true);
    
    try {
      const results = await storeIntegration.checkPriceDiscrepancies(connectionId);
      
      if (results.discrepanciesFound > 0) {
        // Show price discrepancy alert
        toast({
          title: "Price Discrepancies Found",
          description: `Found ${results.discrepanciesFound} price differences between app and store`,
          variant: "destructive"
        });
        
        // In a real app, you'd show the detailed list of discrepancies
      } else {
        toast({
          title: "Prices Match",
          description: "All prices in the app match the store prices",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to check price discrepancies",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle API key visibility
  const toggleApiKeyVisibility = (connectionId: string) => {
    if (visibleApiKey === connectionId) {
      setVisibleApiKey(null);
    } else {
      setVisibleApiKey(connectionId);
    }
  };
  
  return (
    <Layout>
      <div className="pb-8">
        <div className="flex justify-between items-center mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="p-0"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-xl font-bold">Store Integration</h1>
          <div className="w-8"></div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="connect">Connect Store</TabsTrigger>
            <TabsTrigger value="manage">Manage Connections</TabsTrigger>
          </TabsList>
          
          <TabsContent value="connect">
            <Card>
              <CardHeader>
                <CardTitle>Connect to Store API</CardTitle>
                <CardDescription>
                  Integrate with your supermarket's inventory system
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
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="apiEndpoint" className="text-sm font-medium">
                      API Endpoint
                    </label>
                    <Input
                      id="apiEndpoint"
                      placeholder="https://api.yourstore.com/v1"
                      value={apiEndpoint}
                      onChange={(e) => setApiEndpoint(e.target.value)}
                    />
                  </div>
                  
                  <Alert>
                    <Database className="h-4 w-4" />
                    <AlertTitle>Compatible Systems</AlertTitle>
                    <AlertDescription>
                      Works with RetailPro, SAP, Oracle Retail, Microsoft Dynamics, and custom inventory systems used by major Nigerian retailers.
                    </AlertDescription>
                  </Alert>
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Connecting..." : "Connect to Store"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="manage">
            {connections.length === 0 ? (
              <div className="text-center py-8">
                <ServerOff className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium">No Connected Stores</h3>
                <p className="text-gray-500 mt-2">
                  You haven't connected any stores yet. Go to the "Connect Store" tab to add one.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {connections.map((connection: any) => (
                  <Card key={connection.id}>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle>{connection.name}</CardTitle>
                        <Badge variant={connection.isActive ? "default" : "outline"}>
                          {connection.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <CardDescription>
                        Store ID: {connection.storeId}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <Clock className="h-4 w-4 mr-2 text-gray-500" />
                          {connection.lastSynced ? (
                            <span>Last synced: {new Date(connection.lastSynced).toLocaleString()}</span>
                          ) : (
                            <span>Not synced yet</span>
                          )}
                        </div>
                        
                        <div className="flex items-center text-sm mt-2">
                          <span className="font-medium mr-2">API Endpoint:</span>
                          <code className="bg-gray-100 p-1 rounded text-xs">{connection.apiEndpoint}</code>
                        </div>

                        <div className="flex items-center text-sm mt-2">
                          <span className="font-medium mr-2">API Key:</span>
                          {visibleApiKey === connection.id ? (
                            <code className="bg-gray-100 p-1 rounded text-xs">{connection.apiKey}</code>
                          ) : (
                            <code className="bg-gray-100 p-1 rounded text-xs">••••••••••••••••</code>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 ml-2 text-xs" 
                            onClick={() => toggleApiKeyVisibility(connection.id)}
                          >
                            {visibleApiKey === connection.id ? "Hide" : "Show"}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex flex-wrap gap-2">
                      <Button 
                        variant="default" 
                        size="sm"
                        onClick={() => handleSyncInventory(connection.id)}
                        disabled={isLoading}
                      >
                        <RefreshCcw className="h-4 w-4 mr-2" />
                        Sync Now
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleCheckPrices(connection.id)}
                        disabled={isLoading}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Check Prices
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleSetupAutoSync(connection.id)}
                        disabled={isLoading}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Auto Sync
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
                
                {syncResults && (
                  <Card className="bg-slate-50">
                    <CardHeader>
                      <CardTitle>Last Sync Results</CardTitle>
                      <CardDescription>
                        {new Date(syncResults.lastSyncTimestamp).toLocaleString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="rounded-lg bg-white p-3 text-center shadow-sm">
                            <p className="text-gray-500 text-xs">Updated</p>
                            <p className="text-2xl font-bold">{syncResults.productsUpdated}</p>
                          </div>
                          <div className="rounded-lg bg-white p-3 text-center shadow-sm">
                            <p className="text-gray-500 text-xs">Added</p>
                            <p className="text-2xl font-bold">{syncResults.productsAdded}</p>
                          </div>
                          <div className="rounded-lg bg-white p-3 text-center shadow-sm">
                            <p className="text-gray-500 text-xs">Removed</p>
                            <p className="text-2xl font-bold">{syncResults.productsRemoved}</p>
                          </div>
                        </div>
                        
                        {syncResults.errorMessages && syncResults.errorMessages.length > 0 && (
                          <Alert variant="destructive">
                            <AlertTitle>Errors Occurred</AlertTitle>
                            <AlertDescription className="max-h-24 overflow-y-auto">
                              <ul className="list-disc pl-4 space-y-1">
                                {syncResults.errorMessages.slice(0, 3).map((msg: string, i: number) => (
                                  <li key={i}>{msg}</li>
                                ))}
                                {syncResults.errorMessages.length > 3 && (
                                  <li>And {syncResults.errorMessages.length - 3} more errors...</li>
                                )}
                              </ul>
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default StoreIntegration;
