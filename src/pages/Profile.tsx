
import React from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Edit, LogOut, ShoppingBag, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/services/api';
import { useQuery } from '@tanstack/react-query';
import { formatCurrency } from '@/lib/utils';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders', user?.id],
    queryFn: () => api.getUserOrders(user?.id || ''),
    enabled: !!user,
  });
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  if (!user) {
    navigate('/login');
    return null;
  }
  
  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-8">
        <Card className="overflow-hidden">
          <CardHeader className="bg-brand text-white flex flex-row items-center gap-4">
            <div className="bg-white rounded-full p-4">
              <User className="h-8 w-8 text-brand" />
            </div>
            <div>
              <CardTitle className="text-2xl">{user.name}</CardTitle>
              <p>{user.email}</p>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-medium text-lg">Account Information</h3>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between pb-2 border-b">
                <span className="text-gray-600">Member since</span>
                <span>June 2023</span>
              </div>
              
              <div className="flex justify-between pb-2 border-b">
                <span className="text-gray-600">Status</span>
                <Badge className="bg-green-600">Active</Badge>
              </div>
              
              <div className="flex justify-between pb-2 border-b">
                <span className="text-gray-600">Payment Methods</span>
                <span>Mastercard •••• 1234</span>
              </div>
              
              <div className="flex justify-between pt-2">
                <Button 
                  variant="destructive" 
                  onClick={handleLogout}
                  className="w-full"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Order History</h2>
          
          {isLoading ? (
            <div className="text-center py-8">Loading orders...</div>
          ) : orders && orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order: any) => (
                <Card key={order.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <p className="font-medium">{order.id}</p>
                        <p className="text-sm text-gray-500">{order.date}</p>
                      </div>
                      <Badge className={
                        order.status === 'Completed' 
                          ? 'bg-green-600' 
                          : order.status === 'Processing' 
                            ? 'bg-amber-500' 
                            : 'bg-blue-600'
                      }>
                        {order.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      {order.items.map((item: any, index: number) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{item.name} x{item.quantity}</span>
                          <span>₦{formatCurrency(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex justify-between font-medium border-t pt-2">
                      <span>Total</span>
                      <span>₦{formatCurrency(order.total)}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <ShoppingBag className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="font-medium text-lg mb-2">No orders yet</h3>
                <p className="text-gray-500 mb-4">Your order history will appear here</p>
                <Button onClick={() => navigate('/scan')} className="bg-brand hover:bg-brand-dark">
                  Start Shopping
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
