
import React, { useState, useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { api } from '@/services/api';
import { Product } from '@/context/CartContext';

interface ScannerProps {
  onScan: (product: Product) => void;
  onError: (error: string) => void;
}

export const Scanner: React.FC<ScannerProps> = ({ onScan, onError }) => {
  const [scanning, setScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [testBarcode, setTestBarcode] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Simulate barcode scanning (in a real app, we'd use a barcode scanning library)
  const startScanning = async () => {
    setScanning(true);
    
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access not supported by browser');
      }
      
      const constraints = {
        video: {
          facingMode: 'environment'
        }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      
      // In a real app with a real scanner, we would process video frames here
      // For demo purposes, we'll simulate finding a barcode after 3 seconds
      setTimeout(() => {
        // This is where we'd typically get the barcode from the scanner
        // For demo, we'll use a test barcode
        processScan('test123');
      }, 3000);
      
    } catch (error) {
      setScanning(false);
      onError('Failed to access camera: ' + (error.message || 'Unknown error'));
    }
  };
  
  const stopScanning = () => {
    setScanning(false);
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };
  
  useEffect(() => {
    return () => {
      stopScanning(); // Clean up on component unmount
    };
  }, []);
  
  const processScan = async (barcode: string) => {
    if (!barcode) return;
    
    setLoading(true);
    stopScanning();
    
    try {
      const product = await api.getProductByBarcode(barcode);
      onScan(product);
    } catch (error) {
      onError('Product not found. Please try again.');
      setScanning(false);
    } finally {
      setLoading(false);
    }
  };
  
  // For testing - allow manual barcode entry
  const handleTestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (testBarcode) {
      processScan(testBarcode);
    }
  };
  
  return (
    <div className="flex flex-col items-center w-full">
      {scanning ? (
        <div className="relative w-full aspect-square max-w-md rounded-lg overflow-hidden border-2 border-brand">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            playsInline
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-64 h-64 border-2 border-white rounded-lg"></div>
          </div>
          <div className="absolute bottom-4 left-0 right-0 flex justify-center">
            <Button onClick={stopScanning} variant="destructive">
              Cancel
            </Button>
          </div>
        </div>
      ) : loading ? (
        <div className="flex flex-col items-center justify-center h-64 w-full">
          <div className="scan-circle p-6 bg-brand/20 rounded-full">
            <Loader2 className="h-12 w-12 text-brand animate-spin" />
          </div>
          <p className="mt-4 text-lg">Finding product...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center w-full max-w-md space-y-6">
          <Button 
            onClick={startScanning} 
            className="w-full py-8 text-xl bg-brand hover:bg-brand-dark"
          >
            Tap to Scan Barcode
          </Button>
          
          <div className="w-full mt-8 p-4 border rounded-lg">
            <h3 className="text-sm font-medium mb-2">Test Mode</h3>
            <form onSubmit={handleTestSubmit} className="flex space-x-2">
              <input 
                type="text" 
                value={testBarcode} 
                onChange={(e) => setTestBarcode(e.target.value)} 
                placeholder="Enter barcode (e.g. test123)"
                className="flex-1 px-3 py-2 border rounded-md text-sm"
              />
              <Button type="submit" variant="secondary">Test</Button>
            </form>
            <p className="text-xs text-muted-foreground mt-2">
              Try: test123, 8901491004881, 5449000267412
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Scanner;
