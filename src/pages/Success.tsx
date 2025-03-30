
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { CheckCircle, Home, ShoppingBag } from 'lucide-react';

const Success = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, timestamp } = location.state || {};
  
  useEffect(() => {
    if (!orderId) {
      navigate('/');
    }
  }, [orderId, navigate]);
  
  if (!orderId) {
    return null;
  }
  
  return (
    <Layout>
      <div className="max-w-md mx-auto text-center pt-8">
        <div className="bg-green-100 rounded-full p-6 inline-flex mb-6">
          <CheckCircle className="h-16 w-16 text-green-600" />
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
        <p className="text-gray-600 mb-8">Your order has been confirmed</p>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border mb-8">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Order ID</span>
              <span className="font-medium">{orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date</span>
              <span>{new Date(timestamp).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status</span>
              <span className="text-green-600 font-medium">Completed</span>
            </div>
          </div>
        </div>
        
        <p className="text-gray-700 mb-8">
          Simply show this confirmation to the store staff before leaving with your items.
        </p>
        
        <div className="space-y-4">
          <Button 
            onClick={() => navigate('/')} 
            className="w-full py-6 bg-brand hover:bg-brand-dark"
          >
            <Home className="mr-2 h-5 w-5" />
            Return to Home
          </Button>
          
          <Button 
            onClick={() => navigate('/profile')} 
            variant="outline"
            className="w-full py-6"
          >
            <ShoppingBag className="mr-2 h-5 w-5" />
            View Order History
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Success;
