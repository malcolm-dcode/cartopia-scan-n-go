
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { TableRow } from "@/types/database";

// Types
export interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  // Initialize and set up auth state listener
  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state change event:", event);
        setSession(currentSession);
        
        if (currentSession?.user) {
          // Convert Supabase user to our User type
          // Use setTimeout to avoid potential deadlocks with Supabase's internal state
          setTimeout(() => {
            fetchUserProfile(currentSession.user.id);
          }, 0);
        } else {
          setUser(null);
          setIsLoading(false);
        }
      }
    );
    
    // Check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);
        
        if (currentSession?.user) {
          // Fetch user profile
          fetchUserProfile(currentSession.user.id);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        setIsLoading(false);
      }
    };
    
    initializeAuth();
    
    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  const fetchUserProfile = async (userId: string) => {
    try {
      console.log("Fetching profile for user:", userId);
      
      // Explicitly type the response
      interface ProfileResponse {
        id: string;
        name: string;
        email: string;
        created_at?: string;
        updated_at?: string;
      }
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single<ProfileResponse>();
      
      if (error) {
        console.error("Error fetching profile:", error);
        
        // If no profile exists yet, let's create one using the auth user data
        if (error.code === 'PGRST116') {
          await createDefaultProfile(userId);
          return;
        }
        
        throw error;
      }
      
      if (data) {
        console.log("Profile found:", data);
        setUser({
          id: data.id,
          name: data.name,
          email: data.email
        });
      }
    } catch (error) {
      console.error("Error in fetchUserProfile:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fallback to create a profile if it doesn't exist
  const createDefaultProfile = async (userId: string) => {
    try {
      console.log("Creating default profile for user:", userId);
      // Get user email from the auth session
      const { data: authData } = await supabase.auth.getUser(userId);
      
      if (!authData?.user) {
        throw new Error("Cannot get user data");
      }
      
      const { email, user_metadata } = authData.user;
      const name = user_metadata?.name || email?.split('@')[0] || 'User';
      
      // Create a profile with proper typing
      interface ProfileInsert {
        id: string;
        name: string;
        email: string;
      }
      
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          name,
          email
        } as ProfileInsert)
        .select()
        .single();
        
      if (error) {
        console.error("Error creating profile:", error);
        throw error;
      }
      
      if (data) {
        console.log("Profile created:", data);
        setUser({
          id: data.id,
          name: data.name,
          email: data.email
        });
      }
    } catch (error) {
      console.error("Error in createDefaultProfile:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };
  
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      console.log("Attempting login for:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error("Login error:", error);
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive"
        });
        return false;
      }
      
      if (data.session) {
        console.log("Login successful, session:", data.session.user.id);
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        return true;
      }
      
      return false;
    } catch (error: any) {
      console.error("Login exception:", error);
      toast({
        title: "Login error",
        description: error.message || "An error occurred during login",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      console.log("Attempting registration for:", email);
      // Register the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name
          }
        }
      });
      
      if (error) {
        console.error("Registration error:", error);
        toast({
          title: "Registration failed",
          description: error.message,
          variant: "destructive"
        });
        return false;
      }
      
      if (data.user) {
        console.log("Registration successful, user:", data.user.id);
        toast({
          title: "Registration successful",
          description: "Welcome to CartScan!",
        });
        return true;
      }
      
      return false;
    } catch (error: any) {
      console.error("Registration exception:", error);
      toast({
        title: "Registration error",
        description: error.message || "An error occurred during registration",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = async () => {
    try {
      console.log("Logging out");
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
    } catch (error: any) {
      console.error("Logout error:", error);
      toast({
        title: "Logout error",
        description: error.message || "An error occurred during logout",
        variant: "destructive"
      });
    }
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
