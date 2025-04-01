import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RefreshCcw, CheckCircle2, Settings, Clock, AlertTriangle, ServerOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { storeIntegration } from '@/services/storeIntegration';

const StoreManage = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [connections, setConnections] = useState<any[]>([]);
  const [syncResults, setSyncResults] = useState<any>(null);
  
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

  const [visibleApiKey, setVisibleApiKey] = useState<string | null>(null);

  const toggleApiKeyVisibility = (connectionId: string, apiKey: string) => {
    if (visibleApiKey === connectionId) {
      setVisibleApiKey(null);
    } else {
      setVisibleApiKey(connectionId);
    }
  };

  if (connections.length === 0) {
    return (
      <div className="text-center py-12">
        <ServerOff className="mx-auto h-16 w-16 text-gray-300" />
        <h3 className="mt-6 text-xl font-medium">No Connected Stores</h3>
        <p className="text-gray-500 mt-2 max-w-md mx-auto">
          You haven't connected any stores yet. Go to the "Connect" tab to integrate your first store.
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-medium">Connected Stores</h2>
      
      {connections.map((connection: any) => (
        <Card key={connection.id} className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>{connection.name}</CardTitle>
                <CardDescription>
                  Store ID: {connection.storeId}
                </CardDescription>
              </div>
              <Badge variant={connection.isActive ? "default" : "outline"} className="ml-2">
                {connection.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="border-t border-b py-4">
            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <Clock className="h-4 w-4 mr-2 text-gray-500" />
                {connection.lastSynced ? (
                  <span>Last synced: {new Date(connection.lastSynced).toLocaleString()}</span>
                ) : (
                  <span className="text-amber-600 font-medium flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-1" /> Not synced yet
                  </span>
                )}
              </div>
              
              {connection.auto_sync_enabled && (
                <div className="flex items-center text-sm text-green-600">
                  <RefreshCcw className="h-4 w-4 mr-2" />
                  <span>Auto-sync enabled (every {connection.sync_interval_minutes} minutes)</span>
                </div>
              )}

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
                  onClick={() => toggleApiKeyVisibility(connection.id, connection.apiKey)}
                >
                  {visibleApiKey === connection.id ? "Hide" : "Show"}
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between flex-wrap gap-2 pt-4">
            <div className="flex flex-wrap gap-2">
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
            </div>
            
            {!connection.auto_sync_enabled && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleSetupAutoSync(connection.id)}
                disabled={isLoading}
              >
                <Settings className="h-4 w-4 mr-2" />
                Enable Auto Sync
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
      
      {syncResults && (
        <div className="mt-8">
          <Card className="bg-gray-50 border-green-100">
            <CardHeader>
              <div className="flex items-center">
                <CardTitle className="text-lg">Last Sync Results</CardTitle>
                <span className="text-xs text-gray-500 ml-2">
                  {new Date(syncResults.lastSyncTimestamp).toLocaleString()}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="rounded-lg bg-white p-3 text-center shadow-sm border">
                    <p className="text-gray-500 text-xs mb-1">Updated</p>
                    <p className="text-2xl font-bold text-green-600">{syncResults.productsUpdated}</p>
                  </div>
                  <div className="rounded-lg bg-white p-3 text-center shadow-sm border">
                    <p className="text-gray-500 text-xs mb-1">Added</p>
                    <p className="text-2xl font-bold text-blue-600">{syncResults.productsAdded}</p>
                  </div>
                  <div className="rounded-lg bg-white p-3 text-center shadow-sm border">
                    <p className="text-gray-500 text-xs mb-1">Removed</p>
                    <p className="text-2xl font-bold text-gray-600">{syncResults.productsRemoved}</p>
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
        </div>
      )}
    </div>
  );
};

export default StoreManage;
