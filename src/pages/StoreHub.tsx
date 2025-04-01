
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ArrowLeft, Database, NetworkIcon, RefreshCw, Settings2 } from "lucide-react";
import StoreConnect from "@/components/store-hub/StoreConnect";
import StoreManage from "@/components/store-hub/StoreManage";
import StoreAnalytics from "@/components/store-hub/StoreAnalytics";

const StoreHub = () => {
  const [activeTab, setActiveTab] = useState("connect");
  
  return (
    <Layout className="bg-gray-50">
      <div className="max-w-5xl mx-auto pb-8">
        <div className="flex justify-between items-center mb-6">
          <Link to="/" className="flex items-center text-sm text-gray-600 hover:text-brand">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to CartScan
          </Link>
          <h1 className="text-2xl font-bold">Store Hub</h1>
          <div className="w-24"></div>
        </div>
        
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-brand/90 to-brand text-white">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold mb-2">Store Integration Portal</h2>
                  <p className="text-white/90 max-w-md">
                    Seamlessly connect your supermarket's inventory system with CartScan for realtime stock and price synchronization.
                  </p>
                </div>
                <Database className="h-16 w-16 opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="connect" className="flex items-center">
              <NetworkIcon className="h-4 w-4 mr-2" />
              Connect
            </TabsTrigger>
            <TabsTrigger value="manage" className="flex items-center">
              <Settings2 className="h-4 w-4 mr-2" />
              Manage
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center">
              <RefreshCw className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="connect">
            <StoreConnect />
          </TabsContent>
          
          <TabsContent value="manage">
            <StoreManage />
          </TabsContent>
          
          <TabsContent value="analytics">
            <StoreAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default StoreHub;
