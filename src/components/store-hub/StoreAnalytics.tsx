
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const StoreAnalytics = () => {
  const [timePeriod, setTimePeriod] = useState("week");
  
  // Mock data for demonstration
  const syncActivityData = [
    { day: 'Monday', syncs: 4, items: 120 },
    { day: 'Tuesday', syncs: 2, items: 68 },
    { day: 'Wednesday', syncs: 5, items: 230 },
    { day: 'Thursday', syncs: 3, items: 145 },
    { day: 'Friday', syncs: 6, items: 310 },
    { day: 'Saturday', syncs: 2, items: 98 },
    { day: 'Sunday', syncs: 1, items: 52 },
  ];
  
  const discrepancyData = [
    { day: 'Monday', price: 12, stock: 3 },
    { day: 'Tuesday', price: 8, stock: 5 },
    { day: 'Wednesday', price: 15, stock: 2 },
    { day: 'Thursday', price: 6, stock: 0 },
    { day: 'Friday', price: 9, stock: 1 },
    { day: 'Saturday', price: 4, stock: 0 },
    { day: 'Sunday', price: 2, stock: 0 },
  ];
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium">Integration Analytics</h2>
        
        <div>
          <Tabs value={timePeriod} onValueChange={setTimePeriod} className="w-[240px]">
            <TabsList>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="year">Year</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sync Activity</CardTitle>
            <CardDescription>Total syncs and items processed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={syncActivityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" fontSize={12} />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="syncs" name="Syncs" fill="#8884d8" radius={[4, 4, 0, 0]} />
                  <Bar yAxisId="right" dataKey="items" name="Items" fill="#82ca9d" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Discrepancy Rate</CardTitle>
            <CardDescription>Price and stock differences found</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={discrepancyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" fontSize={12} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="price" name="Price Discrepancies" stroke="#ff7300" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="stock" name="Stock Discrepancies" stroke="#387908" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Syncs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">23</p>
            <p className="text-sm text-green-600">+12% from last week</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Products Updated</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">1,023</p>
            <p className="text-sm text-green-600">+5% from last week</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Discrepancy Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">3.2%</p>
            <p className="text-sm text-red-600">+0.5% from last week</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StoreAnalytics;
