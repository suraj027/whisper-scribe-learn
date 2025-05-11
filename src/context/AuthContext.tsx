
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// Types for our authentication context
type User = {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signUp: async () => {},
  signIn: async () => {},
  signInWithGoogle: async () => {},
  signOut: async () => {},
});

// Hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component to wrap the app with
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check for existing session on load
  useEffect(() => {
    const checkSession = async () => {
      try {
        // This is a placeholder for Supabase auth
        // This will be replaced with actual Supabase code once integrated
        const storedUser = localStorage.getItem('researchai_user');
        
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  // Placeholder for sign up functionality
  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      setLoading(true);
      // This will be replaced with actual Supabase auth once integrated
      console.log('Sign up:', { email, password, fullName });
      
      // Mock successful signup
      const newUser = {
        id: 'mock-user-id',
        email,
        user_metadata: {
          full_name: fullName || email.split('@')[0]
        }
      };
      
      localStorage.setItem('researchai_user', JSON.stringify(newUser));
      setUser(newUser);
      
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Placeholder for sign in functionality
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      // This will be replaced with actual Supabase auth once integrated
      console.log('Sign in:', { email, password });
      
      // Mock successful login
      const mockUser = {
        id: 'mock-user-id',
        email,
        user_metadata: {
          full_name: email.split('@')[0]
        }
      };
      
      localStorage.setItem('researchai_user', JSON.stringify(mockUser));
      setUser(mockUser);
      
      toast.success('Signed in successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Placeholder for Google sign in
  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      // This will be replaced with actual Supabase auth once integrated
      console.log('Sign in with Google');
      
      // Mock successful Google login
      const mockUser = {
        id: 'google-user-id',
        email: 'user@gmail.com',
        user_metadata: {
          full_name: 'Google User',
          avatar_url: 'https://lh3.googleusercontent.com/a/default-user'
        }
      };
      
      localStorage.setItem('researchai_user', JSON.stringify(mockUser));
      setUser(mockUser);
      
      toast.success('Signed in with Google successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in with Google');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Placeholder for sign out functionality
  const signOut = async () => {
    try {
      // This will be replaced with actual Supabase auth once integrated
      localStorage.removeItem('researchai_user');
      setUser(null);
      toast.success('Signed out successfully');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign out');
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Route guard component to protect routes that require authentication
export const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-primary/50 mb-4"></div>
          <div className="h-4 w-24 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return user ? <>{children}</> : null;
};
